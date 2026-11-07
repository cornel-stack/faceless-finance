import React from "react";
import { useCurrentFrame } from "remotion";

// Hand-drawn "line boil": a turbulence displacement whose seed changes a few
// times a second, so any SVG it wraps gets a wobbly outline that subtly redraws
// itself frame to frame. Apply to drawn SVG (doodles, mascot, chart linework) —
// not to text or screenshots.
//
//   const { filterId, defs } = useBoil(7);
//   <svg>…<defs>{defs}</defs><g filter={filterId}>…</g></svg>
export function useBoil(scale = 7, enabled = true) {
  const frame = useCurrentFrame();
  const id = React.useId().replace(/:/g, "");
  const seed = Math.floor(frame / 3) % 9; // redraw ~10×/sec
  if (!enabled) return { filterId: undefined as string | undefined, defs: null as React.ReactNode };
  const defs = (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="turbulence" baseFrequency="0.016" numOctaves="2" seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} />
    </filter>
  );
  return { filterId: `url(#${id})`, defs };
}
