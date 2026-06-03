import fs from "fs";
import path from "path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(repoRoot, "eval", "downloaded");
const targetDir = path.join(repoRoot, "app", "public", "eval");

if (!fs.existsSync(sourceDir)) {
  console.error("Missing eval/downloaded. Run: npm run eval:download");
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

const files = fs.readdirSync(sourceDir).filter((name) => name.endsWith(".jpg"));
let copied = 0;

for (const name of files) {
  const src = path.join(sourceDir, name);
  const dest = path.join(targetDir, name);
  if (!fs.existsSync(dest) || fs.statSync(src).mtimeMs > fs.statSync(dest).mtimeMs) {
    fs.copyFileSync(src, dest);
    copied += 1;
  }
}

console.log(`Synced ${files.length} eval image(s) to app/public/eval (${copied} updated).`);
