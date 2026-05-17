import { useRef } from "react";

interface Props {
  dragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (file: File) => void;
}

export default function DropZone({ dragging, onDragOver, onDragLeave, onDrop, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className="h-[180px] sm:h-[260px] rounded-[12px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors mb-4"
      style={{
        background: "#141417",
        border: `1px dashed ${dragging ? "#61c1d8" : "rgba(97,193,216,0.3)"}`,
      }}
    >
      <span className="text-teal text-[32px] leading-none">↑</span>
      <p className="text-warm-white text-[16px] font-medium mt-1">Drop your PDF here</p>
      <p className="text-muted text-[13px]">or click to browse files</p>
      <p className="text-[11px] mt-1" style={{ color: "#444" }}>PDF files only · Max 10MB</p>

      <button
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        className="mt-3 h-9 px-5 rounded-[6px] text-[13px] font-medium cursor-pointer"
        style={{ background: "#61c1d8", color: "#0d0d0f" }}
      >
        Browse files
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </div>
  );
}
