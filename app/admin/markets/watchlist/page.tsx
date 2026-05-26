import { createClient } from "@/lib/supabase/server";
import { getDashboard } from "@/lib/markets";
import WatchlistPageClient from "@/components/admin/markets/WatchlistPageClient";

export const revalidate = 300;

export default async function WatchlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let watchlistTickers: string[] = [];
  if (user) {
    const { data } = await supabase.from("user_watchlist").select("ticker").eq("user_id", user.id);
    watchlistTickers = data?.map((r) => r.ticker) ?? [];
  }

  let tickers: import("@/types/markets").WatchlistTicker[] = [];
  if (watchlistTickers.length) {
    try {
      const data = await getDashboard(watchlistTickers);
      tickers = data.watchlist;
    } catch {}
  }

  return <WatchlistPageClient tickers={tickers} />;
}
