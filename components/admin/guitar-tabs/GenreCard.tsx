"use client";

import type { Genre } from "@/types/guitar-tabs";

interface Props {
  genre: Genre;
  onClick: () => void;
  onEdit: () => void;
}

export default function GenreCard({ genre, onClick, onEdit }: Props) {
  return (
    <div
      onClick={onClick}
      className="rounded-[12px] overflow-hidden relative hover:opacity-90 transition-opacity cursor-pointer"
      style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)", height: "112px" }}
    >
      <div
        className="absolute top-0 left-0 h-full w-[3px] rounded-l-[12px]"
        style={{ background: "#61c1d8" }}
      />
      <div className="pl-6 pr-3 py-3 h-full flex gap-4 justify-between">
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-warm-white text-[18px] font-medium leading-none truncate">{genre.name}</p>
          {genre.description && (
            <p className="text-muted text-[12px] mt-2 truncate">{genre.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end justify-between self-stretch shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-muted hover:text-warm-white transition-colors cursor-pointer text-[16px] leading-none px-1 pt-1"
          >
            ···
          </button>
          <p className="text-teal text-[12px] pb-1">{genre.artist_count} artist{genre.artist_count !== 1 ? "s" : ""}</p>
        </div>
      </div>
    </div>
  );
}
