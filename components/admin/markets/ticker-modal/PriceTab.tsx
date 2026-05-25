import type { TickerDetail } from "@/types/markets";
import { fmt, fmtDate } from "@/lib/marketsFormat";
import StatBlock from "./StatBlock";

export default function PriceTab({ detail }: { detail: TickerDetail }) {
  const t = detail.today ?? null;
  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBlock label="Close Price" value={t?.price_close != null ? `$${t.price_close.toFixed(2)}` : "—"} />
        <StatBlock label="1-Day Return" value={fmt(t?.return_1d ?? null, true)} />
        <StatBlock label="5-Day Return" value={fmt(t?.return_5d ?? null, true)} />
        <StatBlock label="20-Day Return" value={fmt(t?.return_20d ?? null, true)} />
      </div>

      <div>
        <p className="text-muted mb-3" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>30-DAY PRICE HISTORY</p>
        <div className="flex flex-col gap-0.5">
          {detail.price_history.slice(0, 14).map((p) => (
            <div key={p.date} className="flex items-center justify-between" style={{ fontSize: "0.8125rem" }}>
              <span className="text-muted">{fmtDate(p.date)}</span>
              <span className="text-warm-white">
                {p.price_close != null ? `$${p.price_close.toFixed(2)}` : "—"}
              </span>
              <span
                style={{
                  color: (p.return_1d ?? 0) >= 0 ? "#4ade80" : "#f87171",
                  minWidth: "3.5rem",
                  textAlign: "right",
                }}
              >
                {fmt(p.return_1d, true)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
