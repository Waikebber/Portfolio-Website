"use client";

import { useEffect, useState } from "react";
import type { Artist, Genre, Song, Tuning } from "@/types/guitar-tabs";

const inputStyle = {
  background: "#19191d",
  border: "1px solid rgba(255,255,255,0.08)",
};

interface Props {
  song: Song | null;
  artists: Artist[];
  genres: Genre[];
  tunings: Tuning[];
  currentArtistId: string;
  currentGenreId: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function SongPanel({ song, artists, genres, tunings, currentArtistId, currentGenreId, isOpen, onClose, onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [titleTranslated, setTitleTranslated] = useState("");
  const [artistId, setArtistId] = useState(currentArtistId);
  const [showNewArtist, setShowNewArtist] = useState(false);
  const [newArtistName, setNewArtistName] = useState("");
  const [newArtistTranslated, setNewArtistTranslated] = useState("");
  const [newArtistGenreId, setNewArtistGenreId] = useState(currentGenreId);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setTitleTranslated(song.title_translated ?? "");
      setArtistId(song.artist_id);
    } else {
      setTitle("");
      setTitleTranslated("");
      setArtistId(currentArtistId);
    }
    setShowNewArtist(false);
    setNewArtistName("");
    setNewArtistTranslated("");
    setNewArtistGenreId(currentGenreId);
    setError(null);
  }, [song, isOpen]);

  async function save() {
    setSaving(true);
    setError(null);

    let resolvedArtistId = artistId;
    if (showNewArtist && newArtistName.trim()) {
      const res = await fetch("/api/guitar-tabs/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newArtistName.trim(),
          name_translated: newArtistTranslated.trim() || null,
          genre_id: newArtistGenreId,
        }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg);
        setSaving(false);
        return;
      }
      const data = await res.json();
      resolvedArtistId = data.id;
    }

    const method = song ? "PATCH" : "POST";
    const url = song ? `/api/guitar-tabs/songs/${song.id}` : "/api/guitar-tabs/songs";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, title_translated: titleTranslated.trim() || null, artist_id: resolvedArtistId }),
    });
    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg);
    } else {
      onClose();
      onSaved();
    }
    setSaving(false);
  }

  async function deleteSong() {
    if (!song) return;
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/guitar-tabs/songs/${song.id}`, { method: "DELETE" });
    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg);
    } else {
      onClose();
      onSaved();
    }
    setDeleting(false);
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose} />
      )}
      <div
        className="fixed top-0 right-0 h-screen w-[300px] z-40 flex flex-col transition-transform duration-300"
        style={{
          background: "#141417",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 h-16 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-warm-white text-[15px] font-medium">
            {song ? "Edit Song" : "Add Song"}
          </p>
          <button onClick={onClose} className="text-muted hover:text-warm-white transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Title</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Purple Haze"
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-muted text-[10px] tracking-[1.1px] uppercase">Translated Title</p>
              <p className="text-[10px]" style={{ color: "#444" }}>optional</p>
            </div>
            <input
              type="text"
              value={titleTranslated}
              onChange={(e) => setTitleTranslated(e.target.value)}
              placeholder="e.g. Lemon"
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Artist</p>
            {!showNewArtist ? (
              <>
                <select
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                  className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none cursor-pointer"
                  style={inputStyle}
                >
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewArtist(true)}
                  className="mt-2 text-teal text-[12px] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  + Add new artist
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={newArtistName}
                  onChange={(e) => setNewArtistName(e.target.value)}
                  placeholder="e.g. Jimi Hendrix"
                  className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
                  style={inputStyle}
                />
                <div className="flex items-baseline gap-2 mt-3 mb-1">
                  <p className="text-muted text-[10px] tracking-[1.1px] uppercase">Translated Name</p>
                  <p className="text-[10px]" style={{ color: "#444" }}>optional</p>
                </div>
                <input
                  type="text"
                  value={newArtistTranslated}
                  onChange={(e) => setNewArtistTranslated(e.target.value)}
                  placeholder="e.g. 米津玄師"
                  className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
                  style={inputStyle}
                />
                <p className="text-muted text-[10px] tracking-[1.1px] uppercase mt-3 mb-1">Genre</p>
                <select
                  value={newArtistGenreId}
                  onChange={(e) => setNewArtistGenreId(e.target.value)}
                  className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none cursor-pointer"
                  style={inputStyle}
                >
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => { setShowNewArtist(false); setNewArtistName(""); setNewArtistTranslated(""); }}
                  className="mt-2 text-muted text-[12px] hover:text-warm-white transition-colors cursor-pointer"
                >
                  ← Use existing
                </button>
              </>
            )}
          </div>

          {error && <p className="text-[11px]" style={{ color: "#e64d4d" }}>{error}</p>}

          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={save}
              disabled={saving || !title.trim()}
              className="w-full h-10 rounded-[6px] text-[13px] font-medium transition-opacity disabled:opacity-50 cursor-pointer"
              style={{ background: "#61c1d8", color: "#0d0d0f" }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            {song && (
              <>
                <button
                  onClick={deleteSong}
                  disabled={deleting}
                  className="w-full h-10 rounded-[6px] text-[13px] transition-opacity disabled:opacity-50 cursor-pointer"
                  style={{ border: "1px solid rgba(191,77,77,0.4)", color: "#e64d4d" }}
                >
                  {deleting ? "Deleting…" : "Delete song"}
                </button>
                <p className="text-center text-[10px]" style={{ color: "#444" }}>
                  This action cannot be undone.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
