const MIN_RMS = 0.0001;

export interface PitchResult {
  frequency: number;
  clarity: number; // 0–1
}

/**
 * Autocorrelation-based pitch detector for guitar frequencies (60–1200 Hz).
 * Returns null when the signal is too quiet or no clear pitch is found.
 */
export function autoCorrelate(buf: Float32Array<ArrayBuffer>, sampleRate: number, maxFreq = 400): PitchResult | null {
  // Reject silence
  let rms = 0;
  for (const s of buf) rms += s * s;
  rms = Math.sqrt(rms / buf.length);
  if (rms < MIN_RMS) return null;

  const minLag = Math.floor(sampleRate / maxFreq);
  const maxLag = Math.min(Math.ceil(sampleRate / 60), buf.length - 1);

  let maxCorr = -Infinity;
  let bestLag = minLag;
  const corrs: number[] = [];

  for (let lag = minLag; lag <= maxLag; lag++) {
    let c = 0;
    for (let i = 0; i < buf.length - lag; i++) c += buf[i] * buf[i + lag];
    corrs.push(c);
    if (c > maxCorr) { maxCorr = c; bestLag = lag; }
  }

  // Parabolic interpolation for sub-sample accuracy
  const idx = bestLag - minLag;
  let refinedLag = bestLag;
  if (idx > 0 && idx < corrs.length - 1) {
    const a = corrs[idx - 1], b = corrs[idx], c = corrs[idx + 1];
    const denom = 2 * (2 * b - a - c);
    if (denom !== 0) refinedLag = bestLag + (c - a) / denom;
  }

  const zeroLag = corrs[0] > 0 ? corrs[0] : 1;
  return { frequency: sampleRate / refinedLag, clarity: Math.min(maxCorr / zeroLag, 1) };
}
