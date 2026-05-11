"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RecentTab } from "@/types/guitar-tabs";

export function useRecents() {
  const [recents, setRecents] = useState<RecentTab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRecents(); }, []);

  async function fetchRecents() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("tab_recents")
      .select(`
        accessed_at,
        tabs (
          id, description, source_type, source_value,
          tunings ( name ),
          songs (
            id, title, title_translated,
            artists (
              id, name, name_translated,
              genres ( id )
            )
          )
        )
      `)
      .eq("user_id", user.id)
      .order("accessed_at", { ascending: false })
      .limit(6);

    setRecents(
      (data ?? []).map((r) => {
        const tab = Array.isArray(r.tabs) ? r.tabs[0] : r.tabs;
        const tuning = tab && (Array.isArray(tab.tunings) ? tab.tunings[0] : tab.tunings);
        const song = tab && (Array.isArray(tab.songs) ? tab.songs[0] : tab.songs);
        const artist = song && (Array.isArray(song.artists) ? song.artists[0] : song.artists);
        const genre = artist && (Array.isArray(artist.genres) ? artist.genres[0] : artist.genres);
        return {
          accessed_at: r.accessed_at,
          tab_id: tab?.id ?? "",
          tab_description: tab?.description ?? null,
          source_type: (tab?.source_type ?? "link") as "file" | "link",
          source_value: tab?.source_value ?? "",
          tuning_name: tuning?.name ?? null,
          song_id: song?.id ?? "",
          song_title: song?.title ?? "",
          song_title_translated: song?.title_translated ?? null,
          artist_id: artist?.id ?? "",
          artist_name: artist?.name ?? "",
          artist_name_translated: artist?.name_translated ?? null,
          genre_id: genre?.id ?? "",
        };
      })
    );
    setLoading(false);
  }

  return { recents, loading, refresh: fetchRecents };
}
