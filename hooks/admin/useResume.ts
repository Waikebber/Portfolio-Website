"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ResumeRecord {
  id: string;
  filename: string;
  storage_path: string;
  uploaded_at: string;
}

export function useResume() {
  const [current, setCurrent] = useState<ResumeRecord | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchCurrent(); }, []);

  async function fetchCurrent() {
    const supabase = createClient();
    const { data } = await supabase
      .from("resume")
      .select("*")
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setCurrent(data ?? null);
  }

  function getPublicUrl(path: string) {
    const supabase = createClient();
    const { data } = supabase.storage.from("docs").getPublicUrl(path);
    return data.publicUrl;
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") setSelected(file);
  }, []);

  async function upload() {
    if (!selected) return;
    setUploading(true);
    setError(null);
    setSuccess(false);

    const body = new FormData();
    body.append("file", selected);
    if (current?.id) body.append("old_id", current.id);
    if (current?.storage_path) body.append("old_storage_path", current.storage_path);

    const res = await fetch("/api/resume", { method: "POST", body });
    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(`Upload failed: ${msg}`);
      setUploading(false);
      return;
    }

    setSelected(null);
    setSuccess(true);
    setUploading(false);
    fetchCurrent();
  }

  return {
    current, selected, setSelected,
    dragging, setDragging,
    uploading, error, success,
    onDrop, upload, getPublicUrl,
  };
}
