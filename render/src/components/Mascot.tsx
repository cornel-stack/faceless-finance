import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

// Code-drawn, hand-stickman-style host with a face and a handful of poses — the
// Casual Finance look. Static apart from a subtle idle breath. No generative AI;
// pure SVG. Drawn in a 100×170 viewBox so proportions never distort.

export type Pose = "stand" | "walk" | "point" | "think" | "surprised" | "celebrate";
export type Expression = "neutral" | "happy" | "worried" | "surprised";

type Pt = [number, number];
type PoseDef = {
  head: Pt;
  neck: Pt;
  pelvis: Pt;
  arms: { Lel: Pt; Lwr: Pt; Rel: Pt; Rwr: Pt };
  legs: { Lkn: Pt; Lan: Pt; Rkn: Pt; Ran: Pt };
};

const SH_L: Pt = [41, 52];
const SH_R: Pt = [59, 52];

const POSES: Record<Pose, PoseDef> = {
  stand: {
    head: [50, 26], neck: [50, 42], pelvis: [50, 100],
    arms: { Lel: [32, 76], Lwr: [29, 98], Rel: [68, 76], Rwr: [71, 98] },
    legs: { Lkn: [43, 132], Lan: [41, 164], Rkn: [57, 132], Ran: [59, 164] },
  },
  walk: {
    head: [50, 26], neck: [50, 42], pelvis: [50, 100],
    arms: { Lel: [35, 74], Lwr: [31, 94], Rel: [66, 78], Rwr: [70, 98] },
    legs: { Lkn: [45, 130], Lan: [36, 162], Rkn: [58, 132], Ran: [67, 164] },
  },
  point: {
    head: [50, 26], neck: [50, 42], pelvis: [50, 100],
    arms: { Lel: [32, 76], Lwr: [29, 98], Rel: [74, 46], Rwr: [95, 37] },
    legs: { Lkn: [43, 132], Lan: [41, 164], Rkn: [57, 132], Ran: [59, 164] },
  },
  think: {
    head: [48, 26], neck: [49, 42], pelvis: [50, 100],
    arms: { Lel: [40, 78], Lwr: [53, 88], Rel: [64, 74], Rwr: [53, 44] },
    legs: { Lkn: [43, 132], Lan: [41, 164], Rkn: [57, 132], Ran: [59, 164] },
  },
  surprised: {
    head: [50, 26], neck: [50, 42], pelvis: [50, 100],
    arms: { Lel: [30, 40], Lwr: [22, 22], Rel: [70, 40], Rwr: [78, 22] },
    legs: { Lkn: [42, 132], Lan: [37, 164], Rkn: [58, 132], Ran: [63, 164] },
  },
  celebrate: {
    head: [50, 24], neck: [50, 40], pelvis: [50, 98],
    arms: { Lel: [33, 32], Lwr: [27, 12], Rel: [67, 32], Rwr: [73, 12] },
    legs: { Lkn: [44, 128], Lan: [42, 156], Rkn: [57, 128], Ran: [60, 156] },
  },
};

const DEFAULT_EXPRESSION: Record<Pose, Expression> = {
  stand: "neutral", walk: "neutral", point: "happy",
  think: "worried", surprised: "surprised", celebrate: "happy",
};

const HEAD_R = 15;

function Face({ cx, cy, expr }: { cx: number; cy: number; expr: Expression }) {
  const eyeY = cy - 2;
  const eyeDx = 5.5;
  const eyeR = expr === "surprised" ? 2.6 : 2.1;
  return (
    <g fill={theme.ink} stroke="none">
      <circle cx={cx - eyeDx} cy={eyeY} r={eyeR} />
      <circle cx={cx + eyeDx} cy={eyeY} r={eyeR} />
      {/* brows */}
      {expr === "surprised" && (
        <g stroke={theme.ink} strokeWidth={1.4} strokeLinecap="round">
          <line x1={cx - 9} y1={cy - 8} x2={cx - 3} y2={cy - 9} />
          <line x1={cx + 3} y1={cy - 9} x2={cx + 9} y2={cy - 8} />
        </g>
      )}
      {expr === "worried" && (
        <g stroke={theme.ink} strokeWidth={1.4} strokeLinecap="round">
          <line x1={cx - 9} y1={cy - 7} x2={cx - 3} y2={cy - 5} />
          <line x1={cx + 3} y1={cy - 5} x2={cx + 9} y2={cy - 7} />
        </g>
      )}
      {/* mouth */}
      {expr === "neutral" && <line x1={cx - 4} y1={cy + 7} x2={cx + 4} y2={cy + 7} stroke={theme.ink} strokeWidth={1.6} strokeLinecap="round" />}
      {expr === "happy" && <path d={`M ${cx - 6} ${cy + 5} Q ${cx} ${cy + 12} ${cx + 6} ${cy + 5}`} fill="none" stroke={theme.ink} strokeWidth={1.8} strokeLinecap="round" />}
      {expr === "worried" && <path d={`M ${cx - 5} ${cy + 9} Q ${cx} ${cy + 4} ${cx + 5} ${cy + 9}`} fill="none" stroke={theme.ink} strokeWidth={1.8} strokeLinecap="round" />}
      {expr === "surprised" && <ellipse cx={cx} cy={cy + 8} rx={2.8} ry={3.6} fill={theme.ink} />}
    </g>
  );
}

export const Mascot: React.FC<{
  pose?: Pose;
  expression?: Expression;
  width: number;
  height: number;
  idle?: boolean;
}> = ({ pose = "stand", expression, width, height, idle = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = POSES[pose];
  const expr = expression ?? DEFAULT_EXPRESSION[pose];

  // subtle idle breath — a small vertical bob, so the host isn't dead-frozen
  const bob = idle ? Math.sin((frame / fps) * 2 * Math.PI * 0.5) * 1.1 : 0;

  const stroke = theme.ink;
  const limb = { stroke, strokeWidth: 7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const [hx, hy] = p.head;

  return (
    <svg width={width} height={height} viewBox="0 0 100 170" preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(0 ${bob})`}>
        {/* torso + shoulders */}
        <line x1={p.neck[0]} y1={p.neck[1]} x2={p.pelvis[0]} y2={p.pelvis[1]} {...limb} />
        <line x1={SH_L[0]} y1={SH_L[1]} x2={SH_R[0]} y2={SH_R[1]} {...limb} />
        {/* arms */}
        <polyline points={`${SH_L[0]},${SH_L[1]} ${p.arms.Lel[0]},${p.arms.Lel[1]} ${p.arms.Lwr[0]},${p.arms.Lwr[1]}`} {...limb} />
        <polyline points={`${SH_R[0]},${SH_R[1]} ${p.arms.Rel[0]},${p.arms.Rel[1]} ${p.arms.Rwr[0]},${p.arms.Rwr[1]}`} {...limb} />
        {/* legs */}
        <polyline points={`${p.pelvis[0]},${p.pelvis[1]} ${p.legs.Lkn[0]},${p.legs.Lkn[1]} ${p.legs.Lan[0]},${p.legs.Lan[1]}`} {...limb} />
        <polyline points={`${p.pelvis[0]},${p.pelvis[1]} ${p.legs.Rkn[0]},${p.legs.Rkn[1]} ${p.legs.Ran[0]},${p.legs.Ran[1]}`} {...limb} />
        {/* hands + feet */}
        {[p.arms.Lwr, p.arms.Rwr, p.legs.Lan, p.legs.Ran].map((pt, i) => (
          <circle key={i} cx={pt[0]} cy={pt[1]} r={3.6} fill={stroke} />
        ))}
        {/* head: white fill so the face reads on any background */}
        <circle cx={hx} cy={hy} r={HEAD_R} fill={theme.bg} stroke={stroke} strokeWidth={6} />
        <Face cx={hx} cy={hy} expr={expr} />
      </g>
    </svg>
  );
};

export const poseForClip = (clip?: string): Pose => {
  switch (clip) {
    case "walk": return "walk";
    case "point": return "point";
    case "shock": return "surprised";
    case "think": return "think";
    case "celebrate": return "celebrate";
    default: return "stand";
  }
};

export const expressionForMood = (mood?: string): Expression | undefined => {
  switch (mood) {
    case "up": return "happy";
    case "down": return "worried";
    case "shock": return "surprised";
    default: return undefined;
  }
};
