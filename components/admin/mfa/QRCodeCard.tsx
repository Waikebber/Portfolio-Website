interface Props {
  qrCode: string;
  secret: string;
}

export default function QRCodeCard({ qrCode, secret }: Props) {
  return (
    <>
      <div
        className="w-[180px] h-[180px] rounded-[10px] mb-6 overflow-hidden p-3"
        style={{ background: "#fff" }}
      >
        <img src={qrCode} alt="TOTP QR code" className="w-full h-full" />
      </div>

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
