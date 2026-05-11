"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getProjects } from "@/lib/data";
import Spinner from "@/components/Spinner";
import type { Project } from "@/types";

type ImageMap = Record<string, { bento: string | null; display: string | null; displayBottomOffset: number }>;

const SLOT_LABELS: Record<"bento" | "display", string> = {
  bento: "Bento (tile)",
  display: "Display (expanded)",
};

const base = getProjects();

export default function AdminProjectsPage() {
  const [imageMap, setImageMap] = useState<ImageMap>({});
  const [uploading, setUploading] = useState<{ projectId: string; type: "bento" | "display" } | null>(null);
  const [savingOffset, setSavingOffset] = useState<string | null>(null);
  const [loadedSet, setLoadedSet] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUpload = useRef<{ projectId: string; type: "bento" | "display" } | null>(null);
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const res = await fetch("/api/projects/images");
    if (res.ok) setImageMap(await res.json());
  }

  function triggerUpload(project: Project, type: "bento" | "display") {
    pendingUpload.current = { projectId: project.id, type };
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const meta = pendingUpload.current;
    if (!file || !meta) return;

    setUploading(meta);
    e.target.value = "";

    const fd = new FormData();
    fd.append("project_id", meta.projectId);
    fd.append("image_type", meta.type);
    fd.append("file", file);

    const res = await fetch("/api/projects/images", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      const key = `${meta.projectId}-${meta.type}`;
      setLoadedSet((prev) => { const next = new Set(prev); next.delete(key); return next; });
      setImageMap((prev) => ({
        ...prev,
        [meta.projectId]: {
          ...prev[meta.projectId],
          [meta.type]: url,
        },
      }));
    }

    setUploading(null);
    pendingUpload.current = null;
  }

  function handleOffsetChange(projectId: string, value: string) {
    const offset = Math.max(0, Math.min(50, Number(value) || 0));
    setImageMap((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], displayBottomOffset: offset },
    }));

    clearTimeout(debounceRef.current[projectId]);
    debounceRef.current[projectId] = setTimeout(async () => {
      setSavingOffset(projectId);
      await fetch("/api/projects/images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, display_bottom_offset: offset }),
      });
      setSavingOffset(null);
    }, 600);
  }

  return (
    <div className="max-w-[860px]">
      <input
        ref={fileInputRef}
        type="file"
        accept=".webp,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mb-8">
        <h1 className="text-warm-white text-[28px] font-medium">Projects</h1>
        <p className="text-muted text-[13px] mt-1">
          Upload bento tile and expanded display images for each project. Images are served from Supabase storage.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {base.map((project) => {
          const imgs = imageMap[project.id] ?? { bento: null, display: null, displayBottomOffset: 0 };
          return (
            <div
              key={project.id}
              className="rounded-[10px] px-5 py-4"
              style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-start gap-6">
                {/* Info */}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-teal text-[10px] tracking-[1.4px] mb-1">{project.tag}</p>
                  <p className="text-warm-white text-[15px] font-medium leading-snug">{project.title}</p>
                </div>

                {/* Image slots */}
                <div className="flex gap-4 shrink-0">
                  {(["bento", "display"] as const).map((type) => {
                    const url = imgs[type];
                    const isUploading = uploading?.projectId === project.id && uploading?.type === type;
                    return (
                      <div key={type} className="flex flex-col items-center gap-2">
                        <p className="text-muted text-[11px] tracking-[0.8px]">{SLOT_LABELS[type]}</p>
                        <div
                          className="relative rounded-[8px] overflow-hidden"
                          style={{
                            width: 120,
                            height: 80,
                            background: "#19191d",
                            border: url
                              ? "1px solid rgba(97,193,216,0.25)"
                              : "1px dashed rgba(255,255,255,0.12)",
                          }}
                        >
                          {url ? (
                            <>
                              {!loadedSet.has(`${project.id}-${type}`) && <Spinner />}
                              <Image
                                src={url}
                                alt={`${project.title} ${type}`}
                                fill
                                sizes="120px"
                                className="object-cover transition-opacity duration-300"
                                style={{ opacity: loadedSet.has(`${project.id}-${type}`) ? 1 : 0 }}
                                onLoad={() => setLoadedSet((prev) => new Set(prev).add(`${project.id}-${type}`))}
                              />
                            </>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <p className="text-[11px]" style={{ color: "#444" }}>No image</p>
                            </div>
                          )}
                          {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(13,13,15,0.75)" }}>
                              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#61c1d8", borderTopColor: "transparent" }} />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => triggerUpload(project, type)}
                          disabled={isUploading}
                          className="h-7 px-3 rounded-[6px] text-[11px] cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40"
                          style={{
                            background: "#19191d",
                            border: "1px solid rgba(255,255,255,0.10)",
                            color: "#61c1d8",
                          }}
                        >
                          {url ? "Replace" : "Upload"}
                        </button>

                        {/* Bottom offset input — display slot only */}
                        {type === "display" && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <label className="text-[10px]" style={{ color: "#555" }}>
                              Bottom %
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={50}
                              value={imgs.displayBottomOffset}
                              onChange={(e) => handleOffsetChange(project.id, e.target.value)}
                              className="w-12 h-6 rounded-[4px] text-center text-[11px] outline-none"
                              style={{
                                background: "#19191d",
                                border: "1px solid rgba(255,255,255,0.10)",
                                color: savingOffset === project.id ? "#61c1d8" : "#ccc",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
