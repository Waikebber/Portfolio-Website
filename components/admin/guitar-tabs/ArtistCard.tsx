"use client";

import type { Artist } from "@/types/guitar-tabs";

interface Props {
  artist: Artist;
  onNavigate: () => void;
  onEdit: () => void;
}

export default function ArtistCard({ artist, onNavigate, onEdit }: Props) {
  return (
    <div
      onClick={onNavigate}
      className="rounded-[12px] relative hover:opacity-90 transition-opacity cursor-pointer"
      style={{
        background: "#141417",
        border: "1px solid rgba(255,255,255,0.08)",
        minHeight: "112px",
      }}
    >
      <div className="px-4 py-3 h-full flex gap-3 justify-between" style={{ minHeight: "112px" }}>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p style={{ color: "#f0ede6", fontSize: "15px", fontWeight: 500, lineHeight: 1 }} className="truncate">
            {artist.name}
          </p>
          {artist.name_translated && (
            <p style={{ color: "#888", fontSize: "11px", marginTop: "5px" }}>{artist.name_translated}</p>
          )}
        </div>
        <div className="flex flex-col items-end justify-between self-stretch shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-muted hover:text-warm-white transition-colors cursor-pointer text-[16px] leading-none px-1 pt-1"
          >
            ···
          </button>
          <p className="text-teal text-[12px] pb-1">{artist.song_count} song{artist.song_count !== 1 ? "s" : ""}</p>
        </div>
      </div>
    </div>
  );
}
