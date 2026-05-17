"use client";

import { useEffect, useState } from "react";
import type { Tab, Tuning } from "@/types/guitar-tabs";
import TuningSelect from "./TuningSelect";

const inputStyle = {
  background: "#19191d",
  border: "1px solid rgba(255,255,255,0.08)",
};

interface Props {
  tab: Tab | null;
  tunings: Tuning[];
  songId: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  onTuningsRefresh?: () => void;
}

export default function TabPanel({ tab, tunings, songId, isOpen, onClose, onSaved, onTuningsRefresh }: Props) {
  const [localTunings, setLocalTunings] = useState<Tuning[]>(tunings);
  const [description, setDescription] = useState("");
  const [tuningId, setTuningId] = useState("");
  const [capo, setCapo] = useState<string>("");
  const [showNewTuning, setShowNewTuning] = useState(false);
  const [newTuningName, setNewTuningName] = useState("");
  const [newTuningStrings, setNewTuningStrings] = useState("");
  const [sourceType, setSourceType] = useState<"link" | "file">("link");
  const [sourceValue, setSourceValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setLocalTunings(tunings); }, [tunings]);

  useEffect(() => {
    if (tab) {
      setDescription(tab.description ?? "");
      setTuningId(tab.tuning_id ?? "");
      setCapo(tab.capo != null ? String(tab.capo) : "");
      setSourceType(tab.source_type);
      setSourceValue(tab.source_value);
    } else {
      setDescription("");
      const standard = tunings.find((t) => t.name === "Standard");
      setTuningId(standard?.id ?? tunings[0]?.id ?? "");
      setCapo("");
      setSourceType("link");
      setSourceValue("");
    }
    setSelectedFile(null);
    setShowNewTuning(false);
    setNewTuningName("");
    setNewTuningStrings("");
    setError(null);
  }, [tab, isOpen, tunings]);

  async function save() {
    setSaving(true);
    setError(null);

    let resolvedTuningId: string | null = tuningId || null;
    if (showNewTuning && newTuningStrings.trim()) {
      const res = await fetch("/api/guitar-tabs/tunings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTuningName.trim() || null, strings: newTuningStrings.trim() }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg);
        setSaving(false);
        return;
      }
      const data = await res.json();
      resolvedTuningId = data.id;
      const created: Tuning = { id: data.id, name: newTuningName.trim() || null, strings: newTuningStrings.trim() };
      setLocalTunings((prev) => [...prev, created]);
      onTuningsRefresh?.();
    }

    let resolvedSourceValue = sourceValue;
    if (sourceType === "file" && selectedFile) {
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("song_id", songId);
      const uploadRes = await fetch("/api/guitar-tabs/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) {
        const { error: msg } = await uploadRes.json();
        setError(msg);
        setSaving(false);
        return;
      }
      const { path } = await uploadRes.json();
      resolvedSourceValue = path;
    }

    const resolvedCapo = capo.trim() !== "" ? parseInt(capo, 10) : null;

    const method = tab ? "PATCH" : "POST";
    const url = tab ? `/api/guitar-tabs/tabs/${tab.id}` : "/api/guitar-tabs/tabs";
    const body = tab
      ? { description: description.trim() || null, tuning_id: resolvedTuningId, capo: resolvedCapo, source_type: sourceType, source_value: resolvedSourceValue }
      : { description: description.trim() || null, song_id: songId, tuning_id: resolvedTuningId, capo: resolvedCapo, source_type: sourceType, source_value: resolvedSourceValue };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg);
    } else {
      onClose();
      onSaved();
    }
    setSaving(false);
  }

  const canSave = sourceType === "link"
    ? !!sourceValue.trim()
    : !!selectedFile || !!sourceValue;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose} />
      )}
      <div
        className="fixed top-0 right-0 h-screen w-[300px] z-40 flex flex-col transition-transform duration-300"
        style={{
          background: "#141417",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 h-16 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-warm-white text-[15px] font-medium">
            {tab ? "Edit Tab" : "Add Tab"}
          </p>
          <button onClick={onClose} className="text-muted hover:text-warm-white transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-muted text-[10px] tracking-[1.1px] uppercase">Description</p>
              <p className="text-[10px]" style={{ color: "#444" }}>optional</p>
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Fingerstyle arrangement"
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Tuning</p>
            {!showNewTuning ? (
              <>
                <TuningSelect
                  tunings={localTunings}
                  value={tuningId}
                  onChange={setTuningId}
                />
                <button
                  onClick={() => setShowNewTuning(true)}
                  className="mt-2 text-teal text-[12px] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  + Add new tuning
                </button>
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-muted text-[10px] tracking-[1.1px] uppercase">Name</p>
                  <p className="text-[10px]" style={{ color: "#444" }}>optional</p>
                </div>
                <input
                  type="text"
                  value={newTuningName}
                  onChange={(e) => setNewTuningName(e.target.value)}
                  placeholder="e.g. Open E"
                  className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none mb-3"
                  style={inputStyle}
                />
                <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Strings</p>
                <input
                  type="text"
                  value={newTuningStrings}
                  onChange={(e) => setNewTuningStrings(e.target.value)}
                  placeholder="e.g. E B E G# B E"
                  className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
                  style={inputStyle}
                />
                <button
                  onClick={() => { setShowNewTuning(false); setNewTuningName(""); setNewTuningStrings(""); }}
                  className="mt-2 text-muted text-[12px] hover:text-warm-white transition-colors cursor-pointer"
                >
                  ← Use existing
                </button>
              </>
            )}
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-muted text-[10px] tracking-[1.1px] uppercase">Capo</p>
              <p className="text-[10px]" style={{ color: "#444" }}>optional</p>
            </div>
            <input
              type="number"
              min={1}
              max={12}
              value={capo}
              onChange={(e) => setCapo(e.target.value)}
              placeholder="e.g. 2"
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">Source Type</p>
            <select
              value={sourceType}
              onChange={(e) => {
                setSourceType(e.target.value as "link" | "file");
                setSourceValue("");
                setSelectedFile(null);
              }}
              className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none cursor-pointer"
              style={inputStyle}
            >
              <option value="link">Link</option>
              <option value="file">File</option>
            </select>
          </div>

          <div>
            <p className="text-muted text-[10px] tracking-[1.1px] uppercase mb-1">
              {sourceType === "link" ? "URL" : "PDF File"}
            </p>
            {sourceType === "file" ? (
              <>
                {sourceValue && !selectedFile && (
                  <p className="text-[11px] mb-2 truncate" style={{ color: "#888" }}>
                    Current: {sourceValue.split("/").pop()}
                  </p>
                )}
                {selectedFile ? (
                  <div className="flex items-center gap-2 h-10 px-3 rounded-[6px]" style={inputStyle}>
                    <p className="text-warm-white text-[13px] flex-1 truncate">{selectedFile.name}</p>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-muted hover:text-warm-white text-[12px] shrink-0 cursor-pointer transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label
                    className="flex items-center justify-center h-10 rounded-[6px] text-teal text-[13px] cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ border: "1px dashed rgba(97,193,216,0.4)", background: "rgba(97,193,216,0.04)" }}
                  >
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    />
                    Choose PDF
                  </label>
                )}
              </>
            ) : (
              <input
                type="text"
                value={sourceValue}
                onChange={(e) => setSourceValue(e.target.value)}
                placeholder="https://ultimate-guitar.com/..."
                className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
                style={inputStyle}
              />
            )}
          </div>

          {error && <p className="text-[11px]" style={{ color: "#e64d4d" }}>{error}</p>}

          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={save}
              disabled={saving || !canSave}
              className="w-full h-10 rounded-[6px] text-[13px] font-medium transition-opacity disabled:opacity-50 cursor-pointer"
              style={{ background: "#61c1d8", color: "#0d0d0f" }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
