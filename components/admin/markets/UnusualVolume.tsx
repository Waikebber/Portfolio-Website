import type { VolumeFlag } from "@/types/markets";

interface Props {
  flags: VolumeFlag[];
  onTickerClick: (ticker: string) => void;
}

export default function UnusualVolume({ flags, onTickerClick }: Props) {
  return (
    <div
      style={{
        background: "#141417",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    >
      {flags.length === 0 ? (
        <p className="text-muted text-[13px] p-4">No unusual volume today.</p>
      ) : (
        flags.map((f) => (
          <button
            key={f.ticker}
            onClick={() => onTickerClick(f.ticker)}
            className="w-full text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
            style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-teal font-semibold" style={{ fontSize: "0.875rem" }}>{f.ticker}</span>
                  <span className="text-muted truncate" style={{ fontSize: "0.6875rem" }}>{f.company_name}</span>
                </div>
                {f.top_headline && (
                  <p className="text-muted mt-0.5 truncate" style={{ fontSize: "0.6875rem" }}>{f.top_headline}</p>
                )}
              </div>
              <span
                className="shrink-0 font-medium"
                style={{
                  background: "rgba(245,158,11,0.15)",
                  color: "#f59e0b",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: "0.25rem",
                  padding: "0.15rem 0.45rem",
                  fontSize: "0.6875rem",
                  whiteSpace: "nowrap",
                }}
              >
                {f.volume_ratio.toFixed(1)}× avg vol
              </span>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
