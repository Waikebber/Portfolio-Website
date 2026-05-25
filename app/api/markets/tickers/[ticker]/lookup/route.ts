import { requireAnyAdmin, proxyGet } from "@/app/api/markets/_proxy";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const user = await requireAnyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { ticker } = await params;
  return proxyGet(`/api/tickers/${ticker.toUpperCase()}/lookup`);
}
