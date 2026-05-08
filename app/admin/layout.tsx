"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import SetupBanner from "@/components/admin/SetupBanner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <main className="ml-[220px] min-h-screen p-12">
        <SetupBanner />
        {children}
      </main>
    </div>
  );
}
