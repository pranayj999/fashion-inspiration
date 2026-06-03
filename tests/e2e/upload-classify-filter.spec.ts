import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

test("upload, classify, and filter inspiration image", async ({ page }) => {
  const designer = `Playwright Designer ${Date.now()}`;
  const fixturePath = path.join(__dirname, "fixtures", "sample-upload.png");
  fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
  fs.writeFileSync(fixturePath, tinyPng);

  await page.goto("/");

  await page.fill("#designer", designer);
  await page.fill("#locationHint", "Europe, France, Paris");
  await page.setInputFiles("#file", fixturePath);
  await page.getByRole("button", { name: "Upload & classify" }).click();

  await expect(page.getByText("Uploaded and classified.")).toBeVisible({ timeout: 15000 });

  await page.selectOption("#filter-designer", { label: designer });
  await expect(page.getByText("1 inspiration image(s)")).toBeVisible();

  await page.selectOption("#filter-country", { label: "France" });
  await expect(page.getByText("1 inspiration image(s)")).toBeVisible();

  await page.fill("#search", "nonexistent-query-xyz");
  await expect(page.getByText("0 inspiration image(s)")).toBeVisible();
});
