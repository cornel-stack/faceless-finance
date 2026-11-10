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
  | "creditcard" | "taxform" | "hospital" | "school" | "factory"
  | "retiree" | "baby" | "handshake" | "goldbar" | "pricetag"
  | "domino" | "cheque" | "clock" | "oilbarrel" | "percent" | "bridge"
  | "forsale" | "sold" | "keys" | "mortgage" | "apartment" | "crane"
  | "hardhat" | "padlock" | "lockhouse" | "calculator" | "blueprint"
  | "paystub" | "couple" | "movingbox"
  | "gaspump" | "ticker" | "gauge" | "bubble" | "calendar"
  | "crookedE" | "shredder" | "houseofcards" | "shellbox" | "handcuffs"
  | "magichat" | "trophy" | "prison"
  | "token" | "yacht" | "island" | "laptop" | "chip" | "rocket" | "phone" | "vault"
  // EP016 (currencies) additions:
  | "euro" | "yen" | "pound" | "exchange" | "candles" | "basket" | "anchor" | "magnet" | "wheelbarrow" | "banknote"
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
    case "creditcard":
      return (
        <>
          <RRect x={16} y={34} w={68} h={44} fill="#4a74b8" strokeWidth={SW} />
          <RRect x={16} y={42} w={68} h={9} fill={INK} strokeWidth={0} />
          <RRect x={25} y={58} w={15} h={11} fill={GOLD} strokeWidth={1.6} />
          <RLine x1={46} y1={64} x2={76} y2={64} strokeWidth={2} />
          <RLine x1={46} y1={70} x2={68} y2={70} strokeWidth={2} />
        </>
      );
    case "taxform":
      return (
        <>
          <RRect x={28} y={18} w={44} h={64} fill="#fff" strokeWidth={SW} />
          <text x={50} y={36} fontSize={15} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Georgia, serif">TAX</text>
          <RLine x1={34} y1={44} x2={66} y2={44} strokeWidth={1.4} />
          {[52, 60, 68].map((y) => <RLine key={y} x1={34} y1={y} x2={62} y2={y} strokeWidth={1.3} />)}
          <RRect x={60} y={64} w={8} h={8} fill="none" strokeWidth={1.6} />
        </>
      );
    case "hospital":
      return (
        <>
          <RRect x={26} y={40} w={48} h={44} fill="#fff" strokeWidth={SW} />
          {[32, 46, 60].map((x) => [48, 62].map((y) => <RRect key={`${x}-${y}`} x={x} y={y} w={8} h={8} fill="#cfe6ef" strokeWidth={1.3} />))}
          <RRect x={44} y={72} w={12} h={12} fill="#9aa6ad" strokeWidth={1.6} />
          <RRect x={40} y={22} w={20} h={18} fill="#fff" strokeWidth={2} />
          <RRect x={48} y={25} w={4} h={12} fill={RED} strokeWidth={0} />
          <RRect x={44} y={29} w={12} h={4} fill={RED} strokeWidth={0} />
        </>
      );
    case "school":
      return (
        <>
          <RRect x={24} y={48} w={52} h={36} fill="#f1d7a0" strokeWidth={SW} />
          <RPath d="M20 48 L50 30 L80 48 Z" fill={RED} strokeWidth={SW} />
          <RRect x={47} y={22} w={6} h={10} fill={INK} strokeWidth={1.4} />
          <RRect x={44} y={66} w={14} h={18} fill="#8a5a33" strokeWidth={1.6} />
          {[32, 64].map((x) => <RRect key={x} x={x} y={56} w={9} h={9} fill="#cfe6ef" strokeWidth={1.3} />)}
          <text x={50} y={46} fontSize={8} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">ABC</text>
        </>
      );
    case "factory":
      return (
        <>
          <RRect x={22} y={52} w={58} h={32} fill="#9aa6ad" strokeWidth={SW} />
          <RPath d="M22 52 L32 44 L32 52 L42 44 L42 52 L52 44 L52 52" stroke={INK} strokeWidth={SW} fill="none" />
          <RRect x={64} y={30} w={9} h={22} fill="#7f8a90" strokeWidth={2} />
          {[[70, 24], [76, 20], [73, 16]].map(([x, y], i) => <RCircle key={i} cx={x} cy={y} d={8 + i * 2} fill="#d7dde0" strokeWidth={1.2} />)}
          {[30, 44, 58].map((x) => <RRect key={x} x={x} y={62} w={9} h={10} fill="#cfe6ef" strokeWidth={1.3} />)}
        </>
      );
    case "retiree":
      return (
        <>
          <RCircle cx={44} cy={30} d={22} fill="#f0cda6" strokeWidth={2} />
          <RPath d="M33 26 Q44 14 55 26" stroke="#c9cdd1" strokeWidth={3} fill="none" />
          <RCircle cx={39} cy={30} d={7} fill="none" strokeWidth={1.4} />
          <RCircle cx={50} cy={30} d={7} fill="none" strokeWidth={1.4} />
          <RLine x1={42} y1={30} x2={47} y2={30} strokeWidth={1.2} />
          <RPath d="M32 86 Q32 52 44 52 Q56 52 56 86" fill="#8a7f72" strokeWidth={2} />
          <RLine x1={64} y1={52} x2={68} y2={88} strokeWidth={3} />
        </>
      );
    case "baby":
      return (
        <>
          <RCircle cx={50} cy={42} d={40} fill="#f6d2b0" strokeWidth={2} />
          <RPath d="M50 22 Q56 18 52 26" stroke={INK} strokeWidth={2.4} fill="none" />
          <circle cx={42} cy={42} r={2.4} fill={INK} />
          <circle cx={58} cy={42} r={2.4} fill={INK} />
          <RPath d="M44 50 Q50 55 56 50" stroke={INK} strokeWidth={2} fill="none" />
          <RPath d="M34 88 Q34 64 50 64 Q66 64 66 88" fill="#bfe0ef" strokeWidth={2} />
        </>
      );
    case "handshake":
      return (
        <>
          <RRect x={14} y={50} w={26} h={12} fill="#4a74b8" strokeWidth={2} />
          <RRect x={60} y={50} w={26} h={12} fill={GREEN} strokeWidth={2} />
          <REllipse cx={50} cy={56} w={30} h={20} fill="#f0cda6" strokeWidth={2} />
          {[48, 52, 56].map((x, i) => <RLine key={i} x1={x} y1={50} x2={x - 2} y2={62} strokeWidth={1.6} />)}
        </>
      );
    case "goldbar":
      return (
        <>
          <RPath d="M30 50 L58 50 L64 62 L24 62 Z" fill="#f0cf6b" strokeWidth={2} />
          <RPath d="M24 62 L64 62 L70 80 L18 80 Z" fill={GOLD} strokeWidth={SW} />
          <RPath d="M58 50 L64 62 L70 80" stroke="#caa227" strokeWidth={1.6} fill="none" />
        </>
      );
    case "pricetag":
      return (
        <>
          <RPath d="M24 34 L56 34 L78 56 L54 78 L24 78 Z" fill={YELLOW} strokeWidth={SW} />
          <RCircle cx={34} cy={46} d={8} fill="#fff" strokeWidth={1.6} />
          <text x={46} y={64} fontSize={20} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">$</text>
          <RPath d="M86 62 L86 40 M86 40 L80 48 M86 40 L92 48" stroke={RED} strokeWidth={3.4} fill="none" />
        </>
      );
    case "domino":
      return (
        <>
          <RRect x={20} y={44} w={12} h={40} fill="#fff" strokeWidth={SW} />
          <circle cx={26} cy={54} r={1.8} fill={INK} /><circle cx={26} cy={74} r={1.8} fill={INK} />
          <RPath d="M40 46 L50 42 L58 78 L48 82 Z" fill="#fff" strokeWidth={SW} />
          <RPath d="M58 50 L70 44 L82 76 L70 82 Z" fill="#fff" strokeWidth={SW} />
          <RPath d="M20 44 L36 40" stroke={INK} strokeWidth={2.2} fill="none" />
        </>
      );
    case "cheque":
      return (
        <>
          <RRect x={14} y={34} w={72} h={40} fill="#eaf3e8" strokeWidth={SW} />
          <text x={24} y={47} fontSize={8} fontWeight={700} fill={INK} textAnchor="start" fontFamily="Arial, sans-serif">PAY</text>
          <RLine x1={38} y1={47} x2={80} y2={47} strokeWidth={1.3} />
          <RRect x={58} y={52} w={22} h={13} fill="#fff" strokeWidth={1.6} />
          <text x={69} y={62} fontSize={11} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif">$</text>
          <RLine x1={20} y1={68} x2={48} y2={68} strokeWidth={1.3} />
        </>
      );
    case "clock":
      return (
        <>
          <RCircle cx={50} cy={52} d={60} fill="#fff" strokeWidth={SW} />
          {[[50, 26], [74, 52], [50, 78], [26, 52]].map(([x, y], i) => <RCircle key={i} cx={x} cy={y} d={3} fill={INK} strokeWidth={0} />)}
          <RLine x1={50} y1={52} x2={50} y2={32} strokeWidth={3.2} />
          <RLine x1={50} y1={52} x2={65} y2={59} strokeWidth={3.2} />
          <RCircle cx={50} cy={52} d={5} fill={INK} strokeWidth={0} />
        </>
      );
    case "oilbarrel":
      return (
        <>
          <RRect x={32} y={26} w={36} h={56} fill="#333" strokeWidth={SW} />
          <REllipse cx={50} cy={26} w={36} h={11} fill="#4a4a4a" strokeWidth={2} />
          <RLine x1={32} y1={44} x2={68} y2={44} strokeWidth={2} />
          <RLine x1={32} y1={64} x2={68} y2={64} strokeWidth={2} />
          <text x={50} y={60} fontSize={12} fontWeight={900} fill={GOLD} textAnchor="middle" fontFamily="Arial, sans-serif">OIL</text>
        </>
      );
    case "percent":
      return (
        <>
          <RCircle cx={50} cy={52} d={64} fill="#fff" strokeWidth={SW} />
          <text x={50} y={68} fontSize={46} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">%</text>
        </>
      );
    case "bridge":
      return (
        <>
          <RPath d="M12 40 Q50 72 88 40" stroke={INK} strokeWidth={3} fill="none" />
          <RLine x1={20} y1={30} x2={20} y2={70} strokeWidth={3} />
          <RLine x1={80} y1={30} x2={80} y2={70} strokeWidth={3} />
          {[30, 40, 50, 60, 70].map((x) => {
            const t = (x - 12) / 76; const cy = 40 + (1 - Math.pow(2 * t - 1, 2)) * 32;
            return <RLine key={x} x1={x} y1={cy} x2={x} y2={70} strokeWidth={1.6} />;
          })}
          <RRect x={10} y={70} w={80} h={7} fill="#b88b5a" strokeWidth={2} />
          <RPath d="M10 84 q10 -5 20 0 q10 5 20 0 q10 -5 20 0 q10 5 20 0" stroke="#79b4d6" strokeWidth={2.4} fill="none" />
        </>
      );
    case "forsale":
      return (
        <>
          <RLine x1={28} y1={56} x2={28} y2={88} strokeWidth={3} />
          <RLine x1={72} y1={56} x2={72} y2={88} strokeWidth={3} />
          <RRect x={18} y={30} w={64} h={30} fill="#fff" strokeWidth={SW} />
          <text x={50} y={43} fontSize={12} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Arial, sans-serif">FOR</text>
          <text x={50} y={55} fontSize={12} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Arial, sans-serif">SALE</text>
        </>
      );
    case "sold":
      return (
        <>
          <RLine x1={28} y1={56} x2={28} y2={88} strokeWidth={3} />
          <RLine x1={72} y1={56} x2={72} y2={88} strokeWidth={3} />
          <RRect x={18} y={30} w={64} h={30} fill={RED} strokeWidth={SW} />
          <text x={50} y={52} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Arial, sans-serif">SOLD</text>
        </>
      );
    case "keys":
      return (
        <>
          <RCircle cx={34} cy={40} d={26} fill="none" strokeWidth={5} stroke="#caa227" />
          <RCircle cx={34} cy={40} d={10} fill="none" strokeWidth={3} stroke="#caa227" />
          <RLine x1={44} y1={49} x2={80} y2={80} strokeWidth={6} stroke="#caa227" />
          <RLine x1={70} y1={70} x2={66} y2={62} strokeWidth={4} stroke="#caa227" />
          <RLine x1={80} y1={80} x2={84} y2={72} strokeWidth={4} stroke="#caa227" />
        </>
      );
    case "mortgage":
      return (
        <>
          <RRect x={26} y={16} w={48} h={68} fill="#fff" strokeWidth={SW} />
          <text x={50} y={30} fontSize={8.5} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">MORTGAGE</text>
          <RPath d="M39 48 L50 39 L61 48 Z" fill={RED} strokeWidth={1.4} />
          <RRect x={43} y={48} w={14} h={10} fill="#fff" strokeWidth={1.4} />
          <text x={50} y={76} fontSize={13} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Georgia, serif">7%</text>
        </>
      );
    case "apartment":
      return (
        <>
          <RRect x={30} y={18} w={40} h={68} fill="#d7b58a" strokeWidth={SW} />
          {[24, 36, 48, 60].flatMap((y) => [37, 50].map((x) => <RRect key={`${x}-${y}`} x={x} y={y} w={9} h={9} fill="#cfe6ef" strokeWidth={1.2} />))}
          <RRect x={45} y={74} w={10} h={12} fill="#8a5a33" strokeWidth={1.4} />
        </>
      );
    case "crane":
      return (
        <>
          <RLine x1={40} y1={22} x2={40} y2={86} strokeWidth={4} />
          <RLine x1={18} y1={28} x2={80} y2={28} strokeWidth={3} />
          <RLine x1={40} y1={20} x2={22} y2={28} strokeWidth={2} />
          <RLine x1={40} y1={20} x2={74} y2={28} strokeWidth={2} />
          <RRect x={16} y={25} w={8} h={7} fill={INK} strokeWidth={1.4} />
          <RLine x1={72} y1={28} x2={72} y2={46} strokeWidth={2} />
          <RRect x={66} y={46} w={12} h={9} fill={GOLD} strokeWidth={2} />
          <RRect x={32} y={86} w={16} h={5} fill={INK} strokeWidth={1.4} />
        </>
      );
    case "hardhat":
      return (
        <>
          <RPath d="M24 66 Q24 36 50 36 Q76 36 76 66 Z" fill={YELLOW} strokeWidth={SW} />
          <RRect x={18} y={64} w={64} h={8} fill={YELLOW} strokeWidth={2} />
          <RRect x={46} y={38} w={8} h={28} fill="#e0b400" strokeWidth={1.2} />
        </>
      );
    case "padlock":
      return (
        <>
          <RPath d="M36 52 L36 42 Q36 26 50 26 Q64 26 64 42 L64 52" fill="none" strokeWidth={5} />
          <RRect x={30} y={50} w={40} h={34} fill={GOLD} strokeWidth={SW} />
          <RCircle cx={50} cy={64} d={9} fill={INK} strokeWidth={1.2} />
          <RRect x={48} y={66} w={4} h={9} fill={INK} strokeWidth={1} />
        </>
      );
    case "lockhouse":
      return (
        <>
          <RRect x={22} y={44} w={44} h={36} fill="#fff" strokeWidth={SW} />
          <RPath d="M16 46 L44 24 L72 46 Z" fill={RED} strokeWidth={SW} />
          <RRect x={30} y={60} w={12} h={20} fill="#bcd3e0" strokeWidth={1.4} />
          <RPath d="M58 70 L58 63 Q58 55 67 55 Q76 55 76 63 L76 70" fill="none" strokeWidth={3.5} />
          <RRect x={54} y={69} w={26} h={19} fill={GOLD} strokeWidth={SW} />
          <RCircle cx={67} cy={78} d={5} fill={INK} strokeWidth={1} />
        </>
      );
    case "calculator":
      return (
        <>
          <RRect x={28} y={16} w={44} h={68} fill="#59707c" strokeWidth={SW} />
          <RRect x={33} y={22} w={34} h={15} fill="#cfe6ef" strokeWidth={1.4} />
          <text x={63} y={33} fontSize={9} fontWeight={700} fill={INK} textAnchor="end" fontFamily="'Courier New', monospace">$$$</text>
          {[44, 55, 66].flatMap((y) => [35, 46, 57].map((x) => <RRect key={`${x}-${y}`} x={x} y={y} w={8} h={7} fill="#e8e2d6" strokeWidth={1} />))}
        </>
      );
    case "blueprint":
      return (
        <>
          <RRect x={20} y={24} w={60} h={52} fill="#2f5597" strokeWidth={SW} />
          {[32, 44, 56, 68].map((x) => <RLine key={`v${x}`} x1={x} y1={26} x2={x} y2={74} strokeWidth={0.5} stroke="#6f93c4" />)}
          {[36, 48, 60].map((y) => <RLine key={`h${y}`} x1={22} y1={y} x2={78} y2={y} strokeWidth={0.5} stroke="#6f93c4" />)}
          <RPath d="M38 64 L38 46 L50 38 L62 46 L62 64 Z" fill="none" stroke="#fff" strokeWidth={2} />
        </>
      );
    case "paystub":
      return (
        <>
          <RRect x={22} y={30} w={56} h={40} fill="#eaf3e8" strokeWidth={SW} />
          <text x={30} y={43} fontSize={8} fontWeight={700} fill={INK} textAnchor="start" fontFamily="Arial, sans-serif">PAY</text>
          <RLine x1={28} y1={48} x2={72} y2={48} strokeWidth={1.3} />
          <text x={50} y={63} fontSize={13} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif">$3,200</text>
        </>
      );
    case "couple":
      return (
        <>
          {[38, 62].map((x, i) => (
            <g key={x}>
              <RCircle cx={x} cy={40} d={19} fill={["#f0cda6", "#e8c49a"][i]} strokeWidth={2} />
              <RPath d={`M${x - 11} 86 Q${x - 11} 58 ${x} 58 Q${x + 11} 58 ${x + 11} 86`} fill={[RED, "#4a74b8"][i]} strokeWidth={2} />
            </g>
          ))}
        </>
      );
    case "movingbox":
      return (
        <>
          <RPath d="M24 46 L50 56 L76 46 L76 76 L50 86 L24 76 Z" fill={TAN} strokeWidth={SW} />
          <RPath d="M24 46 L50 56 L76 46" fill="none" strokeWidth={1.6} />
          <RLine x1={50} y1={56} x2={50} y2={86} strokeWidth={1.6} />
          <RLine x1={40} y1={51} x2={60} y2={51} strokeWidth={2.4} stroke="#b58a50" />
        </>
      );
    case "gaspump":
      return (
        <>
          <RRect x={30} y={28} w={30} h={58} fill={RED} strokeWidth={SW} />
          <RRect x={35} y={34} w={20} h={13} fill="#cfe6ef" strokeWidth={1.4} />
          <text x={45} y={44} fontSize={8} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="'Courier New', monospace">$$$</text>
          <RLine x1={60} y1={38} x2={68} y2={38} strokeWidth={2.4} />
          <RPath d="M68 38 Q75 50 68 62 L64 72" stroke={INK} strokeWidth={3} fill="none" />
          <RRect x={60} y={70} w={9} h={9} fill="#333" strokeWidth={1.4} />
          <RRect x={26} y={86} w={38} h={5} fill={INK} strokeWidth={1.4} />
        </>
      );
    case "ticker":
      return (
        <>
          <RRect x={14} y={38} w={72} h={28} fill="#15181c" strokeWidth={SW} />
          <path d="M28 58 L33 46 L38 58 Z" fill="#3ddc6f" />
          <text x={44} y={57} fontSize={11} fill="#3ddc6f" fontFamily="'Courier New', monospace">+2.1</text>
          <path d="M62 46 L67 58 L72 46 Z" fill="#ff5a5a" />
          <text x={76} y={57} fontSize={9} fill="#ff5a5a" textAnchor="end" fontFamily="'Courier New', monospace" />
        </>
      );
    case "gauge":
      return (
        <>
          <RPath d="M20 70 A32 32 0 0 1 50 38" fill="none" stroke={GREEN} strokeWidth={6} />
          <RPath d="M50 38 A32 32 0 0 1 80 70" fill="none" stroke={RED} strokeWidth={6} />
          <RLine x1={50} y1={70} x2={73} y2={49} strokeWidth={3.4} />
          <RCircle cx={50} cy={70} d={8} fill={INK} strokeWidth={1.4} />
          <text x={50} y={88} fontSize={11} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Georgia, serif">HIGH</text>
        </>
      );
    case "bubble":
      return (
        <>
          <RCircle cx={48} cy={54} d={56} fill="#bfe0ef" strokeWidth={SW} />
          <RPath d="M34 42 Q40 33 50 36" stroke="#fff" strokeWidth={5} fill="none" />
          <RCircle cx={74} cy={34} d={12} fill="#bfe0ef" strokeWidth={1.8} />
        </>
      );
    case "calendar":
      return (
        <>
          <RRect x={22} y={26} w={56} h={54} fill="#fff" strokeWidth={SW} />
          <RRect x={22} y={26} w={56} h={15} fill={RED} strokeWidth={SW} />
          <RLine x1={35} y1={20} x2={35} y2={32} strokeWidth={3} />
          <RLine x1={65} y1={20} x2={65} y2={32} strokeWidth={3} />
          {[48, 60, 72].flatMap((y) => [32, 44, 56, 68].map((x) => <RCircle key={`${x}-${y}`} cx={x} cy={y} d={3} fill={INK} strokeWidth={0} />))}
        </>
      );
    case "crookedE":
      return (
        <g transform="rotate(-11 50 52)">
          <RRect x={33} y={28} w={10} h={48} fill={INK} strokeWidth={2} />
          <RRect x={33} y={28} w={34} h={10} fill={GREEN} strokeWidth={2} />
          <RRect x={33} y={46} w={27} h={10} fill={RED} strokeWidth={2} />
          <RRect x={33} y={64} w={34} h={10} fill="#2f5597" strokeWidth={2} />
        </g>
      );
    case "shredder":
      return (
        <>
          <RRect x={38} y={20} w={24} h={22} fill="#fff" strokeWidth={1.8} />
          <RLine x1={43} y1={27} x2={57} y2={27} strokeWidth={1.2} /><RLine x1={43} y1={32} x2={57} y2={32} strokeWidth={1.2} />
          <RRect x={24} y={42} w={52} h={20} fill="#59707c" strokeWidth={SW} />
          <RRect x={30} y={46} w={40} h={3} fill={INK} strokeWidth={0} />
          {[32, 40, 48, 56, 64].map((x) => <RLine key={x} x1={x} y1={62} x2={x - 2} y2={82} strokeWidth={1.6} />)}
        </>
      );
    case "houseofcards":
      return (
        <>
          <RPath d="M28 80 L39 52 L50 80 Z" fill="#fff" strokeWidth={SW} />
          <RPath d="M50 80 L61 52 L72 80 Z" fill="#fff" strokeWidth={SW} />
          <RRect x={40} y={49} w={20} h={4} fill="#fff" strokeWidth={1.6} />
          <g transform="rotate(34 70 36)"><RRect x={64} y={28} w={6} h={16} fill="#fff" strokeWidth={1.4} /></g>
          <text x={39} y={72} fontSize={9} fill={RED} textAnchor="middle" fontFamily="Georgia, serif">♥</text>
          <text x={61} y={72} fontSize={9} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">♠</text>
        </>
      );
    case "shellbox":
      return (
        <>
          <RPath d="M26 42 L50 50 L74 42 L74 72 L50 82 L26 72 Z" fill="#efe9db" strokeWidth={SW} />
          <RPath d="M26 42 L50 50 L74 42" fill="none" strokeWidth={1.6} />
          <RLine x1={50} y1={50} x2={50} y2={82} strokeWidth={1.4} />
          <text x={50} y={70} fontSize={12} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">LJM</text>
        </>
      );
    case "handcuffs":
      return (
        <>
          <RCircle cx={33} cy={56} d={32} fill="none" strokeWidth={6} stroke="#8a929a" />
          <RCircle cx={67} cy={56} d={32} fill="none" strokeWidth={6} stroke="#8a929a" />
          <RLine x1={46} y1={56} x2={54} y2={56} strokeWidth={6} stroke="#8a929a" />
          <RCircle cx={33} cy={56} d={9} fill="none" strokeWidth={2} stroke="#8a929a" />
          <RCircle cx={67} cy={56} d={9} fill="none" strokeWidth={2} stroke="#8a929a" />
        </>
      );
    case "magichat":
      return (
        <>
          <text x={50} y={26} fontSize={18} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif">$</text>
          <RPath d="M40 18 L42 24 M60 18 L58 24 M50 14 L50 20" stroke={GOLD} strokeWidth={2} />
          <REllipse cx={50} cy={78} w={54} h={12} fill={INK} strokeWidth={SW} />
          <RRect x={36} y={42} w={28} h={34} fill={INK} strokeWidth={SW} />
          <RRect x={34} y={70} w={32} h={7} fill={RED} strokeWidth={2} />
        </>
      );
    case "trophy":
      return (
        <>
          <RPath d="M38 28 L62 28 L60 48 Q50 57 40 48 Z" fill={GOLD} strokeWidth={SW} />
          <RPath d="M38 32 Q28 34 32 44" stroke={GOLD} strokeWidth={3} fill="none" />
          <RPath d="M62 32 Q72 34 68 44" stroke={GOLD} strokeWidth={3} fill="none" />
          <RRect x={45} y={56} w={10} h={9} fill={GOLD} strokeWidth={2} />
          <RRect x={37} y={64} w={26} h={7} fill={GOLD} strokeWidth={SW} />
          <text x={50} y={44} fontSize={11} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">#1</text>
        </>
      );
    case "prison":
      return (
        <>
          <RRect x={24} y={28} w={52} h={50} fill="#dfe3e6" strokeWidth={SW} />
          {[34, 44, 54, 66].map((x) => <RLine key={x} x1={x} y1={30} x2={x} y2={76} strokeWidth={4} />)}
          <RLine x1={26} y1={30} x2={74} y2={30} strokeWidth={4} />
          <RLine x1={26} y1={76} x2={74} y2={76} strokeWidth={4} />
        </>
      );
    case "token":
      return (
        <>
          <RCircle cx={50} cy={52} d={58} fill="#4a74b8" strokeWidth={SW} />
          <RCircle cx={50} cy={52} d={44} fill="none" strokeWidth={2} stroke="#cfe0f5" />
          <text x={50} y={64} fontSize={34} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Arial, sans-serif">₿</text>
        </>
      );
    case "yacht":
      return (
        <>
          <RPath d="M18 62 L82 62 L72 78 L28 78 Z" fill="#fff" strokeWidth={SW} />
          <RRect x={34} y={46} w={34} h={16} fill="#eef0f1" strokeWidth={2} />
          {[38, 48, 58].map((x) => <RRect key={x} x={x} y={50} w={6} h={8} fill="#9bc6e3" strokeWidth={1.2} />)}
          <RLine x1={52} y1={24} x2={52} y2={46} strokeWidth={3} />
          <RPath d="M54 26 L70 40 L54 40 Z" fill={RED} strokeWidth={1.6} />
          <RPath d="M10 82 q10 -5 20 0 q10 5 20 0 q10 -5 20 0" stroke="#79b4d6" strokeWidth={2.4} fill="none" />
        </>
      );
    case "island":
      return (
        <>
          <REllipse cx={50} cy={80} w={64} h={14} fill="#e9d8a6" strokeWidth={SW} />
          <RLine x1={48} y1={78} x2={44} y2={40} strokeWidth={5} stroke="#8a5a33" />
          <RPath d="M44 40 q-24 -8 -30 2" stroke={GREEN} strokeWidth={6} fill="none" />
          <RPath d="M44 40 q24 -8 30 2" stroke={GREEN} strokeWidth={6} fill="none" />
          <RPath d="M44 40 q2 -24 -2 -30" stroke={GREEN} strokeWidth={6} fill="none" />
          <RCircle cx={74} cy={28} d={16} fill={GOLD} strokeWidth={2} />
        </>
      );
    case "laptop":
      return (
        <>
          <RRect x={26} y={26} w={48} h={34} fill="#15181c" strokeWidth={SW} />
          <RRect x={30} y={30} w={40} h={26} fill="#3ddc6f" strokeWidth={1.4} />
          <path d="M34 48 L42 40 L48 44 L58 34 L66 38" fill="none" stroke="#15181c" strokeWidth={2.4} />
          <RPath d="M18 72 L82 72 L76 60 L24 60 Z" fill="#9aa6ad" strokeWidth={SW} />
        </>
      );
    case "chip":
      return (
        <>
          <RCircle cx={50} cy={52} d={56} fill={RED} strokeWidth={SW} />
          <RCircle cx={50} cy={52} d={34} fill="none" strokeWidth={3} stroke="#fff" />
          {[0, 1, 2, 3, 4, 5].map((k) => { const a = k * Math.PI / 3; return <RRect key={k} x={50 + 26 * Math.cos(a) - 4} y={52 + 26 * Math.sin(a) - 6} w={8} h={12} fill="#fff" strokeWidth={0} />; })}
          <text x={50} y={59} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "rocket":
      return (
        <>
          <RPath d="M50 16 Q64 36 64 62 L36 62 Q36 36 50 16 Z" fill="#fff" strokeWidth={SW} />
          <RCircle cx={50} cy={40} d={14} fill="#9bc6e3" strokeWidth={2} />
          <RPath d="M36 56 L24 72 L36 68 Z" fill={RED} strokeWidth={1.6} />
          <RPath d="M64 56 L76 72 L64 68 Z" fill={RED} strokeWidth={1.6} />
          <RPath d="M42 66 Q50 92 58 66 Z" fill={GOLD} strokeWidth={1.6} />
        </>
      );
    case "phone":
      return (
        <>
          <RRect x={32} y={14} w={36} h={72} fill="#15181c" strokeWidth={SW} />
          <RRect x={36} y={22} w={28} h={52} fill="#eef3f6" strokeWidth={1.4} />
          <RLine x1={44} y1={18} x2={56} y2={18} strokeWidth={2} />
          <RCircle cx={50} cy={80} d={6} fill="none" strokeWidth={2} />
          <text x={50} y={44} fontSize={18} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif">$</text>
          <path d="M40 56 L46 50 L52 54 L60 46" fill="none" stroke={RED} strokeWidth={2.4} />
        </>
      );
    case "vault":
      return (
        <>
          <RRect x={16} y={20} w={68} h={60} fill="#9aa6ad" strokeWidth={SW} />
          <RRect x={22} y={26} w={56} h={48} fill="#c3ccd2" strokeWidth={1.6} />
          <RCircle cx={50} cy={50} d={30} fill="#eef3f6" strokeWidth={2.4} />
          <RCircle cx={50} cy={50} d={10} fill="#15181c" strokeWidth={1.6} />
          {[0, 1, 2, 3].map((k) => { const a = k * Math.PI / 2; return <RLine key={k} x1={50 + 8 * Math.cos(a)} y1={50 + 8 * Math.sin(a)} x2={50 + 18 * Math.cos(a)} y2={50 + 18 * Math.sin(a)} strokeWidth={2.4} />; })}
          <RLine x1={28} y1={80} x2={28} y2={88} strokeWidth={3} />
          <RLine x1={72} y1={80} x2={72} y2={88} strokeWidth={3} />
        </>
      );

    // ---- EP016 (currencies) doodles ----
    case "euro":
      return (
        <>
          <RCircle cx={50} cy={50} d={66} fill="#3a6ea5" strokeWidth={SW} />
          <RCircle cx={50} cy={50} d={50} fill="#5a8fc8" strokeWidth={1.4} />
          <text x={50} y={64} fontSize={46} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">€</text>
        </>
      );
    case "yen":
      return (
        <>
          <RCircle cx={50} cy={50} d={66} fill="#fff" strokeWidth={SW} />
          <RCircle cx={50} cy={50} d={50} fill="#f3e9ea" strokeWidth={1.4} />
          <text x={50} y={66} fontSize={48} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Georgia, serif">¥</text>
        </>
      );
    case "pound":
      return (
        <>
          <RCircle cx={50} cy={50} d={66} fill={GOLD} strokeWidth={SW} />
          <RCircle cx={50} cy={50} d={50} fill={YELLOW} strokeWidth={1.4} />
          <text x={50} y={66} fontSize={46} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">£</text>
        </>
      );
    case "banknote":
      // A generic foreign banknote (not the green $ bill) — a world-money note.
      return (
        <>
          <RRect x={14} y={30} w={72} h={44} fill="#cfe3d4" strokeWidth={SW} />
          <RCircle cx={50} cy={52} d={26} fill="#eaf4ec" strokeWidth={1.8} />
          <text x={50} y={60} fontSize={20} fontWeight={900} fill="#2f6b46" textAnchor="middle" fontFamily="Georgia, serif">¤</text>
          <text x={24} y={42} fontSize={11} fontWeight={900} fill="#2f6b46" fontFamily="Georgia, serif">100</text>
          <text x={70} y={70} fontSize={11} fontWeight={900} fill="#2f6b46" fontFamily="Georgia, serif">100</text>
        </>
      );
    case "exchange":
      // Two currencies swapping — the circular-arrows FX icon.
      return (
        <>
          <RCircle cx={30} cy={54} d={30} fill={GREEN} strokeWidth={2} />
          <text x={30} y={62} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text>
          <RCircle cx={72} cy={54} d={30} fill="#3a6ea5" strokeWidth={2} />
          <text x={72} y={62} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">€</text>
          <path d="M34 28 Q50 16 66 28" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M66 28 l-9 -2 M66 28 l-2 9" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M66 80 Q50 92 34 80" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M34 80 l9 2 M34 80 l2 -9" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        </>
      );
    case "candles":
      // Candlestick chart — the trading floor / FX market.
      return (
        <>
          <RLine x1={14} y1={86} x2={88} y2={86} strokeWidth={2.4} />
          <RLine x1={26} y1={30} x2={26} y2={74} strokeWidth={2} />
          <RRect x={20} y={40} w={12} h={22} fill={GREEN} strokeWidth={2} />
          <RLine x1={46} y1={24} x2={46} y2={70} strokeWidth={2} />
          <RRect x={40} y={34} w={12} h={20} fill={RED} strokeWidth={2} />
          <RLine x1={66} y1={18} x2={66} y2={60} strokeWidth={2} />
          <RRect x={60} y={26} w={12} h={24} fill={GREEN} strokeWidth={2} />
        </>
      );
    case "basket":
      // A shopping basket — purchasing power / the "basket of goods".
      return (
        <>
          <RPath d="M22 44 L78 44 L70 84 L30 84 Z" fill={TAN} strokeWidth={SW} />
          <path d="M34 44 Q40 26 50 26 Q60 26 66 44" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          <RLine x1={40} y1={50} x2={37} y2={80} strokeWidth={1.8} />
          <RLine x1={54} y1={50} x2={55} y2={80} strokeWidth={1.8} />
          <RLine x1={26} y1={58} x2={74} y2={58} strokeWidth={1.8} />
        </>
      );
    case "anchor":
      // For a currency "peg" — anchored to another currency.
      return (
        <>
          <RCircle cx={50} cy={24} d={14} fill="none" strokeWidth={SW} />
          <RLine x1={50} y1={31} x2={50} y2={82} strokeWidth={3.4} />
          <RLine x1={36} y1={44} x2={64} y2={44} strokeWidth={3} />
          <path d="M26 64 Q30 84 50 84 Q70 84 74 64" fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
          <path d="M26 64 l-4 10 M26 64 l10 2 M74 64 l4 10 M74 64 l-10 2" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        </>
      );
    case "magnet":
      // High interest rates as a magnet pulling in capital.
      return (
        <>
          <RPath d="M28 24 L28 60 Q28 82 50 82 Q72 82 72 60 L72 24" fill="none" stroke={RED} strokeWidth={9} />
          <RRect x={22} y={20} w={14} h={12} fill={RED} strokeWidth={1.6} />
          <RRect x={64} y={20} w={14} h={12} fill="#c3ccd2" strokeWidth={1.6} />
          <text x={29} y={18} fontSize={12} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Georgia, serif">N</text>
          <text x={71} y={18} fontSize={12} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">S</text>
        </>
      );
    case "wheelbarrow":
      // Hyperinflation: a wheelbarrow of cash.
      return (
        <>
          <RPath d="M18 52 L74 52 L66 72 L30 72 Z" fill="#9aa6ad" strokeWidth={SW} />
          <RLine x1={74} y1={52} x2={88} y2={46} strokeWidth={3} />
          <RCircle cx={40} cy={84} d={14} fill={INK} fillStyle="solid" strokeWidth={2} />
          <RLine x1={30} y1={72} x2={24} y2={86} strokeWidth={3} />
          {[30, 42, 54].map((x, i) => <RRect key={i} x={x} y={38 + (i % 2) * 2} w={16} h={10} fill={GREEN} strokeWidth={1.4} />)}
          <text x={40} y={32} fontSize={13} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif">$$$</text>
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
