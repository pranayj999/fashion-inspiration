import type { AiMetadata } from "./types";

const CLASSIFICATION_SCHEMA = {
  description: "Rich natural-language description of the garment and scene",
  garmentType: "Primary garment category e.g. dress, jacket, trousers",
  style: "Fashion style e.g. streetwear, minimalist, bohemian",
  material: "Dominant material e.g. denim, silk, wool",
  colorPalette: "Array of 2-5 dominant colors",
  pattern: "Pattern e.g. solid, floral, striped, embroidered",
  season: "Suggested season e.g. spring, summer, fall, winter",
  occasion: "Occasion e.g. casual, formal, workwear, evening",
  consumerProfile: "Target consumer e.g. young adult, luxury, athletic",
  trendNotes: "Brief trend observation",
  location: {
    continent: "Inferred or stated continent",
    country: "Inferred or stated country",
    city: "Inferred or stated city or unknown",
  },
};

export function buildClassificationPrompt(designer?: string, locationHint?: string) {
  const hints = [
    designer ? `Designer context: ${designer}` : null,
    locationHint ? `Capture location hint: ${locationHint}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `Analyze this fashion inspiration photo for a designer mood board.
Return JSON only matching this schema:
${JSON.stringify(CLASSIFICATION_SCHEMA, null, 2)}

Rules:
- colorPalette must be an array of lowercase color strings
- Use "unknown" when location fields cannot be inferred
- Be specific in description (silhouette, details, context)
${hints ? `\nAdditional context:\n${hints}` : ""}`;
}

export function parseModelOutput(raw: string): AiMetadata {
  const trimmed = raw.trim();
  const jsonText = extractJson(trimmed);
  const parsed = JSON.parse(jsonText) as Record<string, unknown>;

  const location = (parsed.location ?? {}) as Record<string, unknown>;
  const colorPalette = normalizeColorPalette(parsed.colorPalette);

  return {
    description: stringField(parsed.description, "No description provided"),
    garmentType: stringField(parsed.garmentType, "unknown"),
    style: stringField(parsed.style, "unknown"),
    material: stringField(parsed.material, "unknown"),
    colorPalette,
    pattern: stringField(parsed.pattern, "unknown"),
    season: stringField(parsed.season, "unknown"),
    occasion: stringField(parsed.occasion, "unknown"),
    consumerProfile: stringField(parsed.consumerProfile, "unknown"),
    trendNotes: stringField(parsed.trendNotes, "unknown"),
    location: {
      continent: stringField(location.continent, "unknown"),
      country: stringField(location.country, "unknown"),
      city: stringField(location.city, "unknown"),
    },
  };
}

function extractJson(text: string): string {
  if (text.startsWith("{")) return text;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  throw new Error("Model output did not contain JSON");
}

function stringField(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
}

function normalizeColorPalette(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => stringField(item, "").toLowerCase())
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[,;/]/)
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

export function mockClassify(filename: string, designer?: string): AiMetadata {
  const lower = filename.toLowerCase();
  const garmentType = lower.includes("dress")
    ? "dress"
    : lower.includes("jacket")
      ? "jacket"
      : lower.includes("coat")
        ? "coat"
        : lower.includes("skirt")
          ? "skirt"
          : lower.includes("shirt")
            ? "shirt"
            : "top";

  return {
    description: `Mock classification for ${filename}. A ${garmentType} captured for inspiration research.`,
    garmentType,
    style: lower.includes("street") ? "streetwear" : "contemporary",
    material: lower.includes("denim") ? "denim" : "cotton blend",
    colorPalette: ["neutral", "earth tone"],
    pattern: lower.includes("stripe") ? "striped" : "solid",
    season: "spring",
    occasion: "casual",
    consumerProfile: "young adult",
    trendNotes: "Relaxed silhouette with artisan details",
    location: {
      continent: "unknown",
      country: "unknown",
      city: "unknown",
    },
  };
}

export type ClassifierProvider = "openai" | "claude" | "mock";

export function resolveClassifierProvider(): ClassifierProvider {
  const explicit = process.env.CLASSIFIER_PROVIDER?.toLowerCase();
  if (explicit === "openai" || explicit === "claude" || explicit === "mock") {
    return explicit;
  }
  if (process.env.ANTHROPIC_API_KEY) return "claude";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "mock";
}

function normalizeMediaType(mimeType: string): "image/jpeg" | "image/png" | "image/gif" | "image/webp" {
  if (mimeType === "image/png" || mimeType === "image/gif" || mimeType === "image/webp") {
    return mimeType;
  }
  return "image/jpeg";
}

async function classifyWithClaude(
  imageBase64: string,
  mimeType: string,
  options?: { designer?: string; locationHint?: string }
): Promise<AiMetadata> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey });
  const mediaType = normalizeMediaType(mimeType);

  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: buildClassificationPrompt(options?.designer, options?.locationHint),
          },
        ],
      },
    ],
  });

  const content = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  if (!content) {
    throw new Error("Empty Claude response");
  }
  return parseModelOutput(content);
}

async function classifyWithOpenAI(
  imageBase64: string,
  mimeType: string,
  options?: { designer?: string; locationHint?: string }
): Promise<AiMetadata> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: buildClassificationPrompt(options?.designer, options?.locationHint) },
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${imageBase64}` },
          },
        ],
      },
    ],
    max_tokens: 900,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty model response");
  }
  return parseModelOutput(content);
}

export async function classifyImage(
  imageBase64: string,
  mimeType: string,
  options?: { designer?: string; locationHint?: string; provider?: ClassifierProvider }
): Promise<AiMetadata> {
  const provider = options?.provider ?? resolveClassifierProvider();

  if (provider === "mock") {
    return mockClassify("upload.jpg", options?.designer);
  }
  if (provider === "claude") {
    return classifyWithClaude(imageBase64, mimeType, options);
  }
  return classifyWithOpenAI(imageBase64, mimeType, options);
}

