import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

const STATIC_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kai-webber",
    icon: "/assets/icons/linkedin-icon.png",
  },
  {
    label: "GitHub",
    href: "https://github.com/Waikebber",
    icon: "/assets/icons/github-icon.png",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/k_webb_photos",
    icon: "/assets/icons/instagram-icon.png",
  },
];

async function getResumeUrl(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("resume")
      .select("storage_path")
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) return null;
    const { data: urlData } = supabase.storage.from("docs").getPublicUrl(data.storage_path);
    return urlData.publicUrl;
  } catch {
    return null;
  }
}

export default async function ContactSection() {
  const resumeUrl = await getResumeUrl();

  const links = [
    ...STATIC_LINKS,
    {
      label: "Resume",
      href: resumeUrl ?? "#",
      icon: "/assets/icons/doc-icon.png",
    },
  ];

  return (
    <div className="h-full flex flex-col max-md:min-h-screen max-md:h-auto">
      {/* Main contact content — vertically centered */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 xl:pl-[270px] xl:pr-[270px]">
        <p className="text-teal text-[11px] tracking-[2.2px] mb-3">CONTACT</p>
        <h2 className="text-warm-white text-[40px] font-medium mb-5">
          Let&apos;s talk
        </h2>
        <p className="text-muted text-[15px] leading-[26px] max-w-[520px] mb-8">
          Open to new opportunities, collabs, or a good conversation
          <br />
          about tech, cameras, or Mars rovers.
        </p>

        <div className="flex items-center gap-4">
          {links.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target={href !== "#" ? "_blank" : undefined}
              rel={href !== "#" ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="relative size-[28px] max-md:size-8 rounded-[2px] opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image src={icon} alt={label} fill className="object-contain invert" />
            </a>
          ))}
        </div>
      </div>

      {/* Footer bar — sits at the bottom of the Contact section */}
      <footer
        className="shrink-0 h-[72px] flex items-center px-6 md:px-16 xl:pl-[270px] xl:pr-[270px]"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-full flex items-center justify-between">
          <span className="text-muted text-[13px]">Kai Webber © 2026</span>
          <span className="text-muted text-[13px]">kaiwebber.com</span>
        </div>
      </footer>
    </div>
  );
}
