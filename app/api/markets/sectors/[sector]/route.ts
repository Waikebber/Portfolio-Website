import { requireAnyAdmin, proxyGet } from "@/app/api/markets/_proxy";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sector: string }> }
) {
  const user = await requireAnyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { sector } = await params;
  return proxyGet(`/api/sectors/${encodeURIComponent(sector)}`);
}
