import { NextRequest, NextResponse } from "next/server";
import { getImageById, updateAnnotations } from "@/lib/db";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const image = getImageById(id);
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(image);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const tags = Array.isArray(body.tags)
    ? body.tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)
    : undefined;
  const notes = typeof body.notes === "string" ? body.notes : undefined;

  const existing = getImageById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = updateAnnotations(id, {
    tags: tags ?? existing.annotations.tags,
    notes: notes ?? existing.annotations.notes,
  });

  if (!updated) {
    return NextResponse.json({ error: "Failed to update annotations" }, { status: 500 });
  }

  return NextResponse.json(updated);
}
