"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSongs } from "@/hooks/admin/useSongs";
import { useArtists } from "@/hooks/admin/useArtists";
import { useGenres } from "@/hooks/admin/useGenres";
import { useTunings } from "@/hooks/admin/useTunings";
import SongRow from "@/components/admin/guitar-tabs/SongRow";
import SongPanel from "@/components/admin/guitar-tabs/SongPanel";
import type { Song } from "@/types/guitar-tabs";

export default function SongsPage({
  params,
}: {
  params: Promise<{ genreId: string; artistId: string }>;
}) {
  const { genreId, artistId } = use(params);
  const router = useRouter();
  const { songs, loading, refresh } = useSongs(artistId);
  const { artists } = useArtists(genreId);
  const { genres } = useGenres();
  const { tunings } = useTunings();
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const currentArtist = artists.find((a) => a.id === artistId);

  function openAdd() {
    setEditingSong(null);
    setPanelOpen(true);
  }

  function openEdit(song: Song) {
    setEditingSong(song);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingSong(null);
  }

  async function handleNavigate(song: Song) {
    if (song.tab_count === 1 && song.first_tab_source_value) {
      let url = song.first_tab_source_value;
      if (song.first_tab_source_type === "file") {
        const res = await fetch(`/api/guitar-tabs/signed-url?path=${encodeURIComponent(url)}`);
        if (!res.ok) { router.push(`/admin/guitar-tabs/${genreId}/${artistId}/${song.id}`); return; }
        url = (await res.json()).url;
      }
      window.open(url, "_blank", "noopener noreferrer");
      if (song.first_tab_id) {
        fetch("/api/guitar-tabs/recents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tab_id: song.first_tab_id }),
        });
      }
    } else {
      router.push(`/admin/guitar-tabs/${genreId}/${artistId}/${song.id}`);
    }
  }

  return (
    <div className="max-w-[1180px]">
      {/* Breadcrumb */}
      <Link
        href={`/admin/guitar-tabs/${genreId}`}
        className="text-muted text-[13px] hover:text-warm-white transition-colors mb-6 inline-block"
      >
        ← {currentArtist?.genre_name ?? "Genre"}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-warm-white text-[32px] font-medium">
            {currentArtist?.name ?? "Songs"}
          </h1>
          {currentArtist?.name_translated && (
            <p className="text-muted text-[13px] mt-0.5">{currentArtist.name_translated}</p>
          )}
          <p className="text-muted text-[14px] mt-1">
            {currentArtist?.genre_name && `${currentArtist.genre_name}  ·  `}
            {songs.length} song{songs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 flex items-center rounded-[8px] text-[13px] shrink-0 mt-1 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)", color: "#61c1d8" }}
        >
          + Add song
        </button>
      </div>

      <p className="text-muted text-[11px] tracking-[1.1px] uppercase mt-8 mb-4">Songs</p>

      {loading ? (
        <p className="text-muted text-[13px]">Loading…</p>
      ) : songs.length === 0 ? (
        <p className="text-muted text-[13px]">No songs yet. Add one to get started.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {songs.map((song) => (
            <SongRow
              key={song.id}
              song={song}
              onEdit={() => openEdit(song)}
              onNavigate={() => handleNavigate(song)}
              onAddTab={() => router.push(`/admin/guitar-tabs/${genreId}/${artistId}/${song.id}?add=1`)}
              onEditTab={() => router.push(`/admin/guitar-tabs/${genreId}/${artistId}/${song.id}?editFirst=1`)}
            />
          ))}
        </div>
      )}

      <SongPanel
        song={editingSong}
        artists={artists}
        genres={genres}
        tunings={tunings}
        currentArtistId={artistId}
        currentGenreId={genreId}
        isOpen={panelOpen}
        onClose={closePanel}
        onSaved={refresh}
      />
    </div>
  );
}
