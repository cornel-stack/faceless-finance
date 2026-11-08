import React from "react";
import { RPath, RRect, RCircle, REllipse, RLine } from "../motion/rough";

// Hand-drawn doodle props, rendered through Rough.js — wobbly outlines + solid
// hand-coloured fills. No generative AI; pure code. Each in a 100×100 viewBox.
export type DoodleName =
  | "coins" | "moneybag" | "house" | "bank" | "piggybank"
  | "dollar" | "chartup" | "chartdown" | "warning";

const INK = "#17120f";
const GOLD = "#e8b73a";
const GREEN = "#5aa469";
const RED = "#c0392b";
const PINK = "#e79ab0";
const TAN = "#d8c29a";
const YELLOW = "#f2c744";

const SW = 2.4;

function shape(name: DoodleName): React.ReactNode {
  switch (name) {
    case "coins":
      return (
        <>
          <REllipse cx={50} cy={74} w={58} h={19} fill={GOLD} strokeWidth={SW} />
          <REllipse cx={50} cy={58} w={58} h={19} fill={GOLD} strokeWidth={SW} />
          <REllipse cx={50} cy={42} w={58} h={19} fill={GOLD} strokeWidth={SW} />
          <text x={50} y={47} fontSize={16} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "moneybag":
      return (
        <>
          <RPath d="M34 34 Q50 22 66 34 L60 40 Q74 58 70 78 Q66 92 50 92 Q34 92 30 78 Q26 58 40 40 Z" fill={TAN} strokeWidth={SW} />
          <RLine x1={36} y1={33} x2={64} y2={33} strokeWidth={4} />
          <text x={50} y={72} fontSize={28} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "house":
      return (
        <>
          <RRect x={28} y={52} w={44} h={34} fill="#fff" strokeWidth={SW} />
          <RPath d="M22 54 L50 30 L78 54 Z" fill={RED} strokeWidth={SW} />
          <RRect x={44} y={64} w={14} h={22} fill={INK} fillStyle="solid" strokeWidth={SW} />
          <RRect x={33} y={58} w={9} h={9} fill="#bcd3e0" strokeWidth={1.8} />
        </>
      );
    case "bank":
      return (
        <>
          <RPath d="M20 42 L50 24 L80 42 Z" fill="#fff" strokeWidth={SW} />
          <RLine x1={24} y1={48} x2={76} y2={48} strokeWidth={SW} />
          <RRect x={30} y={52} w={7} h={28} fill="#fff" strokeWidth={2} />
          <RRect x={46} y={52} w={7} h={28} fill="#fff" strokeWidth={2} />
          <RRect x={62} y={52} w={7} h={28} fill="#fff" strokeWidth={2} />
          <RRect x={22} y={82} w={56} h={6} fill="#fff" strokeWidth={SW} />
          <text x={50} y={40} fontSize={11} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "piggybank":
      return (
        <>
          <REllipse cx={52} cy={58} w={62} h={46} fill={PINK} strokeWidth={SW} />
          <REllipse cx={24} cy={54} w={22} h={20} fill={PINK} strokeWidth={2} />
          <RCircle cx={20} cy={54} d={7} fill="#c76f8c" strokeWidth={1.6} />
          <RPath d="M44 40 L52 48" strokeWidth={3} />
          <RRect x={48} y={37} w={14} h={4} fill={INK} strokeWidth={1.6} />
          <RRect x={40} y={78} w={8} h={10} fill={PINK} strokeWidth={2} />
          <RRect x={62} y={78} w={8} h={10} fill={PINK} strokeWidth={2} />
          <circle cx={66} cy={54} r={2.2} fill={INK} />
          <circle cx={22} cy={52} r={1.6} fill={INK} />
        </>
      );
    case "dollar":
      return (
        <>
          <RRect x={16} y={34} w={68} h={38} fill={GREEN} strokeWidth={SW} />
          <RCircle cx={50} cy={53} d={26} strokeWidth={2} />
          <text x={50} y={60} fontSize={20} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "chartup":
      return (
        <>
          <RRect x={28} y={70} w={10} h={14} fill={GREEN} strokeWidth={2} />
          <RRect x={44} y={60} w={10} h={24} fill={GREEN} strokeWidth={2} />
          <RRect x={60} y={46} w={10} h={38} fill={GREEN} strokeWidth={2} />
          <RPath d="M24 64 L44 50 L58 56 L80 28" stroke={GREEN} strokeWidth={4} />
          <RPath d="M80 28 L68 30 M80 28 L78 40" stroke={GREEN} strokeWidth={4} />
        </>
      );
    case "chartdown":
      return (
        <>
          <RRect x={28} y={36} w={10} h={14} fill="#d98b84" strokeWidth={2} />
          <RRect x={44} y={44} w={10} h={24} fill="#d98b84" strokeWidth={2} />
          <RRect x={60} y={52} w={10} h={30} fill="#d98b84" strokeWidth={2} />
          <RPath d="M24 32 L44 46 L58 40 L80 72" stroke={RED} strokeWidth={4} />
          <RPath d="M80 72 L68 70 M80 72 L78 60" stroke={RED} strokeWidth={4} />
        </>
      );
    case "warning":
      return (
        <>
          <RPath d="M50 22 L84 82 L16 82 Z" fill={YELLOW} strokeWidth={SW} />
          <RRect x={46} y={46} w={8} h={20} fill={INK} strokeWidth={1.6} />
          <RCircle cx={50} cy={74} d={8} fill={INK} strokeWidth={1.6} />
        </>
      );
  }
}

export const Doodle: React.FC<{ name: DoodleName; size?: number }> = ({ name, size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {shape(name)}
  </svg>
);
