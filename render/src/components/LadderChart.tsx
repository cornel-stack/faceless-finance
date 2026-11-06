import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme, money, moneyShort } from "../theme";
import { display, sans } from "../fonts";

export type LadderItem = { label: string; value: number };

// The hero: a log-scale bar ladder that accumulates one bar per chapter.
// Earlier bars stay drawn; the current bar grows and its value counts up.
export const LadderChart: React.FC<{
  items: LadderItem[];
  upto: number; // index of the current (animating) bar
  width: number;
  height: number;
  domainMin?: number;
  domainMax?: number;
}> = ({ items, upto, width, height, domainMin = 1000, domainMax = 100_000_000 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const padL = 150;
  const padR = 40;
  const padT = 40;
  const padB = 70;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const baseY = padT + plotH;

  const logMin = Math.log10(domainMin);
  const logMax = Math.log10(domainMax);
  const frac = (v: number) => {
    const c = Math.max(domainMin, Math.min(domainMax, v));
    return (Math.log10(c) - logMin) / (logMax - logMin);
  };

  const n = items.length;
  const slot = plotW / n;
  const barW = Math.min(slot * 0.52, 150);

  // y-axis ticks at each power of ten in range
  const ticks: number[] = [];
  for (let e = logMin; e <= logMax + 0.001; e++) ticks.push(Math.pow(10, e));

  // current bar animation
  const grow = spring({ frame, fps, config: { damping: 18, mass: 0.6 }, durationInFrames: Math.round(fps * 1.1) });

  return (
    <svg width={width} height={height}>
      {/* gridlines + y labels */}
      {ticks.map((t, i) => {
        const y = baseY - frac(t) * plotH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke={theme.grid} strokeWidth={1.5} />
            <text x={padL - 18} y={y + 8} textAnchor="end" fontFamily={sans} fontSize={26} fill={theme.inkSoft}>
              {moneyShort(t)}
            </text>
          </g>
        );
      })}
      {/* baseline */}
      <line x1={padL} y1={baseY} x2={width - padR} y2={baseY} stroke={theme.ink} strokeWidth={3} />

      {items.map((it, i) => {
        if (i > upto) return null;
        const isCurrent = i === upto;
        const cx = padL + slot * i + slot / 2;
        const p = isCurrent ? grow : 1;
        const h = frac(it.value) * plotH * p;
        const y = baseY - h;
        const shownVal = it.value * (isCurrent ? grow : 1);
        const barColor = isCurrent ? theme.accent : "#b8afa1";
        return (
          <g key={i}>
            <rect x={cx - barW / 2} y={y} width={barW} height={h} rx={4} fill={barColor} />
            {/* value label on top of bar */}
            <text
              x={cx}
              y={y - 18}
              textAnchor="middle"
              fontFamily={display}
              fontWeight={900}
              fontSize={isCurrent ? 44 : 30}
              fill={isCurrent ? theme.ink : theme.inkSoft}
              opacity={isCurrent ? 1 : 0.85}
            >
              {money(shownVal)}
            </text>
            {/* x label (short) under baseline */}
            <text x={cx} y={baseY + 44} textAnchor="middle" fontFamily={sans} fontSize={24} fill={theme.inkSoft}>
              {it.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
