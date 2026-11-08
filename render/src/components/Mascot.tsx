import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { RPath, REllipse } from "../motion/rough";

// Casual Finance-style character: a big egg-shaped skin-toned head with messy
// scribbled hair, thick brows, simple solid eyes, no nose, a plain mouth — on a
// THIN stick body. Hand-drawn via Rough.js.

export type Pose = "stand" | "walk" | "point" | "think" | "surprised" | "celebrate";
export type Expression = "neutral" | "happy" | "worried" | "surprised";
export type Variant = "normal" | "villain" | "king";

type Pt = [number, number];
type PoseDef = { head: Pt; neck: Pt; pelvis: Pt; arms: { Lel: Pt; Lwr: Pt; Rel: Pt; Rwr: Pt }; legs: { Lkn: Pt; Lan: Pt; Rkn: Pt; Ran: Pt } };

const SH_L: Pt = [42, 56];
const SH_R: Pt = [58, 56];
const INK = "#17120f";
const SKIN = "#f4c7a1";
const HEAD_W = 42;
const HEAD_H = 50;

const POSES: Record<Pose, PoseDef> = {
  stand: { head: [50, 28], neck: [50, 48], pelvis: [50, 104], arms: { Lel: [34, 78], Lwr: [31, 100], Rel: [66, 78], Rwr: [69, 100] }, legs: { Lkn: [44, 134], Lan: [42, 166], Rkn: [56, 134], Ran: [58, 166] } },
  walk: { head: [50, 28], neck: [50, 48], pelvis: [50, 104], arms: { Lel: [36, 76], Lwr: [32, 96], Rel: [64, 80], Rwr: [68, 100] }, legs: { Lkn: [46, 132], Lan: [37, 164], Rkn: [57, 134], Ran: [66, 166] } },
  point: { head: [50, 28], neck: [50, 48], pelvis: [50, 104], arms: { Lel: [34, 78], Lwr: [31, 100], Rel: [72, 50], Rwr: [94, 40] }, legs: { Lkn: [44, 134], Lan: [42, 166], Rkn: [56, 134], Ran: [58, 166] } },
  think: { head: [48, 28], neck: [49, 48], pelvis: [50, 104], arms: { Lel: [40, 80], Lwr: [53, 90], Rel: [64, 76], Rwr: [54, 50] }, legs: { Lkn: [44, 134], Lan: [42, 166], Rkn: [56, 134], Ran: [58, 166] } },
  surprised: { head: [50, 28], neck: [50, 48], pelvis: [50, 104], arms: { Lel: [32, 44], Lwr: [24, 26], Rel: [68, 44], Rwr: [76, 26] }, legs: { Lkn: [43, 134], Lan: [38, 166], Rkn: [57, 134], Ran: [62, 166] } },
  celebrate: { head: [50, 26], neck: [50, 46], pelvis: [50, 102], arms: { Lel: [34, 36], Lwr: [28, 16], Rel: [66, 36], Rwr: [72, 16] }, legs: { Lkn: [45, 130], Lan: [43, 158], Rkn: [56, 130], Ran: [59, 158] } },
};

const DEFAULT_EXPRESSION: Record<Pose, Expression> = {
  stand: "neutral", walk: "neutral", point: "happy", think: "worried", surprised: "surprised", celebrate: "happy",
};

const Face: React.FC<{ cx: number; cy: number; expr: Expression }> = ({ cx, cy, expr }) => {
  const eyeDx = 9.5;
  const eyeY = cy - 6;
  const browY = expr === "surprised" ? cy - 17 : cy - 14;
  const eyeR = expr === "surprised" ? 5 : 4.2;

  const brows =
    expr === "worried"
      ? [`M ${cx - 15} ${browY - 1} L ${cx - 4} ${browY + 4}`, `M ${cx + 4} ${browY + 4} L ${cx + 15} ${browY - 1}`]
      : expr === "happy"
      ? [`M ${cx - 15} ${browY + 2} Q ${cx - 9} ${browY - 3} ${cx - 3} ${browY}`, `M ${cx + 3} ${browY} Q ${cx + 9} ${browY - 3} ${cx + 15} ${browY + 2}`]
      : [`M ${cx - 15} ${browY} Q ${cx - 9} ${browY - 3} ${cx - 3} ${browY - 1}`, `M ${cx + 3} ${browY - 1} Q ${cx + 9} ${browY - 3} ${cx + 15} ${browY}`];

  return (
    <>
      {/* eyes — simple solid almonds, no whites/pupils */}
      <ellipse cx={cx - eyeDx} cy={eyeY} rx={eyeR * 0.74} ry={eyeR} fill={INK} />
      <ellipse cx={cx + eyeDx} cy={eyeY} rx={eyeR * 0.74} ry={eyeR} fill={INK} />
      {/* thick brows */}
      {brows.map((d, i) => <RPath key={i} d={d} stroke={INK} strokeWidth={3.4} roughness={0.9} />)}
      {/* mouth (no nose), sits low with chin below */}
      {expr === "neutral" && <RPath d={`M ${cx - 9} ${cy + 10} Q ${cx} ${cy + 12} ${cx + 9} ${cy + 10}`} stroke={INK} strokeWidth={3} roughness={0.9} />}
      {expr === "happy" && <RPath d={`M ${cx - 11} ${cy + 7} Q ${cx} ${cy + 19} ${cx + 11} ${cy + 7}`} stroke={INK} strokeWidth={3} roughness={0.9} />}
      {expr === "worried" && <RPath d={`M ${cx - 9} ${cy + 14} Q ${cx} ${cy + 9} ${cx + 9} ${cy + 14}`} stroke={INK} strokeWidth={3} roughness={0.9} />}
      {expr === "surprised" && <REllipse cx={cx} cy={cy + 13} w={10} h={12} fill={INK} stroke={INK} strokeWidth={1.6} />}
    </>
  );
};

const Hair: React.FC<{ cx: number; cy: number; variant: Variant }> = ({ cx, cy, variant }) => {
  const top = cy - HEAD_H / 2;
  if (variant === "king") {
    return <RPath d={`M ${cx - 17} ${top + 3} L ${cx - 17} ${top - 12} L ${cx - 9} ${top - 4} L ${cx} ${top - 15} L ${cx + 9} ${top - 4} L ${cx + 17} ${top - 12} L ${cx + 17} ${top + 3} Z`} fill="#e8b73a" stroke={INK} strokeWidth={2.2} />;
  }
  if (variant === "villain") {
    return (
      <>
        <REllipse cx={cx} cy={top + 6} w={HEAD_W + 14} h={9} fill="#2a2a2a" stroke={INK} strokeWidth={2} />
        <RPath d={`M ${cx - 12} ${top + 5} Q ${cx - 12} ${top - 12} ${cx} ${top - 12} Q ${cx + 12} ${top - 12} ${cx + 12} ${top + 5} Z`} fill="#2a2a2a" stroke={INK} strokeWidth={2} />
      </>
    );
  }
  // messy scribbled hair — tall and spiky on top, fringe over the forehead
  const hair = `M ${cx - 22} ${cy - 3}
    C ${cx - 29} ${cy - 24} ${cx - 20} ${cy - 40} ${cx - 10} ${cy - 33}
    C ${cx - 6} ${cy - 44} ${cx + 4} ${cy - 42} ${cx + 6} ${cy - 33}
    C ${cx + 16} ${cy - 42} ${cx + 26} ${cy - 30} ${cx + 21} ${cy - 3}
    C ${cx + 13} ${cy - 14} ${cx + 8} ${cy - 11} ${cx + 4} ${cy - 15}
    C ${cx} ${cy - 10} ${cx - 4} ${cy - 10} ${cx - 8} ${cy - 15}
    C ${cx - 13} ${cy - 11} ${cx - 17} ${cy - 12} ${cx - 22} ${cy - 3} Z`;
  return (
    <>
      <RPath d={hair} fill={INK} fillStyle="solid" stroke={INK} strokeWidth={2.6} roughness={2.4} bowing={2.5} />
      <RPath d={`M ${cx - 12} ${cy - 33} L ${cx - 16} ${cy - 44}`} stroke={INK} strokeWidth={2.6} roughness={1.5} />
      <RPath d={`M ${cx - 2} ${cy - 37} L ${cx - 3} ${cy - 48}`} stroke={INK} strokeWidth={2.6} roughness={1.5} />
      <RPath d={`M ${cx + 8} ${cy - 34} L ${cx + 12} ${cy - 45}`} stroke={INK} strokeWidth={2.6} roughness={1.5} />
      <RPath d={`M ${cx + 16} ${cy - 30} L ${cx + 21} ${cy - 39}`} stroke={INK} strokeWidth={2.6} roughness={1.5} />
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
  const bob = idle ? Math.sin((frame / fps) * 2 * Math.PI * 0.5) * 1 : 0;
  const [hx, hy] = p.head;
  const LW = 3.4; // thin stick body

  return (
    <svg width={width} height={height} viewBox="0 0 100 175" preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(0 ${bob})`}>
        {/* thin stick body */}
        <RPath d={`M ${p.neck[0]} ${p.neck[1]} L ${p.pelvis[0]} ${p.pelvis[1]}`} stroke={INK} strokeWidth={LW} />
        <RPath d={`M ${SH_L[0]} ${SH_L[1]} L ${p.arms.Lel[0]} ${p.arms.Lel[1]} L ${p.arms.Lwr[0]} ${p.arms.Lwr[1]}`} stroke={INK} strokeWidth={LW} />
        <RPath d={`M ${SH_R[0]} ${SH_R[1]} L ${p.arms.Rel[0]} ${p.arms.Rel[1]} L ${p.arms.Rwr[0]} ${p.arms.Rwr[1]}`} stroke={INK} strokeWidth={LW} />
        <RPath d={`M ${p.pelvis[0]} ${p.pelvis[1]} L ${p.legs.Lkn[0]} ${p.legs.Lkn[1]} L ${p.legs.Lan[0]} ${p.legs.Lan[1]}`} stroke={INK} strokeWidth={LW} />
        <RPath d={`M ${p.pelvis[0]} ${p.pelvis[1]} L ${p.legs.Rkn[0]} ${p.legs.Rkn[1]} L ${p.legs.Ran[0]} ${p.legs.Ran[1]}`} stroke={INK} strokeWidth={LW} />
        {[p.arms.Lwr, p.arms.Rwr, p.legs.Lan, p.legs.Ran].map((pt, i) => (
          <circle key={i} cx={pt[0]} cy={pt[1]} r={2.4} fill={INK} />
        ))}
        {/* big egg head (wider jaw, narrower top) + face + hair */}
        <RPath
          d={`M ${hx} ${hy - 25} C ${hx + 15} ${hy - 25} ${hx + 23} ${hy - 10} ${hx + 24} ${hy + 3} C ${hx + 25} ${hy + 16} ${hx + 17} ${hy + 28} ${hx} ${hy + 28} C ${hx - 17} ${hy + 28} ${hx - 25} ${hy + 16} ${hx - 24} ${hy + 3} C ${hx - 23} ${hy - 10} ${hx - 15} ${hy - 25} ${hx} ${hy - 25} Z`}
          fill={SKIN} stroke={INK} strokeWidth={3.4}
        />
        <Face cx={hx} cy={hy} expr={expr} />
        <Hair cx={hx} cy={hy} variant={variant} />
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
