import { createClient } from "@/lib/supabase/server";
import { getDashboard } from "@/lib/markets";
import MarketsClient from "@/components/admin/markets/MarketsClient";

export const revalidate = 300;

export default async function MarketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let watchlistTickers: string[] = [];
  if (user) {
    const { data } = await supabase.from("user_watchlist").select("ticker").eq("user_id", user.id);
    watchlistTickers = data?.map((r) => r.ticker) ?? [];
  }

  let data;
  try {
    data = await getDashboard(watchlistTickers);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return (
      <div>
        <h1 className="text-warm-white font-medium mb-2" style={{ fontSize: "2rem" }}>Markets</h1>
        <div
          style={{
            background: "#141417",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginTop: "1.5rem",
          }}
        >
          <p className="text-warm-white text-[14px] font-medium mb-1">Markets API unavailable</p>
          <p className="text-muted text-[13px] mt-1">
            The backend may still be starting up — try refreshing in a moment.
          </p>
          <p className="text-muted text-[11px] mt-2" style={{ opacity: 0.5 }}>{msg}</p>
        </div>
      </div>
    );
  }

  return <MarketsClient data={data} />;
}
