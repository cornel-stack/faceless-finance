import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { display, sans } from "../fonts";

// ---------------------------------------------------------------------------
// Animated hand-drawn doodles for Shorts. Everything MOVES: strokes draw on,
// objects bob and orbit, money flies, numbers count up. No character — the
// illustrations carry the story. All deterministic (no Math.random/Date).
// Trick used throughout: pathLength={1} + strokeDasharray={1} +
// strokeDashoffset={1 - t}  → any shape "draws on" as t goes 0→1.
// ---------------------------------------------------------------------------

const INK = theme.ink;
const RED = theme.accent;
const GOLD = "#e8a33d";
const GREEN = theme.up;
const BLUE = "#2d6fb3";

const useT = (delay = 0, stiffness = 90, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200, stiffness, mass } });
};

const bob = (frame: number, fps: number, speed = 1, amp = 8, phase = 0) =>
  Math.sin((frame / fps) * speed * Math.PI * 2 + phase) * amp;

// A single flying dollar bill (used for money-flow loops)
const Bill: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-26} y={-16} width={52} height={32} rx={5} fill="#eaf6ec" stroke={GREEN} strokeWidth={3} />
    <circle cx={0} cy={0} r={9} fill="none" stroke={GREEN} strokeWidth={3} />
    <text x={0} y={6} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={16} fill={GREEN}>
      $
    </text>
  </g>
);

const Coin: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 22 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={GOLD} stroke={INK} strokeWidth={3} />
    <text x={0} y={r * 0.34} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={r} fill={INK}>
      $
    </text>
  </g>
);

const starPoints = (cx: number, cy: number, R: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const b = a + Math.PI / 5;
    pts.push(`${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`);
    pts.push(`${cx + R * 0.45 * Math.cos(b)},${cy + R * 0.45 * Math.sin(b)}`);
  }
  return pts.join(" ");
};

// Schematic national flag (recognisable, not literal). wave = slight skew.
const Flag: React.FC<{ country: "jp" | "cn" | "us"; w?: number; h?: number }> = ({ country, w = 150, h = 100 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const skew = bob(frame, fps, 0.5, 2.5);
  return (
    <g transform={`skewY(${skew})`}>
      <rect x={0} y={0} width={w} height={h} rx={4} fill="#fff" stroke={INK} strokeWidth={4} />
      {country === "jp" && <circle cx={w / 2} cy={h / 2} r={h * 0.28} fill={RED} />}
      {country === "cn" && (
        <>
          <rect x={0} y={0} width={w} height={h} rx={4} fill={RED} stroke={INK} strokeWidth={4} />
          <polygon points={starPoints(w * 0.22, h * 0.34, h * 0.2)} fill={GOLD} />
          <polygon points={starPoints(w * 0.42, h * 0.18, h * 0.08)} fill={GOLD} />
          <polygon points={starPoints(w * 0.46, h * 0.4, h * 0.08)} fill={GOLD} />
        </>
      )}
      {country === "us" && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={0} y={(i * 2 * h) / 7} width={w} height={h / 7} fill={RED} />
          ))}
          <rect x={0} y={0} width={w * 0.42} height={h * 0.54} fill={BLUE} />
        </>
      )}
    </g>
  );
};

// A pennant/label tag that says IOU — orbits the globe
const IouTag: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-34} y={-20} width={68} height={40} rx={6} fill="#fff" stroke={RED} strokeWidth={4} />
    <text x={0} y={8} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={24} fill={RED}>
      IOU
    </text>
  </g>
);

// ---- GLOBE: rotating meridians + orbiting IOU tags + question marks --------
export const Globe: React.FC<{ size?: number; question?: boolean }> = ({ size = 440, question }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT(2, 70);
  const C = 200;
  const R = 150;
  const spin = frame * 0.025;
  const tags = [0, 1, 2, 3].map((i) => {
    const a = frame * 0.012 + (i * Math.PI) / 2;
    const rr = 196 + bob(frame, fps, 0.6, 8, i);
    return { x: C + rr * Math.cos(a), y: C + rr * Math.sin(a), rot: Math.sin(a) * 12 };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      {/* globe */}
      <circle cx={C} cy={C} r={R} fill="#eef4f7" stroke={INK} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      {[0, 1, 2].map((i) => {
        const phase = spin + (i * Math.PI) / 3;
        const rx = Math.max(6, Math.abs(Math.cos(phase)) * R);
        return <ellipse key={i} cx={C} cy={C} rx={rx} ry={R} fill="none" stroke={BLUE} strokeWidth={4} opacity={0.55 * t} />;
      })}
      <ellipse cx={C} cy={C} rx={R} ry={R * 0.42} fill="none" stroke={BLUE} strokeWidth={4} opacity={0.55 * t} />
      {/* orbiting IOUs */}
      {t > 0.5 && tags.map((p, i) => <IouTag key={i} x={p.x} y={p.y} rot={p.rot} />)}
      {question && (
        <text x={C} y={C + 44} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={160} fill={RED} style={{ transform: `scale(${t})`, transformOrigin: "200px 200px" }}>
          ?
        </text>
      )}
    </svg>
  );
};

// ---- MONEY FLOW: China flag → curved arrow over ocean → US flag -----------
export const MoneyFlow: React.FC<{ size?: number }> = ({ size = 620 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = useT(6, 60);
  // three bills travel along the arc on a loop
  const path = { x0: 120, y0: 150, cx: 300, cy: 20, x1: 500, y1: 150 };
  const at = (u: number) => ({
    x: (1 - u) * (1 - u) * path.x0 + 2 * (1 - u) * u * path.cx + u * u * path.x1,
    y: (1 - u) * (1 - u) * path.y0 + 2 * (1 - u) * u * path.cy + u * u * path.y1,
  });
  const bills = [0, 1, 2].map((i) => {
    const u = ((frame / fps) * 0.4 + i / 3) % 1;
    return { ...at(u), u };
  });
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 620 300">
      {/* ocean waves */}
      {[220, 250, 280].map((y, i) => (
        <path key={i} d={`M20 ${y} q 40 -16 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} fill="none" stroke={BLUE} strokeWidth={4} opacity={0.5} transform={`translate(${bob(frame, fps, 0.4, 10, i)} 0)`} />
      ))}
      {/* curved money arrow */}
      <path d={`M${path.x0} ${path.y0} Q ${path.cx} ${path.cy} ${path.x1} ${path.y1}`} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" strokeDasharray={1} pathLength={1} strokeDashoffset={1 - draw} />
      {draw > 0.9 && <polygon points={`${path.x1},${path.y1} ${path.x1 - 22},${path.y1 - 14} ${path.x1 - 22},${path.y1 + 14}`} fill={RED} />}
      {/* flags */}
      <g transform="translate(40 110)"><Flag country="cn" w={150} h={100} /></g>
      <g transform="translate(440 110)"><Flag country="us" w={150} h={100} /></g>
      {/* traveling bills */}
      {draw > 0.6 && bills.map((b, i) => <Bill key={i} x={b.x} y={b.y} r={-20 + b.u * 40} />)}
    </svg>
  );
};

// ---- HOME: a house with money circulating inside (owed at home) ------------
export const HomeMoney: React.FC<{ size?: number }> = ({ size = 460 }) => {
  const frame = useCurrentFrame();
  const draw = useT(4, 60);
  const roof = useT(2, 70);
  const C = 200;
  const orbit = frame * 1.4;
  const coins = [0, 1, 2].map((i) => {
    const a = (orbit + i * 120) * (Math.PI / 180);
    return { x: C + 78 * Math.cos(a), y: 210 + 58 * Math.sin(a) };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      {/* body */}
      <path d="M90 180 L90 330 L310 330 L310 180" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {/* roof */}
      <path d="M70 185 L200 90 L330 185" fill="#f3d9b0" stroke={INK} strokeWidth={7} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - roof} />
      {/* door + window */}
      <rect x={250} y={255} width={44} height={75} rx={4} fill={GOLD} stroke={INK} strokeWidth={5} opacity={draw} />
      {/* circulating loop */}
      <circle cx={C} cy={210} r={78} fill="none" stroke={RED} strokeWidth={4} strokeDasharray="10 12" opacity={0.6 * draw} />
      {draw > 0.6 && coins.map((c, i) => <Coin key={i} x={c.x} y={c.y} r={20} />)}
    </svg>
  );
};

// ---- FLAG + growing/shrinking money stack ---------------------------------
export const FlagStack: React.FC<{ country: "jp" | "cn" | "us"; trend?: "up" | "down"; size?: number }> = ({ country, trend = "up", size = 440 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = useT(4, 55, 1);
  const maxBills = 6;
  const shown = trend === "up" ? Math.floor(grow * maxBills) : Math.max(2, Math.floor((1 - grow) * maxBills) + 2);
  const bills = Array.from({ length: shown }, (_, i) => i);
  const fallY = trend === "down" ? interpolate(grow, [0, 1], [0, 90]) : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      {/* flag on a pole */}
      <line x1={80} y1={60} x2={80} y2={330} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <g transform="translate(84 60)" style={{ transform: `translate(84px,60px) scale(${grow})`, transformOrigin: "84px 60px" }}>
        <Flag country={country} w={150} h={100} />
      </g>
      {/* money stack */}
      {bills.map((i) => {
        const y = 320 - i * 26;
        const off = (i % 2 === 0 ? -1 : 1) * 4;
        return <g key={i} transform={`translate(${250 + off} ${y})`}><Bill x={0} y={0} r={(i % 2 === 0 ? -1 : 1) * 3} s={1.35} /></g>;
      })}
      {trend === "up" ? (
        <polygon points="250,150 230,185 270,185" fill={GREEN} opacity={grow} />
      ) : (
        <g transform={`translate(0 ${fallY})`}>
          <polygon points="250,235 230,200 270,200" fill={RED} opacity={grow} />
        </g>
      )}
    </svg>
  );
};

// ---- BANK: the Fed, columns, printing bills that fly up --------------------
export const BankPrint: React.FC<{ size?: number }> = ({ size = 460 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = useT(2, 60);
  const bills = [0, 1, 2, 3].map((i) => {
    const u = ((frame / fps) * 0.5 + i / 4) % 1;
    return { x: 150 + i * 32, y: interpolate(u, [0, 1], [230, 40]), o: interpolate(u, [0, 0.2, 0.8, 1], [0, 1, 1, 0]) };
  });
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 400 320">
      {/* flying printed bills */}
      {bills.map((b, i) => (
        <g key={i} opacity={b.o}>
          <Bill x={b.x} y={b.y} r={-8 + i * 5} s={1.1} />
        </g>
      ))}
      {/* steps + base */}
      <rect x={60} y={250} width={280} height={24} fill="#fff" stroke={INK} strokeWidth={6} />
      <rect x={80} y={120} width={240} height={130} fill="#fff" stroke={INK} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {/* columns */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={100 + i * 56} y={135} width={26} height={115} fill="#f3f1ec" stroke={INK} strokeWidth={5} opacity={draw} />
      ))}
      {/* pediment */}
      <path d="M66 120 L200 50 L334 120 Z" fill="#f3d9b0" stroke={INK} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <text x={200} y={104} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={34} fill={RED} opacity={draw}>
        FED
      </text>
    </svg>
  );
};

// ---- COUNT-UP number -------------------------------------------------------
export const CountUp: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number; color?: string; size: number; delay?: number }> = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  color = RED,
  size,
  delay = 4,
}) => {
  const t = useT(delay, 55, 1);
  const v = value * t;
  return (
    <span style={{ fontFamily: display, fontWeight: 900, fontSize: size, lineHeight: 0.92, color, letterSpacing: -4 }}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// ---- CRASH CHART: a line rises then plunges, drawn left→right -------------
export const CrashChart: React.FC<{ size?: number }> = ({ size = 620 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT(2, 45, 1);
  // rise to a peak at ~60%, then crash
  const pts = [
    [40, 250], [110, 220], [180, 180], [250, 120], [320, 70], [360, 60],
    [400, 150], [440, 240], [480, 300], [520, 320],
  ];
  const d = "M" + pts.map((p) => `${p[0]} ${p[1]}`).join(" L ");
  // head dot follows the reveal
  const idx = Math.min(pts.length - 1, Math.floor(t * (pts.length - 1)));
  const head = pts[idx];
  const crashing = idx >= 5;
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 560 340">
      {/* axes */}
      <line x1={40} y1={320} x2={530} y2={320} stroke={INK} strokeWidth={4} opacity={0.5} />
      <line x1={40} y1={40} x2={40} y2={320} stroke={INK} strokeWidth={4} opacity={0.5} />
      <path d={d} fill="none" stroke={crashing ? RED : GREEN} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      <circle cx={head[0]} cy={head[1]} r={12} fill={crashing ? RED : GREEN} />
      {t > 0.95 && <polygon points="520,320 500,290 540,290" fill={RED} />}
    </svg>
  );
};

// ---- PRICE TAG: a swinging tag with a big $ label -------------------------
export const PriceTag: React.FC<{ size?: number; label?: string }> = ({ size = 360, label = "$" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT(2, 70);
  const swing = bob(frame, fps, 0.5, 4);
  return (
    <svg width={size} height={size} viewBox="0 0 300 300">
      <g transform={`rotate(${swing} 150 40)`}>
        <line x1={150} y1={20} x2={150} y2={70} stroke={INK} strokeWidth={5} />
        <g style={{ transform: `scale(${t})`, transformOrigin: "150px 170px" }}>
          <path d="M110 80 L220 80 L250 150 L170 230 L90 150 Z" fill={RED} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <circle cx={135} cy={118} r={12} fill="#fff" stroke={INK} strokeWidth={5} />
          <text x={170} y={172} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={54} fill="#fff">{label}</text>
        </g>
      </g>
    </svg>
  );
};

// ---- LOCK: a padlock, locked, with a little shake -------------------------
export const Lock: React.FC<{ size?: number }> = ({ size = 320 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT(2, 80);
  const shake = Math.sin(frame * 0.6) * 2 * Math.max(0, 1 - frame / 40);
  return (
    <svg width={size} height={size} viewBox="0 0 240 260">
      <g transform={`translate(${shake} 0)`}>
        <path d="M80 110 L80 70 A40 40 0 0 1 160 70 L160 110" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
        <rect x={55} y={110} width={130} height={110} rx={16} fill={GOLD} stroke={INK} strokeWidth={8} style={{ transform: `scale(${t})`, transformOrigin: "120px 165px" }} />
        <circle cx={120} cy={155} r={15} fill={INK} />
        <rect x={113} y={155} width={14} height={38} rx={6} fill={INK} />
      </g>
    </svg>
  );
};

// ---- BUILDING: a corporate tower that tilts + cracks (collapse) ------------
export const Building: React.FC<{ size?: number; collapse?: boolean }> = ({ size = 420, collapse = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT(2, 60);
  const tilt = collapse ? interpolate(t, [0.6, 1], [0, 7], { extrapolateLeft: "clamp" }) : 0;
  const win = (r: number, c: number) => {
    const lit = (r * 3 + c) % 4 !== 0 || t < 0.7;
    return <rect key={`${r}-${c}`} x={70 + c * 52} y={90 + r * 56} width={34} height={38} rx={3} fill={lit ? GOLD : "#444"} stroke={INK} strokeWidth={3} opacity={t} />;
  };
  const rows = [0, 1, 2, 3, 4];
  const cols = [0, 1, 2];
  return (
    <svg width={size} height={size} viewBox="0 0 360 420">
      <g transform={`rotate(${tilt} 180 390)`}>
        <rect x={56} y={60} width={200} height={330} fill="#fff" stroke={INK} strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
        {rows.map((r) => cols.map((c) => win(r, c)))}
        {collapse && t > 0.75 && <path d="M156 60 L150 180 L168 250 L156 390" fill="none" stroke={RED} strokeWidth={5} />}
      </g>
      <rect x={30} y={388} width={300} height={16} fill={INK} />
    </svg>
  );
};

// ---- VAULT: a bank vault door, ajar and nearly empty ----------------------
export const Vault: React.FC<{ size?: number }> = ({ size = 420 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT(2, 60);
  const spin = frame * 2;
  return (
    <svg width={size} height={size} viewBox="0 0 400 360">
      <rect x={40} y={40} width={320} height={280} rx={16} fill="#eceae4" stroke={INK} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      <circle cx={200} cy={180} r={110} fill="#fff" stroke={INK} strokeWidth={7} opacity={t} />
      <circle cx={200} cy={180} r={78} fill="none" stroke={INK} strokeWidth={5} opacity={t} />
      <g transform={`rotate(${spin} 200 180)`} opacity={t}>
        <line x1={200} y1={120} x2={200} y2={240} stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <line x1={140} y1={180} x2={260} y2={180} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      </g>
      {/* a lone coin rolling out (the "fraction" left) */}
      {t > 0.7 && <Coin x={70 + bob(frame, fps, 0.5, 10)} y={300} r={18} />}
    </svg>
  );
};

// ---- US MAP: simplified silhouette with a pulsing pin (find your state) ----
export const USMap: React.FC<{ size?: number }> = ({ size = 600 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT(2, 55);
  const pulse = 1 + Math.sin(frame * 0.2) * 0.12;
  const d =
    "M40 110 L150 90 L300 80 L470 70 L560 95 L540 150 L560 200 L520 230 L470 220 L430 250 L300 255 L250 240 L160 240 L120 200 L70 190 Z";
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 600 300">
      <path d={d} fill="#eef4f7" stroke={INK} strokeWidth={7} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      {t > 0.7 && (
        <g transform={`translate(320 150) scale(${pulse})`}>
          <path d="M0 -44 C 26 -44 34 -20 0 26 C -34 -20 -26 -44 0 -44 Z" fill={RED} stroke={INK} strokeWidth={5} />
          <circle cx={0} cy={-26} r={11} fill="#fff" />
        </g>
      )}
    </svg>
  );
};

// ---- MINI ICONS: small animated props scattered around a shot -------------
export type MiniName =
  | "coin" | "bill" | "iou" | "question" | "bank" | "piggy" | "house"
  | "chartDown" | "chartUp" | "x" | "check" | "loop" | "globe" | "fire" | "clock";

export const MiniIcon: React.FC<{ name: MiniName; delay?: number; size?: number }> = ({ name, delay = 0, size = 92 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 160, stiffness: 180, mass: 0.5 } });
  const y = bob(frame, fps, 0.8, 6, delay);
  const rot = Math.sin((frame / fps) * 2 + delay) * 5;
  let art: React.ReactNode = null;
  switch (name) {
    case "coin":
      art = (<><circle cx={50} cy={50} r={34} fill={GOLD} stroke={INK} strokeWidth={5} /><text x={50} y={64} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={40} fill={INK}>$</text></>);
      break;
    case "bill":
      art = (<><rect x={14} y={28} width={72} height={44} rx={6} fill="#eaf6ec" stroke={GREEN} strokeWidth={5} /><circle cx={50} cy={50} r={13} fill="none" stroke={GREEN} strokeWidth={4} /><text x={50} y={60} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={22} fill={GREEN}>$</text></>);
      break;
    case "iou":
      art = (<><rect x={14} y={30} width={72} height={40} rx={6} fill="#fff" stroke={RED} strokeWidth={5} /><text x={50} y={60} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={28} fill={RED}>IOU</text></>);
      break;
    case "question":
      art = (<text x={50} y={74} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={84} fill={RED}>?</text>);
      break;
    case "bank":
      art = (<><path d="M16 40 L50 20 L84 40 Z" fill="#f3d9b0" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={22} y={44} width={10} height={30} fill="#fff" stroke={INK} strokeWidth={4} /><rect x={45} y={44} width={10} height={30} fill="#fff" stroke={INK} strokeWidth={4} /><rect x={68} y={44} width={10} height={30} fill="#fff" stroke={INK} strokeWidth={4} /><rect x={14} y={76} width={72} height={8} fill={INK} /></>);
      break;
    case "piggy":
      art = (<><ellipse cx={50} cy={54} rx={34} ry={26} fill={RED} stroke={INK} strokeWidth={5} /><circle cx={64} cy={48} r={4} fill="#fff" /><rect x={40} y={24} width={16} height={8} rx={3} fill={RED} stroke={INK} strokeWidth={3} /><rect x={30} y={76} width={8} height={10} fill={INK} /><rect x={60} y={76} width={8} height={10} fill={INK} /></>);
      break;
    case "house":
      art = (<><path d="M18 50 L50 24 L82 50 Z" fill="#f3d9b0" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={28} y={50} width={44} height={30} fill="#fff" stroke={INK} strokeWidth={5} /><rect x={44} y={60} width={14} height={20} fill={GOLD} stroke={INK} strokeWidth={3} /></>);
      break;
    case "chartDown":
      art = (<><polyline points="16,26 38,46 54,38 84,78" fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /><polygon points="84,78 66,74 78,60" fill={RED} /></>);
      break;
    case "chartUp":
      art = (<><polyline points="16,78 38,52 54,60 84,24" fill="none" stroke={GREEN} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /><polygon points="84,24 66,28 78,42" fill={GREEN} /></>);
      break;
    case "x":
      art = (<><line x1={24} y1={24} x2={76} y2={76} stroke={RED} strokeWidth={11} strokeLinecap="round" /><line x1={76} y1={24} x2={24} y2={76} stroke={RED} strokeWidth={11} strokeLinecap="round" /></>);
      break;
    case "check":
      art = (<polyline points="22,52 42,72 80,26" fill="none" stroke={GREEN} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />);
      break;
    case "loop":
      art = (<><path d="M30 64 A24 24 0 1 1 54 76" fill="none" stroke={BLUE} strokeWidth={7} strokeLinecap="round" /><polygon points="54,78 40,70 44,86" fill={BLUE} /></>);
      break;
    case "globe":
      art = (<><circle cx={50} cy={50} r={32} fill="#eef4f7" stroke={INK} strokeWidth={5} /><ellipse cx={50} cy={50} rx={13} ry={32} fill="none" stroke={BLUE} strokeWidth={4} /><line x1={18} y1={50} x2={82} y2={50} stroke={BLUE} strokeWidth={4} /></>);
      break;
    case "fire":
      art = (<path d="M50 20 C62 38 74 42 66 64 C62 78 38 78 34 64 C30 52 44 52 42 38 C50 46 44 30 50 20 Z" fill={RED} stroke={INK} strokeWidth={4} strokeLinejoin="round" />);
      break;
    case "clock":
      art = (<><circle cx={50} cy={52} r={30} fill="#fff" stroke={INK} strokeWidth={5} /><line x1={50} y1={52} x2={50} y2={32} stroke={INK} strokeWidth={5} strokeLinecap="round" /><line x1={50} y1={52} x2={66} y2={58} stroke={INK} strokeWidth={5} strokeLinecap="round" /></>);
      break;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `translateY(${y}px) rotate(${rot}deg) scale(${t})`, opacity: t }}>
      {art}
    </svg>
  );
};

// ---- GLOBE with a big red X struck through (not abroad) --------------------
export const GlobeX: React.FC<{ size?: number }> = ({ size = 440 }) => {
  const frame = useCurrentFrame();
  const t = useT(2, 90);
  const x = useT(10, 120);
  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      <circle cx={200} cy={200} r={140} fill="#eef4f7" stroke={INK} strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} opacity={0.7} />
      <ellipse cx={200} cy={200} rx={56} ry={140} fill="none" stroke={BLUE} strokeWidth={4} opacity={0.5 * t} />
      <line x1={200} y1={60} x2={200} y2={340} stroke={BLUE} strokeWidth={4} opacity={0.5 * t} />
      <line x1={70} y1={70} x2={330} y2={330} stroke={RED} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - x} />
    </svg>
  );
};

// ---- Drifting $ background (subtle life behind every scene) ----------------
export const MoneyDust: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seeds = [
    { x: 120, p: 0, s: 26, sp: 0.5 },
    { x: 300, p: 2, s: 34, sp: 0.4 },
    { x: 520, p: 4, s: 22, sp: 0.6 },
    { x: 760, p: 1, s: 30, sp: 0.45 },
    { x: 950, p: 3, s: 24, sp: 0.55 },
    { x: 220, p: 5, s: 20, sp: 0.5 },
    { x: 640, p: 1.5, s: 28, sp: 0.42 },
    { x: 860, p: 3.5, s: 22, sp: 0.6 },
  ];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {seeds.map((d, i) => {
        const cycle = ((frame / fps) * d.sp + d.p) % 3;
        const y = 1920 - (cycle / 3) * 2000;
        const o = interpolate(cycle, [0, 0.4, 2.6, 3], [0, 0.12, 0.12, 0]);
        const drift = bob(frame, fps, 0.3, 30, d.p);
        return (
          <text key={i} x={d.x + drift} y={y} fontFamily={display} fontWeight={900} fontSize={d.s * 2.2} fill={INK} opacity={o}>
            $
          </text>
        );
      })}
    </svg>
  );
};
