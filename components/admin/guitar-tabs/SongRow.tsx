"use client";

import type { Song } from "@/types/guitar-tabs";

interface Props {
  song: Song;
  onEdit: () => void;
  onNavigate: () => void;
}

export default function SongRow({ song, onEdit, onNavigate }: Props) {
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

      <div className="flex flex-col items-end justify-between shrink-0 py-3">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="text-muted hover:text-warm-white transition-colors cursor-pointer text-[16px] leading-none px-1"
        >
          ···
        </button>
        <p className="text-teal text-[12px]">{song.tab_count} {song.tab_count === 1 ? "tab" : "tabs"}</p>
      </div>
    </div>
  );
}
