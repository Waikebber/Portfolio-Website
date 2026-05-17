"use client";

import Image from "next/image";
import { getProjects } from "@/lib/data";
import Spinner from "@/components/Spinner";
import { useProjectImages } from "@/hooks/admin/useProjectImages";

const SLOT_LABELS: Record<"bento" | "display", string> = {
  bento: "Bento (tile)",
  display: "Display (expanded)",
};

const base = getProjects();

export default function AdminProjectsPage() {
  const {
    imageMap,
    uploading,
    savingOffset,
    loadedSet,
    fileInputRef,
    triggerUpload,
    handleFileChange,
    handleOffsetChange,
    markLoaded,
  } = useProjectImages();

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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                {/* Info */}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-teal text-[10px] tracking-[1.4px] mb-1">{project.tag}</p>
                  <p className="text-warm-white text-[15px] font-medium leading-snug">{project.title}</p>
                </div>

                {/* Image slots */}
                <div className="flex gap-4 shrink-0">
                  {(["bento", "display"] as const).map((type) => {
                    const url = imgs[type];
                    const loadKey = `${project.id}-${type}`;
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
                              {!loadedSet.has(loadKey) && <Spinner />}
                              <Image
                                src={url}
                                alt={`${project.title} ${type}`}
                                fill
                                sizes="120px"
                                className="object-cover transition-opacity duration-300"
                                style={{ opacity: loadedSet.has(loadKey) ? 1 : 0 }}
                                onLoad={() => markLoaded(loadKey)}
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
