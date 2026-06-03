import { NextResponse } from "next/server";
import { buildDynamicFilters } from "@/lib/filters";
import { listImages } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const filters = buildDynamicFilters(listImages());
  return NextResponse.json(filters);
}
