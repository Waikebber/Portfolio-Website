"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getPhotoUrl } from "@/lib/storage";
import Spinner from "@/components/Spinner";
import type { useEditPhoto } from "@/hooks/admin/useEditPhoto";

const REGIONS = ["Japan", "Italy", "California"];

const selectStyle = {
  background: "#19191d",
  border: "1px solid rgba(255,255,255,0.08)",
};

type EditState = ReturnType<typeof useEditPhoto>;

interface Props extends EditState {}

export default function EditPanel({
  photo, editRegion, setEditRegion,
  editLocation, setEditLocation,
  newLocation, setNewLocation,
  showNewLocation, setShowNewLocation,
  isHero, setIsHero,
  editOrder, setEditOrder, totalPhotos,
  locationsForRegion,
  saving, deleting, error,
  close, save, deletePhoto,
}: Props) {
  const isOpen = !!photo;
  const [thumbLoaded, setThumbLoaded] = useState(false);
  useEffect(() => { setThumbLoaded(false); }, [photo?.id]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={close}
        />
      )}

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-screen w-[300px] z-40 flex flex-col transition-transform duration-300"
        style={{
          background: "#141417",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[64px] shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-warm-white text-[15px] font-medium">Edit Photo</p>
          <button onClick={close} className="text-muted hover:text-warm-white transition-colors text-[16px] cursor-pointer">✕</button>
        </div>

        {photo && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
            {/* Thumbnail */}
            <div className="relative w-full h-[160px] rounded-[8px] overflow-hidden" style={{ background: "#19191d" }}>
              {!thumbLoaded && <Spinner />}
              <Image
                src={getPhotoUrl(photo.filename)}
                alt={photo.location}
                fill
                unoptimized
                className="object-cover transition-opacity duration-300"
                style={{ opacity: thumbLoaded ? 1 : 0 }}
                onLoad={() => setThumbLoaded(true)}
              />
            </div>

            {/* Filename (read-only) */}
            <div>
              <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Filename</p>
              <p
                className="text-warm-white text-[12px] px-3 py-2 rounded-[6px] font-mono truncate"
                style={{ background: "#19191d", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {photo.filename}
              </p>
            </div>

            {/* Display order */}
            <div>
              <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">
                Order <span className="normal-case tracking-normal">1–{totalPhotos}</span>
              </p>
              <input
                type="number"
                min={1}
                max={totalPhotos}
                value={editOrder}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v)) setEditOrder(Math.max(1, Math.min(v, totalPhotos)));
                }}
                className="w-full h-9 px-3 rounded-[6px] text-warm-white text-[13px] outline-none"
                style={selectStyle}
              />
            </div>

            {/* Region */}
            <div>
              <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Region</p>
              <select
                value={editRegion}
                onChange={(e) => { setEditRegion(e.target.value); setEditLocation(""); setShowNewLocation(false); }}
                className="w-full h-9 px-3 rounded-[6px] text-warm-white text-[13px] outline-none cursor-pointer"
                style={selectStyle}
              >
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Location */}
            <div>
              <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Location</p>
              {!showNewLocation ? (
                <>
                  <select
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full h-9 px-3 rounded-[6px] text-warm-white text-[13px] outline-none cursor-pointer"
                    style={selectStyle}
                  >
                    {locationsForRegion.map((l) => <option key={l} value={l}>{l}</option>)}
                    {locationsForRegion.length === 0 && <option value="">No locations yet</option>}
                  </select>
                  <button
                    onClick={() => setShowNewLocation(true)}
                    className="mt-1.5 text-teal text-[11px] hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    + Add new location
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Shinjuku, Tokyo"
                    className="w-full h-9 px-3 rounded-[6px] text-warm-white text-[13px] outline-none"
                    style={selectStyle}
                  />
                  <button
                    onClick={() => setShowNewLocation(false)}
                    className="mt-1.5 text-muted text-[11px] hover:text-warm-white transition-colors cursor-pointer"
                  >
                    ← Use existing
                  </button>
                </>
              )}
            </div>

            {/* Region display photo */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isHero}
                  onChange={(e) => setIsHero(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-4 h-4 rounded-[3px] flex items-center justify-center transition-colors"
                  style={{
                    background: isHero ? "#61c1d8" : "transparent",
                    border: isHero ? "1px solid #61c1d8" : "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {isHero && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#0d0d0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-warm-white text-[13px]">Region display photo</p>
                <p className="text-muted text-[11px]">Shown on the region overview card</p>
              </div>
            </label>

            {error && <p className="text-[11px]" style={{ color: "#e64d4d" }}>{error}</p>}

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto">
              <button
                onClick={save}
                disabled={saving}
                className="w-full h-10 rounded-[6px] text-[13px] font-medium transition-opacity disabled:opacity-50 cursor-pointer"
                style={{ background: "#61c1d8", color: "#0d0d0f" }}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                onClick={deletePhoto}
                disabled={deleting}
                className="w-full h-10 rounded-[6px] text-[13px] font-medium transition-opacity disabled:opacity-50 cursor-pointer"
                style={{ border: "1px solid rgba(230,77,77,0.4)", color: "#e64d4d" }}
              >
                {deleting ? "Deleting…" : "Delete photo"}
              </button>
              <p className="text-center text-[10px]" style={{ color: "#444" }}>
                This action cannot be undone.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
