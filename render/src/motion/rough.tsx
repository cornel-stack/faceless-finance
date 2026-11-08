import React, { useMemo } from "react";
import rough from "roughjs";

// Genuine hand-drawn rendering via Rough.js: ordinary shapes are redrawn with
// wobbly strokes and hatched/offset fills. Use these instead of plain SVG
// <rect>/<circle>/<path> wherever we want the hand-sketched look. Seed is stable
// per element (a steady drawing), not frame-shaken.
const gen = rough.generator();

export type RoughOpts = {
  seed?: number;
  roughness?: number;
  bowing?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillStyle?: "solid" | "hachure" | "zigzag" | "cross-hatch" | "dots";
  fillWeight?: number;
  hachureGap?: number;
  hachureAngle?: number;
};

const INK = "#17120f";

function opts(o: RoughOpts) {
  return {
    seed: o.seed ?? 2,
    roughness: o.roughness ?? 1.0,
    bowing: o.bowing ?? 1.0,
    stroke: o.stroke ?? INK,
    strokeWidth: o.strokeWidth ?? 2.4,
    fill: o.fill,
    fillStyle: o.fillStyle ?? "solid",
    fillWeight: o.fillWeight ?? 2,
    hachureGap: o.hachureGap ?? 4,
    hachureAngle: o.hachureAngle ?? -41,
  };
}

const Paths: React.FC<{ paths: any[] }> = ({ paths }) => (
  <>
    {paths.map((p, i) => (
      <path key={i} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill || "none"} strokeLinecap="round" strokeLinejoin="round" />
    ))}
  </>
);

const useDraw = (make: () => any, deps: React.DependencyList) =>
  useMemo(() => gen.toPaths(make()), deps); // eslint-disable-line react-hooks/exhaustive-deps

export const RPath: React.FC<RoughOpts & { d: string }> = (p) => (
  <Paths paths={useDraw(() => gen.path(p.d, opts(p)), [p.d, p.seed, p.stroke, p.strokeWidth, p.fill, p.fillStyle, p.roughness])} />
);
export const RRect: React.FC<RoughOpts & { x: number; y: number; w: number; h: number }> = (p) => (
  <Paths paths={useDraw(() => gen.rectangle(p.x, p.y, p.w, p.h, opts(p)), [p.x, p.y, p.w, p.h, p.seed, p.stroke, p.strokeWidth, p.fill, p.fillStyle, p.roughness])} />
);
export const RCircle: React.FC<RoughOpts & { cx: number; cy: number; d: number }> = (p) => (
  <Paths paths={useDraw(() => gen.circle(p.cx, p.cy, p.d, opts(p)), [p.cx, p.cy, p.d, p.seed, p.stroke, p.strokeWidth, p.fill, p.fillStyle, p.roughness])} />
);
export const REllipse: React.FC<RoughOpts & { cx: number; cy: number; w: number; h: number }> = (p) => (
  <Paths paths={useDraw(() => gen.ellipse(p.cx, p.cy, p.w, p.h, opts(p)), [p.cx, p.cy, p.w, p.h, p.seed, p.stroke, p.strokeWidth, p.fill, p.fillStyle, p.roughness])} />
);
export const RLine: React.FC<RoughOpts & { x1: number; y1: number; x2: number; y2: number }> = (p) => (
  <Paths paths={useDraw(() => gen.line(p.x1, p.y1, p.x2, p.y2, opts(p)), [p.x1, p.y1, p.x2, p.y2, p.seed, p.stroke, p.strokeWidth, p.roughness])} />
);
export const RPolygon: React.FC<RoughOpts & { points: [number, number][] }> = (p) => (
  <Paths paths={useDraw(() => gen.polygon(p.points as any, opts(p)), [JSON.stringify(p.points), p.seed, p.stroke, p.strokeWidth, p.fill, p.fillStyle, p.roughness])} />
);
