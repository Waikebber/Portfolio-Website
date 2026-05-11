"use client";

import { useState } from "react";
import type { Tab } from "@/types/guitar-tabs";

interface Props {
  tab: Tab;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TabCard({ tab, onEdit, onDelete }: Props) {
  const [opening, setOpening] = useState(false);

  async function openTab() {
    const recordRecent = () =>
      fetch("/api/guitar-tabs/recents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tab_id: tab.id }),
      });

    if (tab.source_type === "link") {
      window.open(tab.source_value, "_blank", "noopener noreferrer");
      recordRecent();
      return;
    }

    setOpening(true);
    try {
      const res = await fetch(`/api/guitar-tabs/signed-url?path=${encodeURIComponent(tab.source_value)}`);
      if (res.ok) {
        const { url } = await res.json();
        window.open(url, "_blank", "noopener noreferrer");
        recordRecent();
      }
    } finally {
      setOpening(false);
    }
  }

  return (
    <div
      className="rounded-[12px] px-6 py-5"
      style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          {tab.description && (
            <p className="text-warm-white text-[18px] font-medium mb-1">{tab.description}</p>
          )}
          <button
            onClick={openTab}
            disabled={opening}
            className="text-teal text-[13px] mt-1 inline-block hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {opening ? "Opening…" : "Open tab →"}
          </button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onEdit}
            className="h-[28px] px-3 rounded-[6px] text-muted text-[13px] hover:text-warm-white transition-colors cursor-pointer"
            style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="h-[28px] w-[38px] flex items-center justify-center rounded-[6px] text-[13px] cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: "#141417", border: "1px solid #bf4d4d", color: "#bf4d4d" }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4" style={{ height: "1px", background: "rgba(240,237,230,0.06)" }} />

      {/* Details */}
      <div className="flex gap-12">
        <div>
          <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-2">Tuning</p>
          <p className="text-warm-white text-[14px]">{tab.tuning?.name ?? "—"}</p>
          {tab.tuning?.strings && (
            <p className="text-muted text-[13px] mt-1">{tab.tuning.strings}</p>
          )}
        </div>

        <div>
          <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-2">Capo</p>
          <p className="text-warm-white text-[14px]">{tab.capo != null ? `Fret ${tab.capo}` : "—"}</p>
        </div>

        <div>
          <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-2">Source</p>
          <div
            className="inline-flex items-center px-2 rounded-[4px] h-5 mb-1"
            style={{ background: "rgba(97,193,216,0.12)" }}
          >
            <span className="text-teal text-[11px] capitalize">{tab.source_type}</span>
          </div>
          <p className="text-muted text-[12px] truncate max-w-[240px]">{tab.source_value}</p>
        </div>
      </div>
    </div>
  );
}
