"use client";

import Link from "next/link";
import { usePhotos } from "@/hooks/admin/usePhotos";
import { useEditPhoto } from "@/hooks/admin/useEditPhoto";
import RegionFilter from "@/components/admin/photos/RegionFilter";
import PhotoGrid from "@/components/admin/photos/PhotoGrid";
import EditPanel from "@/components/admin/photos/EditPanel";

export default function AdminPhotosPage() {
  const { photos, allPhotos, region, setRegion, loading, refresh } = usePhotos();
  const edit = useEditPhoto(allPhotos, refresh);

  return (
    <div className="max-w-[860px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-warm-white text-[32px] font-medium">Photos</h1>
          <p className="text-muted text-[14px] mt-1">Click a photo to edit its metadata or delete it.</p>
        </div>
        <Link
          href="/admin/photos/upload"
          className="flex-none h-9 px-4 flex items-center rounded-[6px] text-[13px] font-medium mt-1"
          style={{
            border: "1px solid rgba(97,193,216,0.35)",
            color: "#61c1d8",
          }}
        >
          + Upload photo
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-5 mt-6">
        <RegionFilter value={region} onChange={setRegion} />
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-muted text-[13px]">Loading…</p>
      ) : (
        <PhotoGrid photos={photos} onSelect={edit.open} />
      )}

      {/* Edit panel */}
      <EditPanel {...edit} />
    </div>
  );
}
