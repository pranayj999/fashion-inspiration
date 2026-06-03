import { describe, expect, it } from "vitest";
import { filterImages } from "@/lib/filters";
import type { ImageRecord } from "@/lib/types";

function buildImage(overrides: Partial<ImageRecord> & { id: string }): ImageRecord {
  return {
    id: overrides.id,
    filename: `${overrides.id}.jpg`,
    designer: overrides.designer ?? "Alex Chen",
    capturedAt: overrides.capturedAt ?? "2024-06-15T10:00:00.000Z",
    ai: {
      description: overrides.ai?.description ?? "Silk evening dress with embroidered neckline.",
      garmentType: overrides.ai?.garmentType ?? "dress",
      style: overrides.ai?.style ?? "minimalist",
      material: overrides.ai?.material ?? "silk",
      colorPalette: overrides.ai?.colorPalette ?? ["black"],
      pattern: overrides.ai?.pattern ?? "solid",
      season: overrides.ai?.season ?? "summer",
      occasion: overrides.ai?.occasion ?? "evening",
      consumerProfile: overrides.ai?.consumerProfile ?? "luxury",
      trendNotes: overrides.ai?.trendNotes ?? "quiet luxury",
      location: overrides.ai?.location ?? {
        continent: "Europe",
        country: "France",
        city: "Paris",
      },
    },
    annotations: overrides.annotations ?? { tags: ["artisan market"], notes: "Strong neckline detail" },
    createdAt: overrides.createdAt ?? "2024-06-15T10:00:00.000Z",
  };
}

describe("filterImages", () => {
  const library = [
    buildImage({ id: "a", designer: "Alex Chen", capturedAt: "2024-03-10T09:00:00.000Z" }),
    buildImage({
      id: "b",
      designer: "Jamie Park",
      capturedAt: "2023-11-02T09:00:00.000Z",
      annotations: { tags: [], notes: "" },
      ai: {
        description: "Denim streetwear jacket in Tokyo market.",
        garmentType: "jacket",
        style: "streetwear",
        material: "denim",
        colorPalette: ["indigo"],
        pattern: "solid",
        season: "fall",
        occasion: "casual",
        consumerProfile: "young adult",
        trendNotes: "oversized silhouette",
        location: { continent: "Asia", country: "Japan", city: "Tokyo" },
      },
    }),
  ];

  it("filters by location fields", () => {
    const filtered = filterImages(library, {
      continent: "Asia",
      country: "Japan",
      city: "Tokyo",
    });
    expect(filtered.map((item) => item.id)).toEqual(["b"]);
  });

  it("filters by year and month", () => {
    const byYear = filterImages(library, { year: "2024" });
    expect(byYear.map((item) => item.id)).toEqual(["a"]);

    const byMonth = filterImages(library, { month: "11", year: "2023" });
    expect(byMonth.map((item) => item.id)).toEqual(["b"]);
  });

  it("supports full-text search across AI and designer annotations", () => {
    const byAi = filterImages(library, { q: "embroidered neckline" });
    expect(byAi.map((item) => item.id)).toEqual(["a"]);

    const byDesignerTag = filterImages(library, { q: "artisan market" });
    expect(byDesignerTag.map((item) => item.id)).toEqual(["a"]);
  });
});
