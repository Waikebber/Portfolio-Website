"use client";

import { useEffect, useRef, useState } from "react";
import type { Tuning } from "@/types/guitar-tabs";

interface Props {
  tunings: Tuning[];
  value: string;
  onChange: (id: string) => void;
}

export default function TuningSelect({ tunings, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = tunings.find((t) => t.id === value) ?? null;

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2.5 rounded-[6px] text-left cursor-pointer relative"
        style={{ background: "#19191d", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {selected && (
          <>
            <p className="text-warm-white text-[14px] leading-none pr-5">{selected.strings}</p>
            {selected.name && (
              <p className="mt-1 text-[11px] leading-none" style={{ color: "#888" }}>{selected.name}</p>
            )}
          </>
        )}
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px]"
          style={{ color: "#888" }}
        >
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-[6px] overflow-hidden z-50"
          style={{
            background: "#19191d",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {tunings.map((t, i) => (
            <div key={t.id}>
              <button
                type="button"
                onClick={() => { onChange(t.id); setOpen(false); }}
                className="w-full px-3 py-2.5 text-left cursor-pointer transition-colors hover:bg-white/[0.04]"
                style={value === t.id ? { background: "rgba(97,193,216,0.08)" } : {}}
              >
                <p className="text-warm-white text-[13px] leading-none">{t.strings}</p>
                {t.name && (
                  <p className="mt-1 text-[11px] leading-none" style={{ color: "#888" }}>{t.name}</p>
                )}
              </button>
              {i < tunings.length - 1 && (
                <div style={{ height: "1px", background: "rgba(255,255,255,0.04)" }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
