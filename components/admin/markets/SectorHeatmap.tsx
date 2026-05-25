import type { SectorRow } from "@/types/markets";
import { fmt } from "@/lib/marketsFormat";

function sectorColor(ret: number | null): { bg: string; textPrimary: string; textSub: string } {
  if (ret == null) return { bg: "#19191d", textPrimary: "#888", textSub: "#555" };
  if (ret >= 0.015) return { bg: "rgba(22,163,74,0.25)", textPrimary: "#4ade80", textSub: "rgba(134,239,172,0.7)" };
  if (ret >= 0.005) return { bg: "rgba(22,163,74,0.14)", textPrimary: "#86efac", textSub: "rgba(134,239,172,0.6)" };
  if (ret > -0.005) return { bg: "#19191d", textPrimary: "#aaa", textSub: "#666" };
  if (ret > -0.015) return { bg: "rgba(239,68,68,0.14)", textPrimary: "#f87171", textSub: "rgba(248,113,113,0.6)" };
  return { bg: "rgba(239,68,68,0.25)", textPrimary: "#f87171", textSub: "rgba(248,113,113,0.7)" };
}

interface Props {
  sectors: SectorRow[];
  onSectorClick: (sector: string) => void;
}

export default function SectorHeatmap({ sectors, onSectorClick }: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
      {sectors.map((s) => {
        const { bg, textPrimary, textSub } = sectorColor(s.return_5d_avg);
        return (
          <button
            key={s.sector}
            onClick={() => onSectorClick(s.sector)}
            className="text-left cursor-pointer hover:brightness-110 transition-all"
            style={{
              background: bg,
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "0.625rem",
              padding: "0.75rem",
            }}
          >
            <p style={{ fontSize: "0.6875rem", color: textSub, marginBottom: "0.375rem" }}>{s.sector}</p>
            <p style={{ fontSize: "1.125rem", fontWeight: 600, color: textPrimary, lineHeight: 1 }}>
              {fmt(s.return_5d_avg, true)}
            </p>
            <p style={{ fontSize: "0.625rem", color: textSub, marginTop: "0.25rem" }}>
              sent {fmt(s.sentiment_score)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
