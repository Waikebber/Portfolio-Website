"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export function usePhotoUpload(locationsForRegion: string[]) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [filename, setFilename] = useState("");
  const [region, setRegion] = useState("Japan");
  const [location, setLocation] = useState(locationsForRegion[0] ?? "");
  const [newLocation, setNewLocation] = useState("");
  const [showNewLocation, setShowNewLocation] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) selectFile(f);
  }, []);

  function selectFile(f: File) {
    setFile(f);
    setFilename(f.name);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  }

  async function upload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    const loc = showNewLocation && newLocation ? newLocation : location;
    const body = new FormData();
    body.append("file", file);
    body.append("filename", filename);
    body.append("region", region);
    body.append("location", loc);
    body.append("display_order", String(displayOrder));
    const res = await fetch("/api/photos", { method: "POST", body });
    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg);
      setUploading(false);
      return;
    }
    router.push("/admin/photos");
  }

  return {
    file, preview, dragging, setDragging,
    filename, setFilename,
    region, setRegion,
    location, setLocation,
    newLocation, setNewLocation,
    showNewLocation, setShowNewLocation,
    displayOrder, setDisplayOrder,
    uploading, error,
    onDrop, selectFile, upload,
  };
}
