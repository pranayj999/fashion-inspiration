import fs from "fs";
import path from "path";
import {
  classifyImage,
  mockClassify,
  parseModelOutput,
  resolveClassifierProvider,
  type ClassifierProvider,
} from "../app/lib/classifier";
import type { AiMetadata, ExpectedLabels } from "../app/lib/types";

type AttributeKey = "garmentType" | "style" | "material" | "occasion" | "location";

const labelsPath = path.join(__dirname, "labels.json");
const downloadDir = path.join(__dirname, "downloaded");
const resultsPath = path.join(__dirname, "results.json");

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, "../.env"));
loadEnvFile(path.join(__dirname, "../app/.env.local"));

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function locationMatches(
  predicted: { continent: string; country: string; city: string },
  expected: { continent: string; country: string; city: string }
): boolean {
  const fields: Array<keyof typeof predicted> = ["continent", "country", "city"];
  return fields.every((field) => normalize(predicted[field]) === normalize(expected[field]));
}

function compareAttribute(
  key: AttributeKey,
  predicted: AiMetadata,
  expected: ExpectedLabels["expected"]
): boolean {
  if (key === "location") {
    return locationMatches(predicted.location, expected.location);
  }
  return normalize(predicted[key]) === normalize(expected[key]);
}

function resolveEvalProvider(): ClassifierProvider {
  if (process.env.EVAL_USE_MOCK === "true") return "mock";
  return resolveClassifierProvider();
}

async function classifyLocalImage(label: ExpectedLabels, provider: ClassifierProvider) {
  const filePath = path.join(downloadDir, label.filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${filePath}. Run npm run eval:download first.`);
  }

  const buffer = fs.readFileSync(filePath);

  if (provider === "mock") {
    return mockClassify(label.filename, "eval");
  }

  return classifyImage(buffer.toString("base64"), "image/jpeg", {
    designer: "eval",
    provider,
  });
}

function buildEvalNotes(summary: Record<AttributeKey, { accuracy: number }>) {
  const best = Object.entries(summary).sort((a, b) => b[1].accuracy - a[1].accuracy)[0]?.[0];
  const worst = Object.entries(summary).sort((a, b) => a[1].accuracy - b[1].accuracy)[0]?.[0];

  return {
    strengths: `Strongest on ${best ?? "garmentType"} when garment silhouettes and styling cues are visually obvious in Pexels street-fashion photos.`,
    weaknesses: `Weakest on ${worst ?? "location"} because stock photos rarely contain reliable geographic signals without capture metadata.`,
    nextSteps:
      "Collect designer field photos with EXIF/GPS, add synonym-aware scoring (e.g. t-shirt vs tee), and fine-tune prompts per attribute for the vision model.",
  };
}

async function classifyWithRetry(
  label: ExpectedLabels,
  provider: ClassifierProvider,
  maxAttempts = 3
): Promise<AiMetadata> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await classifyLocalImage(label, provider);
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
      }
    }
  }
  throw lastError;
}

async function main() {
  const provider = resolveEvalProvider();
  if (provider === "openai" && !process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Set it or run with EVAL_USE_MOCK=true.");
  }
  if (provider === "claude" && !process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set. Set it or run with EVAL_USE_MOCK=true.");
  }

  const labels = JSON.parse(fs.readFileSync(labelsPath, "utf8")) as ExpectedLabels[];
  const attributes: AttributeKey[] = [
    "garmentType",
    "style",
    "material",
    "occasion",
    "location",
  ];

  const totals = Object.fromEntries(attributes.map((key) => [key, { correct: 0, total: 0 }])) as Record<
    AttributeKey,
    { correct: number; total: number }
  >;

  const rows: Array<Record<string, unknown>> = [];
  const failures: string[] = [];

  for (const label of labels) {
    try {
      const predicted = await classifyWithRetry(label, provider);
      const row: Record<string, unknown> = { id: label.id, predicted, expected: label.expected };

      for (const key of attributes) {
        totals[key].total += 1;
        const match = compareAttribute(key, predicted, label.expected);
        if (match) totals[key].correct += 1;
        row[`${key}Match`] = match;
      }

      rows.push(row);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${label.id}: ${message}`);
      rows.push({ id: label.id, expected: label.expected, error: message, skipped: true });
    }
    process.stdout.write(`\rEvaluated ${rows.length}/${labels.length}`);
  }

  if (failures.length > 0) {
    process.stdout.write(`\nWarnings: ${failures.length} image(s) failed after retries\n`);
  }

  process.stdout.write("\n");

  const summary = Object.fromEntries(
    attributes.map((key) => [
      key,
      {
        accuracy: totals[key].total ? totals[key].correct / totals[key].total : 0,
        correct: totals[key].correct,
        total: totals[key].total,
      },
    ])
  ) as Record<AttributeKey, { accuracy: number; correct: number; total: number }>;

  const output = {
    generatedAt: new Date().toISOString(),
    mode: provider,
    model:
      provider === "openai"
        ? process.env.OPENAI_MODEL ?? "gpt-4o-mini"
        : provider === "claude"
          ? process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5"
          : "mock",
    dataset: {
      source: "pexels-street-fashion",
      count: labels.length,
      labelsFile: "eval/labels.json",
    },
    summary,
    notes: buildEvalNotes(summary),
    failures,
    rows,
  };

  fs.writeFileSync(resultsPath, JSON.stringify(output, null, 2));

  console.log("Evaluation summary");
  for (const key of attributes) {
    const item = summary[key];
    console.log(`- ${key}: ${(item.accuracy * 100).toFixed(1)}% (${item.correct}/${item.total})`);
  }
  console.log(`\nFull report written to ${resultsPath}`);
}

export { parseModelOutput };

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
