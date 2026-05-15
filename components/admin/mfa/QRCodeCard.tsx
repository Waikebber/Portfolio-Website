interface Props {
  qrCode: string;
  secret: string;
}

export default function QRCodeCard({ qrCode, secret }: Props) {
  // The SDK wraps the SVG as data:image/svg+xml;utf-8,<svg ...fill="#000"...>
  // Using that string in <img src> truncates at '#' (treated as URL fragment).
  // Render the raw SVG via innerHTML instead — safe since it's from our own
  // Supabase instance.
  const rawSvg = qrCode.replace(/^data:image\/svg\+xml[^,]*,/, "");

  return (
    <>
      <div
        className="w-[180px] h-[180px] rounded-[10px] mb-6 overflow-hidden p-3 [&_svg]:w-full [&_svg]:h-full"
        style={{ background: "#fff" }}
        dangerouslySetInnerHTML={{ __html: rawSvg }}
      />

      <div className="mb-6">
        <p className="text-muted text-[11px] tracking-[1.1px] uppercase mb-1">Manual entry key</p>
        <p
          className="text-warm-white text-[13px] font-mono px-3 py-2 rounded-[6px] tracking-widest"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {secret}
        </p>
      </div>
    </>
  );
}
