import React from "react";
import { RPath, RRect, RCircle, REllipse, RLine } from "../motion/rough";
import { Flag, Country } from "./Flag";

// Hand-drawn doodle props, rendered through Rough.js — wobbly outlines + solid
// hand-coloured fills. No generative AI; pure code. Each in a 100×100 viewBox.
// Every doodle gets a gentle idle micro-animation so nothing sits dead-still.
export type DoodleName =
  | "coins" | "moneybag" | "house" | "bank" | "piggybank"
  | "dollar" | "chartup" | "chartdown" | "warning"
  | "globe" | "officetower" | "capitol" | "flag" | "bomb"
  | "printer" | "iou" | "chain" | "crowd" | "scale"
  | "debtclock" | "newspaper" | "bond" | "refinance" | "tank"
  | "flagJP" | "flagUS" | "flagCN" | "flagGB" | "flagGR" | "flagAR" | "flagLK" | "flagEU";

const FLAG_MAP: Partial<Record<DoodleName, Country>> = {
  flagJP: "jp", flagUS: "us", flagCN: "cn", flagGB: "gb", flagGR: "gr", flagAR: "ar", flagLK: "lk", flagEU: "eu",
};

const INK = "#17120f";
const GOLD = "#e8b73a";
const GREEN = "#5aa469";
const RED = "#c0392b";
const PINK = "#e79ab0";
const TAN = "#d8c29a";
const YELLOW = "#f2c744";
const ARMY = "#6f7a3f";
const PARCH = "#fbf3d9";

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
    case "globe":
      return (
        <>
          <RCircle cx={50} cy={52} d={70} fill="#9bc6e3" strokeWidth={SW} />
          <RPath d="M28 40 Q40 34 50 42 Q56 50 46 56 Q36 60 30 52 Z" fill={GREEN} strokeWidth={1.6} />
          <RPath d="M58 62 Q70 58 72 68 Q66 76 58 70 Z" fill={GREEN} strokeWidth={1.6} />
          <RPath d="M18 52 Q50 44 82 52" stroke={INK} strokeWidth={1.4} />
          <RPath d="M50 18 Q40 52 50 86" stroke={INK} strokeWidth={1.4} />
        </>
      );
    case "officetower":
      return (
        <>
          <RRect x={34} y={18} w={32} h={70} fill="#9aa6ad" strokeWidth={SW} />
          {[26, 40, 54, 68].flatMap((y) => [40, 52].map((x) => (
            <RRect key={`${x}-${y}`} x={x} y={y} w={8} h={8} fill="#cfe6ef" strokeWidth={1.4} />
          )))}
        </>
      );
    case "capitol":
      return (
        <>
          <REllipse cx={50} cy={34} w={24} h={16} fill="#eef0f1" strokeWidth={SW} />
          <RRect x={47} y={22} w={6} h={9} fill="#eef0f1" strokeWidth={2} />
          <RRect x={24} y={46} w={52} h={6} fill="#fff" strokeWidth={SW} />
          {[28, 40, 52, 64].map((x) => <RRect key={x} x={x} y={52} w={6} h={24} fill="#fff" strokeWidth={1.8} />)}
          <RRect x={20} y={78} w={60} h={8} fill="#fff" strokeWidth={SW} />
        </>
      );
    case "flag":
      return (
        <>
          <RPath d="M28 14 L28 88" stroke={INK} strokeWidth={SW} />
          <RRect x={28} y={16} w={40} h={26} fill={RED} strokeWidth={SW} />
        </>
      );
    case "bomb":
      return (
        <>
          <RCircle cx={46} cy={62} d={50} fill="#2a2a2a" strokeWidth={SW} />
          <RRect x={42} y={30} w={9} h={9} fill="#2a2a2a" strokeWidth={2} />
          <RPath d="M51 32 Q62 20 68 28" stroke={INK} strokeWidth={2.6} />
          <RPath d="M68 26 L73 22 M68 28 L74 29 M68 28 L67 34" stroke={RED} strokeWidth={2.2} />
        </>
      );
    case "printer":
      return (
        <>
          <RRect x={40} y={30} w={20} h={20} fill={GREEN} strokeWidth={2} />
          <text x={50} y={45} fontSize={13} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">$</text>
          <RRect x={26} y={50} w={48} h={32} fill="#9aa6ad" strokeWidth={SW} />
          <RRect x={31} y={58} w={13} h={5} fill="#cfe6ef" strokeWidth={1.4} />
        </>
      );
    case "iou":
      return (
        <>
          <RRect x={30} y={20} w={40} h={58} fill="#fff" strokeWidth={SW} />
          <text x={50} y={40} fontSize={16} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">IOU</text>
          {[52, 62, 72].map((y) => <RPath key={y} d={`M37 ${y} L63 ${y}`} stroke={INK} strokeWidth={1.6} />)}
        </>
      );
    case "chain":
      return (
        <>
          <REllipse cx={40} cy={52} w={24} h={36} fill="none" strokeWidth={5} />
          <REllipse cx={61} cy={52} w={24} h={36} fill="none" strokeWidth={5} />
        </>
      );
    case "crowd":
      return (
        <>
          {[30, 50, 70].map((x, i) => (
            <g key={x}>
              <RCircle cx={x} cy={44} d={17} fill={["#f4c7a1", "#e8c49a", "#f0cda6"][i]} strokeWidth={2} />
              <RPath d={`M${x - 10} 86 Q${x - 10} 60 ${x} 60 Q${x + 10} 60 ${x + 10} 86`} fill={[GREEN, RED, "#4a74b8"][i]} strokeWidth={2} />
            </g>
          ))}
        </>
      );
    case "scale":
      return (
        <>
          <RPath d="M50 22 L50 76" stroke={INK} strokeWidth={SW} />
          <RRect x={40} y={78} w={20} h={6} fill={TAN} strokeWidth={2} />
          <RPath d="M26 30 L74 30" stroke={INK} strokeWidth={SW} />
          <RPath d="M26 30 L19 46 L33 46 Z" fill={TAN} strokeWidth={2} />
          <RPath d="M74 30 L67 46 L81 46 Z" fill={TAN} strokeWidth={2} />
        </>
      );
    case "debtclock":
      return (
        <>
          <RRect x={12} y={30} w={76} h={40} fill="#15181c" strokeWidth={SW} />
          <text x={50} y={25} fontSize={9} fontWeight={700} fill={INK} textAnchor="middle" fontFamily="Arial, sans-serif">U.S. DEBT</text>
          <text x={50} y={57} fontSize={20} fontWeight={900} fill="#ff4133" textAnchor="middle" fontFamily="'Courier New', monospace">$40.0T</text>
        </>
      );
    case "newspaper":
      return (
        <>
          <RRect x={22} y={22} w={58} h={60} fill="#fff" strokeWidth={SW} />
          <text x={51} y={35} fontSize={9} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">THE TIMES</text>
          <RLine x1={27} y1={40} x2={75} y2={40} strokeWidth={1.4} />
          <text x={51} y={52} fontSize={12} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Georgia, serif">DEBT!</text>
          <RRect x={27} y={58} w={22} h={18} fill="#cdd8de" strokeWidth={1.4} />
          {[62, 68, 74].map((y) => <RLine key={y} x1={53} y1={y} x2={75} y2={y} strokeWidth={1.2} />)}
        </>
      );
    case "bond":
      return (
        <>
          <RRect x={16} y={26} w={68} h={48} fill={PARCH} strokeWidth={SW} />
          <text x={44} y={43} fontSize={13} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">BOND</text>
          <RLine x1={24} y1={50} x2={62} y2={50} strokeWidth={1.4} />
          <text x={34} y={68} fontSize={12} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif">$100</text>
          <RCircle cx={68} cy={62} d={16} fill={GOLD} strokeWidth={2} />
          <RPath d="M64 70 L62 80 L68 76 L74 80 L72 70 Z" fill={RED} strokeWidth={1.6} />
        </>
      );
    case "refinance":
      return (
        <>
          <RPath d="M74 44 A26 26 0 0 1 56 78" stroke={GREEN} strokeWidth={4} fill="none" />
          <RPath d="M56 78 L63 73 M56 78 L61 70" stroke={GREEN} strokeWidth={4} />
          <RPath d="M26 60 A26 26 0 0 1 44 26" stroke={GREEN} strokeWidth={4} fill="none" />
          <RPath d="M44 26 L37 31 M44 26 L39 34" stroke={GREEN} strokeWidth={4} />
          <text x={50} y={61} fontSize={24} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "tank":
      return (
        <>
          <REllipse cx={50} cy={74} w={64} h={16} fill="#444" strokeWidth={SW} />
          {[32, 50, 68].map((x) => <RCircle key={x} cx={x} cy={74} d={13} fill="#666" strokeWidth={1.6} />)}
          <RRect x={24} y={54} w={52} h={16} fill={ARMY} strokeWidth={SW} />
          <RRect x={40} y={42} w={22} h={14} fill={ARMY} strokeWidth={2} />
          <RLine x1={60} y1={48} x2={88} y2={44} strokeWidth={5} />
        </>
      );
  }
}

// Casual Finance style: doodles are STATIC drawings (no idle motion). Energy
// comes from cutting between shots, not from elements moving.
export const Doodle: React.FC<{ name: DoodleName; size?: number }> = ({ name, size = 120 }) => {
  const country = FLAG_MAP[name];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {country ? <Flag country={country} /> : shape(name)}
    </svg>
  );
};
