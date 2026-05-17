import type { ResumeRecord } from "@/hooks/admin/useResume";

interface Props {
  current: ResumeRecord | null;
  getPublicUrl: (path: string) => string;
}

export default function CurrentResumeCard({ current, getPublicUrl }: Props) {
  const cardStyle = { background: "#141417", border: "1px solid rgba(255,255,255,0.08)" };

  if (!current) {
    return (
      <div className="flex items-center h-[80px] px-5 rounded-[10px] mb-6" style={cardStyle}>
        <p className="text-muted text-[13px]">No resume uploaded yet.</p>
      </div>
    );
  }

  return (
    <div
      className="flex items-start justify-between gap-4 px-5 py-4 rounded-[10px] mb-6 sm:items-center"
      style={cardStyle}
    >
      <div className="min-w-0">
        <p className="text-muted text-[10px] tracking-[1.2px] uppercase mb-1">Current Resume</p>
        <p className="text-warm-white font-medium truncate" style={{ fontSize: "0.875rem" }}>{current.filename}</p>
        <p className="text-muted" style={{ fontSize: "0.6875rem", marginTop: "0.125rem" }}>
          Uploaded{" "}
          {new Date(current.uploaded_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </p>
      </div>
      <a
        href={getPublicUrl(current.storage_path)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-none flex items-center text-teal hover:bg-teal/10 transition-colors"
        style={{
          height: "1.75rem",
          padding: "0 0.75rem",
          borderRadius: "0.25rem",
          fontSize: "0.6875rem",
          border: "1px solid rgba(97,193,216,0.3)",
        }}
      >
        View PDF
      </a>
    </div>
  );
}
