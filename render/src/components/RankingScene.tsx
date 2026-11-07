import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme, money } from "../theme";
import { display, sans } from "../fonts";

export type RankItem = { label: string; value: number };

// The-Price-Tag hero: a horizontal ranking that reveals row by row, each bar
// growing to a linear scale with its value counting up. Top row highlighted.
export const RankingScene: React.FC<{
  items: RankItem[];
  unit?: string;
  width: number;
  height: number;
  staggerFrames?: number;
}> = ({ items, unit = "USD", width, height, staggerFrames = 9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sorted = [...items].sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map((i) => i.value), 1);

  const labelW = 360;
  const valueW = 220;
  const rowH = Math.min(height / sorted.length, 92);
  const barMax = width - labelW - valueW;

  return (
    <svg width={width} height={sorted.length * rowH}>
      {sorted.map((it, i) => {
        const reveal = spring({ frame: frame - i * staggerFrames, fps, config: { damping: 20 }, durationInFrames: Math.round(fps * 0.9) });
        const y = i * rowH;
        const barW = (it.value / max) * barMax * reveal;
        const isTop = i === 0;
        const color = isTop ? theme.accent : "#b8afa1";
        return (
          <g key={it.label} opacity={interpolate(reveal, [0, 0.15], [0, 1], { extrapolateRight: "clamp" })}>
            <text x={0} y={y + rowH / 2 + 12} fontFamily={sans} fontWeight={isTop ? 700 : 400} fontSize={34} fill={theme.ink}>
              {i + 1}. {it.label}
            </text>
            <rect x={labelW} y={y + rowH * 0.18} width={barW} height={rowH * 0.64} rx={5} fill={color} />
            <text
              x={labelW + barW + 16}
              y={y + rowH / 2 + 14}
              fontFamily={display}
              fontWeight={900}
              fontSize={isTop ? 42 : 34}
              fill={isTop ? theme.ink : theme.inkSoft}
            >
              {money(it.value * reveal, unit)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
