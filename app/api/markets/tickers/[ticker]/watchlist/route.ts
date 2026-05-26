import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) console.error("[watchlist POST] auth error:", authError.message);
  if (!user) {
    console.error("[watchlist POST] no user found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { ticker } = await params;
  const { error } = await supabase
    .from("user_watchlist")
    .upsert({ user_id: user.id, ticker: ticker.toUpperCase() }, { onConflict: "user_id,ticker" });
  if (error) {
    console.error("[watchlist POST] upsert error:", error.message, error.code);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log("[watchlist POST] success:", user.id, ticker.toUpperCase());
  return NextResponse.json({ ticker, in_watchlist: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) console.error("[watchlist DELETE] auth error:", authError.message);
  if (!user) {
    console.error("[watchlist DELETE] no user found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { ticker } = await params;
  const { error } = await supabase
    .from("user_watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("ticker", ticker.toUpperCase());
  if (error) {
    console.error("[watchlist DELETE] delete error:", error.message, error.code);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log("[watchlist DELETE] success:", user.id, ticker.toUpperCase());
  return NextResponse.json({ ticker, in_watchlist: false });
}
