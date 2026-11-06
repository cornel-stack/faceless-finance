import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { Figure } from "../types";

// A self-drawing chart: the line reveals in sync with narration over `drawSeconds`.
// Placeholder geometry for the pipeline skeleton; real series rendering (bar-race,
// maps, compounding via Manim) slots in behind the same props.
export const ChartPanel: React.FC<{
  figures: Figure[];
  type?: string;
  drawSeconds?: number;
  width: number;
  height: number;
}> = ({ figures, type = "line", drawSeconds = 5, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pad = 48;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const values = figures.length ? figures.map((f) => f.value) : [0, 1];
  const max = Math.max(...values, 1);
  const n = Math.max(values.length, 2);

  // Build a point per figure (or interpolate a growth curve for `compound`).
  const points = Array.from({ length: n }, (_, i) => {
    const x = pad + (w * i) / (n - 1);
    const vRaw =
      type === "compound"
        ? max * Math.pow((i + 1) / n, 2.2) // eased growth shape
        : values[i % values.length];
    const y = pad + h - (h * vRaw) / max;
    return [x, y] as const;
  });

  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  // Animate the reveal with a dash offset.
  const total = width * 2;
  const reveal = interpolate(frame, [0, drawSeconds * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={width} height={height}>
      {/* axes */}
      <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#ccc" strokeWidth={2} />
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#ccc" strokeWidth={2} />
      <path
        d={path}
        fill="none"
        stroke="#b02a1f"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={total}
        strokeDashoffset={total * (1 - reveal)}
      />
      {points.map(([x, y], i) =>
        reveal > i / (n - 1) ? (
          <circle key={i} cx={x} cy={y} r={7} fill="#b02a1f" />
        ) : null
      )}
    </svg>
  );
};
