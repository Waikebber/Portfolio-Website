"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ALL_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", roles: ["full-admin"] },
  { label: "Users", href: "/admin/users", roles: ["full-admin"] },
  { label: "Resume", href: "/admin/resume", roles: ["full-admin"] },
  { label: "Photos", href: "/admin/photos", roles: ["full-admin"] },
  { label: "Guitar Tabs", href: "/admin/guitar-tabs", roles: ["full-admin", "guest-admin"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string>("full-admin");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.role) setRole(data.role);
    });
  }, []);

  const navItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(role));

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-[220px] flex flex-col z-40"
      style={{
        background: "#141417",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-5">
        <p className="text-teal text-[14px] font-medium tracking-[1.12px]">KW</p>
        <p className="text-[11px] tracking-[1.1px] mt-1" style={{ color: "#444" }}>
          ADMIN
        </p>
      </div>

      <div className="h-px mx-4" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-3 pt-3 flex-1">
        {navItems.map(({ label, href }) => {
          const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <div key={href} className="relative flex items-center">
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-[2px]"
                  style={{ background: "#61c1d8" }}
                />
              )}
              <Link
                href={href}
                className={`block w-full pl-5 pr-3 py-2.5 rounded-[6px] text-[13px] transition-colors duration-150 ${
                  isActive
                    ? "text-teal"
                    : "text-muted hover:text-warm-white"
                }`}
              >
                {label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div>
        <div className="h-px mx-4 mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="px-6 pb-8 flex flex-col gap-3">
          <Link
            href="/"
            className="text-[12px] hover:text-warm-white transition-colors"
            style={{ color: "#444" }}
          >
            ← Back to site
          </Link>
          <button
            onClick={signOut}
            className="text-left text-[12px] cursor-pointer hover:brightness-125 transition-all"
            style={{ color: "#bf4d4d" }}
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
