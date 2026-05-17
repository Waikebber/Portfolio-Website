"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGenres } from "@/hooks/admin/useGenres";
import { useRecents } from "@/hooks/admin/useRecents";
import GenreCard from "@/components/admin/guitar-tabs/GenreCard";
import GenrePanel from "@/components/admin/guitar-tabs/GenrePanel";
import RecentTabRow from "@/components/admin/guitar-tabs/RecentTabRow";
import type { Genre } from "@/types/guitar-tabs";

export default function GuitarTabsPage() {
  const router = useRouter();
  const { genres, loading, refresh } = useGenres();
  const { recents } = useRecents();
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  function openAdd() {
    setEditingGenre(null);
    setPanelOpen(true);
  }

  function openEdit(genre: Genre) {
    setEditingGenre(genre);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingGenre(null);
  }

  return (
    <div className="max-w-[1180px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-warm-white text-[32px] font-medium">Guitar Tabs</h1>
          <p className="text-muted text-[14px] mt-1">Browse tabs by genre, artist, and song.</p>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 flex items-center rounded-[8px] text-[13px] shrink-0 mt-1 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)", color: "#61c1d8" }}
        >
          + Add genre
        </button>
      </div>

      {recents.length > 0 && (
        <>
          <p className="text-muted text-[11px] tracking-[1.1px] uppercase mt-8 mb-4">Recently Accessed</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {recents.slice(0, 6).map((r, i) => (
              <div key={r.tab_id} className={i >= 4 ? "hidden sm:block" : ""}>
                <RecentTabRow recent={r} />
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-muted text-[11px] tracking-[1.1px] uppercase mt-8 mb-4">Genres</p>

      {loading ? (
        <p className="text-muted text-[13px]">Loading…</p>
      ) : genres.length === 0 ? (
        <p className="text-muted text-[13px]">No genres yet. Add one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {genres.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              onClick={() => router.push(`/admin/guitar-tabs/${genre.id}`)}
              onEdit={() => openEdit(genre)}
            />
          ))}
        </div>
      )}

      <GenrePanel
        genre={editingGenre}
        isOpen={panelOpen}
        onClose={closePanel}
        onSaved={refresh}
      />
    </div>
  );
}
