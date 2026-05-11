"use client";

import { useState } from "react";
import type { Tab } from "@/types/guitar-tabs";

interface Props {
  tab: Tab;
  onEdit: () => void;
  onDelete: () => void;
  onPinToggle: () => void;
}

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {filled ? (
        <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1-.5 1s-.5-.724-.5-1V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.83V2.5a2.804 2.804 0 0 1-.543-.394C4.093 1.818 3.5 1.279 3.5.5a.5.5 0 0 1 .146-.354z" />
      ) : (
        <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z" />
      )}
    </svg>
  );
}

export default function TabCard({ tab, onEdit, onDelete, onPinToggle }: Props) {
  const [opening, setOpening] = useState(false);
  const [pinning, setPinning] = useState(false);

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

  async function togglePin() {
    setPinning(true);
    await fetch(`/api/guitar-tabs/tabs/${tab.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_pinned: !tab.is_pinned }),
    });
    setPinning(false);
    onPinToggle();
  }

  return (
    <div
      className="rounded-[12px] overflow-hidden relative"
      style={{
        background: "#141417",
        border: `1px solid ${tab.is_pinned ? "rgba(97,193,216,0.35)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {tab.is_pinned && (
        <div className="absolute top-0 left-0 h-full w-[3px] rounded-l-[12px]" style={{ background: "#61c1d8" }} />
      )}

      <div className="px-6 py-5">
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
              onClick={togglePin}
              disabled={pinning}
              title={tab.is_pinned ? "Unpin" : "Pin"}
              className="h-[28px] w-[32px] flex items-center justify-center rounded-[6px] transition-colors cursor-pointer disabled:opacity-50"
              style={{
                background: tab.is_pinned ? "rgba(97,193,216,0.12)" : "#141417",
                border: `1px solid ${tab.is_pinned ? "rgba(97,193,216,0.35)" : "rgba(255,255,255,0.08)"}`,
                color: tab.is_pinned ? "#61c1d8" : "#888",
              }}
            >
              <PinIcon filled={tab.is_pinned} />
            </button>
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
    </div>
  );
}
