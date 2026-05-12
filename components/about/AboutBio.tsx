import Link from "next/link";
import ResumeButton from "@/components/ResumeButton";
import type { AboutData } from "@/types";

interface Props {
  data: AboutData;
  resumeUrl: string | null;
}

export default function AboutBio({ data, resumeUrl }: Props) {
  return (
    <div className="w-[35rem] pt-[1.75rem]">
      <p className="text-teal text-[0.8125rem] tracking-[0.03em] mb-4">
        {data.subheading}
      </p>

      <div className="space-y-[1rem]">
        {data.bio.map((paragraph, i) => (
          <p key={i} className="text-[#bfbfbf] text-[1rem] leading-[1.75]">
            {paragraph}
          </p>
        ))}
      </div>

      <div
        className="h-px mt-[1.5rem] mb-[1rem]"
        style={{ background: "rgba(97,193,216,0.15)" }}
      />

      <div className="grid grid-cols-3 mb-[1.5rem]">
        {data.quickFacts.map(({ label, value }) => (
          <div key={label}>
            <p className="text-muted text-[0.625rem] font-medium tracking-[0.15em] mb-1">
              {label}
            </p>
            <p className="text-warm-white text-[0.875rem]">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <ResumeButton url={resumeUrl} variant="outline" />
        <Link
          href="/#contact"
          className="inline-flex items-center justify-center h-[2.75rem] px-8 bg-teal text-bg text-[0.8125rem] font-medium rounded-[0.25rem] hover:opacity-90 transition-opacity"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
