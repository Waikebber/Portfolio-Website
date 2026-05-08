const REGIONS = ["Japan", "Italy", "California"];

const inputStyle = { background: "#19191d", border: "1px solid rgba(255,255,255,0.08)" };

interface Props {
  filename: string;
  setFilename: (v: string) => void;
  region: string;
  setRegion: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  locationsForRegion: string[];
  newLocation: string;
  setNewLocation: (v: string) => void;
  showNewLocation: boolean;
  setShowNewLocation: (v: boolean) => void;
  displayOrder: number;
  setDisplayOrder: (v: number) => void;
  uploading: boolean;
  error: string | null;
  onSubmit: () => void;
  disabled: boolean;
}

export default function UploadForm({
  filename, setFilename,
  region, setRegion,
  location, setLocation,
  locationsForRegion,
  newLocation, setNewLocation,
  showNewLocation, setShowNewLocation,
  displayOrder, setDisplayOrder,
  uploading, error, onSubmit, disabled,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Filename */}
      <div>
        <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1.5">Filename</p>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[13px] outline-none font-mono"
          style={inputStyle}
        />
      </div>

      {/* Region */}
      <div>
        <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1.5">Region</p>
        <select
          value={region}
          onChange={(e) => { setRegion(e.target.value); setLocation(""); setShowNewLocation(false); }}
          className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[13px] outline-none cursor-pointer"
          style={inputStyle}
        >
          {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Location */}
      <div>
        <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1.5">Location</p>
        {!showNewLocation ? (
          <>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[13px] outline-none cursor-pointer"
              style={inputStyle}
            >
              {locationsForRegion.map((l) => <option key={l} value={l}>{l}</option>)}
              {locationsForRegion.length === 0 && <option value="">No existing locations</option>}
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
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[13px] outline-none"
              style={inputStyle}
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

      {/* Display order */}
      <div>
        <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1.5">Display order</p>
        <input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
          className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[13px] outline-none"
          style={inputStyle}
        />
      </div>

      {error && <p className="text-[12px]" style={{ color: "#e64d4d" }}>{error}</p>}

      <button
        onClick={onSubmit}
        disabled={disabled || uploading}
        className="w-full h-11 rounded-[8px] text-[14px] font-medium transition-opacity disabled:opacity-50 cursor-pointer mt-auto"
        style={{ background: "#61c1d8", color: "#0d0d0f" }}
      >
        {uploading ? "Uploading…" : "Upload photo"}
      </button>
    </div>
  );
}
