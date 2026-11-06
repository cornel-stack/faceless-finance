import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type { Source } from "../types";

// Credibility layer: the real source, printed beneath the data. A red underline
// animates in (never baked into the image — drawn here).
export const SourceCard: React.FC<{ source: Source; width: number }> = ({
  source,
  width,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const underline = interpolate(frame, [fps * 0.4, fps * 1.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
        fontFamily: "Georgia, serif",
        color: "#1a1a1a",
        boxSizing: "border-box",
        padding: "0 48px",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700 }}>{source.name}</div>
      <div
        style={{
          display: "inline-block",
          fontSize: 22,
          opacity: 0.7,
          borderBottom: "3px solid #b02a1f",
          width: `${underline * 100}%`,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {source.url} · accessed {source.accessed}
      </div>
    </div>
  );
};
