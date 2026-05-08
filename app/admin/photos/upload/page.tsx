"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { usePhotoUpload } from "@/hooks/admin/usePhotoUpload";
import PhotoDropZone from "@/components/admin/photos/upload/PhotoDropZone";
import UploadForm from "@/components/admin/photos/upload/UploadForm";

function useLocationsForRegion(region: string) {
  const [locations, setLocations] = useState<string[]>([]);
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("photos")
      .select("location")
      .eq("region", region)
      .then(({ data }) => {
        setLocations([...new Set((data ?? []).map((p: { location: string }) => p.location))]);
      });
  }, [region]);
  return locations;
}

export default function AdminPhotosUploadPage() {
  const upload = usePhotoUpload([]);
  const locationsForRegion = useLocationsForRegion(upload.region);

  return (
    <div className="max-w-[860px]">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/photos" className="text-muted text-[12px] hover:text-warm-white transition-colors">
          ← Photos
        </Link>
      </div>
      <h1 className="text-warm-white text-[32px] font-medium mb-2">Upload Photo</h1>
      <p className="text-muted text-[14px] mb-8">Add a new photo to the photography page.</p>

      <div className="grid grid-cols-2 gap-8 items-start">
        <PhotoDropZone
          preview={upload.preview}
          fileSize={upload.file?.size ?? null}
          dragging={upload.dragging}
          onDragOver={(e) => { e.preventDefault(); upload.setDragging(true); }}
          onDragLeave={() => upload.setDragging(false)}
          onDrop={upload.onDrop}
          onFileSelect={upload.selectFile}
        />

        <UploadForm
          filename={upload.filename}
          setFilename={upload.setFilename}
          region={upload.region}
          setRegion={upload.setRegion}
          location={upload.location}
          setLocation={upload.setLocation}
          locationsForRegion={locationsForRegion}
          newLocation={upload.newLocation}
          setNewLocation={upload.setNewLocation}
          showNewLocation={upload.showNewLocation}
          setShowNewLocation={upload.setShowNewLocation}
          uploading={upload.uploading}
          error={upload.error}
          onSubmit={upload.upload}
          disabled={!upload.file}
        />
      </div>
    </div>
  );
}
