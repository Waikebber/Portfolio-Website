import { NextRequest, NextResponse } from "next/server";
import { requireAnyAdmin, requireFullAdmin, proxyGet, proxyMutate } from "../_proxy";

export async function GET() {
  const user = await requireAnyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return proxyGet("/api/tickers");
}

export async function POST(req: NextRequest) {
  const user = await requireFullAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  return proxyMutate("/api/tickers", "POST", body);
}
