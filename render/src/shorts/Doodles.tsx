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
