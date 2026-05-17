import { getPhotoUrl } from "@/lib/storage";
import type { AdminPhoto } from "@/hooks/admin/usePhotos";
import PhotoTile from "./PhotoTile";

interface Props {
  photos: AdminPhoto[];
  onSelect: (photo: AdminPhoto) => void;
}

export default function PhotoGrid({ photos, onSelect }: Props) {
  if (photos.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-[200px] rounded-[10px]"
        style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-muted text-[13px]">No photos uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map((photo, i) => (
        <PhotoTile
          key={photo.id}
          photo={photo}
          photoUrl={getPhotoUrl(photo.filename)}
          onClick={() => onSelect(photo)}
          priority={i === 0}
        />
      ))}
    </div>
  );
}
