import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getStats() {
  try {
    const supabase = await createClient();
    const [photosRes, resumeRes, tabsRes] = await Promise.all([
      supabase.from("photos").select("*", { count: "exact", head: true }),
      supabase.from("resume").select("*").order("uploaded_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("tabs").select("*", { count: "exact", head: true }),
    ]);
    return {
      photoCount: photosRes.count ?? 0,
      resume: resumeRes.data ?? null,
      tabCount: tabsRes.count ?? 0,
    };
  } catch {
    return { photoCount: 0, resume: null, tabCount: 0 };
  }
}

function StatTile({
  count,
  label,
  sub,
}: {
  count: number | string;
  label: string;
  sub: string;
}) {
  return (
    <div
      className="w-[240px] h-[110px] rounded-[12px] p-5 flex flex-col justify-between"
      style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="text-[40px] font-semibold leading-none" style={{ color: "#61c1d8" }}>
        {count}
      </p>
      <div>
        <p className="text-warm-white text-[14px]">{label}</p>
        <p className="text-muted text-[11px] mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between w-full h-16 px-5 rounded-[10px] hover:bg-white/[0.02] transition-colors group"
      style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div>
        <p className="text-warm-white text-[14px] font-medium">{title}</p>
        <p className="text-muted text-[12px] mt-0.5">{subtitle}</p>
      </div>
      <span className="text-teal text-[16px] group-hover:translate-x-0.5 transition-transform">
        →
      </span>
    </Link>
  );
}

export default async function AdminDashboard() {
  const { photoCount, resume, tabCount } = await getStats();

  const resumeSub = resume
    ? `uploaded ${new Date(resume.uploaded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "not uploaded yet";

  return (
    <div>
      <h1 className="text-warm-white text-[32px] font-medium mb-2">Dashboard</h1>
      <p className="text-muted text-[14px] mb-10">Welcome back, Kai.</p>

      {/* Stats */}
      <div className="flex gap-4 mb-10">
        <StatTile count={photoCount} label="Photos" sub="across 3 regions" />
        <StatTile count={resume ? "✓" : "—"} label="Resume" sub={resumeSub} />
        <StatTile count={tabCount} label="Guitar Tabs" sub={tabCount === 0 ? "none uploaded yet" : `${tabCount} tab${tabCount === 1 ? "" : "s"}`} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-3 max-w-[860px]">
        <QuickAction
          title="Upload new resume"
          subtitle="Replace the current PDF"
          href="/admin/resume"
        />
        <QuickAction
          title="Upload new photo"
          subtitle="Add to the photography page"
          href="/admin/photos/upload"
        />
        <QuickAction
          title="Browse & edit photos"
          subtitle="Modify locations or delete"
          href="/admin/photos"
        />
        <QuickAction
          title="Invite user"
          subtitle="Grant someone access to the admin"
          href="/admin/users"
        />
        <QuickAction
          title="Browse & add guitar tabs"
          subtitle="Manage genres, artists, songs, and tabs"
          href="/admin/guitar-tabs"
        />
      </div>
    </div>
  );
}
