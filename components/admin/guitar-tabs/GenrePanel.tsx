"use client";

import { useEffect, useState } from "react";
import type { Genre } from "@/types/guitar-tabs";

const inputStyle = {
  background: "#19191d",
  border: "1px solid rgba(255,255,255,0.08)",
};

interface Props {
  genre: Genre | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function GenrePanel({ genre, isOpen, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (genre) {
      setName(genre.name);
      setDescription(genre.description ?? "");
    } else {
      setName("");
      setDescription("");
    }
    setError(null);
  }, [genre, isOpen]);

  async function save() {
    setSaving(true);
    setError(null);
    const method = genre ? "PATCH" : "POST";
    const url = genre ? `/api/guitar-tabs/genres/${genre.id}` : "/api/guitar-tabs/genres";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
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

  async function deleteGenre() {
    if (!genre) return;
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/guitar-tabs/genres/${genre.id}`, { method: "DELETE" });
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
            {genre ? "Edit Genre" : "Add Genre"}
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
              placeholder="e.g. Rock"
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Subgenres</p>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Classic Rock · Indie · Alt"
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
              style={inputStyle}
            />
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
            {genre && (
              <>
                <button
                  onClick={deleteGenre}
                  disabled={deleting}
                  className="w-full h-10 rounded-[6px] text-[13px] transition-opacity disabled:opacity-50 cursor-pointer"
                  style={{ border: "1px solid rgba(191,77,77,0.4)", color: "#e64d4d" }}
                >
                  {deleting ? "Deleting…" : "Delete genre"}
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
