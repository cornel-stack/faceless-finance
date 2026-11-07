import React from "react";
import { theme } from "../theme";

// Code-drawn, flat-color doodle props with black outlines — the Casual Finance
// prop language. No generative AI; pure SVG. Each drawn in a 100×100 viewBox.
export type DoodleName =
  | "coins" | "moneybag" | "house" | "bank" | "piggybank"
  | "dollar" | "chartup" | "chartdown" | "warning";

const INK = theme.ink;
const GOLD = "#e8b73a";
const GREEN = "#5aa469";
const RED = theme.accent;
const PINK = "#e79ab0";
const TAN = "#d8c29a";
const YELLOW = "#f2c744";

const SW = 4.5; // outline weight
const base = { stroke: INK, strokeWidth: SW, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function shape(name: DoodleName): React.ReactNode {
  switch (name) {
    case "coins":
      return (
        <g {...base}>
          {[74, 58, 42].map((cy, i) => (
            <ellipse key={i} cx={50} cy={cy} rx={30} ry={10} fill={GOLD} />
          ))}
          <text x={50} y={47} fontSize={16} fontWeight={900} fill={INK} textAnchor="middle" stroke="none">$</text>
        </g>
      );
    case "moneybag":
      return (
        <g {...base}>
          <path d="M34 34 Q50 22 66 34 L60 40 Q74 58 70 78 Q66 92 50 92 Q34 92 30 78 Q26 58 40 40 Z" fill={TAN} />
          <path d="M36 33 L64 33" strokeWidth={6} />
          <text x={50} y={72} fontSize={28} fontWeight={900} fill={INK} textAnchor="middle" stroke="none">$</text>
        </g>
      );
    case "house":
      return (
        <g {...base}>
          <rect x={28} y={52} width={44} height={36} fill="#fff" />
          <path d="M22 54 L50 30 L78 54 Z" fill={RED} />
          <rect x={44} y={66} width={14} height={22} fill={INK} stroke="none" />
          <rect x={33} y={58} width={9} height={9} fill="#bcd3e0" />
        </g>
      );
    case "bank":
      return (
        <g {...base}>
          <path d="M20 42 L50 24 L80 42 Z" fill="#fff" />
          <rect x={24} y={46} width={52} height={4} fill="#fff" />
          {[32, 46, 60].map((x) => (
            <rect key={x} x={x} y={52} width={8} height={28} fill="#fff" />
          ))}
          <rect x={22} y={82} width={56} height={6} fill="#fff" />
          <text x={50} y={40} fontSize={11} fontWeight={900} fill={INK} textAnchor="middle" stroke="none">$</text>
        </g>
      );
    case "piggybank":
      return (
        <g {...base}>
          <ellipse cx={52} cy={58} rx={32} ry={24} fill={PINK} />
          <ellipse cx={24} cy={54} rx={12} ry={11} fill={PINK} />
          <circle cx={20} cy={54} r={4} fill="#c76f8c" stroke="none" />
          <circle cx={22} cy={52} r={1.6} fill={INK} stroke="none" />
          <path d="M40 38 L48 46" strokeWidth={5} fill="none" />
          <rect x={48} y={38} width={14} height={4} fill={INK} stroke="none" />
          {[40, 64].map((x) => <rect key={x} x={x} y={78} width={8} height={10} fill={PINK} />)}
          <circle cx={66} cy={56} r={2} fill={INK} stroke="none" />
        </g>
      );
    case "dollar":
      return (
        <g {...base}>
          <rect x={16} y={34} width={68} height={38} rx={4} fill={GREEN} />
          <circle cx={50} cy={53} r={13} fill="none" stroke={INK} strokeWidth={3} />
          <text x={50} y={60} fontSize={20} fontWeight={900} fill={INK} textAnchor="middle" stroke="none">$</text>
        </g>
      );
    case "chartup":
      return (
        <g {...base}>
          {[[28, 70, 14], [44, 60, 24], [60, 46, 38]].map(([x, y, h], i) => (
            <rect key={i} x={x} y={y} width={10} height={h} fill={GREEN} />
          ))}
          <path d="M24 64 L44 50 L58 56 L80 28" fill="none" stroke={GREEN} strokeWidth={5} />
          <path d="M80 28 L68 30 M80 28 L78 40" stroke={GREEN} strokeWidth={5} />
        </g>
      );
    case "chartdown":
      return (
        <g {...base}>
          {[[28, 36, 14], [44, 44, 24], [60, 52, 30]].map(([x, y, h], i) => (
            <rect key={i} x={x} y={y} width={10} height={h} fill="#d98b84" />
          ))}
          <path d="M24 32 L44 46 L58 40 L80 72" fill="none" stroke={RED} strokeWidth={5} />
          <path d="M80 72 L68 70 M80 72 L78 60" stroke={RED} strokeWidth={5} />
        </g>
      );
    case "warning":
      return (
        <g {...base}>
          <path d="M50 22 L84 82 L16 82 Z" fill={YELLOW} />
          <rect x={46} y={46} width={8} height={20} rx={3} fill={INK} stroke="none" />
          <circle cx={50} cy={74} r={4} fill={INK} stroke="none" />
        </g>
      );
  }
}

export const Doodle: React.FC<{ name: DoodleName; size?: number }> = ({ name, size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {shape(name)}
  </svg>
);
