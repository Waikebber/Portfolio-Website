"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTabs } from "@/hooks/admin/useTabs";
import { useTunings } from "@/hooks/admin/useTunings";
import TabCard from "@/components/admin/guitar-tabs/TabCard";
import TabPanel from "@/components/admin/guitar-tabs/TabPanel";
import type { Tab } from "@/types/guitar-tabs";

interface SongInfo {
  title: string;
  title_translated: string | null;
  artist_name: string;
  artist_name_translated: string | null;
  genre_name: string;
}

export default function TabOptionsPage({
  params,
}: {
  params: Promise<{ genreId: string; artistId: string; songId: string }>;
}) {
  const { genreId, artistId, songId } = use(params);
  const searchParams = useSearchParams();
  const { tabs, loading, refresh } = useTabs(songId);
  const { tunings } = useTunings();
  const [panelOpen, setPanelOpen] = useState(searchParams.get("add") === "1");
  const [editingTab, setEditingTab] = useState<Tab | null>(null);
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const autoEditDone = useRef(false);

  useEffect(() => {
    async function fetchSong() {
      const supabase = createClient();
      const { data } = await supabase
        .from("songs")
        .select("title, title_translated, artists(name, name_translated, genres(name))")
        .eq("id", songId)
        .single();
      if (data) {
        const artist = Array.isArray(data.artists) ? data.artists[0] : data.artists;
        const genre = artist && (Array.isArray(artist.genres) ? artist.genres[0] : artist.genres);
        setSongInfo({
          title: data.title,
          title_translated: (data as { title_translated?: string | null }).title_translated ?? null,
          artist_name: artist?.name ?? "",
          artist_name_translated: artist?.name_translated ?? null,
          genre_name: genre?.name ?? "",
        });
      }
    }
    fetchSong();
  }, [songId]);

  useEffect(() => {
    if (!loading && tabs.length > 0 && searchParams.get("editFirst") === "1" && !autoEditDone.current) {
      autoEditDone.current = true;
      openEdit(tabs[0]);
    }
  }, [loading, tabs]);

  function openAdd() {
    setEditingTab(null);
    setPanelOpen(true);
  }

  function openEdit(tab: Tab) {
    setEditingTab(tab);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingTab(null);
  }

  async function deleteTab(tab: Tab) {
    const res = await fetch(`/api/guitar-tabs/tabs/${tab.id}`, { method: "DELETE" });
    if (res.ok) refresh();
  }

  const subtitle = [songInfo?.artist_name, songInfo?.genre_name, `${tabs.length} tab${tabs.length !== 1 ? "s" : ""} available`]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div className="max-w-[1180px]">
      {/* Breadcrumb */}
      <Link
        href={`/admin/guitar-tabs/${genreId}/${artistId}`}
        className="text-muted text-[13px] hover:text-warm-white transition-colors mb-6 inline-block"
      >
        ← {songInfo
          ? songInfo.artist_name_translated
            ? `${songInfo.artist_name} (${songInfo.artist_name_translated})`
            : songInfo.artist_name
          : "Songs"}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-warm-white text-[32px] font-medium flex items-baseline gap-3 flex-wrap">
            {songInfo?.title ?? "…"}
            {songInfo?.title_translated && (
              <span style={{ color: "#888", fontSize: "20px", fontWeight: 400 }}>
                {songInfo.title_translated}
              </span>
            )}
          </h1>
          <p className="text-muted text-[14px] mt-1">{subtitle}</p>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 flex items-center rounded-[8px] text-[13px] shrink-0 mt-1 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)", color: "#61c1d8" }}
        >
          + Add tab
        </button>
      </div>

      <p className="text-muted text-[11px] tracking-[1.1px] uppercase mt-8 mb-4">Available Tabs</p>

      {loading ? (
        <p className="text-muted text-[13px]">Loading…</p>
      ) : tabs.length === 0 ? (
        <p className="text-muted text-[13px]">No tabs yet. Add one to get started.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {[...tabs]
            .sort((a, b) => {
              if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
              return (a.description ?? "").localeCompare(b.description ?? "");
            })
            .map((tab) => (
              <TabCard
                key={tab.id}
                tab={tab}
                onEdit={() => openEdit(tab)}
                onDelete={() => deleteTab(tab)}
                onPinToggle={refresh}
              />
            ))}
        </div>
      )}

      <TabPanel
        tab={editingTab}
        tunings={tunings}
        songId={songId}
        isOpen={panelOpen}
        onClose={closePanel}
        onSaved={refresh}
      />
    </div>
  );
}
