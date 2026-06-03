import fs from "fs";
import path from "path";
import { toLabelsJson } from "./curated-labels";

const labelsPath = path.join(__dirname, "labels.json");
const labels = toLabelsJson();
fs.writeFileSync(labelsPath, JSON.stringify(labels, null, 2));
console.log(`Wrote ${labels.length} curated Pexels labels to ${labelsPath}`);
