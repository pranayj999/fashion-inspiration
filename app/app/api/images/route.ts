import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { classifyImage, mockClassify } from "@/lib/classifier";
import { insertImageFromParts, listImages } from "@/lib/db";
import { buildDynamicFilters, filterImages, parseFilterState } from "@/lib/filters";
import { saveUploadedFile } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const filters = parseFilterState(request.nextUrl.searchParams);
  const all = listImages();
  const images = filterImages(all, filters);
  const dynamicFilters = buildDynamicFilters(all);

  return NextResponse.json({ images, filters: dynamicFilters, total: images.length });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const designer = String(formData.get("designer") ?? "Unknown").trim() || "Unknown";
    const locationHint = String(formData.get("locationHint") ?? "").trim();
    const capturedAtRaw = String(formData.get("capturedAt") ?? "").trim();
    const useMock = String(formData.get("useMock") ?? "") === "true";
    const providerRaw = String(formData.get("provider") ?? "").toLowerCase();
    const provider =
      providerRaw === "openai" || providerRaw === "claude" ? providerRaw : useMock ? "mock" : "openai";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const id = uuidv4();
    const filename = await saveUploadedFile(file, id);
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";
    const capturedAt = capturedAtRaw
      ? new Date(capturedAtRaw).toISOString()
      : new Date().toISOString();

    let ai;
    if (provider === "mock") {
      ai = mockClassify(file.name, designer);
      if (locationHint) {
        const parts = locationHint.split(",").map((p) => p.trim());
        ai.location = {
          continent: parts[0] ?? "unknown",
          country: parts[1] ?? "unknown",
          city: parts[2] ?? "unknown",
        };
      }
    } else if (provider === "claude") {
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 400 });
      }
      ai = await classifyImage(buffer.toString("base64"), mimeType, {
        designer,
        locationHint,
        provider: "claude",
      });
    } else {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OPENAI_API_KEY is not set" }, { status: 400 });
      }
      ai = await classifyImage(buffer.toString("base64"), mimeType, {
        designer,
        locationHint,
        provider: "openai",
      });
    }

    insertImageFromParts(id, filename, designer, capturedAt, ai);

    return NextResponse.json({ id, filename, ai }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
