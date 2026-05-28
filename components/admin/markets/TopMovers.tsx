"use client";

import { useState } from "react";
import type { MoverTicker } from "@/types/markets";
import { pct } from "@/lib/marketsFormat";

const MAX = 4;

function MoverRow({ m, onTickerClick }: { m: MoverTicker; onTickerClick: (t: string) => void }) {
  const ret = m.return_1d;
  const color = ret == null ? "#888" : ret >= 0 ? "#4ade80" : "#f87171";
  return (
    <button
      onClick={() => onTickerClick(m.ticker)}
      className="w-full text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
      style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
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

function MoverList({ items, onTickerClick }: { items: MoverTicker[]; onTickerClick: (t: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, MAX);
  const hidden = items.length - MAX;

  return (
    <div
      style={{
        background: "#141417",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    >
      {items.length === 0 ? (
        <p className="text-muted text-[13px] p-4">No data yet.</p>
      ) : (
        <>
          {visible.map((m) => <MoverRow key={m.ticker} m={m} onTickerClick={onTickerClick} />)}
          {hidden > 0 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="w-full flex items-center justify-center gap-1.5 hover:bg-white/[0.03] transition-colors cursor-pointer"
              style={{ padding: "0.6rem", color: "#555" }}
            >
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{ transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: "0.6875rem" }}>
                {expanded ? "Show less" : `${hidden} more`}
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

interface Props {
  bull: MoverTicker[];
  bear: MoverTicker[];
  onTickerClick: (ticker: string) => void;
}

export default function TopMovers({ bull, bear, onTickerClick }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "#4ade80", marginBottom: "0.5rem" }}>GAINERS</p>
        <MoverList items={bull} onTickerClick={onTickerClick} />
      </div>
      <div>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "#f87171", marginBottom: "0.5rem" }}>LOSERS</p>
        <MoverList items={bear} onTickerClick={onTickerClick} />
      </div>
    </div>
  );
}
