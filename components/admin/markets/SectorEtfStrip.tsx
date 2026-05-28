"use client";

import { useRef } from "react";
import type { SectorEtf } from "@/types/markets";
import { pct } from "@/lib/marketsFormat";

const SECTOR_SHORT: Record<string, string> = {
  "Communication Services": "Comm.",
  "Consumer Discretionary": "Disc.",
  "Consumer Cyclical":      "Disc.",
  "Consumer Staples":       "Staples",
  "Consumer Defensive":     "Staples",
  "Energy":                 "Energy",
  "Financials":             "Fin.",
  "Financial Services":     "Fin.",
  "Health Care":            "Health",
  "Healthcare":             "Health",
  "Industrials":            "Indust.",
  "Information Technology": "Tech",
  "Technology":             "Tech",
  "Materials":              "Matl.",
  "Basic Materials":        "Matl.",
  "Real Estate":            "RE",
  "Utilities":              "Util.",
};

function ReturnPill({ value, label }: { value: number | null; label: string }) {
  const color = value == null ? "#555" : value >= 0 ? "#4ade80" : "#f87171";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: "#555" }}>{label}</span>
      <span style={{ fontSize: "0.8125rem", color, fontVariantNumeric: "tabular-nums" }}>
        {pct(value)}
      </span>
    </div>
  );
}

export default function SectorEtfStrip({ etfs }: { etfs: SectorEtf[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  if (!etfs.length) return null;

  function onMouseDown(e: React.MouseEvent) {
    drag.current = { active: true, startX: e.pageX, scrollLeft: ref.current?.scrollLeft ?? 0 };
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!drag.current.active || !ref.current) return;
    e.preventDefault();
    ref.current.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX);
  }
  function onMouseUp() { drag.current.active = false; }

  return (
    <div
      ref={ref}
      className="flex gap-2 overflow-x-auto pb-0.5 select-none"
      style={{ scrollbarWidth: "none", cursor: "grab" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {etfs.map((e) => (
        <div
          key={e.ticker}
          style={{
            background: "#141417",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0.75rem",
            padding: "0.625rem 0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
            flexShrink: 0,
          }}
        >
          <div>
            <p className="text-teal font-semibold" style={{ fontSize: "0.8125rem" }}>{e.ticker}</p>
            <p className="text-muted" style={{ fontSize: "0.625rem", marginTop: "0.1rem" }}>
              {e.sector ? (SECTOR_SHORT[e.sector] ?? e.sector) : "—"}
            </p>
          </div>
          <div style={{ width: "1px", height: "1.5rem", background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
          <div className="flex gap-3">
            <ReturnPill value={e.return_1d} label="1D" />
            <ReturnPill value={e.return_5d} label="5D" />
          </div>
        </div>
      ))}
    </div>
  );
}
