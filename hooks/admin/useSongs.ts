"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Song } from "@/types/guitar-tabs";

export function useSongs(artistId: string) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSongs(); }, [artistId]);

  async function fetchSongs() {
    setLoading(true);
    const supabase = createClient();
    const [{ data: songsData }, { data: tabsData }] = await Promise.all([
      supabase.from("songs").select("*").eq("artist_id", artistId).order("title"),
      supabase.from("tabs").select("*, tunings(name, strings)").order("created_at"),
    ]);

    const tabsBySong = (tabsData ?? []).reduce<Record<string, typeof tabsData>>((acc, t) => {
      if (!acc[t.song_id]) acc[t.song_id] = [];
      acc[t.song_id]!.push(t);
      return acc;
    }, {});

    setSongs(
      (songsData ?? [])
        .map((s) => {
          const songTabs = tabsBySong[s.id] ?? [];
          const first = songTabs.find((t) => t.is_pinned) ?? songTabs[0];
          return {
            ...s,
            tab_count: songTabs.length,
            first_tab_id: first?.id ?? null,
            first_tab_source_type: first?.source_type ?? null,
            first_tab_source_value: first?.source_value ?? null,
            tuning_name: first?.tunings?.name ?? null,
            tuning_strings: first?.tunings?.strings ?? null,
            first_tab_capo: first?.capo ?? null,
          };
        })
        .sort((a, b) => b.tab_count - a.tab_count || a.title.localeCompare(b.title))
    );
    setLoading(false);
  }

  return { songs, loading, refresh: fetchSongs };
}
