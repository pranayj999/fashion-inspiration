import fs from "fs";
import path from "path";
import type { ExpectedLabels } from "../app/lib/types";

const labelsPath = path.join(__dirname, "labels.json");
const downloadDir = path.join(__dirname, "downloaded");

async function downloadOne(label: ExpectedLabels) {
  const target = path.join(downloadDir, label.filename);
  if (fs.existsSync(target)) {
    return;
  }

  const response = await fetch(label.imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download ${label.id}: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(target, buffer);
}

async function main() {
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const labels = JSON.parse(fs.readFileSync(labelsPath, "utf8")) as ExpectedLabels[];
  let completed = 0;

  for (const label of labels) {
    await downloadOne(label);
    completed += 1;
    process.stdout.write(`\rDownloaded ${completed}/${labels.length}`);
  }

  process.stdout.write("\nDone.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
