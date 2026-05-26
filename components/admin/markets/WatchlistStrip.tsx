import Link from "next/link";
import type { WatchlistTicker } from "@/types/markets";
import { fmt, pct } from "@/lib/marketsFormat";
import SignalBadge from "./SignalBadge";

const MAX = 4;

function ReturnColor({ value }: { value: number | null }) {
  const color = value == null ? "#888" : value >= 0 ? "#4ade80" : "#f87171";
  return <span style={{ color }}>{pct(value)}</span>;
}

export function WatchlistCard({ t, onClick }: { t: WatchlistTicker; onClick: (ticker: string) => void }) {
  return (
    <button
      onClick={() => onClick(t.ticker)}
      className="flex flex-col justify-between text-left cursor-pointer hover:brightness-110 transition-all"
      style={{
        background: "#141417",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.75rem",
        padding: "1rem 1.125rem",
        minHeight: "6.5rem",
        width: "100%",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-teal font-semibold" style={{ fontSize: "0.9375rem" }}>{t.ticker}</p>
          <p className="text-muted" style={{ fontSize: "0.6875rem", marginTop: "0.1rem" }}>{t.company_name}</p>
        </div>
        <SignalBadge signal={t.signal_strength} size="xs" />
      </div>
      <div className="flex items-center gap-3 mt-2" style={{ fontSize: "0.75rem" }}>
        <ReturnColor value={t.return_5d} />
        <span style={{ color: "#444" }}>·</span>
        <span style={{ color: "#888" }}>sent {fmt(t.sentiment_score)}</span>
      </div>
    </button>
  );
}

export default function WatchlistStrip({ tickers, onTickerClick }: { tickers: WatchlistTicker[]; onTickerClick: (ticker: string) => void }) {
  if (!tickers.length) {
    return (
      <p className="text-muted text-[13px]">
        No watchlist tickers yet. Add them via the{" "}
        <a href="/admin/markets/universe" className="text-teal underline">Universe Manager</a>.
      </p>
    );
  }

  const visible = tickers.slice(0, MAX);
  const overflow = tickers.length - MAX;

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {visible.map((t) => <WatchlistCard key={t.ticker} t={t} onClick={onTickerClick} />)}
      </div>
      {overflow > 0 && (
        <div className="mt-3 flex justify-end">
          <Link
            href="/admin/markets/watchlist"
            className="text-teal hover:opacity-80 transition-opacity"
            style={{ fontSize: "0.8125rem" }}
          >
            View all {tickers.length} →
          </Link>
        </div>
      )}
    </div>
  );
}
