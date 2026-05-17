"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useArtists } from "@/hooks/admin/useArtists";
import { useGenres } from "@/hooks/admin/useGenres";
import ArtistCard from "@/components/admin/guitar-tabs/ArtistCard";
import ArtistPanel from "@/components/admin/guitar-tabs/ArtistPanel";
import type { Artist } from "@/types/guitar-tabs";

export default function ArtistsPage({ params }: { params: Promise<{ genreId: string }> }) {
  const { genreId } = use(params);
  const router = useRouter();
  const { artists, loading, refresh } = useArtists(genreId);
  const { genres } = useGenres();
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

  const currentGenre = genres.find((g) => g.id === genreId);

  function openAdd() {
    setEditingArtist(null);
    setPanelOpen(true);
  }

  function openEdit(artist: Artist) {
    setEditingArtist(artist);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingArtist(null);
  }

  return (
    <div className="max-w-[1180px]">
      {/* Breadcrumb */}
      <Link
        href="/admin/guitar-tabs"
        className="text-muted text-[13px] hover:text-warm-white transition-colors mb-6 inline-block"
      >
        ← Guitar Tabs
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-warm-white text-[32px] font-medium">
            {currentGenre?.name ?? "Artists"}
          </h1>
          <p className="text-muted text-[14px] mt-1">
            {artists.length} artist{artists.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 flex items-center rounded-[8px] text-[13px] shrink-0 mt-1 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)", color: "#61c1d8" }}
        >
          + Add artist
        </button>
      </div>

      <p className="text-muted text-[11px] tracking-[1.1px] uppercase mt-8 mb-4">Artists</p>

      {loading ? (
        <p className="text-muted text-[13px]">Loading…</p>
      ) : artists.length === 0 ? (
        <p className="text-muted text-[13px]">No artists yet. Add one to get started.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onNavigate={() => router.push(`/admin/guitar-tabs/${genreId}/${artist.id}`)}
              onEdit={() => openEdit(artist)}
            />
          ))}
        </div>
      )}

      <ArtistPanel
        artist={editingArtist}
        genres={genres}
        currentGenreId={genreId}
        isOpen={panelOpen}
        onClose={closePanel}
        onSaved={refresh}
      />
    </div>
  );
}
