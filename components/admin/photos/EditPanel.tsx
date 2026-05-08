import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
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
  locationsForRegion,
  saving, deleting, error,
  close, save, deletePhoto,
}: Props) {
  const isOpen = !!photo;

  function getPhotoUrl(filename: string) {
    const supabase = createClient();
    return supabase.storage.from("photos").getPublicUrl(filename).data.publicUrl;
  }

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
            <div className="relative w-full h-[160px] rounded-[8px] overflow-hidden">
              <Image
                src={getPhotoUrl(photo.filename)}
                alt={photo.location}
                fill
                className="object-cover"
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
