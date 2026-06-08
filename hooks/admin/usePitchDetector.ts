"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { autoCorrelate } from "@/lib/autoCorrelate";

export type { PitchResult } from "@/lib/autoCorrelate";
export type MicState = "idle" | "requesting" | "granted" | "denied";

const BUFFER_SIZE = 2048;

export function usePitchDetector(
  onPitch: (r: import("@/lib/autoCorrelate").PitchResult | null) => void,
  maxFreq = 400,
) {
  const [micState, setMicState] = useState<MicState>("idle");
  const [listening, setListening] = useState(false);

  const ctxRef      = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const rafRef      = useRef<number>(0);
  const bufRef      = useRef<Float32Array>(new Float32Array(BUFFER_SIZE));
  const onPitchRef  = useRef(onPitch);
  useEffect(() => { onPitchRef.current = onPitch; }, [onPitch]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close();
    ctxRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    setListening(false);
    onPitchRef.current(null);
  }, []);

  const start = useCallback(async () => {
    if (micState === "denied") return;
    setMicState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation:  false,
          noiseSuppression:  false,
          autoGainControl:   false,
        },
        video: false,
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = BUFFER_SIZE;
      analyser.smoothingTimeConstant = 0;
      analyserRef.current = analyser;
      ctx.createMediaStreamSource(stream).connect(analyser);

      setMicState("granted");
      setListening(true);

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(bufRef.current);
        onPitchRef.current(autoCorrelate(bufRef.current, ctx.sampleRate, maxFreq));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setMicState("denied");
    }
  }, [micState]);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return { micState, listening, toggle };
}
