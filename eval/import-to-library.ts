import fs from "fs";
import path from "path";
import type { AiMetadata } from "../app/lib/types";

const repoRoot = path.resolve(import.meta.dirname, "..");
const resultsPath = path.join(repoRoot, "eval", "results.json");
const sourceDir = path.join(repoRoot, "eval", "downloaded");
const uploadsDir = path.join(repoRoot, "app", "public", "uploads");

type EvalRow = {
  id: string;
  predicted: AiMetadata;
};

if (!fs.existsSync(resultsPath)) {
  console.error("Missing eval/results.json. Run: npm run eval");
  process.exit(1);
}

if (!fs.existsSync(sourceDir)) {
  console.error("Missing eval/downloaded. Run: npm run eval:download");
  process.exit(1);
}

process.env.INSPIRATION_DB_PATH =
  process.env.INSPIRATION_DB_PATH ?? path.join(repoRoot, "app", "data", "inspiration.db");

import { getImageById, insertImageFromParts } from "../app/lib/db";

const results = JSON.parse(fs.readFileSync(resultsPath, "utf8")) as { rows: EvalRow[] };

fs.mkdirSync(uploadsDir, { recursive: true });

let imported = 0;
let skipped = 0;

for (const row of results.rows) {
  if (getImageById(row.id)) {
    skipped += 1;
    continue;
  }

  const srcName = `${row.id}.jpg`;
  const src = path.join(sourceDir, srcName);
  if (!fs.existsSync(src)) {
    console.warn(`Skip ${row.id}: missing ${srcName}`);
    continue;
  }

  const filename = `eval-${row.id}.jpg`;
  fs.copyFileSync(src, path.join(uploadsDir, filename));

  insertImageFromParts(
    row.id,
    filename,
    "Eval dataset",
    new Date().toISOString(),
    row.predicted,
    { tags: ["eval"], notes: "Imported from model evaluation run." }
  );
  imported += 1;
}

console.log(`Imported ${imported} eval image(s) into the library (${skipped} already present).`);
