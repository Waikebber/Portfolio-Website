export default function Footer() {
  return (
    <footer
      className="snap-start h-[72px] flex items-center px-6 md:px-16 xl:px-[18.75%]"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="mx-auto max-w-[1440px] w-full flex items-center justify-between">
        <span className="text-muted text-[13px]">Kai Webber © 2026</span>
        <span className="text-muted text-[13px]">kaiwebber.com</span>
      </div>
    </footer>
  );
}
