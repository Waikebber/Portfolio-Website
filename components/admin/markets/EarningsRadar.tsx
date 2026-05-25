import type { EarningsRow } from "@/types/markets";
import { fmtEps, fmtDate } from "@/lib/marketsFormat";

function epsBeatColor(days: number): { color: string; label: string } {
  if (days <= 3) return { color: "#4ade80", label: "High" };
  if (days <= 7) return { color: "#f59e0b", label: "Medium" };
  return { color: "#f87171", label: "Low" };
}

interface Props {
  rows: EarningsRow[];
  onTickerClick: (ticker: string) => void;
}

export default function EarningsRadar({ rows, onTickerClick }: Props) {
  return (
    <div
      style={{
        background: "#141417",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: "6rem 5rem 1fr 1fr 7.5rem 4.5rem",
          padding: "0.625rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {["TICKER", "DATE", "EST. EPS", "PRIOR EPS", "EPS BEAT PROB", "DAYS OUT"].map((h) => (
          <span key={h} style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "#555" }}>{h}</span>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="text-muted text-[13px] p-4">No earnings in the next 14 days.</p>
      ) : (
        rows.map((r) => {
          const { color, label } = epsBeatColor(r.days_out);
          return (
            <button
              key={`${r.ticker}-${r.earnings_date}`}
              onClick={() => onTickerClick(r.ticker)}
              className="grid w-full text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
              style={{
                gridTemplateColumns: "6rem 5rem 1fr 1fr 7.5rem 4.5rem",
                padding: "0.7rem 1rem",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                alignItems: "center",
              }}
            >
              <span className="text-teal font-semibold" style={{ fontSize: "0.875rem" }}>{r.ticker}</span>
              <span className="text-warm-white" style={{ fontSize: "0.8125rem" }}>{fmtDate(r.earnings_date)}</span>
              <span className="text-warm-white" style={{ fontSize: "0.8125rem" }}>{fmtEps(r.eps_estimate)}</span>
              <span className="text-muted" style={{ fontSize: "0.8125rem" }}>{fmtEps(r.eps_prior)}</span>
              <span style={{ color, fontSize: "0.8125rem" }}>{label}</span>
              <span className="text-muted" style={{ fontSize: "0.8125rem" }}>{r.days_out}d</span>
            </button>
          );
        })
      )}
    </div>
  );
}
