import type { TickerRow } from "@/types/markets";

const COLS = "5rem 1fr 8rem 8rem 6rem 5.5rem";
const HEADERS = ["TICKER", "COMPANY", "SECTOR", "INDUSTRY", "MARKET CAP", ""];

interface Props {
  rows: TickerRow[];
  empty: boolean;
  deleting: string | null;
  onTickerClick: (ticker: string) => void;
  onDeactivate: (ticker: string) => void;
}

export default function UniverseTable({ rows, empty, deleting, onTickerClick, onDeactivate }: Props) {
  return (
    <div
      style={{
        background: "#141417",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <div
        className="grid"
        style={{ gridTemplateColumns: COLS, padding: "0.625rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        {HEADERS.map((h) => (
          <span key={h} style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "#555" }}>{h}</span>
        ))}
      </div>

      {empty ? (
        <p className="text-muted text-[13px] p-4">No tickers match.</p>
      ) : (
        rows.map((t) => (
          <div
            key={t.ticker}
            className="grid hover:bg-white/[0.02] transition-colors"
            style={{
              gridTemplateColumns: COLS,
              padding: "0.7rem 1rem",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              alignItems: "center",
              opacity: t.active ? 1 : 0.4,
            }}
          >
            <button
              onClick={() => onTickerClick(t.ticker)}
              className="text-teal font-semibold text-left cursor-pointer hover:underline"
              style={{ fontSize: "0.875rem" }}
            >
              {t.ticker}
            </button>
            <span className="text-warm-white truncate pr-2" style={{ fontSize: "0.8125rem" }}>{t.company_name}</span>
            <span className="text-muted truncate" style={{ fontSize: "0.8125rem" }}>{t.sector ?? "—"}</span>
            <span className="text-muted truncate" style={{ fontSize: "0.8125rem" }}>{t.industry ?? "—"}</span>
            <span className="text-muted" style={{ fontSize: "0.8125rem" }}>
              {t.market_cap_b != null ? `$${t.market_cap_b}B` : "—"}
            </span>
            <div className="flex justify-end">
              {t.active && (
                <button
                  onClick={() => onDeactivate(t.ticker)}
                  disabled={deleting === t.ticker}
                  className="text-[11px] cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40"
                  style={{ color: "#555" }}
                >
                  {deleting === t.ticker ? "…" : "Deactivate"}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
