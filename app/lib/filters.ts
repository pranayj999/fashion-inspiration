import type { DynamicFilters, FilterState, ImageRecord } from "./types";

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function buildDynamicFilters(images: ImageRecord[]): DynamicFilters {
  return {
    garmentType: uniqueSorted(images.map((i) => i.ai.garmentType)),
    style: uniqueSorted(images.map((i) => i.ai.style)),
    material: uniqueSorted(images.map((i) => i.ai.material)),
    colorPalette: uniqueSorted(images.flatMap((i) => i.ai.colorPalette)),
    pattern: uniqueSorted(images.map((i) => i.ai.pattern)),
    occasion: uniqueSorted(images.map((i) => i.ai.occasion)),
    consumerProfile: uniqueSorted(images.map((i) => i.ai.consumerProfile)),
    trendNotes: uniqueSorted(images.map((i) => i.ai.trendNotes)),
    continent: uniqueSorted(images.map((i) => i.ai.location.continent)),
    country: uniqueSorted(images.map((i) => i.ai.location.country)),
    city: uniqueSorted(images.map((i) => i.ai.location.city)),
    year: uniqueSorted(
      images.map((i) => String(new Date(i.capturedAt).getUTCFullYear()))
    ),
    month: uniqueSorted(
      images.map((i) => String(new Date(i.capturedAt).getUTCMonth() + 1))
    ),
    season: uniqueSorted(images.map((i) => i.ai.season)),
    designer: uniqueSorted(images.map((i) => i.designer)),
  };
}

function matchesText(haystack: string, needle?: string): boolean {
  if (!needle) return true;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function matchesExact(value: string, filter?: string): boolean {
  if (!filter) return true;
  return value.toLowerCase() === filter.toLowerCase();
}

export function filterImages(
  images: ImageRecord[],
  filters: FilterState
): ImageRecord[] {
  return images.filter((image) => {
    const captured = new Date(image.capturedAt);
    const year = String(captured.getUTCFullYear());
    const month = String(captured.getUTCMonth() + 1);

    const searchableText = [
      image.ai.description,
      image.ai.garmentType,
      image.ai.style,
      image.ai.material,
      image.ai.pattern,
      image.ai.occasion,
      image.ai.consumerProfile,
      image.ai.trendNotes,
      image.ai.location.continent,
      image.ai.location.country,
      image.ai.location.city,
      image.designer,
      ...image.ai.colorPalette,
      ...image.annotations.tags,
      image.annotations.notes,
    ].join(" ");

    if (!matchesText(searchableText, filters.q)) return false;
    if (!matchesExact(image.ai.garmentType, filters.garmentType)) return false;
    if (!matchesExact(image.ai.style, filters.style)) return false;
    if (!matchesExact(image.ai.material, filters.material)) return false;
    if (!matchesExact(image.ai.pattern, filters.pattern)) return false;
    if (!matchesExact(image.ai.occasion, filters.occasion)) return false;
    if (!matchesExact(image.ai.consumerProfile, filters.consumerProfile)) return false;
    if (!matchesExact(image.ai.trendNotes, filters.trendNotes)) return false;
    if (!matchesExact(image.ai.location.continent, filters.continent)) return false;
    if (!matchesExact(image.ai.location.country, filters.country)) return false;
    if (!matchesExact(image.ai.location.city, filters.city)) return false;
    if (!matchesExact(image.ai.season, filters.season)) return false;
    if (!matchesExact(image.designer, filters.designer)) return false;
    if (!matchesExact(year, filters.year)) return false;
    if (!matchesExact(month, filters.month)) return false;

    if (filters.colorPalette) {
      const palette = image.ai.colorPalette.map((c) => c.toLowerCase());
      if (!palette.includes(filters.colorPalette.toLowerCase())) return false;
    }

    return true;
  });
}

export function parseFilterState(searchParams: URLSearchParams): FilterState {
  const keys = [
    "q",
    "garmentType",
    "style",
    "material",
    "colorPalette",
    "pattern",
    "occasion",
    "consumerProfile",
    "trendNotes",
    "continent",
    "country",
    "city",
    "year",
    "month",
    "season",
    "designer",
  ] as const;

  const filters: FilterState = {};
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) filters[key] = value;
  }
  return filters;
}
