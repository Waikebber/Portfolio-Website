import { useEffect, useRef, useState } from "react";
import type { Project } from "@/types";

export type ImageEntry = { bento: string | null; display: string | null; displayBottomOffset: number };
export type ImageMap = Record<string, ImageEntry>;

export function useProjectImages() {
  const [imageMap, setImageMap] = useState<ImageMap>({});
  const [uploading, setUploading] = useState<{ projectId: string; type: "bento" | "display" } | null>(null);
  const [savingOffset, setSavingOffset] = useState<string | null>(null);
  const [loadedSet, setLoadedSet] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUpload = useRef<{ projectId: string; type: "bento" | "display" } | null>(null);
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    fetch("/api/projects/images")
      .then((r) => r.ok ? r.json() : {})
      .then(setImageMap)
      .catch(() => {});
  }, []);

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
        [meta.projectId]: { ...prev[meta.projectId], [meta.type]: url },
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

  function markLoaded(key: string) {
    setLoadedSet((prev) => new Set(prev).add(key));
  }

  return {
    imageMap,
    uploading,
    savingOffset,
    loadedSet,
    fileInputRef,
    triggerUpload,
    handleFileChange,
    handleOffsetChange,
    markLoaded,
  };
}
