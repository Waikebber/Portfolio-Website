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
      className="flex flex-col justify-between"
      style={{
        borderRadius: "0.75rem",
        padding: "1.25rem",
        minHeight: "6.875rem",
        background: "#141417",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p className="font-semibold leading-none" style={{ fontSize: "2.25rem", color: "#61c1d8" }}>
        {count}
      </p>
      <div>
        <p className="text-warm-white" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{label}</p>
        <p className="text-muted" style={{ fontSize: "0.625rem", marginTop: "0.125rem" }}>{sub}</p>
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
      className="flex items-center justify-between w-full hover:bg-white/[0.02] transition-colors group"
      style={{
        background: "#141417",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.625rem",
        padding: "0.875rem 1.25rem",
      }}
    >
      <div>
        <p className="text-warm-white font-medium" style={{ fontSize: "0.8125rem" }}>{title}</p>
        <p className="text-muted" style={{ fontSize: "0.6875rem", marginTop: "0.25rem" }}>{subtitle}</p>
      </div>
      <span className="text-teal group-hover:translate-x-0.5 transition-transform" style={{ fontSize: "1rem" }}>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 mb-10" style={{ gap: "0.75rem" }}>
        <StatTile count={photoCount} label="Photos" sub="across 3 regions" />
        <StatTile count={resume ? "✓" : "—"} label="Resume" sub={resumeSub} />
        <StatTile count={tabCount} label="Guitar Tabs" sub={tabCount === 0 ? "none uploaded yet" : `${tabCount} tab${tabCount === 1 ? "" : "s"}`} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-col" style={{ gap: "0.5rem", maxWidth: "53.75rem" }}>
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
