"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tuning } from "@/types/guitar-tabs";

export function useTunings() {
  const [tunings, setTunings] = useState<Tuning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTunings(); }, []);

  async function fetchTunings() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("tunings").select("*").order("name");
    setTunings(data ?? []);
    setLoading(false);
  }

  return { tunings, loading, refresh: fetchTunings };
}
