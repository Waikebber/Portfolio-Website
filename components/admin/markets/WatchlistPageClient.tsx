"use client";

import { useState } from "react";
import Link from "next/link";
import type { WatchlistTicker } from "@/types/markets";
import { WatchlistCard } from "./WatchlistStrip";
import TickerModal from "./ticker-modal/TickerModal";
import { useRouter } from "next/navigation";

export default function WatchlistPageClient({ tickers }: { tickers: WatchlistTicker[] }) {
  const router = useRouter();
  const [activeTicker, setActiveTicker] = useState<string | null>(null);

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <Link
            href="/admin/markets"
            className="inline-flex items-center gap-1 text-muted hover:text-warm-white transition-colors mb-2"
            style={{ fontSize: "0.8125rem" }}
          >
            ← Markets
          </Link>
          <h1 className="text-warm-white font-medium" style={{ fontSize: "2rem" }}>Watchlist</h1>
          <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
            {tickers.length} ticker{tickers.length === 1 ? "" : "s"} watched
          </p>
        </div>
      </div>

      {tickers.length === 0 ? (
        <p className="text-muted text-[13px]">
          No watchlist tickers yet. Add them via the{" "}
          <Link href="/admin/markets/universe" className="text-teal underline">Universe Manager</Link>.
        </p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {tickers.map((t) => (
            <WatchlistCard key={t.ticker} t={t} onClick={setActiveTicker} />
          ))}
        </div>
      )}

      <TickerModal
        ticker={activeTicker}
        onClose={() => setActiveTicker(null)}
        onWatchlistChange={() => router.refresh()}
      />
    </>
  );
}
