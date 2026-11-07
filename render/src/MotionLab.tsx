import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "./theme";
import { sans } from "./fonts";

// A library of hand-drawn MOTION effects, previewed as film strips (each cell is
// a later frame, so reading left→right shows how the effect moves).

const HOUSE = "M18 84 L18 46 L50 20 L82 46 L82 84 Z";
const DOOR = "M44 84 L44 62 L58 62 L58 84";
const SW = 4;

const Pen: React.FC<{ children: React.ReactNode; filter?: string; transform?: string }> = ({ children, filter, transform }) => (
  <g filter={filter} transform={transform} stroke={theme.ink} strokeWidth={SW} fill="none" strokeLinejoin="round" strokeLinecap="round">
    {children}
  </g>
);

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 100 100" width={150} height={150}>{children}</svg>
);

type Eff = React.FC<{ atFrame?: number }>;

// 1. Line boil — the outline wiggles frame to frame (displacement seed changes).
const Boil: Eff = ({ atFrame }) => {
  const f = atFrame ?? useCurrentFrame();
  const id = React.useId().replace(/:/g, "");
  const seed = Math.floor(f / 2) % 9;
  return (
    <Svg>
      <defs>
        <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="turbulence" baseFrequency="0.016" numOctaves="2" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="13" />
        </filter>
      </defs>
      <Pen filter={`url(#${id})`}><path d={HOUSE} fill="#fff" /><path d={DOOR} /></Pen>
    </Svg>
  );
};

// 2. Draw-on — the shape sketches itself in via stroke dash.
const DrawOn: Eff = ({ atFrame }) => {
  const f = atFrame ?? useCurrentFrame();
  const h = interpolate(f, [0, 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const d = interpolate(f, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Svg>
      <Pen>
        <path d={HOUSE} fill="#fff" strokeDasharray={260} strokeDashoffset={260 * (1 - h)} />
        <path d={DOOR} strokeDasharray={70} strokeDashoffset={70 * (1 - d)} />
      </Pen>
    </Svg>
  );
};

// 3. Draw-on + boil — sketch in with a wobbling line.
const DrawOnBoil: Eff = ({ atFrame }) => {
  const f = atFrame ?? useCurrentFrame();
  const id = React.useId().replace(/:/g, "");
  const seed = Math.floor(f / 2) % 9;
  const h = interpolate(f, [0, 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const d = interpolate(f, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Svg>
      <defs>
        <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="turbulence" baseFrequency="0.016" numOctaves="2" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="13" />
        </filter>
      </defs>
      <Pen filter={`url(#${id})`}>
        <path d={HOUSE} fill="#fff" strokeDasharray={260} strokeDashoffset={260 * (1 - h)} />
        <path d={DOOR} strokeDasharray={70} strokeDashoffset={70 * (1 - d)} />
      </Pen>
    </Svg>
  );
};

// 4. Jitter — a hand-held shake (erratic position + tiny rotation).
const Jitter: Eff = ({ atFrame }) => {
  const f = atFrame ?? useCurrentFrame();
  const dx = Math.sin(f * 2.3) * 1.7 + Math.sin(f * 5.1) * 0.9;
  const dy = Math.cos(f * 1.9) * 1.7 + Math.cos(f * 4.3) * 0.8;
  const rot = Math.sin(f * 3.1) * 1.3;
  return (
    <Svg>
      <Pen transform={`translate(${dx} ${dy}) rotate(${rot} 50 50)`}><path d={HOUSE} fill="#fff" /><path d={DOOR} /></Pen>
    </Svg>
  );
};

// 5. Wiggle — a gentle back-and-forth tilt, pivoting at the base.
const Wiggle: Eff = ({ atFrame }) => {
  const f = atFrame ?? useCurrentFrame();
  const rot = Math.sin(f * 0.5) * 4;
  return (
    <Svg>
      <Pen transform={`rotate(${rot} 50 84)`}><path d={HOUSE} fill="#fff" /><path d={DOOR} /></Pen>
    </Svg>
  );
};

// 6. Redraw flicker — 3 slightly different drawings shown one per frame, the
//    classic "redrawn by hand every frame" boil.
const VARIANTS = [[0, 0, 0], [0.9, -0.7, 0.7], [-0.8, 0.6, -0.6]];
const Redraw: Eff = ({ atFrame }) => {
  const f = atFrame ?? useCurrentFrame();
  const [dx, dy, rot] = VARIANTS[f % 3];
  return (
    <Svg>
      <Pen transform={`translate(${dx} ${dy}) rotate(${rot} 50 50)`}><path d={HOUSE} fill="#fff" /><path d={DOOR} /></Pen>
    </Svg>
  );
};

const EFFECTS: [string, Eff][] = [
  ["1 · Line boil", Boil],
  ["2 · Draw-on", DrawOn],
  ["3 · Draw-on + boil", DrawOnBoil],
  ["4 · Jitter (hand-held)", Jitter],
  ["5 · Wiggle", Wiggle],
  ["6 · Redraw flicker", Redraw],
];

// Live grid (for an MP4 preview) — each effect animates continuously.
const LiveCell: React.FC<{ label: string; Comp: Eff; loop?: boolean }> = ({ label, Comp, loop }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: 560, height: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <div style={{ transform: "scale(2.2)" }}>
        <Comp atFrame={loop ? f % 50 : undefined} />
      </div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 32, color: theme.ink }}>{label}</div>
    </div>
  );
};

export const MotionReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: theme.bg, flexDirection: "row", flexWrap: "wrap", alignContent: "center", justifyContent: "center", padding: 40 }}>
    <LiveCell label="1 · Line boil" Comp={Boil} />
    <LiveCell label="2 · Draw-on" Comp={DrawOn} loop />
    <LiveCell label="3 · Draw-on + boil" Comp={DrawOnBoil} loop />
    <LiveCell label="4 · Jitter" Comp={Jitter} />
    <LiveCell label="5 · Wiggle" Comp={Wiggle} />
    <LiveCell label="6 · Redraw flicker" Comp={Redraw} />
  </AbsoluteFill>
);

const STEP = 2;
const CELLS = 8;

export const MotionLab: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: theme.bg, padding: "36px 48px", flexDirection: "column" }}>
    <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 30, color: theme.inkSoft, marginBottom: 10 }}>
      Hand-drawn motion library — each row read left → right is consecutive frames (the motion)
    </div>
    {EFFECTS.map(([label, Comp]) => (
      <div key={label} style={{ display: "flex", alignItems: "center", height: 162 }}>
        <div style={{ width: 268, fontFamily: sans, fontWeight: 700, fontSize: 28, color: theme.ink }}>{label}</div>
        {Array.from({ length: CELLS }).map((_, j) => (
          <div key={j} style={{ width: 176, height: 160, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: `1px dashed ${theme.grid}` }}>
            <Comp atFrame={j * STEP} />
          </div>
        ))}
      </div>
    ))}
  </AbsoluteFill>
);
