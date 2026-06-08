"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useTunings } from "@/hooks/admin/useTunings";
import { usePitchDetector } from "@/hooks/admin/usePitchDetector";
import { parseStrings, findClosestString, getCents, frequencyToNote } from "@/lib/tunerUtils";
import Headstock from "./Headstock";
import CentsMeter from "./CentsMeter";
import NoteReadout from "./NoteReadout";
import MicButton from "./MicButton";
import TuningSelector from "./TuningSelector";
import type { PitchResult } from "@/lib/autoCorrelate";

const MIN_CLARITY        = 0.5;
const STREAK_NEEDED      = 2;    // consecutive consistent readings before display updates
const STREAK_CENTS       = 100;  // max deviation within a streak (~1 semitone)
const HOLD_MS            = 1200; // ms to keep last reading after signal goes quiet
const SWITCH_FRAMES      = 5;    // consecutive frames detecting a new string before auto-switching
const SWITCH_COOLDOWN_MS = 1000; // min ms between auto-switches (prevents ping-pong)

export default function TunerClient() {
  const { tunings, loading } = useTunings();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pinnedString, setPinnedString] = useState<number>(0); // default: string 6

  const [detectedNote, setDetectedNote] = useState<string | null>(null);
  const [detectedHz, setDetectedHz]     = useState<number | null>(null);
  const [activeIndex, setActiveIndex]   = useState<number | null>(null);
  const [activeCents, setActiveCents]   = useState<number | null>(null);

  const streakRef        = useRef<{ freq: number; count: number } | null>(null);
  const holdTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const switchCandidateRef = useRef<{ index: number; count: number } | null>(null);
  const lastSwitchRef    = useRef<number>(0);

  const selectedTuning = useMemo(
    () =>
      tunings.find((t) => t.id === selectedId) ??
      tunings.find((t) => t.name === "Standard") ??
      tunings[0] ??
      null,
    [tunings, selectedId]
  );

  const parsedStrings = useMemo(
    () => (selectedTuning ? parseStrings(selectedTuning.strings) : []),
    [selectedTuning]
  );

  // Highest open string + 1 semitone headroom for sharp/out-of-tune strings
  const maxFreq = useMemo(
    () => parsedStrings.length
      ? Math.max(...parsedStrings.map((s) => s.frequency)) * 1.06
      : 400,
    [parsedStrings]
  );

  function clearDisplay() {
    setDetectedNote(null); setDetectedHz(null);
    setActiveIndex(null);  setActiveCents(null);
    streakRef.current = null;
    switchCandidateRef.current = null;
  }

  const onPitch = useCallback(
    (result: PitchResult | null) => {
      if (!result || result.clarity < MIN_CLARITY || parsedStrings.length === 0) {
        if (!holdTimerRef.current) {
          holdTimerRef.current = setTimeout(() => {
            holdTimerRef.current = null;
            clearDisplay();
          }, HOLD_MS);
        }
        return;
      }

      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }

      const { frequency } = result;

      // Streak filter: require consecutive consistent readings before updating display
      const streak = streakRef.current;
      if (streak && Math.abs(getCents(frequency, streak.freq)) < STREAK_CENTS) {
        const count = streak.count + 1;
        streakRef.current = { freq: (streak.freq * streak.count + frequency) / count, count };
      } else {
        streakRef.current = { freq: frequency, count: 1 };
        return;
      }
      if (streakRef.current.count < STREAK_NEEDED) return;

      const stable   = streakRef.current.freq;
      const closest  = findClosestString(stable, parsedStrings).index;

      // Auto-switch: if stable reading consistently points to a different string, switch
      if (closest !== pinnedString) {
        const candidate = switchCandidateRef.current;
        if (candidate?.index === closest) {
          candidate.count++;
          if (
            candidate.count >= SWITCH_FRAMES &&
            Date.now() - lastSwitchRef.current > SWITCH_COOLDOWN_MS
          ) {
            setPinnedString(closest);
            lastSwitchRef.current = Date.now();
            switchCandidateRef.current = null;
          }
        } else {
          switchCandidateRef.current = { index: closest, count: 1 };
        }
      } else {
        switchCandidateRef.current = null;
      }

      setDetectedNote(frequencyToNote(stable));
      setDetectedHz(stable);
      setActiveIndex(pinnedString);
      setActiveCents(getCents(stable, parsedStrings[pinnedString].frequency));
    },
    [parsedStrings, pinnedString]
  );

  const { micState, listening, toggle } = usePitchDetector(onPitch, maxFreq);

  if (loading) return <p className="text-muted text-[13px]">Loading tunings…</p>;

  return (
    <div className="flex flex-col items-center gap-8 w-full">

      <div className="w-full" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
        <div className="flex justify-start">
          <MicButton micState={micState} listening={listening} onToggle={toggle} />
        </div>
        <NoteReadout note={detectedNote} hz={detectedHz} cents={activeCents} listening={listening} />
        <div className="flex justify-end">
          <TuningSelector
            tunings={tunings}
            selectedId={selectedTuning?.id ?? null}
            onSelect={(id) => { setSelectedId(id); setPinnedString(0); }}
          />
        </div>
      </div>

      {selectedTuning && (
        <div className="flex flex-col items-center gap-6 w-full">
          <div style={{ width: "100%", maxWidth: "28rem" }}>
            <CentsMeter cents={listening ? activeCents : null} />
          </div>
          <Headstock
            strings={parsedStrings}
            activeIndex={listening ? activeIndex : null}
            activeCents={listening ? activeCents : null}
            pinnedString={pinnedString}
            onStringClick={(i) => {
              setPinnedString(i);
              switchCandidateRef.current = null;
              lastSwitchRef.current = Date.now(); // cooldown on manual click too
            }}
          />
        </div>
      )}
    </div>
  );
}
