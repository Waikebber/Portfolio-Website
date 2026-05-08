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
    <div className="flex items-center justify-between h-[80px] px-5 rounded-[10px] mb-6" style={cardStyle}>
      <div>
        <p className="text-muted text-[10px] tracking-[1.2px] uppercase mb-1">Current Resume</p>
        <p className="text-warm-white text-[14px] font-medium">{current.filename}</p>
        <p className="text-muted text-[11px] mt-0.5">
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
        className="h-7 px-3 flex items-center rounded-[4px] text-teal text-[11px] hover:bg-teal/10 transition-colors"
        style={{ border: "1px solid rgba(97,193,216,0.3)" }}
      >
        View PDF
      </a>
    </div>
  );
}
