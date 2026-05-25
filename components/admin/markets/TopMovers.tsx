import type { MoverTicker } from "@/types/markets";
import { pct } from "@/lib/marketsFormat";

interface Props {
  bull: MoverTicker[];
  bear: MoverTicker[];
  onTickerClick: (ticker: string) => void;
}

function MoverRow({ m, onTickerClick }: { m: MoverTicker; onTickerClick: (t: string) => void }) {
  const ret = m.return_1d;
  const color = ret == null ? "#888" : ret >= 0 ? "#4ade80" : "#f87171";
  return (
    <button
      onClick={() => onTickerClick(m.ticker)}
      className="w-full text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
      style={{
        padding: "0.75rem 1rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-teal font-semibold" style={{ fontSize: "0.875rem" }}>{m.ticker}</span>
            <span className="text-muted truncate" style={{ fontSize: "0.6875rem" }}>{m.company_name}</span>
          </div>
          {m.top_headline && (
            <p className="text-muted mt-0.5 truncate" style={{ fontSize: "0.6875rem" }}>{m.top_headline}</p>
          )}
        </div>
        <span className="font-semibold shrink-0" style={{ color, fontSize: "0.875rem" }}>{pct(ret)}</span>
      </div>
    </button>
  );
}

export default function TopMovers({ bull, bear, onTickerClick }: Props) {
  const movers = [...bull, ...bear].sort((a, b) => Math.abs(b.return_1d ?? 0) - Math.abs(a.return_1d ?? 0));
  return (
    <div
      style={{
        background: "#141417",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    >
      {movers.length === 0 ? (
        <p className="text-muted text-[13px] p-4">No movers data yet.</p>
      ) : (
        movers.map((m) => <MoverRow key={m.ticker} m={m} onTickerClick={onTickerClick} />)
      )}
    </div>
  );
}
