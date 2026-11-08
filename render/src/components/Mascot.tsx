import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { RPath, RCircle, REllipse, RLine } from "../motion/rough";

// A cartoon character — a round head with a real cartoon face (eyes with pupils,
// brows, nose, expressive mouth, a tuft of hair) on a stick-figure body. Drawn
// through Rough.js so every line is hand-sketched. Casual Finance style.

export type Pose = "stand" | "walk" | "point" | "think" | "surprised" | "celebrate";
export type Expression = "neutral" | "happy" | "worried" | "surprised";
export type Variant = "normal" | "villain" | "king";

type Pt = [number, number];
type PoseDef = { head: Pt; neck: Pt; pelvis: Pt; arms: { Lel: Pt; Lwr: Pt; Rel: Pt; Rwr: Pt }; legs: { Lkn: Pt; Lan: Pt; Rkn: Pt; Ran: Pt } };

const SH_L: Pt = [41, 52];
const SH_R: Pt = [59, 52];
const INK = "#17120f";
const HEAD_R = 16;

const POSES: Record<Pose, PoseDef> = {
  stand: { head: [50, 26], neck: [50, 42], pelvis: [50, 100], arms: { Lel: [32, 76], Lwr: [29, 98], Rel: [68, 76], Rwr: [71, 98] }, legs: { Lkn: [43, 132], Lan: [41, 164], Rkn: [57, 132], Ran: [59, 164] } },
  walk: { head: [50, 26], neck: [50, 42], pelvis: [50, 100], arms: { Lel: [35, 74], Lwr: [31, 94], Rel: [66, 78], Rwr: [70, 98] }, legs: { Lkn: [45, 130], Lan: [36, 162], Rkn: [58, 132], Ran: [67, 164] } },
  point: { head: [50, 26], neck: [50, 42], pelvis: [50, 100], arms: { Lel: [32, 76], Lwr: [29, 98], Rel: [74, 46], Rwr: [95, 37] }, legs: { Lkn: [43, 132], Lan: [41, 164], Rkn: [57, 132], Ran: [59, 164] } },
  think: { head: [48, 26], neck: [49, 42], pelvis: [50, 100], arms: { Lel: [40, 78], Lwr: [53, 88], Rel: [64, 74], Rwr: [53, 44] }, legs: { Lkn: [43, 132], Lan: [41, 164], Rkn: [57, 132], Ran: [59, 164] } },
  surprised: { head: [50, 26], neck: [50, 42], pelvis: [50, 100], arms: { Lel: [30, 40], Lwr: [22, 22], Rel: [70, 40], Rwr: [78, 22] }, legs: { Lkn: [42, 132], Lan: [37, 164], Rkn: [58, 132], Ran: [63, 164] } },
  celebrate: { head: [50, 24], neck: [50, 40], pelvis: [50, 98], arms: { Lel: [33, 32], Lwr: [27, 12], Rel: [67, 32], Rwr: [73, 12] }, legs: { Lkn: [44, 128], Lan: [42, 156], Rkn: [57, 128], Ran: [60, 156] } },
};

const DEFAULT_EXPRESSION: Record<Pose, Expression> = {
  stand: "neutral", walk: "neutral", point: "happy", think: "worried", surprised: "surprised", celebrate: "happy",
};

const Face: React.FC<{ cx: number; cy: number; expr: Expression }> = ({ cx, cy, expr }) => {
  const ex = 6, ey = cy - 2; // eye offset
  const browY = expr === "surprised" ? cy - 9 : cy - 7;
  const brow = (dir: number) =>
    expr === "worried"
      ? { a: [cx + dir * 9, browY + 2], b: [cx + dir * 3, browY + 4] }
      : { a: [cx + dir * 9, browY], b: [cx + dir * 3, browY - (expr === "surprised" ? 2 : 1)] };
  const bl = brow(-1), br = brow(1);
  return (
    <>
      {/* eye whites + pupils */}
      <RCircle cx={cx - ex} cy={ey} d={7} fill="#fff" stroke={INK} strokeWidth={1.4} />
      <RCircle cx={cx + ex} cy={ey} d={7} fill="#fff" stroke={INK} strokeWidth={1.4} />
      <circle cx={cx - ex + 0.5} cy={ey + 0.5} r={1.7} fill={INK} />
      <circle cx={cx + ex + 0.5} cy={ey + 0.5} r={1.7} fill={INK} />
      {/* brows */}
      <RLine x1={bl.a[0]} y1={bl.a[1]} x2={bl.b[0]} y2={bl.b[1]} stroke={INK} strokeWidth={1.6} />
      <RLine x1={br.a[0]} y1={br.a[1]} x2={br.b[0]} y2={br.b[1]} stroke={INK} strokeWidth={1.6} />
      {/* nose */}
      <RPath d={`M ${cx + 1} ${cy + 1} L ${cx + 2.6} ${cy + 4} L ${cx - 0.4} ${cy + 4.4}`} stroke={INK} strokeWidth={1.4} />
      {/* mouth */}
      {expr === "neutral" && <RPath d={`M ${cx - 5} ${cy + 8} Q ${cx} ${cy + 9} ${cx + 5} ${cy + 8}`} stroke={INK} strokeWidth={1.8} />}
      {expr === "happy" && <RPath d={`M ${cx - 6} ${cy + 6} Q ${cx} ${cy + 14} ${cx + 6} ${cy + 6}`} stroke={INK} strokeWidth={2} />}
      {expr === "worried" && <RPath d={`M ${cx - 5} ${cy + 10} Q ${cx} ${cy + 5} ${cx + 5} ${cy + 10}`} stroke={INK} strokeWidth={2} />}
      {expr === "surprised" && <REllipse cx={cx} cy={cy + 9} w={6} h={7} fill={INK} stroke={INK} strokeWidth={1.4} />}
    </>
  );
};

const Accessory: React.FC<{ cx: number; cy: number; variant: Variant }> = ({ cx, cy, variant }) => {
  const r = HEAD_R;
  if (variant === "king") {
    const top = cy - r - 1;
    return <RPath d={`M ${cx - 16} ${top} L ${cx - 16} ${top - 14} L ${cx - 8} ${top - 6} L ${cx} ${top - 16} L ${cx + 8} ${top - 6} L ${cx + 16} ${top - 14} L ${cx + 16} ${top} Z`} fill="#e8b73a" stroke={INK} strokeWidth={2.2} />;
  }
  if (variant === "villain") {
    return (
      <>
        <REllipse cx={cx} cy={cy - r + 2} w={2 * r + 16} h={9} fill="#2a2a2a" stroke={INK} strokeWidth={2} />
        <RPath d={`M ${cx - 11} ${cy - r + 1} Q ${cx - 11} ${cy - r - 13} ${cx} ${cy - r - 13} Q ${cx + 11} ${cy - r - 13} ${cx + 11} ${cy - r + 1} Z`} fill="#2a2a2a" stroke={INK} strokeWidth={2} />
        <RCircle cx={cx - 6} cy={cy - 2} d={9} fill="#cfe6ef" stroke={INK} strokeWidth={1.6} />
        <RCircle cx={cx + 6} cy={cy - 2} d={9} fill="#cfe6ef" stroke={INK} strokeWidth={1.6} />
        <RPath d={`M ${cx - 6} ${cy + 6} Q ${cx} ${cy + 9} ${cx} ${cy + 6} Q ${cx} ${cy + 9} ${cx + 6} ${cy + 6}`} fill={INK} stroke={INK} strokeWidth={1.2} />
      </>
    );
  }
  // normal: a little tuft of hair
  return (
    <>
      <RLine x1={cx - 8} y1={cy - r + 2} x2={cx - 10} y2={cy - r - 5} stroke={INK} strokeWidth={2} />
      <RLine x1={cx - 1} y1={cy - r} x2={cx - 2} y2={cy - r - 7} stroke={INK} strokeWidth={2} />
      <RLine x1={cx + 6} y1={cy - r + 1} x2={cx + 7} y2={cy - r - 5} stroke={INK} strokeWidth={2} />
    </>
  );
};

export const Mascot: React.FC<{ pose?: Pose; expression?: Expression; variant?: Variant; width: number; height: number; idle?: boolean }> = ({
  pose = "stand", expression, variant = "normal", width, height, idle = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = POSES[pose];
  const expr = expression ?? DEFAULT_EXPRESSION[pose];
  const bob = idle ? Math.sin((frame / fps) * 2 * Math.PI * 0.5) * 1.1 : 0;
  const [hx, hy] = p.head;
  const LW = 5;

  return (
    <svg width={width} height={height} viewBox="0 0 100 170" preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(0 ${bob})`}>
        {/* body */}
        <RPath d={`M ${p.neck[0]} ${p.neck[1]} L ${p.pelvis[0]} ${p.pelvis[1]}`} stroke={INK} strokeWidth={LW} />
        <RPath d={`M ${SH_L[0]} ${SH_L[1]} L ${SH_R[0]} ${SH_R[1]}`} stroke={INK} strokeWidth={LW} />
        <RPath d={`M ${SH_L[0]} ${SH_L[1]} L ${p.arms.Lel[0]} ${p.arms.Lel[1]} L ${p.arms.Lwr[0]} ${p.arms.Lwr[1]}`} stroke={INK} strokeWidth={LW} />
        <RPath d={`M ${SH_R[0]} ${SH_R[1]} L ${p.arms.Rel[0]} ${p.arms.Rel[1]} L ${p.arms.Rwr[0]} ${p.arms.Rwr[1]}`} stroke={INK} strokeWidth={LW} />
        <RPath d={`M ${p.pelvis[0]} ${p.pelvis[1]} L ${p.legs.Lkn[0]} ${p.legs.Lkn[1]} L ${p.legs.Lan[0]} ${p.legs.Lan[1]}`} stroke={INK} strokeWidth={LW} />
        <RPath d={`M ${p.pelvis[0]} ${p.pelvis[1]} L ${p.legs.Rkn[0]} ${p.legs.Rkn[1]} L ${p.legs.Ran[0]} ${p.legs.Ran[1]}`} stroke={INK} strokeWidth={LW} />
        {/* hands + feet */}
        {[p.arms.Lwr, p.arms.Rwr, p.legs.Lan, p.legs.Ran].map((pt, i) => (
          <circle key={i} cx={pt[0]} cy={pt[1]} r={3} fill={INK} />
        ))}
        {/* head + face */}
        <RCircle cx={hx} cy={hy} d={HEAD_R * 2} fill="#fff" stroke={INK} strokeWidth={3} />
        <Face cx={hx} cy={hy} expr={expr} />
        <Accessory cx={hx} cy={hy} variant={variant} />
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
