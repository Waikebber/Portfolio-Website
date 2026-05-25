import { NextResponse } from "next/server";
import { requireFullAdmin, proxyMutate } from "../../_proxy";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const user = await requireFullAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { ticker } = await params;
  return proxyMutate(`/api/tickers/${ticker}`, "DELETE");
}
