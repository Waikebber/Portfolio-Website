import type { WatchlistTicker } from "@/types/markets";
import { fmt, pct } from "@/lib/marketsFormat";
import SignalBadge from "./SignalBadge";

function ReturnColor({ value }: { value: number | null }) {
  const color = value == null ? "#888" : value >= 0 ? "#4ade80" : "#f87171";
  return <span style={{ color }}>{pct(value)}</span>;
}

export default function WatchlistStrip({ tickers }: { tickers: WatchlistTicker[] }) {
  if (!tickers.length) {
    return (
      <p className="text-muted text-[13px]">
        No watchlist tickers yet. Add them via the{" "}
        <a href="/admin/markets/universe" className="text-teal underline">Universe Manager</a>.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {tickers.map((t) => (
        <div
          key={t.ticker}
          className="flex flex-col justify-between"
          style={{
            background: "#141417",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0.75rem",
            padding: "1rem 1.125rem",
            minHeight: "6.5rem",
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
        </div>
      ))}
    </div>
  );
}
