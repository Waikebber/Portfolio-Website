"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import SetupBanner from "@/components/admin/SetupBanner";

const ALL_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", roles: ["full-admin"] },
  { label: "Users", href: "/admin/users", roles: ["full-admin"] },
  { label: "Resume", href: "/admin/resume", roles: ["full-admin"] },
  { label: "Projects", href: "/admin/projects", roles: ["full-admin"] },
  { label: "Photos", href: "/admin/photos", roles: ["full-admin"] },
  { label: "Guitar Tabs", href: "/admin/guitar-tabs", roles: ["full-admin", "guest-admin"] },
  { label: "Markets", href: "/admin/markets", roles: ["full-admin", "guest-admin"] },
];

function getPageName(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/users") return "Users";
  if (pathname === "/admin/resume") return "Resume";
  if (pathname === "/admin/projects") return "Projects";
  if (pathname === "/admin/photos") return "Photos";
  if (pathname === "/admin/photos/upload") return "Upload Photo";
  if (pathname.startsWith("/admin/guitar-tabs")) return "Guitar Tabs";
  if (pathname.startsWith("/admin/markets/universe")) return "Markets — Universe";
  if (pathname.startsWith("/admin/markets")) return "Markets";
  return "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
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
  }, [isLogin]);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drawerOpen]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (isLogin) return <>{children}</>;

  const navItems = role ? ALL_NAV_ITEMS.filter((item) => item.roles.includes(role)) : [];
  const pageName = getPageName(pathname);

  return (
    <div className="min-h-screen bg-bg">
      {/* Topbar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4"
        style={{
          height: "3.5rem",
          background: "#141417",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center" style={{ gap: "0.625rem" }}>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="flex flex-col items-center justify-center cursor-pointer"
            style={{
              padding: "0.375rem",
              borderRadius: "0.375rem",
              gap: "0.3rem",
              minWidth: "2.75rem",
              minHeight: "2.75rem",
            }}
          >
            <span className="block" style={{ width: "1.25rem", height: "0.1rem", background: "#888" }} />
            <span className="block" style={{ width: "1.25rem", height: "0.1rem", background: "#888" }} />
            <span className="block" style={{ width: "1.25rem", height: "0.1rem", background: "#888" }} />
          </button>
          <Link
            href="/admin"
            className="text-teal font-medium"
            style={{ fontSize: "0.875rem", letterSpacing: "0.07em" }}
          >
            KW
          </Link>
        </div>
        <p style={{ fontSize: "0.75rem", color: "#888" }}>{pageName}</p>
      </header>

      {/* Drawer + Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.55)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 h-screen z-50 flex flex-col"
              style={{
                width: "15rem",
                background: "#141417",
                borderRight: "1px solid rgba(255,255,255,0.06)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Header */}
              <div style={{ padding: "2rem 1.5rem 1.25rem" }}>
                <p className="text-teal font-medium" style={{ fontSize: "0.875rem", letterSpacing: "0.07em" }}>KW</p>
                <p style={{ fontSize: "0.625rem", letterSpacing: "0.1em", marginTop: "0.25rem", color: "#444" }}>ADMIN</p>
              </div>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 1rem 0.75rem" }} />

              {/* Nav */}
              <nav className="flex-1 flex flex-col" style={{ padding: "0 0.75rem" }}>
                {navItems.map(({ label, href }) => {
                  const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);
                  return (
                    <div key={href} className="relative flex items-center">
                      {isActive && (
                        <div
                          className="absolute left-0"
                          style={{
                            width: "0.1875rem",
                            height: "1.25rem",
                            background: "#61c1d8",
                            borderRadius: "0.125rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        />
                      )}
                      <Link
                        href={href}
                        onClick={() => setDrawerOpen(false)}
                        style={{
                          display: "block",
                          width: "100%",
                          paddingLeft: "1.5rem",
                          paddingRight: "0.75rem",
                          paddingTop: "0.625rem",
                          paddingBottom: "0.625rem",
                          fontSize: "0.8125rem",
                          color: isActive ? "#61c1d8" : "#888",
                          borderRadius: "0.375rem",
                          transition: "color 0.15s",
                        }}
                      >
                        {label}
                      </Link>
                    </div>
                  );
                })}
              </nav>

              {/* Footer */}
              <div>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 1rem 1rem" }} />
                <div style={{ padding: "0 1.5rem 2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <Link
                    href="/"
                    onClick={() => setDrawerOpen(false)}
                    style={{ fontSize: "0.75rem", color: "#444" }}
                  >
                    ← Back to site
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-left cursor-pointer"
                    style={{ fontSize: "0.75rem", color: "#bf4d4d" }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main style={{ maxWidth: "75rem", margin: "0 auto", padding: "1.5rem" }}>
        <SetupBanner />
        {children}
      </main>
    </div>
  );
}
