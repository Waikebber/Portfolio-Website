"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type SetupState = "none" | "email" | "mfa";

export function useSetupStatus(): SetupState {
  const [status, setStatus] = useState<SetupState>("none");
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStatus("none"); return; }

      if (!user.email_confirmed_at) { setStatus("email"); return; }

      const { data } = await supabase.auth.mfa.listFactors();
      const verified = data?.totp?.some((f) => f.status === "verified");
      setStatus(verified ? "none" : "mfa");
    }
    check();
  }, [pathname]);

  return status;
}
