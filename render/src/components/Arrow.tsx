import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";

// A hand-drawn curved arrow that draws itself on, with an arrowhead and optional
// coins flowing along it (money moving between things). SVG coords (1920×1080).
export const Arrow: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  delay?: number; bend?: number; color?: string; width?: number; flow?: boolean;
}> = ({ x1, y1, x2, y2, delay = 0, bend = 0.18, color = theme.inkSoft, width = 6, flow = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const cxp = mx + nx * len * bend, cyp = my + ny * len * bend;
  const path = `M ${x1} ${y1} Q ${cxp} ${cyp} ${x2} ${y2}`;
  const reveal = interpolate(frame, [delay, delay + 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dash = len * 1.7;

  const a = Math.atan2(y2 - cyp, x2 - cxp);
  const hl = 20;
  const head = `M ${x2 - hl * Math.cos(a - 0.45)} ${y2 - hl * Math.sin(a - 0.45)} L ${x2} ${y2} L ${x2 - hl * Math.cos(a + 0.45)} ${y2 - hl * Math.sin(a + 0.45)}`;
  const headOpacity = interpolate(reveal, [0.82, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bez = (t: number): [number, number] => [
    (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cxp + t * t * x2,
    (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cyp + t * t * y2,
  ];
  const coins = flow && reveal > 0.85
    ? [0, 1, 2].map((i) => {
        const t = (((frame - delay) / (fps * 1.3)) + i / 3) % 1;
        const [px, py] = bez(t);
        return <circle key={i} cx={px} cy={py} r={9} fill="#e8b73a" stroke={theme.ink} strokeWidth={2} />;
      })
    : null;

  return (
    <g>
      <path d={path} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} strokeDashoffset={dash * (1 - reveal)} />
      <path d={head} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={headOpacity} />
      {coins}
    </g>
  );
};
