import { describe, expect, it } from "vitest";
import { parseModelOutput } from "@/lib/classifier";

describe("parseModelOutput", () => {
  it("parses fenced JSON with full metadata", () => {
    const raw = `\`\`\`json
    {
      "description": "Embroidered linen dress with artisan neckline at an open-air market.",
      "garmentType": "dress",
      "style": "bohemian",
      "material": "linen",
      "colorPalette": ["cream", "terracotta"],
      "pattern": "embroidered",
      "season": "summer",
      "occasion": "casual",
      "consumerProfile": "creative professional",
      "trendNotes": "artisan revival",
      "location": {
        "continent": "Europe",
        "country": "Portugal",
        "city": "Lisbon"
      }
    }
    \`\`\``;

    const parsed = parseModelOutput(raw);
    expect(parsed.garmentType).toBe("dress");
    expect(parsed.material).toBe("linen");
    expect(parsed.colorPalette).toEqual(["cream", "terracotta"]);
    expect(parsed.location.city).toBe("Lisbon");
  });

  it("normalizes string color palettes and applies fallbacks", () => {
    const raw = JSON.stringify({
      description: "",
      garmentType: "",
      colorPalette: "navy, white",
      location: {},
    });

    const parsed = parseModelOutput(raw);
    expect(parsed.garmentType).toBe("unknown");
    expect(parsed.colorPalette).toEqual(["navy", "white"]);
    expect(parsed.location.continent).toBe("unknown");
  });

  it("throws when no JSON is present", () => {
    expect(() => parseModelOutput("not json")).toThrow(/JSON/i);
  });
});
