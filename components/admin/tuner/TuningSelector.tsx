"use client";

import { useEffect, useRef, useState } from "react";
import type { Tuning } from "@/types/guitar-tabs";

interface Props {
  tunings: Tuning[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function TuningSelector({ tunings, selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = tunings.find((t) => t.id === selectedId) ?? null;

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <div ref={ref} className="relative" style={{ width: "14rem" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left cursor-pointer flex items-center justify-between gap-2"
        style={{
          background: "#141417",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "0.5rem",
          padding: "0.5rem 0.75rem",
        }}
      >
        <div className="min-w-0">
          <p className="text-warm-white truncate" style={{ fontSize: "0.8125rem", lineHeight: 1.2 }}>
            {selected ? (selected.name ?? selected.strings) : "Select tuning"}
          </p>
          {selected && selected.name && (
            <p className="truncate" style={{ fontSize: "0.625rem", color: "#555", marginTop: "0.15rem", lineHeight: 1 }}>
              {selected.strings}
            </p>
          )}
        </div>
        <span style={{ fontSize: "0.625rem", color: "#555", flexShrink: 0 }}>{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 overflow-y-auto"
          style={{
            top: "calc(100% + 4px)",
            width: "100%",
            background: "#141417",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.5rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            maxHeight: "18rem",
          }}
        >
          {tunings.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { onSelect(t.id); setOpen(false); }}
              className="w-full text-left cursor-pointer hover:bg-white/[0.04] transition-colors"
              style={{
                padding: "0.5rem 0.75rem",
                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                background: t.id === selectedId ? "rgba(97,193,216,0.08)" : undefined,
              }}
            >
              <p style={{ fontSize: "0.8125rem", color: t.id === selectedId ? "#61c1d8" : "#ccc", lineHeight: 1.2 }}>
                {t.name ?? t.strings}
              </p>
              {t.name && (
                <p style={{ fontSize: "0.625rem", color: "#555", marginTop: "0.15rem", lineHeight: 1 }}>
                  {t.strings}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
