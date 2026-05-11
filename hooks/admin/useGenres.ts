"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Genre } from "@/types/guitar-tabs";

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchGenres(); }, []);

  async function fetchGenres() {
    setLoading(true);
    const supabase = createClient();
    const [{ data: genresData }, { data: artistsData }] = await Promise.all([
      supabase.from("genres").select("*").order("name"),
      supabase.from("artists").select("genre_id"),
    ]);

    const countByGenre = (artistsData ?? []).reduce<Record<string, number>>((acc, a) => {
      if (a.genre_id) acc[a.genre_id] = (acc[a.genre_id] ?? 0) + 1;
      return acc;
    }, {});

    setGenres(
      (genresData ?? [])
        .map((g) => ({ ...g, artist_count: countByGenre[g.id] ?? 0 }))
        .sort((a, b) => b.artist_count - a.artist_count || a.name.localeCompare(b.name))
    );
    setLoading(false);
  }

  return { genres, loading, refresh: fetchGenres };
}
