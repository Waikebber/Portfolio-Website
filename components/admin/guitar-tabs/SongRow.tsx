"use client";

import type { Song } from "@/types/guitar-tabs";

interface Props {
  song: Song;
  onEdit: () => void;
  onNavigate: () => void;
  onAddTab: () => void;
  onEditTab: () => void;
}

export default function SongRow({ song, onEdit, onNavigate, onAddTab, onEditTab }: Props) {
  return (
    <div
      onClick={onNavigate}
      className="flex items-stretch px-5 rounded-[10px] hover:opacity-90 transition-opacity cursor-pointer"
      style={{
        background: "#141417",
        border: "1px solid rgba(255,255,255,0.08)",
        minHeight: "84px",
      }}
    >
      <div className="flex-1 min-w-0 flex flex-col justify-center py-3">
        <p style={{ color: "#f0ede6", fontSize: "15px", fontWeight: 500, lineHeight: "18px" }} className="truncate">
          {song.title}
        </p>
        {song.title_translated && (
          <p style={{ color: "#888", fontSize: "11px", marginTop: "3px" }}>{song.title_translated}</p>
        )}
      </div>

      {song.tuning_name && (
        <p className="text-muted text-[13px] self-center mx-6 shrink-0">{song.tuning_name}</p>
      )}

      <div className="flex flex-col items-end justify-between shrink-0 self-stretch py-3 pl-4">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="text-muted hover:text-warm-white transition-colors cursor-pointer text-[16px] leading-none px-1 h-[22px] flex items-center"
        >
          ···
        </button>

        <div className="flex items-center gap-1.5">
          <p className="text-teal text-[12px] mr-1">{song.tab_count} {song.tab_count === 1 ? "tab" : "tabs"}</p>

          {song.tab_count === 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onEditTab(); }}
              title="Edit tab"
              className="h-[20px] w-[20px] flex items-center justify-center rounded-[4px] text-muted hover:text-warm-white transition-colors cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
              </svg>
            </button>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onAddTab(); }}
            title="Add tab"
            className="h-[20px] w-[20px] flex items-center justify-center rounded-[4px] text-teal text-[14px] hover:opacity-80 transition-opacity cursor-pointer"
            style={{ background: "rgba(97,193,216,0.08)", border: "1px solid rgba(97,193,216,0.2)" }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
