import { requireAnyAdmin, proxyGet } from "../_proxy";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await requireAnyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return proxyGet("/api/dashboard", 1800);
}
