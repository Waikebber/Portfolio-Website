import { useMemo } from "react";

interface Props {
  qrCode: string;
  secret: string;
}
export default function QRCodeCard({ qrCode, secret }: Props) {
  const rawSvg = qrCode.replace(/^data:image\/svg\+xml[^,]*,/, "");

  const svgWithViewBox = useMemo(() => {
    if (/viewBox=/i.test(rawSvg)) return rawSvg;

    const widthMatch = rawSvg.match(/width="(\d+(\.\d+)?)"/);
    const heightMatch = rawSvg.match(/height="(\d+(\.\d+)?)"/);
    const w = widthMatch?.[1] ?? "100";
    const h = heightMatch?.[1] ?? "100";

    return rawSvg.replace("<svg", `<svg viewBox="0 0 ${w} ${h}"`);
  }, [rawSvg]);

  return (
    <>
      <div
        className="w-[180px] h-[180px] rounded-[10px] mb-6 overflow-hidden p-3 [&_svg]:w-full [&_svg]:h-full"
        style={{ background: "#fff" }}
        dangerouslySetInnerHTML={{ __html: svgWithViewBox }}
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
