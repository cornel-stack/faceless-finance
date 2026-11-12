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
  // EP017 (sovereign default) additions:
  | "scissors" | "lifering" | "vulture" | "rating" | "protest"
  // EP018 (middle class) additions:
  | "ladder" | "receipt" | "gradcap"
  // EP019 (lifestyle creep) additions:
  | "car" | "briefcase" | "bucket" | "dining"
  // EP020 (banks create money) additions:
  | "keyboard" | "ledger"
  // EP021 (IPO dumping ground) additions:
  | "bell" | "prospectus"
  // EP022 (AI bubble) additions:
  | "server" | "brain"
  // EP023 (war & markets) additions:
  | "jet" | "shield"
  // EP024 (dollar plumbing) additions:
  | "faucet"
  // EP025 (private equity) additions:
  | "store" | "wreckingball"
  // EP026 (tariffs) additions:
  | "cargoship" | "barrier"
  // EP027 (deflation) additions:
  | "hourglass"
  // EP028 (inflation) additions:
  | "thermometer"
  // EP029 (weaker currencies) additions:
  | "luggage"
  // EP030 (crypto) additions:
  | "pickaxe"
  // EP031 (Theranos) additions:
  | "vial" | "droplet"
  // EP032 (Madoff) additions:
  | "pyramid" | "envelope"
  // EP033 (why the rich pretend to be poor) additions:
  | "pickuptruck" | "mansion"
  // EP034 (the fastest way to get poor) additions:
  | "dice" | "slotmachine"
  // EP035 (why markets panic when central banks speak) additions:
  | "podium" | "megaphone"
  // EP036 (how scammers rig the stock market) additions:
  | "telephone" | "stockscreen"
  // EP037 (why Japan is stuck) additions:
  | "torii" | "bullettrain"
  // EP038 (the petrodollar) additions:
  | "pumpjack" | "crown"
  // EP039 (why the dumbest investors win) additions:
  | "turtle" | "hare"
  // EP040 (Wirecard) additions:
  | "spy" | "magnifier"
  // EP041 (Lehman Brothers) additions:
  | "gorilla" | "tombstone"
  // EP042 (dot-com bubble) additions:
  | "dialup" | "sockpuppet"
  // EP043 (credit cards) additions:
  | "cardreader" | "mousetrap"
  // EP044 (every type of investor) additions:
  | "bull" | "bear"
  // EP045 (fund types) additions:
  | "pie" | "rope"
  // EP046 (US dominance ending) additions:
  | "chessking" | "risingcity"
  // EP047 (dollar reserve status) additions:
  | "grocerybag" | "scepter"
  // EP048 (gold) additions:
  | "umbrella" | "nugget"
  // EP049 (debt as a product) additions:
  | "moneytree" | "ballchain"
  // EP050 (why fiat money has value) additions:
  | "decree" | "brokennote"
  // EP051 (your money at every level) additions:
  | "mountain" | "nestegg"
  // EP052 (net worth by age) additions:
  | "birthdaycake" | "seedling"
  // EP053 (how much you should have saved) additions:
  | "safetynet" | "gear"
  // EP054 (how banks treat you at every level) additions:
  | "velvetrope" | "goldcard"
  // EP055 (how much to retire at every age) additions:
  | "hammock" | "medkit"
  // EP056 (invest $100/month at every age) additions:
  | "coffeecup" | "snowball"
  // EP057 ($1,000 invested since 1950) additions:
  | "rollercoaster" | "diamond"
  // EP058 (every level of salary) additions:
  | "smiley" | "balloon"
  // EP059 (how much house at every salary) additions:
  | "wrench" | "sofa"
  // EP060 (every level of debt) additions:
  | "shovel" | "brokenchain"
  // EP061 (cost of living by state) additions:
  | "palmtree" | "mappin"
  // EP062 (every level of rich) additions:
  | "tophat" | "champagne"
  // EP063 (retirement at every savings rate) additions:
  | "stopwatch" | "finishflag"
  // EP064 (every level of passive income) additions:
  | "mailbox" | "moon"
  // EP065 (money every decade of life) additions:
  | "cane" | "backpack"
  // EP066 (every level of millionaire) additions:
  | "moneystack" | "stadium"
  // EP067 (what each credit score costs) additions:
  | "reportcard" | "trafficlight"
  // EP068 (every level of inheritance) additions:
  | "gift" | "will"
  // EP069 (every level of home ownership) additions:
  | "paidstamp" | "confetti"
  // EP070 (every level of stock market crash) additions:
  | "parachute" | "bargaintag"
  // EP071 (every level of interest rate) additions:
  | "thermostat" | "brake"
  // EP072 (every level of emergency fund) additions:
  | "fireextinguisher" | "pillow"
  // EP073 (every level of 401k balance) additions:
  | "jar" | "medal"
  | "camera" | "shoppingcart"
  | "skyline" | "lease"
  | "truck" | "steeringwheel"
  | "diploma" | "books"
  | "ticket" | "clover"
  | "rockingchair" | "goldwatch"
  | "mapleleaf"
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

    // ---- EP017 (sovereign default) doodles ----
    case "scissors":
      // Haircut / austerity cuts.
      return (
        <>
          <RLine x1={30} y1={30} x2={74} y2={66} strokeWidth={4} />
          <RLine x1={30} y1={70} x2={74} y2={34} strokeWidth={4} />
          <RCircle cx={24} cy={30} d={16} fill="none" strokeWidth={3} />
          <RCircle cx={24} cy={70} d={16} fill="none" strokeWidth={3} />
          <RCircle cx={74} cy={50} d={6} fill={INK} fillStyle="solid" strokeWidth={1.4} />
        </>
      );
    case "lifering":
      // IMF rescue / lender of last resort.
      return (
        <>
          <RCircle cx={50} cy={50} d={74} fill={RED} strokeWidth={SW} />
          <RCircle cx={50} cy={50} d={34} fill="#fff" strokeWidth={SW} />
          {[0, 1, 2, 3].map((k) => { const a = k * Math.PI / 2 + Math.PI / 4; return <RRect key={k} x={50 + 24 * Math.cos(a) - 7} y={50 + 24 * Math.sin(a) - 7} w={14} h={14} fill="#fff" strokeWidth={1.4} />; })}
        </>
      );
    case "vulture":
      // Vulture / distressed-debt funds circling.
      return (
        <>
          <REllipse cx={50} cy={60} w={40} h={30} fill="#3a3f45" strokeWidth={SW} />
          <RCircle cx={50} cy={34} d={22} fill="#4a5056" strokeWidth={SW} />
          <path d="M60 32 L74 36 L60 40 Z" fill={GOLD} stroke={INK} strokeWidth={1.6} />
          <RCircle cx={46} cy={30} d={5} fill={RED} fillStyle="solid" strokeWidth={1} />
          <path d="M30 56 Q16 48 22 40 M70 56 Q84 48 78 40" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
          <RLine x1={44} y1={84} x2={44} y2={92} strokeWidth={2.4} />
          <RLine x1={56} y1={84} x2={56} y2={92} strokeWidth={2.4} />
        </>
      );
    case "rating":
      // A credit-rating badge dropping toward junk.
      return (
        <>
          <RPath d="M50 12 L84 26 L78 62 Q50 92 50 92 Q22 62 22 26 Z" fill={PARCH} strokeWidth={SW} />
          <text x={50} y={46} fontSize={20} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Georgia, serif">AAA</text>
          <path d="M36 54 L64 54 M50 54 L58 70" fill="none" stroke={RED} strokeWidth={3} strokeLinecap="round" />
          <path d="M58 70 l-9 1 M58 70 l-1 -9" fill="none" stroke={RED} strokeWidth={3} strokeLinecap="round" />
        </>
      );
    case "protest":
      // Social unrest — a protest placard.
      return (
        <>
          <RLine x1={38} y1={46} x2={38} y2={92} strokeWidth={4} />
          <RRect x={20} y={14} w={60} h={36} fill="#fff" strokeWidth={SW} />
          <RLine x1={28} y1={26} x2={72} y2={26} strokeWidth={3} />
          <RLine x1={28} y1={34} x2={64} y2={34} strokeWidth={3} />
          <RLine x1={28} y1={42} x2={70} y2={42} strokeWidth={3} />
        </>
      );

    // ---- EP018 (middle class) doodles ----
    case "ladder":
      return (
        <>
          <RLine x1={34} y1={12} x2={34} y2={92} strokeWidth={3.4} />
          <RLine x1={66} y1={12} x2={66} y2={92} strokeWidth={3.4} />
          <RLine x1={34} y1={26} x2={66} y2={26} strokeWidth={3} />
          <RLine x1={34} y1={66} x2={66} y2={66} strokeWidth={3} />
          <RLine x1={34} y1={82} x2={66} y2={82} strokeWidth={3} />
          <RLine x1={34} y1={46} x2={48} y2={46} strokeWidth={3} stroke={RED} />
          <RLine x1={56} y1={46} x2={66} y2={46} strokeWidth={3} stroke={RED} />
        </>
      );
    case "receipt":
      return (
        <>
          <RPath d="M28 12 L72 12 L72 84 L64 78 L56 84 L48 78 L40 84 L32 78 L28 84 Z" fill="#fff" strokeWidth={SW} />
          {[24, 34, 44, 54].map((y, i) => <RLine key={i} x1={36} y1={y} x2={64} y2={y} strokeWidth={1.8} />)}
          <text x={50} y={72} fontSize={15} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Georgia, serif">$$$</text>
        </>
      );
    case "gradcap":
      return (
        <>
          <RPath d="M50 30 L86 44 L50 58 L14 44 Z" fill={INK} fillStyle="solid" strokeWidth={SW} />
          <RLine x1={70} y1={49} x2={70} y2={68} strokeWidth={2.4} />
          <RCircle cx={70} cy={70} d={6} fill={GOLD} strokeWidth={1.4} />
          <RPath d="M34 50 L34 68 Q50 80 66 68 L66 50" fill="none" strokeWidth={SW} />
        </>
      );

    // ---- EP019 (lifestyle creep) doodles ----
    case "car":
      return (
        <>
          <RPath d="M16 64 L26 44 L74 44 L86 64 Z" fill={RED} strokeWidth={SW} />
          <RRect x={12} y={60} w={76} h={16} fill={RED} strokeWidth={SW} />
          <RRect x={34} y={48} w={32} h={14} fill="#bcd3e0" strokeWidth={1.8} />
          <RCircle cx={30} cy={78} d={16} fill={INK} fillStyle="solid" strokeWidth={2} />
          <RCircle cx={70} cy={78} d={16} fill={INK} fillStyle="solid" strokeWidth={2} />
        </>
      );
    case "briefcase":
      return (
        <>
          <RRect x={20} y={36} w={60} h={46} fill={TAN} strokeWidth={SW} />
          <RPath d="M40 36 L40 28 L60 28 L60 36" fill="none" strokeWidth={SW} />
          <RLine x1={20} y1={54} x2={80} y2={54} strokeWidth={2} />
          <RRect x={44} y={50} w={12} h={8} fill={INK} fillStyle="solid" strokeWidth={1.4} />
        </>
      );
    case "bucket":
      // A leaky bucket — money in, money straight out.
      return (
        <>
          <RPath d="M26 40 L74 40 L68 84 L32 84 Z" fill="#9aa6ad" strokeWidth={SW} />
          <RPath d="M28 40 Q50 26 72 40" fill="none" strokeWidth={SW} />
          <RCircle cx={44} cy={64} d={6} fill="#fff" strokeWidth={1.2} />
          <RCircle cx={58} cy={72} d={5} fill="#fff" strokeWidth={1.2} />
          <text x={50} y={60} fontSize={16} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "dining":
      // Fine dining / lifestyle spend — plate with fork & knife.
      return (
        <>
          <RCircle cx={52} cy={54} d={48} fill="#fff" strokeWidth={SW} />
          <RCircle cx={52} cy={54} d={30} fill="none" strokeWidth={1.6} />
          <RLine x1={16} y1={30} x2={16} y2={78} strokeWidth={3} />
          <RLine x1={88} y1={30} x2={88} y2={78} strokeWidth={3} />
          <RPath d="M12 30 L12 44 M20 30 L20 44" fill="none" strokeWidth={2.4} />
        </>
      );

    // ---- EP020 (banks create money) doodles ----
    case "keyboard":
      return (
        <>
          <RRect x={14} y={40} w={72} h={40} fill="#2b2f33" strokeWidth={SW} />
          {[0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => <RRect key={`${r}-${c}`} x={22 + c * 13} y={46 + r * 10} w={9} h={7} fill="#e8edf0" strokeWidth={1} />))}
          <text x={50} y={34} fontSize={18} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif">+$</text>
        </>
      );
    case "ledger":
      return (
        <>
          <RRect x={18} y={20} w={64} h={62} fill="#fff" strokeWidth={SW} />
          <RLine x1={50} y1={22} x2={50} y2={80} strokeWidth={2.4} />
          <RLine x1={22} y1={34} x2={46} y2={34} strokeWidth={1.8} />
          <RLine x1={54} y1={34} x2={78} y2={34} strokeWidth={1.8} />
          <text x={34} y={56} fontSize={14} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif">+</text>
          <text x={66} y={56} fontSize={14} fontWeight={900} fill={RED} textAnchor="middle" fontFamily="Georgia, serif">−</text>
        </>
      );

    // ---- EP021 (IPO dumping ground) doodles ----
    case "bell":
      // The opening/closing bell rung at an IPO.
      return (
        <>
          <RPath d="M34 40 Q34 24 50 24 Q66 24 66 40 L70 70 L30 70 Z" fill={GOLD} strokeWidth={SW} />
          <RLine x1={50} y1={18} x2={50} y2={24} strokeWidth={3} />
          <RCircle cx={50} cy={16} d={6} fill={GOLD} strokeWidth={2} />
          <RRect x={26} y={70} w={48} h={8} fill={GOLD} strokeWidth={2} />
          <RCircle cx={50} cy={78} d={8} fill={INK} fillStyle="solid" strokeWidth={1.4} />
        </>
      );
    case "prospectus":
      // The glossy IPO disclosure document.
      return (
        <>
          <RRect x={24} y={16} w={52} h={70} fill="#fff" strokeWidth={SW} />
          <RRect x={24} y={16} w={52} h={18} fill="#3a6ea5" strokeWidth={1.6} />
          <text x={50} y={30} fontSize={11} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">IPO</text>
          {[44, 52, 60, 68, 76].map((y, i) => <RLine key={i} x1={32} y1={y} x2={68} y2={y} strokeWidth={1.6} />)}
        </>
      );

    // ---- EP022 (AI bubble) doodles ----
    case "server":
      // A data-center server rack.
      return (
        <>
          <RRect x={30} y={14} w={40} h={72} fill="#2b2f33" strokeWidth={SW} />
          {[22, 34, 46, 58, 70].map((y, i) => <g key={i}><RRect x={34} y={y} w={32} h={8} fill="#454b50" strokeWidth={1} /><RCircle cx={40} cy={y + 4} d={3} fill={i % 2 ? GREEN : GOLD} strokeWidth={0.8} /><RCircle cx={48} cy={y + 4} d={3} fill={GREEN} strokeWidth={0.8} /></g>)}
        </>
      );
    case "brain":
      // AI — a stylized brain / chip-brain.
      return (
        <>
          <RPath d="M34 40 Q28 24 44 24 Q50 16 58 24 Q74 24 68 40 Q76 54 64 60 Q58 72 46 64 Q30 64 32 50 Q26 46 34 40 Z" fill={PINK} strokeWidth={SW} />
          <RPath d="M50 26 L50 64 M42 36 L58 36 M40 50 L60 50" fill="none" strokeWidth={1.8} />
          {[[40, 70], [50, 74], [60, 70]].map(([x, y], i) => <RCircle key={i} cx={x} cy={y} d={4} fill={INK} fillStyle="solid" strokeWidth={1} />)}
        </>
      );

    // ---- EP023 (war & markets) doodles ----
    case "jet":
      // A fighter jet — the defense industry.
      return (
        <>
          <RPath d="M12 54 L64 48 L84 50 L64 56 Z" fill="#8a929a" strokeWidth={SW} />
          <RPath d="M40 50 L54 30 L60 30 L50 50 Z" fill="#8a929a" strokeWidth={2} />
          <RPath d="M40 54 L54 74 L60 74 L50 54 Z" fill="#8a929a" strokeWidth={2} />
          <RPath d="M20 52 L30 44 L34 45 L28 53 Z" fill="#6f777d" strokeWidth={1.6} />
          <RCircle cx={70} cy={51} d={5} fill="#bcd3e0" strokeWidth={1.4} />
        </>
      );
    case "shield":
      // Safe haven / flight-to-safety.
      return (
        <>
          <RPath d="M50 14 L82 24 L78 58 Q50 88 50 88 Q22 58 22 24 Z" fill="#3a6ea5" strokeWidth={SW} />
          <RPath d="M50 22 L74 30 L71 56 Q50 78 50 78 Q29 56 29 30 Z" fill="#5a8fc8" strokeWidth={1.4} />
          <path d="M40 48 L47 58 L62 36" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </>
      );

    // ---- EP024 (dollar plumbing) doodles ----
    case "faucet":
      // The dollar tap the world drinks from.
      return (
        <>
          <RRect x={16} y={34} w={18} h={14} fill="#8a929a" strokeWidth={SW} />
          <RPath d="M34 41 L62 41 L62 54 L56 54 L56 47 L34 47 Z" fill="#9aa6ad" strokeWidth={SW} />
          <RRect x={50} y={28} w={12} h={10} fill="#8a929a" strokeWidth={2} />
          <text x={56} y={88} fontSize={22} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif">$</text>
          <RCircle cx={56} cy={64} d={6} fill="#bcd3e0" strokeWidth={1.2} />
        </>
      );

    // ---- EP025 (private equity) doodles ----
    case "store":
      // A beloved high-street store / brand.
      return (
        <>
          <RRect x={20} y={40} w={60} h={46} fill="#fff" strokeWidth={SW} />
          <RPath d="M16 40 L84 40 L76 24 L24 24 Z" fill={RED} strokeWidth={SW} />
          {[28, 44, 60, 76].map((x, i) => <RRect key={i} x={x - 3} y={28} w={8} h={10} fill={i % 2 ? "#fff" : RED} strokeWidth={1} />)}
          <RRect x={44} y={60} w={14} h={26} fill={INK} fillStyle="solid" strokeWidth={SW} />
          <RRect x={26} y={50} w={12} h={10} fill="#bcd3e0" strokeWidth={1.6} />
        </>
      );
    case "wreckingball":
      return (
        <>
          <RLine x1={24} y1={12} x2={70} y2={12} strokeWidth={3.4} />
          <RLine x1={66} y1={12} x2={54} y2={52} strokeWidth={2.6} />
          <RCircle cx={50} cy={64} d={32} fill="#3a3f45" strokeWidth={SW} />
          <RCircle cx={44} cy={58} d={7} fill="#6f777d" strokeWidth={1} />
          <RLine x1={24} y1={12} x2={24} y2={30} strokeWidth={3} />
        </>
      );

    // ---- EP026 (tariffs) doodles ----
    case "cargoship":
      return (
        <>
          <RPath d="M14 60 L86 60 L78 80 L22 80 Z" fill={RED} strokeWidth={SW} />
          <RRect x={30} y={40} w={44} h={20} fill="#3a6ea5" strokeWidth={2} />
          {[32, 46, 60].map((x, i) => <RRect key={i} x={x} y={42} w={12} h={8} fill={i % 2 ? GOLD : "#cfe3d4"} strokeWidth={1} />)}
          <RRect x={40} y={28} w={10} h={14} fill="#fff" strokeWidth={1.6} />
          <path d="M14 70 Q22 64 30 70 Q38 76 46 70 Q54 64 62 70" fill="none" stroke="#3a6ea5" strokeWidth={2} />
        </>
      );
    case "barrier":
      // A border / customs barrier.
      return (
        <>
          <RRect x={18} y={24} w={64} h={16} fill={RED} strokeWidth={SW} />
          {[22, 34, 46, 58, 70].map((x, i) => <RLine key={i} x1={x} y1={24} x2={x + 10} y2={40} strokeWidth={2} stroke="#fff" />)}
          <RLine x1={26} y1={40} x2={26} y2={86} strokeWidth={4} />
          <RLine x1={74} y1={40} x2={74} y2={86} strokeWidth={4} />
        </>
      );

    // ---- EP027 (deflation) doodles ----
    case "hourglass":
      return (
        <>
          <RLine x1={26} y1={16} x2={74} y2={16} strokeWidth={3.4} />
          <RLine x1={26} y1={84} x2={74} y2={84} strokeWidth={3.4} />
          <RPath d="M32 16 L68 16 L52 50 L68 84 L32 84 L48 50 Z" fill="none" strokeWidth={SW} />
          <RPath d="M40 24 L60 24 L52 46 L48 46 Z" fill={GOLD} strokeWidth={1.2} />
          <RPath d="M46 66 L54 66 L58 80 L42 80 Z" fill={GOLD} strokeWidth={1.2} />
        </>
      );

    // ---- EP028 (inflation) doodles ----
    case "thermometer":
      // A hot economy / rising prices.
      return (
        <>
          <RPath d="M42 16 L58 16 L58 64 Q66 70 66 78 Q66 90 50 90 Q34 90 34 78 Q34 70 42 64 Z" fill="#fff" strokeWidth={SW} />
          <RRect x={46} y={24} w={8} h={44} fill={RED} strokeWidth={1} />
          <RCircle cx={50} cy={78} d={18} fill={RED} strokeWidth={1.4} />
          {[28, 38, 48].map((y, i) => <RLine key={i} x1={58} y1={y} x2={66} y2={y} strokeWidth={1.6} />)}
        </>
      );

    // ---- EP029 (weaker currencies) doodles ----
    case "luggage":
      return (
        <>
          <RRect x={26} y={34} w={48} h={50} fill="#3a6ea5" strokeWidth={SW} />
          <RPath d="M40 34 Q40 24 50 24 Q60 24 60 34" fill="none" strokeWidth={SW} />
          <RLine x1={26} y1={50} x2={74} y2={50} strokeWidth={2} />
          <RRect x={44} y={44} w={12} h={10} fill={GOLD} strokeWidth={1.4} />
          <text x={50} y={74} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">✈</text>
        </>
      );

    // ---- EP030 (crypto) doodles ----
    case "pickaxe":
      // Crypto mining.
      return (
        <>
          <RLine x1={30} y1={82} x2={70} y2={28} strokeWidth={5} />
          <RPath d="M44 20 Q62 10 82 24 Q62 22 50 36 Z" fill="#8a929a" strokeWidth={SW} />
          <RCircle cx={34} cy={74} d={16} fill={GOLD} strokeWidth={2} />
          <text x={34} y={80} fontSize={14} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">₿</text>
        </>
      );

    // ---- EP031 (Theranos) doodles ----
    case "vial":
      // A blood collection tube, half full.
      return (
        <>
          <RRect x={40} y={14} w={20} h={11} fill={RED} strokeWidth={SW} />
          <RPath d="M42 25 L58 25 L58 78 Q58 88 50 88 Q42 88 42 78 Z" fill="#fff" strokeWidth={SW} />
          <RPath d="M42 58 L58 58 L58 78 Q58 88 50 88 Q42 88 42 78 Z" fill={RED} strokeWidth={1.2} />
        </>
      );
    case "droplet":
      // A single drop of blood.
      return (
        <>
          <RPath d="M50 16 C 70 48 66 72 50 84 C 34 72 30 48 50 16 Z" fill={RED} strokeWidth={SW} />
          <RPath d="M43 60 Q45 72 53 75" fill="none" stroke="#fff" strokeWidth={2.6} />
        </>
      );

    // ---- EP032 (Madoff) doodles ----
    case "pyramid":
      // The classic pyramid/Ponzi shape.
      return (
        <>
          <RPath d="M50 18 L82 82 L18 82 Z" fill={GOLD} strokeWidth={SW} />
          <RLine x1={34} y1={50} x2={66} y2={50} strokeWidth={2} />
          <RLine x1={26} y1={66} x2={74} y2={66} strokeWidth={2} />
          <RLine x1={50} y1={18} x2={50} y2={82} strokeWidth={1.6} />
        </>
      );
    case "envelope":
      // An account statement in the mail.
      return (
        <>
          <RRect x={18} y={30} w={64} h={44} fill="#fff" strokeWidth={SW} />
          <RPath d="M18 30 L50 54 L82 30" fill="none" strokeWidth={SW} />
        </>
      );

    // ---- EP033 (why the rich pretend to be poor) doodles ----
    case "pickuptruck":
      // A humble old pickup — the frugal-billionaire flex.
      return (
        <>
          <RPath d="M14 62 L14 44 L40 44 L48 56 L84 56 L84 62 Z" fill="#6c7a89" strokeWidth={SW} />
          <RRect x={48} y={48} w={36} h={10} fill="#6c7a89" strokeWidth={1.4} />
          <RCircle cx={30} cy={66} d={15} fill={INK} strokeWidth={1} />
          <RCircle cx={70} cy={66} d={15} fill={INK} strokeWidth={1} />
        </>
      );
    case "mansion":
      // A big mansion — the hidden wealth they don't show.
      return (
        <>
          <RRect x={20} y={46} w={60} h={38} fill={TAN} strokeWidth={SW} />
          <RPath d="M14 46 L50 24 L86 46 Z" fill={RED} strokeWidth={SW} />
          <RRect x={28} y={58} w={12} h={26} fill="#fff" strokeWidth={1.4} />
          <RRect x={58} y={58} w={12} h={14} fill="#fff" strokeWidth={1.4} />
          <RLine x1={50} y1={24} x2={50} y2={14} strokeWidth={2} />
        </>
      );

    // ---- EP034 (the fastest way to get poor) doodles ----
    case "dice":
      // A gambling die.
      return (
        <>
          <RRect x={24} y={24} w={52} h={52} fill="#fff" strokeWidth={SW} />
          <RCircle cx={40} cy={40} d={9} fill={INK} strokeWidth={1} />
          <RCircle cx={60} cy={40} d={9} fill={INK} strokeWidth={1} />
          <RCircle cx={50} cy={50} d={9} fill={RED} strokeWidth={1} />
          <RCircle cx={40} cy={60} d={9} fill={INK} strokeWidth={1} />
          <RCircle cx={60} cy={60} d={9} fill={INK} strokeWidth={1} />
        </>
      );
    case "slotmachine":
      // A slot machine — the house always wins.
      return (
        <>
          <RRect x={26} y={20} w={48} h={64} fill={RED} strokeWidth={SW} />
          <RRect x={32} y={32} w={36} h={22} fill="#fff" strokeWidth={1.4} />
          <text x={50} y={49} fontSize={15} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">7 7</text>
          <RLine x1={74} y1={44} x2={84} y2={44} strokeWidth={SW} />
          <RCircle cx={86} cy={44} d={11} fill={GOLD} strokeWidth={1.4} />
        </>
      );

    // ---- EP035 (why markets panic when central banks speak) doodles ----
    case "podium":
      // A speaker's lectern with a microphone — the central-bank presser.
      return (
        <>
          <RPath d="M36 84 L34 46 L66 46 L64 84 Z" fill={TAN} strokeWidth={SW} />
          <RRect x={30} y={40} w={40} h={8} fill={TAN} strokeWidth={1.4} />
          <RLine x1={50} y1={40} x2={50} y2={26} strokeWidth={2.4} />
          <RCircle cx={50} cy={22} d={11} fill={INK} strokeWidth={1} />
        </>
      );
    case "megaphone":
      // An announcement that moves the market.
      return (
        <>
          <RPath d="M22 42 L54 30 L54 70 L22 58 Z" fill={RED} strokeWidth={SW} />
          <RRect x={54} y={34} w={14} h={32} fill="#b83227" strokeWidth={1.4} />
          <RPath d="M74 36 Q84 50 74 64" fill="none" strokeWidth={2.6} />
          <RLine x1={30} y1={58} x2={30} y2={74} strokeWidth={SW} />
        </>
      );

    // ---- EP036 (how scammers rig the stock market) doodles ----
    case "telephone":
      // A classic handset — the boiler-room cold call.
      return (
        <RPath d="M30 26 Q36 20 44 26 L50 40 Q46 46 42 44 Q36 58 50 72 Q52 68 58 72 L72 78 Q78 86 72 92 Q48 96 30 68 Q18 44 30 26 Z" fill={INK} strokeWidth={SW} />
      );
    case "stockscreen":
      // A trading monitor with a candlestick chart.
      return (
        <>
          <RRect x={18} y={22} w={64} h={48} fill="#17120f" strokeWidth={SW} />
          <RPath d="M24 60 L36 50 L46 56 L58 36 L68 44 L76 30" fill="none" stroke={GREEN} strokeWidth={2.8} />
          <RLine x1={40} y1={80} x2={60} y2={80} strokeWidth={SW} />
          <RLine x1={50} y1={70} x2={50} y2={80} strokeWidth={SW} />
        </>
      );

    // ---- EP037 (why Japan is stuck) doodles ----
    case "torii":
      // A torii gate — the symbol of Japan.
      return (
        <>
          <RPath d="M14 30 L86 30 L82 38 L18 38 Z" fill={RED} strokeWidth={SW} />
          <RRect x={28} y={44} w={44} h={7} fill={RED} strokeWidth={1.4} />
          <RRect x={30} y={38} w={9} h={48} fill={RED} strokeWidth={SW} />
          <RRect x={61} y={38} w={9} h={48} fill={RED} strokeWidth={SW} />
        </>
      );
    case "bullettrain":
      // A shinkansen — Japan's wealth and infrastructure.
      return (
        <>
          <RPath d="M18 44 Q40 36 84 40 L84 64 L18 64 Q14 54 18 44 Z" fill="#dfe6ea" strokeWidth={SW} />
          <RLine x1={20} y1={55} x2={84} y2={55} stroke="#3a6ea5" strokeWidth={3} />
          <RPath d="M22 48 Q30 44 40 47" fill="none" strokeWidth={2} />
          <RCircle cx={40} cy={66} d={10} fill={INK} strokeWidth={1} />
          <RCircle cx={66} cy={66} d={10} fill={INK} strokeWidth={1} />
        </>
      );

    // ---- EP038 (the petrodollar) doodles ----
    case "pumpjack":
      // An oil pump — the source of petrodollars.
      return (
        <>
          <RLine x1={28} y1={84} x2={72} y2={84} strokeWidth={SW} />
          <RPath d="M40 84 L46 52 L56 52 L62 84" fill="none" strokeWidth={SW} />
          <RLine x1={51} y1={52} x2={30} y2={42} strokeWidth={SW} />
          <RLine x1={51} y1={52} x2={72} y2={60} strokeWidth={SW} />
          <RCircle cx={28} cy={42} d={14} fill={INK} strokeWidth={1} />
          <RLine x1={72} y1={60} x2={72} y2={84} strokeWidth={2.4} />
        </>
      );
    case "crown":
      // A crown — the oil monarchies.
      return (
        <>
          <RPath d="M24 70 L24 40 L38 54 L50 34 L62 54 L76 40 L76 70 Z" fill={GOLD} strokeWidth={SW} />
          <RLine x1={24} y1={70} x2={76} y2={70} strokeWidth={SW} />
          <RCircle cx={50} cy={36} d={7} fill={RED} strokeWidth={1} />
        </>
      );

    // ---- EP039 (why the dumbest investors win) doodles ----
    case "turtle":
      // Slow and steady — the 'dumb' buy-and-hold investor.
      return (
        <>
          <RPath d="M26 60 Q52 26 78 60 Z" fill={GREEN} strokeWidth={SW} />
          <RLine x1={26} y1={60} x2={78} y2={60} strokeWidth={SW} />
          <RCircle cx={86} cy={54} d={14} fill={GREEN} strokeWidth={SW} />
          <RLine x1={38} y1={60} x2={36} y2={72} strokeWidth={SW} />
          <RLine x1={66} y1={60} x2={68} y2={72} strokeWidth={SW} />
          <RPath d="M42 54 L52 44 L62 54" fill="none" strokeWidth={1.6} />
        </>
      );
    case "hare":
      // Fast but erratic — the frantic 'genius' trader.
      return (
        <>
          <RCircle cx={48} cy={62} d={30} fill="#b0a89a" strokeWidth={SW} />
          <RCircle cx={64} cy={48} d={18} fill="#b0a89a" strokeWidth={SW} />
          <RPath d="M58 42 Q56 22 64 22 Q68 34 66 44 Z" fill="#b0a89a" strokeWidth={SW} />
          <RPath d="M66 42 Q68 22 76 24 Q76 36 72 46 Z" fill="#b0a89a" strokeWidth={SW} />
          <RCircle cx={70} cy={48} d={4} fill={INK} strokeWidth={0.5} />
        </>
      );

    // ---- EP040 (Wirecard) doodles ----
    case "spy":
      // A trench-coat figure — the fugitive, suspected spy.
      return (
        <>
          <RRect x={38} y={26} w={24} h={14} fill={INK} strokeWidth={SW} />
          <RPath d="M30 40 Q50 32 70 40 L70 45 L30 45 Z" fill={INK} strokeWidth={SW} />
          <RCircle cx={50} cy={58} d={22} fill={PARCH} strokeWidth={SW} />
          <RRect x={38} y={52} w={24} h={7} fill={INK} strokeWidth={1} />
          <RPath d="M34 84 Q50 70 66 84" fill="none" strokeWidth={SW} />
        </>
      );
    case "magnifier":
      // The investigation — journalists and short-sellers.
      return (
        <>
          <RCircle cx={44} cy={44} d={40} fill="#bfe0ef" strokeWidth={SW} />
          <RLine x1={62} y1={62} x2={82} y2={82} strokeWidth={6} />
        </>
      );

    // ---- EP041 (Lehman Brothers) doodles ----
    case "gorilla":
      // 'The Gorilla' — the hard-charging Wall Street CEO.
      return (
        <>
          <RRect x={28} y={58} w={44} h={28} fill="#4a4a4a" strokeWidth={SW} />
          <RCircle cx={50} cy={44} d={34} fill="#4a4a4a" strokeWidth={SW} />
          <RCircle cx={50} cy={50} d={20} fill="#7a7a7a" strokeWidth={1.4} />
          <RCircle cx={41} cy={46} d={5} fill={INK} strokeWidth={0.5} />
          <RCircle cx={59} cy={46} d={5} fill={INK} strokeWidth={0.5} />
        </>
      );
    case "tombstone":
      // RIP — a storied firm, dead.
      return (
        <>
          <RPath d="M30 86 L30 44 Q30 24 50 24 Q70 24 70 44 L70 86 Z" fill={TAN} strokeWidth={SW} />
          <text x={50} y={52} fontSize={14} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">RIP</text>
          <RLine x1={38} y1={62} x2={62} y2={62} strokeWidth={1.6} />
        </>
      );

    // ---- EP042 (dot-com bubble) doodles ----
    case "dialup":
      // A boxy late-90s CRT computer.
      return (
        <>
          <RRect x={24} y={26} w={52} h={40} fill="#d8d2c4" strokeWidth={SW} />
          <RRect x={30} y={32} w={40} h={28} fill="#3a6ea5" strokeWidth={1.4} />
          <RRect x={36} y={68} w={28} h={14} fill="#d8d2c4" strokeWidth={SW} />
        </>
      );
    case "sockpuppet":
      // The dot-com mascot — a sock puppet.
      return (
        <>
          <RPath d="M38 28 Q50 20 60 30 L66 60 Q68 80 50 84 Q40 82 40 66 L28 54 Q26 40 38 28 Z" fill="#e8e2d6" strokeWidth={SW} />
          <RCircle cx={50} cy={40} d={6} fill={INK} strokeWidth={0.5} />
          <RLine x1={28} y1={54} x2={40} y2={52} strokeWidth={2} />
        </>
      );

    // ---- EP043 (credit cards) doodles ----
    case "cardreader":
      // A card payment terminal.
      return (
        <>
          <RRect x={30} y={30} w={40} h={56} fill="#2b2f33" strokeWidth={SW} />
          <RRect x={36} y={38} w={28} h={18} fill={GREEN} strokeWidth={1.4} />
          <RLine x1={36} y1={66} x2={64} y2={66} strokeWidth={2} />
          <RLine x1={36} y1={74} x2={64} y2={74} strokeWidth={2} />
          <RRect x={40} y={20} w={20} h={10} fill={GOLD} strokeWidth={1.4} />
        </>
      );
    case "mousetrap":
      // The debt trap.
      return (
        <>
          <RRect x={24} y={60} w={52} h={24} fill="#8a5a2b" strokeWidth={SW} />
          <RPath d="M30 60 L30 36 L70 44" fill="none" strokeWidth={SW} />
          <RCircle cx={58} cy={70} d={12} fill={GOLD} strokeWidth={1.4} />
        </>
      );

    // ---- EP044 (every type of investor) doodles ----
    case "bull":
      // Bull — the optimist (up).
      return (
        <>
          <RCircle cx={50} cy={56} d={40} fill={GREEN} strokeWidth={SW} />
          <RPath d="M30 42 Q20 28 30 22" fill="none" strokeWidth={SW} />
          <RPath d="M70 42 Q80 28 70 22" fill="none" strokeWidth={SW} />
          <RCircle cx={42} cy={52} d={5} fill={INK} strokeWidth={0.5} />
          <RCircle cx={58} cy={52} d={5} fill={INK} strokeWidth={0.5} />
          <RPath d="M42 74 L50 64 L58 74" fill="none" strokeWidth={2.4} />
        </>
      );
    case "bear":
      // Bear — the pessimist (down).
      return (
        <>
          <RCircle cx={50} cy={56} d={40} fill={RED} strokeWidth={SW} />
          <RCircle cx={32} cy={34} d={16} fill={RED} strokeWidth={SW} />
          <RCircle cx={68} cy={34} d={16} fill={RED} strokeWidth={SW} />
          <RCircle cx={42} cy={52} d={5} fill={INK} strokeWidth={0.5} />
          <RCircle cx={58} cy={52} d={5} fill={INK} strokeWidth={0.5} />
          <RPath d="M42 66 L50 76 L58 66" fill="none" strokeWidth={2.4} />
        </>
      );

    // ---- EP045 (fund types) doodles ----
    case "pie":
      // A pie chart — a diversified basket of holdings.
      return (
        <>
          <RCircle cx={50} cy={52} d={60} fill={TAN} strokeWidth={SW} />
          <RPath d="M50 52 L50 22 A30 30 0 0 1 76 66 Z" fill={GOLD} strokeWidth={1.4} />
          <RPath d="M50 52 L76 66 A30 30 0 0 1 28 70 Z" fill={GREEN} strokeWidth={1.4} />
          <RLine x1={50} y1={52} x2={28} y2={70} strokeWidth={1.4} />
        </>
      );
    case "rope":
      // A velvet rope — exclusivity / access.
      return (
        <>
          <RLine x1={26} y1={36} x2={26} y2={82} strokeWidth={SW} />
          <RLine x1={74} y1={36} x2={74} y2={82} strokeWidth={SW} />
          <RCircle cx={26} cy={32} d={10} fill={GOLD} strokeWidth={1.4} />
          <RCircle cx={74} cy={32} d={10} fill={GOLD} strokeWidth={1.4} />
          <RPath d="M26 42 Q50 72 74 42" fill="none" stroke={RED} strokeWidth={5} />
        </>
      );

    // ---- EP046 (US dominance ending) doodles ----
    case "chessking":
      // A chess king — global power and strategy.
      return (
        <>
          <RLine x1={44} y1={26} x2={56} y2={26} strokeWidth={3} />
          <RLine x1={50} y1={20} x2={50} y2={36} strokeWidth={3} />
          <RPath d="M38 44 Q50 34 62 44 L58 76 L42 76 Z" fill={GOLD} strokeWidth={SW} />
          <RRect x={34} y={76} w={32} h={10} fill={GOLD} strokeWidth={SW} />
        </>
      );
    case "risingcity":
      // A skyline of growing towers — emerging economies.
      return (
        <>
          <RRect x={22} y={60} w={14} h={24} fill={GREEN} strokeWidth={SW} />
          <RRect x={40} y={46} w={14} h={38} fill={GREEN} strokeWidth={SW} />
          <RRect x={58} y={30} w={14} h={54} fill={GREEN} strokeWidth={SW} />
          <RPath d="M18 32 L30 24 M34 28 L46 20" fill="none" stroke={INK} strokeWidth={2} />
        </>
      );

    // ---- EP047 (dollar reserve status) doodles ----
    case "grocerybag":
      // The cost of living / imported goods.
      return (
        <>
          <RPath d="M28 40 L72 40 L66 86 L34 86 Z" fill={TAN} strokeWidth={SW} />
          <RPath d="M40 40 Q40 28 50 28 Q60 28 60 40" fill="none" strokeWidth={SW} />
          <RLine x1={44} y1={52} x2={44} y2={62} strokeWidth={2} />
          <RCircle cx={58} cy={52} d={10} fill={RED} strokeWidth={1.2} />
        </>
      );
    case "scepter":
      // The dollar's reign.
      return (
        <>
          <RLine x1={38} y1={82} x2={62} y2={30} strokeWidth={5} />
          <RCircle cx={64} cy={26} d={16} fill={GOLD} strokeWidth={SW} />
          <RPath d="M64 16 L64 10 M60 13 L68 13" strokeWidth={2.4} />
        </>
      );

    // ---- EP048 (gold) doodles ----
    case "umbrella":
      // A safe haven.
      return (
        <>
          <RPath d="M20 48 Q50 18 80 48 Z" fill={RED} strokeWidth={SW} />
          <RLine x1={50} y1={48} x2={50} y2={80} strokeWidth={SW} />
          <RPath d="M50 80 Q58 80 58 72" fill="none" strokeWidth={SW} />
        </>
      );
    case "nugget":
      // A nugget of gold.
      return (
        <>
          <RPath d="M30 56 Q26 40 44 38 Q52 28 66 36 Q82 40 74 56 Q78 72 58 72 Q38 74 30 56 Z" fill={GOLD} strokeWidth={SW} />
          <RCircle cx={48} cy={50} d={5} fill="#fff" strokeWidth={0.5} />
        </>
      );

    // ---- EP049 (debt as a product) doodles ----
    case "moneytree":
      // Money from nothing.
      return (
        <>
          <RLine x1={50} y1={88} x2={50} y2={56} strokeWidth={5} />
          <RCircle cx={50} cy={40} d={46} fill={GREEN} strokeWidth={SW} />
          <text x={50} y={47} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text>
          <RRect x={42} y={86} w={16} h={8} fill={TAN} strokeWidth={1.4} />
        </>
      );
    case "ballchain":
      // The debt trap.
      return (
        <>
          <RCircle cx={58} cy={70} d={34} fill={INK} strokeWidth={SW} />
          <RCircle cx={30} cy={34} d={12} fill="none" strokeWidth={SW} />
          <RCircle cx={40} cy={47} d={12} fill="none" strokeWidth={SW} />
          <RLine x1={46} y1={54} x2={52} y2={60} strokeWidth={SW} />
        </>
      );
    case "decree":
      // A rolled certificate / proclamation with a wax seal — "by government order".
      return (
        <>
          <RRect x={22} y={20} w={56} h={60} fill={PARCH} strokeWidth={SW} />
          <RLine x1={30} y1={34} x2={70} y2={34} strokeWidth={1.8} />
          <RLine x1={30} y1={44} x2={70} y2={44} strokeWidth={1.8} />
          <RLine x1={30} y1={54} x2={62} y2={54} strokeWidth={1.8} />
          <RCircle cx={64} cy={70} d={22} fill={RED} strokeWidth={SW} />
          <text x={64} y={75} fontSize={12} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">★</text>
        </>
      );
    case "brokennote":
      // A torn banknote — a currency that has lost its value / trust.
      return (
        <>
          <RPath d="M12 34 L46 30 L44 72 L12 76 Z" fill="#cfe3d4" strokeWidth={SW} />
          <RPath d="M54 30 L88 34 L88 76 L56 72 Z" fill="#cfe3d4" strokeWidth={SW} />
          <RPath d="M46 30 L50 42 L44 52 L50 62 L44 72" fill="none" strokeWidth={1.8} />
          <RPath d="M54 30 L50 42 L56 52 L50 62 L56 72" fill="none" strokeWidth={1.8} />
          <text x={28} y={58} fontSize={16} fontWeight={900} fill="#2f6b46" textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "mountain":
      // A peak to climb — the summit of a wealth level.
      return (
        <>
          <RPath d="M10 82 L40 30 L58 56 L72 40 L90 82 Z" fill={TAN} strokeWidth={SW} />
          <RPath d="M31 43 L40 30 L49 43 L44 47 L40 42 L36 47 Z" fill="#fff" strokeWidth={1.4} />
          <RPath d="M64 49 L72 40 L80 50" fill="#fff" strokeWidth={1.4} />
          <RLine x1={40} y1={30} x2={40} y2={14} strokeWidth={SW} />
          <RPath d="M40 14 L54 18 L40 23 Z" fill={RED} strokeWidth={1.4} />
        </>
      );
    case "nestegg":
      // A nest holding a golden egg — savings that generate income.
      return (
        <>
          <RPath d="M20 66 Q50 50 80 66 Q78 80 50 82 Q22 80 20 66 Z" fill={TAN} strokeWidth={SW} />
          <REllipse cx={50} cy={54} w={36} h={46} fill={GOLD} strokeWidth={SW} />
          <RLine x1={44} y1={44} x2={40} y2={50} strokeWidth={1.4} />
          <RLine x1={24} y1={62} x2={16} y2={60} strokeWidth={1.4} />
          <RLine x1={76} y1={62} x2={84} y2={60} strokeWidth={1.4} />
        </>
      );
    case "birthdaycake":
      // A birthday cake with candles — age / milestones.
      return (
        <>
          <RRect x={22} y={52} w={56} h={34} fill={PINK} strokeWidth={SW} />
          <RPath d="M22 62 Q35 70 48 62 Q61 54 78 62" fill="none" strokeWidth={1.8} />
          <RLine x1={36} y1={52} x2={36} y2={38} strokeWidth={SW} />
          <RLine x1={50} y1={52} x2={50} y2={36} strokeWidth={SW} />
          <RLine x1={64} y1={52} x2={64} y2={38} strokeWidth={SW} />
          <RCircle cx={36} cy={34} d={7} fill={GOLD} strokeWidth={1.4} />
          <RCircle cx={50} cy={32} d={7} fill={GOLD} strokeWidth={1.4} />
          <RCircle cx={64} cy={34} d={7} fill={GOLD} strokeWidth={1.4} />
        </>
      );
    case "seedling":
      // A sprouting seedling — start early, let it grow.
      return (
        <>
          <RPath d="M38 86 Q50 70 62 86" fill={TAN} strokeWidth={SW} />
          <RLine x1={50} y1={84} x2={50} y2={40} strokeWidth={SW} />
          <RPath d="M50 54 Q32 48 28 32 Q46 34 50 54 Z" fill={GREEN} strokeWidth={1.8} />
          <RPath d="M50 48 Q68 42 72 26 Q54 28 50 48 Z" fill={GREEN} strokeWidth={1.8} />
        </>
      );
    case "safetynet":
      // A safety net catching a falling coin — the emergency fund.
      return (
        <>
          <RPath d="M14 54 Q50 72 86 54" fill="none" strokeWidth={SW} />
          <RLine x1={14} y1={54} x2={20} y2={70} strokeWidth={1.6} />
          <RLine x1={86} y1={54} x2={80} y2={70} strokeWidth={1.6} />
          <RLine x1={30} y1={60} x2={34} y2={72} strokeWidth={1.4} />
          <RLine x1={50} y1={64} x2={50} y2={76} strokeWidth={1.4} />
          <RLine x1={70} y1={60} x2={66} y2={72} strokeWidth={1.4} />
          <RCircle cx={50} cy={30} d={20} fill={GOLD} strokeWidth={SW} />
          <text x={50} y={36} fontSize={15} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "gear":
      // A gear — automation / "set it and forget it".
      return (
        <>
          <RCircle cx={50} cy={50} d={46} fill={TAN} strokeWidth={SW} />
          <RCircle cx={50} cy={50} d={18} fill={PARCH} strokeWidth={SW} />
          <RLine x1={50} y1={10} x2={50} y2={24} strokeWidth={SW} />
          <RLine x1={50} y1={76} x2={50} y2={90} strokeWidth={SW} />
          <RLine x1={10} y1={50} x2={24} y2={50} strokeWidth={SW} />
          <RLine x1={76} y1={50} x2={90} y2={50} strokeWidth={SW} />
          <RLine x1={22} y1={22} x2={32} y2={32} strokeWidth={SW} />
          <RLine x1={68} y1={68} x2={78} y2={78} strokeWidth={SW} />
          <RLine x1={78} y1={22} x2={68} y2={32} strokeWidth={SW} />
          <RLine x1={32} y1={68} x2={22} y2={78} strokeWidth={SW} />
        </>
      );
    case "velvetrope":
      // A VIP velvet rope between two posts — exclusivity.
      return (
        <>
          <RLine x1={24} y1={30} x2={24} y2={84} strokeWidth={SW} />
          <RCircle cx={24} cy={24} d={12} fill={GOLD} strokeWidth={SW} />
          <RLine x1={76} y1={30} x2={76} y2={84} strokeWidth={SW} />
          <RCircle cx={76} cy={24} d={12} fill={GOLD} strokeWidth={SW} />
          <RPath d="M24 34 Q50 62 76 34" fill="none" stroke={RED} strokeWidth={4} />
        </>
      );
    case "goldcard":
      // A premium metal card — VIP banking status.
      return (
        <>
          <RRect x={16} y={30} w={68} h={44} fill={GOLD} strokeWidth={SW} />
          <RRect x={24} y={40} w={16} h={12} fill={PARCH} strokeWidth={1.6} />
          <RLine x1={24} y1={62} x2={64} y2={62} strokeWidth={1.8} />
          <text x={50} y={50} fontSize={9} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">VIP</text>
        </>
      );
    case "hammock":
      // A hammock slung between two posts — retirement / leisure.
      return (
        <>
          <RLine x1={16} y1={24} x2={16} y2={84} strokeWidth={SW} />
          <RLine x1={84} y1={24} x2={84} y2={84} strokeWidth={SW} />
          <RPath d="M16 40 Q50 84 84 40" fill={TAN} strokeWidth={SW} />
          <RPath d="M16 40 Q50 72 84 40" fill="none" strokeWidth={1.4} />
        </>
      );
    case "medkit":
      // A medical kit — healthcare costs before Medicare.
      return (
        <>
          <RRect x={18} y={34} w={64} h={48} fill={RED} strokeWidth={SW} />
          <RRect x={40} y={26} w={20} h={10} fill="none" strokeWidth={SW} />
          <RLine x1={50} y1={46} x2={50} y2={70} stroke="#fff" strokeWidth={5} />
          <RLine x1={38} y1={58} x2={62} y2={58} stroke="#fff" strokeWidth={5} />
        </>
      );
    case "coffeecup":
      // A takeaway coffee cup — the $5/day latte reframe.
      return (
        <>
          <RPath d="M28 40 L72 40 L66 84 L34 84 Z" fill={PARCH} strokeWidth={SW} />
          <RRect x={24} y={32} w={52} h={10} fill={RED} strokeWidth={SW} />
          <RPath d="M48 20 Q42 26 48 32" fill="none" strokeWidth={1.8} />
          <RPath d="M56 18 Q50 26 56 34" fill="none" strokeWidth={1.8} />
        </>
      );
    case "snowball":
      // A snowball rolling and growing — compounding.
      return (
        <>
          <RLine x1={16} y1={82} x2={88} y2={82} strokeWidth={SW} />
          <RCircle cx={30} cy={72} d={16} fill="#eef3f6" strokeWidth={SW} />
          <RCircle cx={62} cy={60} d={40} fill="#eef3f6" strokeWidth={SW} />
          <RPath d="M20 66 Q40 56 48 64" fill="none" strokeWidth={1.4} />
        </>
      );
    case "rollercoaster":
      // A rollercoaster track — the terrifying ride of the market.
      return (
        <>
          <RPath d="M12 40 Q28 12 44 40 Q56 62 68 30 Q80 10 90 34" fill="none" stroke={RED} strokeWidth={3} />
          <RLine x1={12} y1={40} x2={12} y2={84} strokeWidth={1.6} />
          <RLine x1={44} y1={40} x2={44} y2={84} strokeWidth={1.6} />
          <RLine x1={68} y1={34} x2={68} y2={84} strokeWidth={1.6} />
          <RLine x1={12} y1={84} x2={90} y2={84} strokeWidth={SW} />
          <RRect x={78} y={26} w={14} h={10} fill={GOLD} strokeWidth={1.6} />
        </>
      );
    case "diamond":
      // A diamond — "diamond hands", holding through the crashes.
      return (
        <>
          <RPath d="M30 34 L70 34 L84 50 L50 86 L16 50 Z" fill="#bfe3ea" strokeWidth={SW} />
          <RLine x1={30} y1={34} x2={42} y2={50} strokeWidth={1.6} />
          <RLine x1={70} y1={34} x2={58} y2={50} strokeWidth={1.6} />
          <RLine x1={16} y1={50} x2={84} y2={50} strokeWidth={1.6} />
          <RLine x1={42} y1={50} x2={50} y2={86} strokeWidth={1.6} />
          <RLine x1={58} y1={50} x2={50} y2={86} strokeWidth={1.6} />
        </>
      );
    case "smiley":
      // A smiley face — happiness / well-being.
      return (
        <>
          <RCircle cx={50} cy={50} d={72} fill={YELLOW} strokeWidth={SW} />
          <RCircle cx={37} cy={42} d={7} fill={INK} strokeWidth={1.4} />
          <RCircle cx={63} cy={42} d={7} fill={INK} strokeWidth={1.4} />
          <RPath d="M34 60 Q50 76 66 60" fill="none" strokeWidth={SW} />
        </>
      );
    case "balloon":
      // An inflating balloon — lifestyle inflation.
      return (
        <>
          <REllipse cx={50} cy={40} w={56} h={64} fill={RED} strokeWidth={SW} />
          <RPath d="M46 70 L54 70 L50 78 Z" fill={RED} strokeWidth={1.6} />
          <RLine x1={50} y1={78} x2={50} y2={92} strokeWidth={1.6} />
          <RPath d="M38 30 Q44 22 52 26" fill="none" strokeWidth={1.4} />
        </>
      );
    case "wrench":
      // A wrench — maintenance / upkeep costs.
      return (
        <>
          <RPath d="M30 30 a14 14 0 1 0 14 14 L74 74 L82 66 L52 36 a14 14 0 0 0 -22 -6 Z" fill={TAN} strokeWidth={SW} />
          <RCircle cx={30} cy={34} d={12} fill={PARCH} strokeWidth={1.6} />
        </>
      );
    case "sofa":
      // A sofa — the home / living in it.
      return (
        <>
          <RRect x={18} y={48} w={64} h={28} fill={GOLD} strokeWidth={SW} />
          <RRect x={14} y={40} w={14} h={30} fill={TAN} strokeWidth={SW} />
          <RRect x={72} y={40} w={14} h={30} fill={TAN} strokeWidth={SW} />
          <RRect x={28} y={42} w={44} h={12} fill="#e8d7bf" strokeWidth={1.6} />
          <RLine x1={22} y1={76} x2={22} y2={84} strokeWidth={SW} />
          <RLine x1={78} y1={76} x2={78} y2={84} strokeWidth={SW} />
        </>
      );
    case "shovel":
      // A shovel — digging out of (or into) debt.
      return (
        <>
          <RLine x1={62} y1={18} x2={34} y2={60} strokeWidth={SW} />
          <RPath d="M22 54 L46 54 L40 78 Q34 86 28 78 Z" fill={TAN} strokeWidth={SW} />
          <RRect x={58} y={12} w={14} h={10} fill={TAN} strokeWidth={1.6} />
        </>
      );
    case "brokenchain":
      // A snapped chain link — breaking free of debt.
      return (
        <>
          <REllipse cx={30} cy={50} w={30} h={20} fill="none" strokeWidth={SW} />
          <REllipse cx={70} cy={50} w={30} h={20} fill="none" strokeWidth={SW} />
          <RPath d="M44 44 L50 38 L46 50 L52 46" fill="none" strokeWidth={1.8} />
          <RLine x1={48} y1={30} x2={44} y2={40} strokeWidth={1.4} />
          <RLine x1={54} y1={30} x2={58} y2={40} strokeWidth={1.4} />
        </>
      );
    case "palmtree":
      // A palm tree — high-cost paradise (Hawaii/California).
      return (
        <>
          <RPath d="M48 84 Q46 56 50 36" fill="none" strokeWidth={SW} />
          <RPath d="M50 36 Q30 26 14 32" fill="none" strokeWidth={SW} />
          <RPath d="M50 36 Q70 26 86 32" fill="none" strokeWidth={SW} />
          <RPath d="M50 36 Q34 20 22 14" fill="none" strokeWidth={SW} />
          <RPath d="M50 36 Q66 20 78 14" fill="none" strokeWidth={SW} />
          <RCircle cx={50} cy={34} d={8} fill={GOLD} strokeWidth={1.4} />
          <RPath d="M38 84 Q50 90 60 84" fill={TAN} strokeWidth={1.6} />
        </>
      );
    case "mappin":
      // A location pin — place / geography.
      return (
        <>
          <RPath d="M50 86 Q24 54 24 38 a26 26 0 0 1 52 0 Q76 54 50 86 Z" fill={RED} strokeWidth={SW} />
          <RCircle cx={50} cy={38} d={18} fill={PARCH} strokeWidth={1.8} />
        </>
      );
    case "tophat":
      // A top hat — classic old-money wealth.
      return (
        <>
          <RRect x={30} y={18} w={40} h={46} fill={INK} strokeWidth={SW} />
          <RRect x={16} y={62} w={68} h={12} fill={INK} strokeWidth={SW} />
          <RRect x={30} y={52} w={40} h={10} fill={RED} strokeWidth={1.6} />
        </>
      );
    case "champagne":
      // A champagne flute — luxury / celebration.
      return (
        <>
          <RPath d="M38 20 L62 20 L57 46 Q50 54 43 46 Z" fill="#f2e6a8" strokeWidth={SW} />
          <RLine x1={50} y1={54} x2={50} y2={80} strokeWidth={SW} />
          <RLine x1={38} y1={82} x2={62} y2={82} strokeWidth={SW} />
          <RCircle cx={46} cy={16} d={5} fill={GOLD} strokeWidth={1.2} />
          <RCircle cx={58} cy={12} d={5} fill={GOLD} strokeWidth={1.2} />
        </>
      );
    case "stopwatch":
      // A stopwatch — years to freedom.
      return (
        <>
          <RCircle cx={50} cy={56} d={56} fill={PARCH} strokeWidth={SW} />
          <RRect x={42} y={12} w={16} h={10} fill={INK} strokeWidth={1.6} />
          <RLine x1={50} y1={22} x2={50} y2={30} strokeWidth={SW} />
          <RLine x1={50} y1={56} x2={50} y2={36} strokeWidth={SW} />
          <RLine x1={50} y1={56} x2={66} y2={62} strokeWidth={SW} />
        </>
      );
    case "finishflag":
      // A checkered finish flag — the freedom finish line.
      return (
        <>
          <RLine x1={28} y1={16} x2={28} y2={86} strokeWidth={SW} />
          <RRect x={28} y={18} w={48} h={34} fill={PARCH} strokeWidth={SW} />
          <RRect x={28} y={18} w={12} h={11} fill={INK} strokeWidth={0} />
          <RRect x={52} y={18} w={12} h={11} fill={INK} strokeWidth={0} />
          <RRect x={40} y={29} w={12} h={11} fill={INK} strokeWidth={0} />
          <RRect x={64} y={29} w={12} h={11} fill={INK} strokeWidth={0} />
          <RRect x={28} y={40} w={12} h={12} fill={INK} strokeWidth={0} />
          <RRect x={52} y={40} w={12} h={12} fill={INK} strokeWidth={0} />
        </>
      );
    case "mailbox":
      // A mailbox with the flag up — passive checks arriving.
      return (
        <>
          <RRect x={30} y={44} w={46} h={34} fill={GREEN} strokeWidth={SW} />
          <RPath d="M30 44 Q53 28 76 44" fill={GREEN} strokeWidth={SW} />
          <RLine x1={40} y1={78} x2={40} y2={90} strokeWidth={SW} />
          <RRect x={76} y={40} w={4} h={20} fill={RED} strokeWidth={1.4} />
          <RRect x={78} y={40} w={12} h={10} fill={RED} strokeWidth={1.4} />
        </>
      );
    case "moon":
      // A crescent moon — earning while you sleep.
      return (
        <>
          <RPath d="M62 20 a34 34 0 1 0 0 60 a26 26 0 0 1 0 -60 Z" fill={YELLOW} strokeWidth={SW} />
          <RCircle cx={44} cy={30} d={5} fill="none" strokeWidth={1.2} />
          <RCircle cx={40} cy={66} d={4} fill="none" strokeWidth={1.2} />
        </>
      );
    case "cane":
      // A walking cane — old age / later decades.
      return (
        <>
          <RPath d="M42 20 Q62 20 62 40 L62 84" fill="none" strokeWidth={SW + 1} />
          <RLine x1={54} y1={84} x2={70} y2={84} strokeWidth={1.6} />
        </>
      );
    case "backpack":
      // A backpack — youth / school / the 20s.
      return (
        <>
          <RRect x={28} y={34} w={44} h={50} fill={GREEN} strokeWidth={SW} />
          <RPath d="M36 34 Q36 18 50 18 Q64 18 64 34" fill="none" strokeWidth={SW} />
          <RRect x={38} y={52} w={24} h={20} fill={PARCH} strokeWidth={1.6} />
          <RLine x1={50} y1={40} x2={50} y2={48} strokeWidth={1.6} />
        </>
      );
    case "moneystack":
      // A tall stack of cash bundles — scale of wealth.
      return (
        <>
          <RRect x={24} y={62} w={52} h={16} fill={GREEN} strokeWidth={1.8} />
          <RRect x={24} y={46} w={52} h={16} fill={GREEN} strokeWidth={1.8} />
          <RRect x={24} y={30} w={52} h={16} fill={GREEN} strokeWidth={1.8} />
          <RRect x={24} y={14} w={52} h={16} fill={GREEN} strokeWidth={1.8} />
          <text x={50} y={74} fontSize={10} fontWeight={900} fill="#2f6b46" textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "stadium":
      // A sports stadium — what $100M buys.
      return (
        <>
          <REllipse cx={50} cy={56} w={76} h={44} fill={TAN} strokeWidth={SW} />
          <REllipse cx={50} cy={56} w={44} h={22} fill={GREEN} strokeWidth={1.8} />
          <RLine x1={14} y1={56} x2={14} y2={44} strokeWidth={1.4} />
          <RLine x1={86} y1={56} x2={86} y2={44} strokeWidth={1.4} />
        </>
      );
    case "reportcard":
      // A report card / credit report with a grade.
      return (
        <>
          <RRect x={24} y={16} w={52} h={68} fill={PARCH} strokeWidth={SW} />
          <RLine x1={32} y1={30} x2={56} y2={30} strokeWidth={1.6} />
          <RLine x1={32} y1={40} x2={56} y2={40} strokeWidth={1.6} />
          <RCircle cx={56} cy={64} d={26} fill={GREEN} strokeWidth={SW} />
          <text x={56} y={70} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">A</text>
        </>
      );
    case "trafficlight":
      // A traffic light — red/yellow/green score bands.
      return (
        <>
          <RRect x={38} y={12} w={24} h={76} fill={INK} strokeWidth={SW} />
          <RCircle cx={50} cy={28} d={14} fill={RED} strokeWidth={1.4} />
          <RCircle cx={50} cy={50} d={14} fill={YELLOW} strokeWidth={1.4} />
          <RCircle cx={50} cy={72} d={14} fill={GREEN} strokeWidth={1.4} />
        </>
      );
    case "gift":
      // A wrapped gift — gifting to reduce the estate.
      return (
        <>
          <RRect x={24} y={40} w={52} h={44} fill={RED} strokeWidth={SW} />
          <RRect x={20} y={32} w={60} h={12} fill={GOLD} strokeWidth={SW} />
          <RLine x1={50} y1={32} x2={50} y2={84} strokeWidth={1.8} />
          <RPath d="M50 32 Q38 18 32 26 Q40 32 50 32" fill={GOLD} strokeWidth={1.4} />
          <RPath d="M50 32 Q62 18 68 26 Q60 32 50 32" fill={GOLD} strokeWidth={1.4} />
        </>
      );
    case "will":
      // A last will & testament scroll with a seal.
      return (
        <>
          <RRect x={26} y={16} w={48} h={62} fill={PARCH} strokeWidth={SW} />
          <text x={50} y={32} fontSize={10} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">WILL</text>
          <RLine x1={34} y1={42} x2={66} y2={42} strokeWidth={1.6} />
          <RLine x1={34} y1={50} x2={66} y2={50} strokeWidth={1.6} />
          <RLine x1={34} y1={58} x2={58} y2={58} strokeWidth={1.6} />
          <RCircle cx={60} cy={72} d={16} fill={RED} strokeWidth={1.6} />
        </>
      );
    case "paidstamp":
      // A 'PAID' stamp — mortgage paid off.
      return (
        <>
          <RPath d="M22 38 L78 32 L80 60 L24 66 Z" fill="none" stroke={GREEN} strokeWidth={4} />
          <text x={50} y={56} fontSize={20} fontWeight={900} fill={GREEN} textAnchor="middle" fontFamily="Georgia, serif" transform="rotate(-6 50 50)">PAID</text>
        </>
      );
    case "confetti":
      // Celebration confetti.
      return (
        <>
          <RRect x={20} y={24} w={10} h={10} fill={RED} strokeWidth={1.2} />
          <RRect x={46} y={16} w={10} h={10} fill={GOLD} strokeWidth={1.2} />
          <RRect x={72} y={28} w={10} h={10} fill={GREEN} strokeWidth={1.2} />
          <RCircle cx={34} cy={54} d={9} fill={GOLD} strokeWidth={1.2} />
          <RCircle cx={64} cy={58} d={9} fill={RED} strokeWidth={1.2} />
          <RRect x={30} y={74} w={10} h={10} fill={GREEN} strokeWidth={1.2} />
          <RRect x={60} y={78} w={10} h={10} fill={PINK} strokeWidth={1.2} />
        </>
      );
    case "parachute":
      // A parachute — surviving the fall.
      return (
        <>
          <RPath d="M14 46 Q50 6 86 46 Z" fill={GREEN} strokeWidth={SW} />
          <RLine x1={14} y1={46} x2={50} y2={46} strokeWidth={1.4} />
          <RLine x1={86} y1={46} x2={50} y2={46} strokeWidth={1.4} />
          <RLine x1={14} y1={46} x2={44} y2={76} strokeWidth={1.6} />
          <RLine x1={86} y1={46} x2={56} y2={76} strokeWidth={1.6} />
          <RLine x1={50} y1={46} x2={50} y2={76} strokeWidth={1.6} />
          <RCircle cx={50} cy={82} d={12} fill={PARCH} strokeWidth={SW} />
        </>
      );
    case "bargaintag":
      // A sale/bargain price tag — crash = discount.
      return (
        <>
          <RPath d="M20 30 L56 30 L84 58 L56 86 L20 58 Z" fill={RED} strokeWidth={SW} />
          <RCircle cx={36} cy={48} d={9} fill={PARCH} strokeWidth={1.6} />
          <text x={56} y={66} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">SALE</text>
        </>
      );
    case "thermostat":
      // A thermostat — rates as the economy's temperature dial.
      return (
        <>
          <RCircle cx={50} cy={54} d={64} fill={PARCH} strokeWidth={SW} />
          <RCircle cx={50} cy={54} d={10} fill={RED} strokeWidth={1.6} />
          <RLine x1={50} y1={54} x2={68} y2={38} strokeWidth={SW} />
          {[0,1,2,3,4].map(i=> <RLine key={i} x1={50 + 26*Math.cos((i/4)*3.14 - 3.14)} y1={54 + 26*Math.sin((i/4)*3.14 - 3.14)} x2={50 + 30*Math.cos((i/4)*3.14 - 3.14)} y2={54 + 30*Math.sin((i/4)*3.14 - 3.14)} strokeWidth={1.4} />)}
        </>
      );
    case "brake":
      // A brake pedal / hand brake — rates slowing the economy.
      return (
        <>
          <RLine x1={38} y1={84} x2={54} y2={30} strokeWidth={SW} />
          <RRect x={44} y={18} w={28} h={16} fill={RED} strokeWidth={SW} />
          <RCircle cx={38} cy={84} d={10} fill={INK} strokeWidth={1.4} />
        </>
      );
    case "fireextinguisher":
      // A fire extinguisher — the emergency tool.
      return (
        <>
          <RRect x={36} y={30} w={30} h={54} fill={RED} strokeWidth={SW} />
          <RRect x={44} y={22} w={14} h={10} fill={INK} strokeWidth={1.6} />
          <RLine x1={58} y1={26} x2={74} y2={34} strokeWidth={SW} />
          <RRect x={40} y={44} w={22} h={18} fill={PARCH} strokeWidth={1.4} />
        </>
      );
    case "pillow":
      // A pillow — sleep-at-night peace of mind.
      return (
        <>
          <RPath d="M18 42 Q50 30 82 42 Q86 64 82 74 Q50 86 18 74 Q14 64 18 42 Z" fill="#eef3f6" strokeWidth={SW} />
          <RCircle cx={30} cy={52} d={6} fill="none" strokeWidth={1.2} />
          <RCircle cx={70} cy={52} d={6} fill="none" strokeWidth={1.2} />
        </>
      );
    case "jar":
      // A savings jar filling with coins.
      return (
        <>
          <RRect x={28} y={26} w={44} h={58} fill="none" strokeWidth={SW} />
          <RRect x={32} y={20} w={36} h={10} fill={TAN} strokeWidth={SW} />
          <RRect x={30} y={56} w={40} h={26} fill={GOLD} strokeWidth={1.6} />
          <text x={50} y={74} fontSize={13} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </>
      );
    case "medal":
      // A medal — a milestone achieved.
      return (
        <>
          <RPath d="M38 18 L46 48 L36 48 Z" fill={RED} strokeWidth={1.6} />
          <RPath d="M62 18 L64 48 L54 48 Z" fill={ARMY} strokeWidth={1.6} />
          <RCircle cx={50} cy={64} d={34} fill={GOLD} strokeWidth={SW} />
          <text x={50} y={70} fontSize={16} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">★</text>
        </>
      );
    case "camera":
      // A camera — content creation.
      return (
        <>
          <RRect x={20} y={36} w={60} h={40} fill={TAN} strokeWidth={SW} />
          <RRect x={36} y={28} w={20} h={10} fill={INK} strokeWidth={1.6} />
          <RCircle cx={50} cy={56} d={22} fill={PARCH} strokeWidth={SW} />
          <RCircle cx={50} cy={56} d={10} fill={INK} strokeWidth={1.6} />
          <RCircle cx={70} cy={44} d={5} fill={RED} strokeWidth={1.2} />
        </>
      );
    case "shoppingcart":
      // A shopping cart — e-commerce.
      return (
        <>
          <RPath d="M20 28 L30 28 L40 64 L74 64" fill="none" strokeWidth={SW} />
          <RPath d="M32 36 L80 36 L74 58 L40 58 Z" fill={GOLD} strokeWidth={SW} />
          <RCircle cx={44} cy={74} d={8} fill={INK} strokeWidth={1.6} />
          <RCircle cx={70} cy={74} d={8} fill={INK} strokeWidth={1.6} />
        </>
      );
    case "skyline":
      // A city skyline — urban rent.
      return (
        <>
          <RRect x={16} y={46} w={20} h={40} fill={TAN} strokeWidth={SW} />
          <RRect x={40} y={24} w={22} h={62} fill={GOLD} strokeWidth={SW} />
          <RRect x={66} y={38} w={20} h={48} fill={PARCH} strokeWidth={SW} />
          <RRect x={46} y={32} w={4} h={6} fill={INK} strokeWidth={1} />
          <RRect x={54} y={32} w={4} h={6} fill={INK} strokeWidth={1} />
          <RRect x={46} y={46} w={4} h={6} fill={INK} strokeWidth={1} />
          <RRect x={54} y={46} w={4} h={6} fill={INK} strokeWidth={1} />
        </>
      );
    case "lease":
      // A lease document with a signature line.
      return (
        <>
          <RRect x={28} y={16} w={44} h={68} fill={PARCH} strokeWidth={SW} />
          <RLine x1={34} y1={30} x2={66} y2={30} strokeWidth={2} />
          <RLine x1={34} y1={40} x2={66} y2={40} strokeWidth={2} />
          <RLine x1={34} y1={50} x2={60} y2={50} strokeWidth={2} />
          <RPath d="M36 70 q6 -8 12 0 q6 8 12 -2" fill="none" strokeWidth={2.2} stroke={RED} />
        </>
      );
    case "truck":
      // A pickup truck — the big-payment vehicle.
      return (
        <>
          <RRect x={10} y={46} w={44} h={26} fill={GOLD} strokeWidth={SW} />
          <RPath d="M54 50 L74 50 L88 62 L88 72 L54 72 Z" fill={PARCH} strokeWidth={SW} />
          <RRect x={58} y={54} w={16} h={10} fill={INK} strokeWidth={1.4} />
          <RCircle cx={28} cy={76} d={14} fill={INK} strokeWidth={SW} />
          <RCircle cx={74} cy={76} d={14} fill={INK} strokeWidth={SW} />
        </>
      );
    case "steeringwheel":
      // A steering wheel.
      return (
        <>
          <RCircle cx={50} cy={52} d={62} fill="none" strokeWidth={SW} />
          <RCircle cx={50} cy={52} d={18} fill={GOLD} strokeWidth={SW} />
          <RLine x1={50} y1={61} x2={50} y2={82} strokeWidth={SW} />
          <RLine x1={41} y1={48} x2={23} y2={40} strokeWidth={SW} />
          <RLine x1={59} y1={48} x2={77} y2={40} strokeWidth={SW} />
        </>
      );
    case "diploma":
      // A rolled diploma with a ribbon.
      return (
        <>
          <RRect x={22} y={40} w={56} h={26} fill={PARCH} strokeWidth={SW} />
          <RCircle cx={22} cy={53} d={26} fill={PARCH} strokeWidth={SW} />
          <RCircle cx={78} cy={53} d={26} fill={PARCH} strokeWidth={SW} />
          <RLine x1={36} y1={50} x2={64} y2={50} strokeWidth={2} />
          <RLine x1={36} y1={57} x2={60} y2={57} strokeWidth={2} />
          <RCircle cx={50} cy={72} d={12} fill={RED} strokeWidth={1.6} />
        </>
      );
    case "books":
      // A stack of books — education.
      return (
        <>
          <RRect x={24} y={62} w={52} h={16} fill={RED} strokeWidth={SW} />
          <RRect x={20} y={46} w={56} h={16} fill={GOLD} strokeWidth={SW} />
          <RRect x={26} y={30} w={48} h={16} fill={ARMY} strokeWidth={SW} />
          <RLine x1={30} y1={38} x2={30} y2={78} strokeWidth={1.4} />
        </>
      );
    case "ticket":
      // A lottery ticket.
      return (
        <>
          <RRect x={16} y={34} w={68} h={34} fill={GOLD} strokeWidth={SW} />
          <RLine x1={54} y1={34} x2={54} y2={68} strokeWidth={1.6} />
          <text x={35} y={56} fontSize={13} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">$</text>
          <text x={69} y={55} fontSize={11} fontWeight={900} fill={INK} textAnchor="middle" fontFamily="Georgia, serif">777</text>
        </>
      );
    case "clover":
      // A four-leaf clover — luck.
      return (
        <>
          <RCircle cx={40} cy={40} d={22} fill={GREEN} strokeWidth={1.6} />
          <RCircle cx={60} cy={40} d={22} fill={GREEN} strokeWidth={1.6} />
          <RCircle cx={40} cy={60} d={22} fill={GREEN} strokeWidth={1.6} />
          <RCircle cx={60} cy={60} d={22} fill={GREEN} strokeWidth={1.6} />
          <RLine x1={50} y1={58} x2={54} y2={82} strokeWidth={2.4} />
        </>
      );
    case "rockingchair":
      // A rocking chair — retirement.
      return (
        <>
          <RLine x1={38} y1={26} x2={38} y2={70} strokeWidth={SW} />
          <RLine x1={38} y1={26} x2={58} y2={34} strokeWidth={SW} />
          <RLine x1={38} y1={48} x2={64} y2={54} strokeWidth={SW} />
          <RLine x1={38} y1={70} x2={66} y2={70} strokeWidth={SW} />
          <RLine x1={64} y1={54} x2={66} y2={70} strokeWidth={SW} />
          <RPath d="M30 78 Q50 86 74 76" fill="none" strokeWidth={SW} />
          <RLine x1={38} y1={70} x2={34} y2={78} strokeWidth={2} />
          <RLine x1={66} y1={70} x2={70} y2={77} strokeWidth={2} />
        </>
      );
    case "goldwatch":
      // A gold watch — the classic retirement gift.
      return (
        <>
          <RCircle cx={50} cy={52} d={44} fill={GOLD} strokeWidth={SW} />
          <RRect x={42} y={16} w={16} h={12} fill={TAN} strokeWidth={2} />
          <RRect x={42} y={76} w={16} h={12} fill={TAN} strokeWidth={2} />
          <RLine x1={50} y1={52} x2={50} y2={38} strokeWidth={2.4} />
          <RLine x1={50} y1={52} x2={62} y2={56} strokeWidth={2.4} />
        </>
      );
    case "mapleleaf":
      // A maple leaf — Canada.
      return (
        <>
          <RPath d="M50 16 L55 34 L70 28 L62 44 L82 48 L66 56 L72 72 L54 64 L50 84 L46 64 L28 72 L34 56 L18 48 L38 44 L30 28 L45 34 Z" fill={RED} strokeWidth={SW} />
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
