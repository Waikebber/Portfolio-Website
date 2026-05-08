"use client";

import { useResume } from "@/hooks/admin/useResume";
import CurrentResumeCard from "@/components/admin/resume/CurrentResumeCard";
import DropZone from "@/components/admin/resume/DropZone";
import SelectedFile from "@/components/admin/resume/SelectedFile";

export default function AdminResumePage() {
  const {
    current, selected, setSelected,
    dragging, setDragging,
    uploading, error, success,
    onDrop, upload, getPublicUrl,
  } = useResume();

  return (
    <div className="max-w-[860px]">
      <h1 className="text-warm-white text-[32px] font-medium mb-2">Resume</h1>
      <p className="text-muted text-[14px] mb-8">Upload a new resume PDF to replace the current one.</p>

      <CurrentResumeCard current={current} getPublicUrl={getPublicUrl} />

      {!selected && (
        <DropZone
          dragging={dragging}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onFileSelect={setSelected}
        />
      )}

      {selected && <SelectedFile file={selected} onRemove={() => setSelected(null)} />}

      {error && <p className="text-[12px] mb-3" style={{ color: "#e54d4d" }}>{error}</p>}
      {success && <p className="text-[12px] mb-3 text-teal">Resume updated successfully.</p>}

      {selected && (
        <button
          onClick={upload}
          disabled={uploading}
          className="w-full h-11 rounded-[8px] text-[14px] font-medium transition-opacity disabled:opacity-50 cursor-pointer"
          style={{ background: "#61c1d8", color: "#0d0d0f" }}
        >
          {uploading ? "Uploading…" : "Upload & replace current resume"}
        </button>
      )}
    </div>
  );
}
