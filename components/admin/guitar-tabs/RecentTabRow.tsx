"use client";

import { useRouter } from "next/navigation";
import type { RecentTab } from "@/types/guitar-tabs";

interface Props {
  recent: RecentTab;
}

export default function RecentTabRow({ recent }: Props) {
  const router = useRouter();

  function handleOpen() {
    if (recent.source_type === "link" && recent.source_value) {
      window.open(recent.source_value, "_blank", "noopener noreferrer");
    } else {
      router.push(`/admin/guitar-tabs/${recent.genre_id}/${recent.artist_id}/${recent.song_id}`);
    }
  }

  return (
    <button
      onClick={handleOpen}
      className="w-full text-left rounded-[10px] px-4 py-4 hover:opacity-90 transition-opacity cursor-pointer"
      style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p style={{ color: "#f0ede6", fontSize: "14px", fontWeight: 500, lineHeight: "18px" }} className="truncate">
        {recent.song_title}
        {recent.song_title_translated && (
          <span style={{ color: "#888", fontWeight: 400 }}> · {recent.song_title_translated}</span>
        )}
      </p>
      <p style={{ color: "#888", fontSize: "11px", marginTop: "3px" }} className="truncate">
        {recent.artist_name}
        {recent.artist_name_translated && ` · ${recent.artist_name_translated}`}
      </p>
      {recent.tab_description && (
        <p style={{ color: "#61c1d8", fontSize: "11px", marginTop: "2px" }} className="truncate">
          {recent.tab_description}
        </p>
      )}
      {recent.tuning_name && (
        <p style={{ color: "#666", fontSize: "11px", marginTop: "4px" }}>{recent.tuning_name}</p>
      )}
    </button>
  );
}
