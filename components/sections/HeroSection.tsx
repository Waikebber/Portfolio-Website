export default function HeroSection() {
  return (
    <div className="h-full flex flex-col justify-center px-6 md:px-16 xl:pl-[270px] xl:pr-[270px]">
      <p className="text-teal text-[12px] tracking-[1.8px] mb-8">
        Software Engineer &nbsp;—&nbsp; San Francisco / New York
      </p>

      <div className="mb-8">
        <h1 className="text-warm-white text-[64px] md:text-[80px] xl:text-[96px] font-medium leading-none">
          Kai
        </h1>
        <h1 className="text-teal text-[64px] md:text-[80px] xl:text-[96px] font-medium leading-none">
          Webber.
        </h1>
      </div>

      <p className="text-muted text-[16px] xl:text-[18px] leading-[30px] max-w-[615px] mb-10">
        Full-stack engineer building financial software at eMoney Advisor.
        <br />
        Computer Engineering &amp; CS, Northeastern University &apos;25.
      </p>

      <div className="flex items-center gap-4">
        <a
          href="#"
          className="inline-flex items-center justify-center h-[44px] px-8 bg-teal text-bg text-[13px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
        >
          View resume
        </a>
        <a
          href="#contact"
          className="inline-flex items-center justify-center h-[44px] px-8 text-muted text-[13px] rounded-[4px] border transition-colors duration-200 hover:text-warm-white"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          Get in touch
        </a>
      </div>

      <div className="flex items-center gap-3 mt-10">
        <div className="h-px w-10 bg-[#444]" />
        <span className="text-[#444] text-[11px] tracking-[1.1px]">scroll</span>
      </div>
    </div>
  );
}
