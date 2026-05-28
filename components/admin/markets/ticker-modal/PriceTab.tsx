"use client";

import { useState } from "react";
import type { TickerDetail } from "@/types/markets";
import { fmt, fmtDate } from "@/lib/marketsFormat";
import StatBlock from "./StatBlock";

const DEFAULT_ROWS = 10;

export default function PriceTab({ detail }: { detail: TickerDetail }) {
  const [expanded, setExpanded] = useState(false);
  const t = detail.today ?? null;

  const history = [...detail.price_history].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const visible = expanded ? history : history.slice(0, DEFAULT_ROWS);
  const hidden = history.length - DEFAULT_ROWS;

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
          {visible.map((p) => (
            <div key={p.date} className="flex items-center justify-between" style={{ fontSize: "0.8125rem" }}>
              <span className="text-muted">{fmtDate(p.date)}</span>
              <span className="text-warm-white">
                {p.price_close != null ? `$${p.price_close.toFixed(2)}` : "—"}
              </span>
              <span style={{ color: (p.return_1d ?? 0) >= 0 ? "#4ade80" : "#f87171", minWidth: "3.5rem", textAlign: "right" }}>
                {fmt(p.return_1d, true)}
              </span>
            </div>
          ))}
        </div>
        {hidden > 0 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1.5 mt-3 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: "#555" }}
          >
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{ transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: "0.6875rem" }}>{expanded ? "Show less" : `${hidden} more`}</span>
          </button>
        )}
      </div>
    </div>
  );
}
