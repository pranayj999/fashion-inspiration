import fs from "fs";
import os from "os";
import path from "path";

export default function globalSetup() {
  const testDbPath = path.join(os.tmpdir(), "fashion-inspiration-e2e.db");
  for (const file of [testDbPath, `${testDbPath}-wal`, `${testDbPath}-shm`]) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}
