import Nav from "@/components/Nav";
import AboutLeft from "@/components/about/AboutLeft";
import AboutBio from "@/components/about/AboutBio";
import { createClient } from "@/lib/supabase/server";
import { getAbout } from "@/lib/data";
import { getPortraitUrl } from "@/lib/storage";

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

export default async function AboutPage() {
  const [about, resumeUrl] = await Promise.all([
    Promise.resolve(getAbout()),
    getResumeUrl(),
  ]);
  const portraitUrl = getPortraitUrl();

  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <div className="pt-[4.5rem]">
        <div className="mx-auto max-w-[90rem] xl:pl-[16.875rem] px-10 pt-[3rem] pb-[1.5rem]">
          <div className="flex gap-[3rem] items-start">
            <AboutLeft portraitUrl={portraitUrl} />
            <AboutBio data={about} resumeUrl={resumeUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
