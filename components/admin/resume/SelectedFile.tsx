function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  file: File;
  onRemove: () => void;
}

export default function SelectedFile({ file, onRemove }: Props) {
  return (
    <div
      className="flex items-center justify-between h-[64px] px-5 rounded-[10px] mb-4"
      style={{ background: "#19191d", border: "1px solid rgba(97,193,216,0.3)" }}
    >
      <div>
        <p className="text-warm-white text-[14px] font-medium">{file.name}</p>
        <p className="text-muted text-[12px] mt-0.5">{formatSize(file.size)} · Ready to upload</p>
      </div>
      <button
        onClick={onRemove}
        className="text-[16px] hover:text-warm-white transition-colors cursor-pointer"
        style={{ color: "#444" }}
      >
        ✕
      </button>
    </div>
  );
}
