import { useRef } from "react";
import Image from "next/image";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  preview: string | null;
  fileSize: number | null;
  dragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (file: File) => void;
}

export default function PhotoDropZone({ preview, fileSize, dragging, onDragOver, onDragLeave, onDrop, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !preview && inputRef.current?.click()}
      className="relative h-full min-h-[360px] rounded-[12px] overflow-hidden cursor-pointer"
      style={{
        background: "#141417",
        border: `1px dashed ${dragging ? "#61c1d8" : "rgba(97,193,216,0.3)"}`,
      }}
    >
      {preview ? (
        <>
          <Image src={preview} alt="Preview" fill className="object-contain" />
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-3 z-10">
            {fileSize && (
              <span
                className="text-[11px] px-2 py-1 rounded-[4px]"
                style={{ background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.7)" }}
              >
                {formatSize(fileSize)}
              </span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="h-8 px-3 rounded-[6px] text-[12px] font-medium cursor-pointer ml-auto"
              style={{ background: "rgba(0,0,0,0.7)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              Change
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2 p-6">
          <span className="text-teal text-[32px] leading-none">↑</span>
          <p className="text-warm-white text-[15px] font-medium mt-1">Drop photo here</p>
          <p className="text-muted text-[13px]">or click to browse</p>
          <p className="text-[11px] mt-1" style={{ color: "#444" }}>.webp · .jpg · .png · Max 20MB</p>
          <button
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            className="mt-3 h-9 px-5 rounded-[6px] text-[13px] font-medium cursor-pointer"
            style={{ background: "#61c1d8", color: "#0d0d0f" }}
          >
            Browse files
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".webp,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelect(f);
        }}
      />
    </div>
  );
}
