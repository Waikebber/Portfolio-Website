import type { TickerDetail } from "@/types/markets";
import { fmtEps, fmtDate } from "@/lib/marketsFormat";
import StatBlock from "./StatBlock";

export default function EarningsTab({ detail }: { detail: TickerDetail }) {
  const next = detail.earnings_next;
  return (
    <div className="flex flex-col gap-6 p-5">
      {next ? (
        <div
          style={{
            background: "rgba(97,193,216,0.06)",
            border: "1px solid rgba(97,193,216,0.15)",
            borderRadius: "0.625rem",
            padding: "1rem",
          }}
        >
          <p className="text-muted mb-2" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>NEXT EARNINGS</p>
          <div className="grid grid-cols-3 gap-4">
            <StatBlock label="Date" value={fmtDate(next.earnings_date)} />
            <StatBlock label="EPS Estimate" value={fmtEps(next.eps_estimate)} />
            <StatBlock label="Prior EPS" value={fmtEps(next.eps_prior)} />
          </div>
          <p className="text-muted mt-3" style={{ fontSize: "0.6875rem" }}>
            {next.days_out === 0 ? "Today" : `${next.days_out} day${next.days_out === 1 ? "" : "s"} out`}
          </p>
        </div>
      ) : (
        <p className="text-muted text-[13px]">No upcoming earnings in the next 14 days.</p>
      )}

      {detail.earnings_recent.length > 0 && (
        <div>
          <p className="text-muted mb-3" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>RECENT RESULTS</p>
          {detail.earnings_recent.map((e) => (
            <div
              key={e.earnings_date}
              className="flex items-center justify-between py-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.8125rem" }}
            >
              <span className="text-muted">
                {fmtDate(e.earnings_date, { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className="text-warm-white">Est: {fmtEps(e.eps_estimate)}</span>
              <span style={{ color: (e.eps_actual ?? 0) >= (e.eps_estimate ?? 0) ? "#4ade80" : "#f87171" }}>
                Act: {fmtEps(e.eps_actual)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
