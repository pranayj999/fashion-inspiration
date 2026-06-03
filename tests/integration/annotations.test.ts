import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getImageById, insertImageFromParts, resetDbConnection, updateAnnotations } from "@/lib/db";
import type { AiMetadata } from "@/lib/types";

const sampleAi: AiMetadata = {
  description: "Silk dress with embroidered neckline.",
  garmentType: "dress",
  style: "elegant",
  material: "silk",
  colorPalette: ["black"],
  pattern: "embroidered",
  season: "summer",
  occasion: "evening",
  consumerProfile: "luxury",
  trendNotes: "quiet luxury",
  location: { continent: "Europe", country: "France", city: "Paris" },
};

describe("updateAnnotations", () => {
  let testDbPath = "";

  beforeEach(() => {
    resetDbConnection();
    testDbPath = path.join(
      os.tmpdir(),
      `fashion-annotations-test-${process.pid}-${Date.now()}-${Math.random()}.db`
    );
    process.env.INSPIRATION_DB_PATH = testDbPath;
  });

  afterEach(() => {
    resetDbConnection();
    delete process.env.INSPIRATION_DB_PATH;
    for (const file of [testDbPath, `${testDbPath}-wal`, `${testDbPath}-shm`]) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
  });

  it("persists tags and notes", () => {
    insertImageFromParts("img-1", "img-1.jpg", "Alex", "2024-06-15T10:00:00.000Z", sampleAi);

    const updated = updateAnnotations("img-1", {
      tags: ["artisan market", "neckline"],
      notes: "Strong embroidery at the collar.",
    });

    expect(updated?.annotations.tags).toEqual(["artisan market", "neckline"]);
    expect(updated?.annotations.notes).toBe("Strong embroidery at the collar.");

    const reloaded = getImageById("img-1");
    expect(reloaded?.annotations.tags).toEqual(["artisan market", "neckline"]);
    expect(reloaded?.annotations.notes).toBe("Strong embroidery at the collar.");
  });

  it("allows saving notes only while keeping existing tags", () => {
    insertImageFromParts("img-2", "img-2.jpg", "Alex", "2024-06-15T10:00:00.000Z", sampleAi, {
      tags: ["existing"],
      notes: "",
    });

    const updated = updateAnnotations("img-2", {
      tags: ["existing"],
      notes: "Updated observation",
    });

    expect(updated?.annotations.notes).toBe("Updated observation");
    expect(updated?.annotations.tags).toEqual(["existing"]);
  });
});
