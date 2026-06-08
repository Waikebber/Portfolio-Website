import type { StringTarget } from "@/lib/tunerUtils";
import PegBadge from "./PegBadge";

interface Props {
  strings: StringTarget[];
  activeIndex: number | null;
  activeCents: number | null;
  pinnedString: number | null;
  onStringClick: (i: number) => void;
}

// Vertical position of each peg as % of image height (top to bottom)
const PEG_Y = [17, 33, 49];

// Left column: strings 4,5,6 (indices 2,1,0) top→bottom — bass side
// Right column: strings 3,2,1 (indices 3,4,5) top→bottom — treble side
const LEFT_INDICES  = [2, 1, 0];
const RIGHT_INDICES = [3, 4, 5];

export default function Headstock({ strings, activeIndex, activeCents, pinnedString, onStringClick }: Props) {
  function col(indices: number[]) {
    return (
      <div style={{ position: "relative", width: "2.75rem", flexShrink: 0, alignSelf: "stretch" }}>
        {indices.map((si, pi) =>
          strings[si] ? (
            <PegBadge
              key={si}
              label={strings[si].note}
              yPct={PEG_Y[pi]}
              stringIndex={si}
              activeIndex={activeIndex}
              activeCents={activeCents}
              isPinned={pinnedString === si}
              onClick={() => onStringClick(si)}
            />
          ) : null
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "stretch", justifyContent: "center", gap: "0.5rem" }}>
      {col(LEFT_INDICES)}
      <img
        src="/assets/guitar-headstock.webp"
        alt="Guitar headstock"
        draggable={false}
        style={{ width: "16rem", flexShrink: 0, objectFit: "contain" }}
      />
      {col(RIGHT_INDICES)}
    </div>
  );
}
