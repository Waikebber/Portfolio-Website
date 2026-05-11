"use client";

import { useEffect, useState } from "react";
import type { Artist, Genre } from "@/types/guitar-tabs";

const inputStyle = {
  background: "#19191d",
  border: "1px solid rgba(255,255,255,0.08)",
};

interface Props {
  artist: Artist | null;
  genres: Genre[];
  currentGenreId: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ArtistPanel({ artist, genres, currentGenreId, isOpen, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [nameTranslated, setNameTranslated] = useState("");
  const [genreId, setGenreId] = useState(currentGenreId);
  const [showNewGenre, setShowNewGenre] = useState(false);
  const [newGenreName, setNewGenreName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (artist) {
      setName(artist.name);
      setNameTranslated(artist.name_translated ?? "");
      setGenreId(artist.genre_id);
    } else {
      setName("");
      setNameTranslated("");
      setGenreId(currentGenreId);
    }
    setShowNewGenre(false);
    setNewGenreName("");
    setError(null);
  }, [artist, isOpen]);

  async function save() {
    setSaving(true);
    setError(null);

    let resolvedGenreId = genreId;
    if (showNewGenre && newGenreName.trim()) {
      const res = await fetch("/api/guitar-tabs/genres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGenreName.trim() }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg);
        setSaving(false);
        return;
      }
      const data = await res.json();
      resolvedGenreId = data.id;
    }

    const method = artist ? "PATCH" : "POST";
    const url = artist ? `/api/guitar-tabs/artists/${artist.id}` : "/api/guitar-tabs/artists";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, name_translated: nameTranslated.trim() || null, genre_id: resolvedGenreId }),
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

  async function deleteArtist() {
    if (!artist) return;
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/guitar-tabs/artists/${artist.id}`, { method: "DELETE" });
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
            {artist ? "Edit Artist" : "Add Artist"}
          </p>
          <button onClick={onClose} className="text-muted hover:text-warm-white transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jimi Hendrix"
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-muted text-[10px] tracking-[1.1px] uppercase">Translated Name</p>
              <p className="text-[10px]" style={{ color: "#444" }}>optional</p>
            </div>
            <input
              type="text"
              value={nameTranslated}
              onChange={(e) => setNameTranslated(e.target.value)}
              placeholder="e.g. Kenshi Yonezu"
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Genre</p>
            {!showNewGenre ? (
              <>
                <select
                  value={genreId}
                  onChange={(e) => setGenreId(e.target.value)}
                  className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none cursor-pointer"
                  style={inputStyle}
                >
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewGenre(true)}
                  className="mt-2 text-teal text-[12px] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  + Add new genre
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={newGenreName}
                  onChange={(e) => setNewGenreName(e.target.value)}
                  placeholder="e.g. Blues"
                  className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
                  style={inputStyle}
                />
                <button
                  onClick={() => { setShowNewGenre(false); setNewGenreName(""); }}
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
              disabled={saving || !name.trim()}
              className="w-full h-10 rounded-[6px] text-[13px] font-medium transition-opacity disabled:opacity-50 cursor-pointer"
              style={{ background: "#61c1d8", color: "#0d0d0f" }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            {artist && (
              <>
                <button
                  onClick={deleteArtist}
                  disabled={deleting}
                  className="w-full h-10 rounded-[6px] text-[13px] transition-opacity disabled:opacity-50 cursor-pointer"
                  style={{ border: "1px solid rgba(191,77,77,0.4)", color: "#e64d4d" }}
                >
                  {deleting ? "Deleting…" : "Delete artist"}
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
