"use client";

import type { Song } from "@/types/guitar-tabs";

interface Props {
  song: Song;
  onEdit: () => void;
  onNavigate: () => void;
  onAddTab: () => void;
}

export default function SongRow({ song, onEdit, onNavigate, onAddTab }: Props) {
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
        <div className="flex items-center gap-1">
          {song.tab_count !== 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddTab(); }}
              title="Add tab"
              className="h-[26px] w-[26px] flex items-center justify-center rounded-[6px] text-teal text-[15px] hover:opacity-80 transition-opacity cursor-pointer"
              style={{ background: "rgba(97,193,216,0.08)", border: "1px solid rgba(97,193,216,0.2)" }}
            >
              +
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-muted hover:text-warm-white transition-colors cursor-pointer text-[16px] leading-none px-1 h-[26px] flex items-center"
          >
            ···
          </button>
        </div>
        <p className="text-teal text-[12px]">{song.tab_count} {song.tab_count === 1 ? "tab" : "tabs"}</p>
      </div>
    </div>
  );
}
