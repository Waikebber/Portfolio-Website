import { requireAnyAdmin, proxyGet, proxyMutate } from "../_proxy";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await requireAnyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return proxyGet("/api/jobs/status");
}

export async function POST(req: Request) {
  const user = await requireAnyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  return proxyMutate("/api/jobs/trigger", "POST", body);
}
