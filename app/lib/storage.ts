import fs from "fs";
import path from "path";

export function getUploadsDir() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function saveUploadedFile(file: File, id: string): Promise<string> {
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${id}${ext}`;
  const uploadsDir = getUploadsDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  return filename;
}
