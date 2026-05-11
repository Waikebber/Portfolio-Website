"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tab } from "@/types/guitar-tabs";

export function useTabs(songId: string) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTabs(); }, [songId]);

  async function fetchTabs() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("tabs")
      .select("*, tunings(*)")
      .eq("song_id", songId)
      .order("created_at");

    setTabs(
      (data ?? []).map((t) => ({
        ...t,
        tuning: t.tunings ?? null,
      }))
    );
    setLoading(false);
  }

  return { tabs, loading, refresh: fetchTabs };
}
