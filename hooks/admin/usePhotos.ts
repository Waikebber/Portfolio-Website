"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AdminPhoto {
  id: string;
  filename: string;
  location: string;
  region: string;
  country: string;
  display_order: number;
  is_hero: boolean;
}

export function usePhotos() {
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [region, setRegion] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPhotos(); }, []);

  async function fetchPhotos() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("display_order", { ascending: true });
    setPhotos(data ?? []);
    setLoading(false);
  }

  const filtered = region === "All" ? photos : photos.filter((p) => p.region === region);

  return { photos: filtered, allPhotos: photos, region, setRegion, loading, refresh: fetchPhotos };
}
