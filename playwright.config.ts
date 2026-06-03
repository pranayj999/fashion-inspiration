import { defineConfig, devices } from "@playwright/test";
import os from "os";
import path from "path";

const testDbPath = path.join(os.tmpdir(), "fashion-inspiration-e2e.db");

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  globalSetup: "./tests/e2e/global-setup.ts",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev --prefix app",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      NODE_ENV: "test",
      INSPIRATION_DB_PATH: testDbPath,
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
