export const CHROMATIC = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const FLAT_MAP: Record<string, string> = {
  Db:"C#", Eb:"D#", Fb:"E", Gb:"F#", Ab:"G#", Bb:"A#", Cb:"B",
};

export interface StringTarget {
  note: string;
  octave: number;
  midi: number;
  frequency: number;
}

function noteToChromatic(note: string): number {
  const n = FLAT_MAP[note] ?? note;
  return CHROMATIC.indexOf(n);
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Derive octaves from low→high note names using chromatic-step logic. */
export function parseStrings(strings: string): StringTarget[] {
  const notes = strings.split(" ");
  let octave = 2;
  let prevChromatic = -1;

  return notes.map((rawNote, i) => {
    const chromatic = noteToChromatic(rawNote);
    if (i > 0 && chromatic <= prevChromatic) octave++;
    prevChromatic = chromatic;
    const midi = 12 * (octave + 1) + chromatic;
    return { note: rawNote, octave, midi, frequency: midiToFreq(midi) };
  });
}

/** Cents deviation between a detected frequency and a target frequency. */
export function getCents(detected: number, target: number): number {
  return Math.round(1200 * Math.log2(detected / target));
}

/** Return the index + cents of the closest string to the detected frequency. */
export function findClosestString(
  frequency: number,
  targets: StringTarget[]
): { index: number; cents: number } {
  let best = { index: 0, cents: 9999 };
  for (let i = 0; i < targets.length; i++) {
    const c = getCents(frequency, targets[i].frequency);
    if (Math.abs(c) < Math.abs(best.cents)) best = { index: i, cents: c };
  }
  return best;
}

/** Convert a frequency to its nearest note name. */
export function frequencyToNote(frequency: number): string {
  const midi = Math.round(12 * Math.log2(frequency / 440) + 69);
  return CHROMATIC[midi % 12];
}

/** Classify tuning accuracy for colour coding. */
export function tuneState(cents: number): "in-tune" | "close" | "out" {
  const a = Math.abs(cents);
  if (a <= 5) return "in-tune";
  if (a <= 20) return "close";
  return "out";
}

export const TUNE_COLORS = {
  "in-tune": "#4ade80",
  "close":   "#f59e0b",
  "out":     "#f87171",
  "default": "#333",
} as const;
