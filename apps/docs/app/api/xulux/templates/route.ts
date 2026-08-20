import { NextResponse } from "next/server";
import { isAiPlaygroundEnabled } from "@/lib/feature-flags";
import { getXuluxCatalog } from "@/lib/catalog/xulux";

export function GET() {
  if (!isAiPlaygroundEnabled) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json(getXuluxCatalog());
}
