import fs from "fs";
import path from "path";

export type EvalRow = {
  id: string;
  predicted?: {
    description: string;
    garmentType: string;
    style: string;
    material: string;
    colorPalette: string[];
    pattern: string;
    season: string;
    occasion: string;
    consumerProfile: string;
    trendNotes: string;
    location: { continent: string; country: string; city: string };
  };
  expected: {
    garmentType: string;
    style: string;
    material: string;
    occasion: string;
    location: { continent: string; country: string; city: string };
  };
  garmentTypeMatch?: boolean;
  styleMatch?: boolean;
  materialMatch?: boolean;
  occasionMatch?: boolean;
  locationMatch?: boolean;
  error?: string;
  skipped?: boolean;
};

export type EvalRowComplete = EvalRow & {
  predicted: NonNullable<EvalRow["predicted"]>;
};

export function isCompleteEvalRow(row: EvalRow): row is EvalRowComplete {
  return Boolean(row.predicted?.description);
}

export type EvalResultsFile = {
  generatedAt: string;
  mode: string;
  model: string;
  summary: Record<
    string,
    { accuracy: number; correct: number; total: number }
  >;
  notes: { strengths: string; weaknesses: string; nextSteps: string };
  failures: string[];
  rows: EvalRow[];
};

function repoRoot() {
  return path.resolve(process.cwd(), "..");
}

export function evalResultsPath() {
  return path.join(repoRoot(), "eval", "results.json");
}

export function evalDownloadedDir() {
  return path.join(repoRoot(), "eval", "downloaded");
}

export function evalPublicDir() {
  return path.join(process.cwd(), "public", "eval");
}

export function loadEvalResults(): EvalResultsFile | null {
  const filePath = evalResultsPath();
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as EvalResultsFile;
}

export function evalImageFilename(id: string) {
  return `${id}.jpg`;
}

export function evalImageExists(id: string) {
  const filename = evalImageFilename(id);
  const inPublic = path.join(evalPublicDir(), filename);
  if (fs.existsSync(inPublic)) return true;
  return fs.existsSync(path.join(evalDownloadedDir(), filename));
}
