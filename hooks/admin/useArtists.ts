"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Artist } from "@/types/guitar-tabs";

export function useArtists(genreId: string) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchArtists(); }, [genreId]);

  async function fetchArtists() {
    setLoading(true);
    const supabase = createClient();
    const [{ data: artistsData }, { data: genresData }, { data: songsData }] = await Promise.all([
      supabase.from("artists").select("*").eq("genre_id", genreId).order("name"),
      supabase.from("genres").select("id, name"),
      supabase.from("songs").select("artist_id"),
    ]);

    const genreMap = (genresData ?? []).reduce<Record<string, string>>((acc, g) => {
      acc[g.id] = g.name;
      return acc;
    }, {});

    const countByArtist = (songsData ?? []).reduce<Record<string, number>>((acc, s) => {
      if (s.artist_id) acc[s.artist_id] = (acc[s.artist_id] ?? 0) + 1;
      return acc;
    }, {});

    setArtists(
      (artistsData ?? [])
        .map((a) => ({
          ...a,
          genre_name: genreMap[a.genre_id] ?? "",
          song_count: countByArtist[a.id] ?? 0,
        }))
        .sort((a, b) => b.song_count - a.song_count || a.name.localeCompare(b.name))
    );
    setLoading(false);
  }

  return { artists, loading, refresh: fetchArtists };
}
