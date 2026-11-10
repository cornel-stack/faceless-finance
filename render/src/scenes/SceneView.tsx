import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile, Easing } from "remotion";
import { Gif } from "@remotion/gif";
import { theme, money } from "../theme";
import { display, sans } from "../fonts";
import { Mascot } from "../components/Mascot";
import { Doodle, DoodleName } from "../components/Doodle";
import { Arrow } from "../components/Arrow";
import { SpeechBubble } from "../components/SpeechBubble";
import { ScreenshotSource } from "../components/ScreenshotSource";
import { RRect, RPath, RLine } from "../motion/rough";
import type { SourceEntry } from "../SourceCardDemo";
import type {
  Scene, TitleScene, CharacterScene, CalloutScene, ScreenshotScene,
  ChartScene, DoodleScene, ChalkboardScene, CompareScene, TimelineScene,
  ImageScene, DiagramScene, StageScene, GifScene,
} from "./types";

const EASE = { damping: 200 } as const;

const Title: React.FC<{ scene: TitleScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame, fps, delay: 2, config: EASE });
  const h = spring({ frame, fps, delay: 8, config: EASE });
  const line = interpolate(frame, [16, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 140, textAlign: "center" }}>
      {scene.kicker && (
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, letterSpacing: 8, color: theme.accent, textTransform: "uppercase", opacity: k }}>
          {scene.kicker}
        </div>
      )}
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 104, lineHeight: 1.04, color: theme.ink, marginTop: 24, opacity: h, transform: `translateY(${interpolate(h, [0, 1], [34, 0])}px)` }}>
        {scene.heading}
      </div>
      <div style={{ height: 8, width: line * 380, background: theme.accent, borderRadius: 4, marginTop: 34 }} />
      {scene.sub && <div style={{ fontFamily: sans, fontSize: 42, color: theme.inkSoft, marginTop: 30, opacity: h }}>{scene.sub}</div>}
    </AbsoluteFill>
  );
};

// Scattered slots for the prop cluster beside the character. Layout is fixed for
// the FULL prop count so props keep their place as they accumulate across a scene.
const PROP_SLOTS: { x: number; y: number; s: number }[][] = [
  [],
  [{ x: 1200, y: 420, s: 400 }],
  [{ x: 1010, y: 300, s: 340 }, { x: 1470, y: 560, s: 320 }],
  [{ x: 1000, y: 270, s: 310 }, { x: 1500, y: 330, s: 280 }, { x: 1230, y: 640, s: 330 }],
  [{ x: 970, y: 250, s: 270 }, { x: 1440, y: 270, s: 260 }, { x: 1120, y: 580, s: 290 }, { x: 1560, y: 610, s: 240 }],
  [{ x: 960, y: 230, s: 235 }, { x: 1360, y: 220, s: 225 }, { x: 1620, y: 440, s: 215 }, { x: 1120, y: 560, s: 245 }, { x: 1500, y: 620, s: 225 }],
];

const Character: React.FC<{ scene: CharacterScene }> = ({ scene }) => {
  const { width } = useVideoConfig();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const props = scene.props ?? [];
  const hasProps = props.length > 0;
  const hasBubble = Boolean(scene.bubble);
  const mW = 520, mH = 880;

  // How many props are visible this shot. Props accumulate across a scene: the
  // ones already mentioned stay put (static), only the newest pops in — so the
  // host can build up a cluster and then explain how they connect.
  const reveal = Math.min(scene.reveal ?? props.length, props.length);

  // Side alternates scene-to-scene (parity of the base scene number) but stays
  // CONSTANT across a scene's accumulation sub-shots, so nothing jumps sides.
  const num = parseInt(scene.id.match(/\d+/)?.[0] ?? "0", 10);
  const slotN = Math.min(props.length, PROP_SLOTS.length - 1);
  const charRight = hasProps && num % 2 === 0;
  const charLeft = charRight ? width - mW - 110 : hasProps || hasBubble ? 110 : (width - mW) / 2;
  const flip = charRight;
  const slots = hasProps
    ? PROP_SLOTS[slotN].map((s) => (charRight ? { ...s, x: 1920 - s.x } : s))
    : [];
  const enter = spring({ frame, fps, config: { damping: 13, mass: 0.7 } });

  return (
    <AbsoluteFill>
      {/* props: show the first `reveal`; newest pops in, earlier ones hold still */}
      {hasProps && props.slice(0, slots.length).map((p, i) => {
        if (i >= reveal) return null;
        const slot = slots[i];
        const isNewest = i === reveal - 1;
        const s = isNewest ? spring({ frame, fps, delay: 3, config: { damping: 12, mass: 0.6 } }) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: slot.x - slot.s / 2, top: slot.y - slot.s / 2, width: slot.s, transform: `scale(${s})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Doodle name={p.name} size={slot.s} />
            {p.label && <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: theme.ink, textAlign: "center" }}>{p.label}</div>}
          </div>
        );
      })}
      {/* character */}
      <div style={{ position: "absolute", left: charLeft, bottom: 10, width: mW, height: mH, transform: `translateY(${(1 - enter) * 40}px) scale(${0.92 + enter * 0.08})`, transformOrigin: "bottom center" }}>
        <Mascot pose={scene.pose ?? "stand"} expression={scene.expression} variant={scene.variant} flip={flip} width={mW} height={mH} />
      </div>
      {hasBubble && (
        <div style={{ position: "absolute", left: flip ? charLeft - 300 : charLeft + 40, top: 120, width: 660 }}>
          <SpeechBubble text={scene.bubble!} width={660} tail="down" delay={6} />
        </div>
      )}
      {scene.caption && (
        <div style={{ position: "absolute", left: 0, bottom: 56, width, textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 54, color: theme.ink }}>{scene.caption}</div>
      )}
    </AbsoluteFill>
  );
};

const Callout: React.FC<{ scene: CalloutScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11, mass: 0.8 } });
  const shake = scene.break ? Math.sin(frame * 0.9) * interpolate(frame, [12, 34], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const sub = interpolate(frame, [16, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Count-up for pure number/currency callouts.
  const m = scene.text.trim().match(/^(\$?)([\d,]+)(%|\/[A-Za-z]+)?$/);
  let display = scene.text;
  if (m) {
    const target = parseInt(m[2].replace(/,/g, ""), 10);
    const p = interpolate(frame, [2, fps * 1.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    display = m[1] + Math.round(target * p).toLocaleString("en-US") + (m[3] || "");
  }

  const fs = Math.min(200, Math.floor(1720 / Math.max(3, display.length * 0.56)));
  // drawn-on red emphasis circle, hugging the number
  const cx = 960, cyE = 486;
  const rx = Math.min(870, display.length * fs * 0.28 + 64);
  const ry = fs * 0.62;
  const ell = `M ${cx - rx} ${cyE} C ${cx - rx} ${cyE - ry * 1.1} ${cx + rx} ${cyE - ry * 1.1} ${cx + rx} ${cyE} C ${cx + rx} ${cyE + ry * 1.1} ${cx - rx} ${cyE + ry * 1.1} ${cx - rx} ${cyE} Z`;
  const circLen = 7 * Math.sqrt((rx * rx + ry * ry) / 2);
  const rev = interpolate(frame, [fps * 0.55, fps * 1.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const iconPop = spring({ frame, fps, delay: 3, config: { damping: 12, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      {scene.icon ? (
        <div style={{ transform: `scale(${iconPop})`, marginBottom: 20 }}><Doodle name={scene.icon} size={230} /></div>
      ) : (
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <path d={ell} fill="none" stroke={theme.accent} strokeWidth={9} strokeLinecap="round" strokeDasharray={circLen} strokeDashoffset={circLen * (1 - rev)} transform={`rotate(-4 ${cx} ${cyE})`} />
        </svg>
      )}
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: fs, color: scene.break ? theme.accent : theme.ink, transform: `scale(${s}) translateX(${shake}px)`, lineHeight: 1, position: "relative", marginTop: scene.icon ? 0 : -40 }}>
        {display}
      </div>
      {scene.sub && <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 50, color: theme.inkSoft, marginTop: 40, opacity: sub, textAlign: "center", maxWidth: 1400 }}>{scene.sub}</div>}
    </AbsoluteFill>
  );
};

const Screenshot: React.FC<{ scene: ScreenshotScene; sources?: Record<string, SourceEntry> }> = ({ scene, sources }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entry = sources?.[scene.sourceId];
  const zoom = interpolate(frame, [0, fps * 7], [1, 1.05], { extrapolateRight: "clamp" });
  if (!entry) {
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: sans, fontSize: 40, color: theme.inkSoft }}>[screenshot pending: {scene.sourceId}]</div>
      </AbsoluteFill>
    );
  }
  const w = scene.caption ? 1280 : 1440;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24 }}>
      {scene.caption && (
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 50, color: theme.ink, textAlign: "center", maxWidth: 1500 }}>{scene.caption}</div>
      )}
      <div>
        <ScreenshotSource image={entry.image} naturalW={entry.width} naturalH={entry.height} url={entry.url} quoteRect={entry.quoteRect} words={entry.words} width={w} />
      </div>
      {scene.reaction && (
        <div style={{ position: "absolute", right: 36, bottom: 8, width: 230, height: 360 }}>
          <Mascot pose="point" expression={scene.reaction} width={230} height={360} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const SceneChart: React.FC<{ scene: ChartScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clipId = React.useId().replace(/:/g, "");
  const W = 1500, H = 720, padL = 60, padB = 90, padT = 40, padR = 40;
  const plotW = W - padL - padR, plotH = H - padT - padB, baseY = padT + plotH;
  const max = Math.max(...scene.data.map((d) => d.value), 1);
  const n = scene.data.length;
  const slot = plotW / n, barW = Math.min(slot * 0.5, 160);

  const bars = scene.data.map((d, i) => {
    const grow = spring({ frame, fps, delay: 6 + i * 5, config: { damping: 18 } });
    return { d, i, grow, h: Math.max(0.1, (d.value / max) * plotH * grow), cx: padL + slot * i + slot / 2, on: i === scene.highlight };
  });
  const pts = scene.data.map((d, i) => [padL + (plotW * i) / (n - 1), baseY - (d.value / max) * plotH] as const);
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const reveal = interpolate(frame, [4, fps * 1.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Optional second line overlaid ("then vs now") — each series normalised to its
  // own peak so the SHAPES compare, not the absolute scales.
  const n2 = scene.series2?.length ?? 0;
  const max2 = scene.series2 ? Math.max(...scene.series2.map((d) => d.value), 1) : 1;
  const pts2 = scene.series2 ? scene.series2.map((d, i) => [padL + (plotW * i) / Math.max(1, n2 - 1), baseY - (d.value / max2) * plotH] as const) : [];
  const path2 = pts2.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const reveal2 = interpolate(frame, [fps * 0.8, fps * 2.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Explanatory annotations: one or several labels, each a box + drawn arrow.
  const notesList = scene.notes ?? (scene.note != null ? [{ at: scene.noteAt ?? scene.highlight ?? n - 1, text: scene.note }] : []);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 18 }}>
      {scene.title && <div style={{ fontFamily: display, fontWeight: 900, fontSize: 56, color: theme.ink, textAlign: "center", maxWidth: 1500 }}>{scene.title}</div>}
      <svg width={W} height={H}>
        {/* rough (hand-drawn) linework */}
        <RLine x1={padL} y1={baseY} x2={W - padR} y2={baseY} stroke={theme.ink} strokeWidth={3} />
        {scene.chartType === "bar"
          ? bars.map((b) => <RRect key={b.i} x={b.cx - barW / 2} y={baseY - b.h} w={barW} h={b.h} fill={b.on ? theme.accent : "#b8afa1"} strokeWidth={2.4} seed={b.i + 3} />)
          : (
            <>
              <defs>
                <clipPath id={clipId}><rect x={padL - 6} y={0} width={(plotW + 12) * reveal} height={H} /></clipPath>
                <clipPath id={clipId + "b"}><rect x={padL - 6} y={0} width={(plotW + 12) * reveal2} height={H} /></clipPath>
              </defs>
              {scene.series2 && <g clipPath={`url(#${clipId}b)`}><RPath d={path2} stroke={theme.inkSoft} strokeWidth={5} seed={9} /></g>}
              <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={theme.accent} strokeWidth={6} seed={7} /></g>
            </>
          )}
        {/* legend for overlaid series */}
        {scene.series2 && scene.seriesLabels && (
          <g>
            <RLine x1={padL + 10} y1={padT + 6} x2={padL + 54} y2={padT + 6} stroke={theme.accent} strokeWidth={6} />
            <text x={padL + 64} y={padT + 14} fontFamily={sans} fontWeight={700} fontSize={28} fill={theme.ink}>{scene.seriesLabels[0]}</text>
            <RLine x1={padL + 10} y1={padT + 44} x2={padL + 54} y2={padT + 44} stroke={theme.inkSoft} strokeWidth={6} />
            <text x={padL + 64} y={padT + 52} fontFamily={sans} fontWeight={700} fontSize={28} fill={theme.inkSoft}>{scene.seriesLabels[1]}</text>
          </g>
        )}
        {/* crisp text */}
        {scene.chartType === "bar"
          ? bars.map((b) => (
              <g key={b.i}>
                <text x={b.cx} y={baseY - b.h - 16} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={b.on ? 42 : 32} fill={b.on ? theme.ink : theme.inkSoft}>{money(b.d.value * b.grow, scene.unit)}</text>
                <text x={b.cx} y={baseY + 44} textAnchor="middle" fontFamily={sans} fontSize={28} fill={theme.inkSoft}>{b.d.label}</text>
              </g>
            ))
          : scene.data.map((d, i) => <text key={i} x={pts[i][0]} y={baseY + 44} textAnchor="middle" fontFamily={sans} fontSize={26} fill={theme.inkSoft}>{d.label}</text>)}
        {/* explanatory annotations (one or several) */}
        {notesList.map((nt, k) => {
          const [npx, npy] = scene.chartType === "line" ? pts[nt.at] : [bars[nt.at].cx, baseY - bars[nt.at].h];
          const left = nt.at >= n / 2;
          const lw = nt.text.length * 15 + 28;
          const lx = left ? Math.max(padL, npx - lw - 70) : Math.min(W - padR - lw, npx + 70);
          const ly = Math.max(padT + 4, npy - 118 - (k % 2) * 8);
          const rev = interpolate(frame, [fps * (1.5 + k * 0.5), fps * (2.1 + k * 0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g key={k} opacity={rev}>
              <circle cx={npx} cy={npy} r={10} fill={theme.accent} />
              <Arrow x1={lx + lw / 2} y1={ly + 52} x2={npx} y2={npy - 8} delay={Math.round(fps * (1.6 + k * 0.5))} bend={0.12 * (left ? -1 : 1)} color={theme.accent} width={5} />
              <rect x={lx} y={ly} width={lw} height={46} rx={10} fill="#fff" stroke={theme.accent} strokeWidth={3} />
              <text x={lx + lw / 2} y={ly + 31} textAnchor="middle" fontFamily={display} fontWeight={900} fontSize={28} fill={theme.accent}>{nt.text}</text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const DoodleScene_: React.FC<{ scene: DoodleScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = scene.items.length;
  const size = n <= 3 ? 300 : 230;
  const gap = scene.flow ? 190 : 120;
  const totalW = n * size + (n - 1) * gap;
  const cx0 = 960 - totalW / 2 + size / 2;
  const cy = 450;
  const centers = scene.items.map((_, i) => cx0 + i * (size + gap));
  // Build the diagram one item at a time across cuts: items before the newest
  // are already placed (static); only the newest pops in. Layout uses the full
  // item set so nothing shifts between cuts.
  const shown = scene.reveal ?? n;
  return (
    <AbsoluteFill>
      {scene.flow && (
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {centers.slice(0, -1).map((cx, i) => (
            i + 1 < shown && <Arrow key={i} x1={cx + size * 0.36} y1={cy} x2={centers[i + 1] - size * 0.36} y2={cy} delay={i === shown - 2 ? 8 : 0} flow bend={-0.1} />
          ))}
        </svg>
      )}
      {scene.items.map((name, i) => {
        if (i >= shown) return null;
        const isNewest = i === shown - 1;
        const s = isNewest ? spring({ frame, fps, delay: 4, config: { damping: 12, mass: 0.6 } }) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: centers[i] - size / 2, top: cy - size / 2 - 20, width: size, transform: `scale(${s})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Doodle name={name} size={size} />
            {scene.labels?.[i] && <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: theme.ink, textAlign: "center" }}>{scene.labels[i]}</div>}
          </div>
        );
      })}
      {scene.caption && <div style={{ position: "absolute", left: 0, bottom: 130, width: 1920, textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 56, color: theme.ink }}>{scene.caption}</div>}
    </AbsoluteFill>
  );
};

const Chalkboard: React.FC<{ scene: ChalkboardScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 1560, minHeight: 720, background: "#20352b", border: "16px solid #7a5a39", borderRadius: 10, padding: "70px 90px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 34, boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
        {scene.lines.map((ln, i) => {
          const op = interpolate(frame, [8 + i * 14, 22 + i * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ fontFamily: display, fontWeight: 700, fontSize: 60, color: "#f3efe2", opacity: op, textAlign: "center" }}>{ln}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Compare: React.FC<{ scene: CompareScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Cut-driven contrast: on the "left only" shot the left card springs in; once
  // both are shown the left is already placed (static) and the right pops in.
  const bothShown = scene.only !== "left";
  const l = bothShown ? 1 : spring({ frame, fps, delay: 4, config: { damping: 16 } });
  const r = spring({ frame, fps, delay: 4, config: { damping: 16 } });
  const card = (c: { title: string; value: string; icon?: DoodleName }, p: number, accent: boolean) => (
    <div style={{ width: 640, padding: "44px 40px 56px", borderRadius: 18, border: `4px solid ${accent ? theme.accent : theme.ink}`, background: "#fff", textAlign: "center", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`, boxShadow: "0 12px 0 rgba(23,18,15,0.08)", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {c.icon && <div style={{ marginBottom: 10 }}><Doodle name={c.icon} size={150} /></div>}
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: theme.inkSoft }}>{c.title}</div>
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 96, color: accent ? theme.accent : theme.ink, marginTop: 14 }}>{c.value}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 60 }}>
      {card(scene.left, l, false)}
      {bothShown && <div style={{ fontFamily: display, fontWeight: 900, fontSize: 64, color: theme.inkSoft }}>vs</div>}
      {bothShown && card(scene.right, r, true)}
    </AbsoluteFill>
  );
};

// A horizontal timeline: a drawn-on baseline with an arrowhead (time flows →),
// dated markers that pop in left-to-right, each with an icon + label alternating
// above/below. Great for sequences and "then → now" parallels.
const Timeline: React.FC<{ scene: TimelineScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ev = scene.events;
  const n = ev.length;
  const x0 = 280, x1 = 1640, y = 560;
  const xs = ev.map((_, i) => x0 + (x1 - x0) * (n <= 1 ? 0.5 : i / (n - 1)));
  const lineRev = interpolate(frame, [4, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineEnd = (x0 - 40) + ((x1 + 60) - (x0 - 40)) * lineRev;
  return (
    <AbsoluteFill>
      {scene.title && <div style={{ position: "absolute", top: 72, width: 1920, textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 56, color: theme.ink }}>{scene.title}</div>}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x0 - 40} y1={y} x2={lineEnd} y2={y} stroke={theme.ink} strokeWidth={5} strokeLinecap="round" />
        {lineRev > 0.98 && <path d={`M ${x1 + 60} ${y} l -22 -12 M ${x1 + 60} ${y} l -22 12`} stroke={theme.ink} strokeWidth={5} fill="none" strokeLinecap="round" />}
        {ev.map((e, i) => {
          const s = spring({ frame, fps, delay: 16 + i * 16, config: { damping: 12, mass: 0.6 } });
          if (s <= 0.02) return null;
          const on = i === scene.highlight;
          const up = i % 2 === 0;
          return (
            <g key={i} opacity={Math.min(1, s)}>
              <line x1={xs[i]} y1={y} x2={xs[i]} y2={up ? y - 60 : y + 60} stroke={theme.grid} strokeWidth={3} />
              <circle cx={xs[i]} cy={y} r={on ? 16 : 12} fill={on ? theme.accent : theme.ink} />
            </g>
          );
        })}
      </svg>
      {ev.map((e, i) => {
        const s = spring({ frame, fps, delay: 16 + i * 16, config: { damping: 12, mass: 0.6 } });
        if (s <= 0.02) return null;
        const up = i % 2 === 0;
        const on = i === scene.highlight;
        const cardTop = up ? y - 268 : y + 74;
        return (
          <div key={i} style={{ position: "absolute", left: xs[i] - 115, top: cardTop, width: 230, transform: `scale(${Math.min(1, s)})`, transformOrigin: up ? "center bottom" : "center top", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            {up && e.icon && <Doodle name={e.icon} size={140} />}
            <div style={{ fontFamily: display, fontWeight: 900, fontSize: 48, color: on ? theme.accent : theme.ink }}>{e.year}</div>
            <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 27, color: theme.inkSoft, textAlign: "center", lineHeight: 1.12 }}>{e.label}</div>
            {!up && e.icon && <Doodle name={e.icon} size={140} />}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// A real downloaded photo filling the frame (celebrity / logo / building), with
// a name tag, caption, a slow zoom, and an optional red emphasis ring.
const ImageScene_: React.FC<{ scene: ImageScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16 } });
  const zoom = interpolate(frame, [0, fps * 6], [1, 1.06], { extrapolateRight: "clamp" });
  const W = 740;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30 }}>
      <div style={{ position: "relative", transform: `scale(${0.92 + enter * 0.08})`, opacity: enter }}>
        <div style={{ width: W, borderRadius: 14, overflow: "hidden", border: `6px solid ${theme.ink}`, boxShadow: "0 18px 44px rgba(0,0,0,0.22)", background: "#fff" }}>
          <Img src={staticFile(scene.src)} style={{ width: W, display: "block", transform: `scale(${zoom})`, filter: scene.mug ? "grayscale(0.25) contrast(1.05)" : "none" }} />
        </div>
        {scene.circle && (
          <div style={{ position: "absolute", inset: -20, border: `9px solid ${theme.accent}`, borderRadius: "50%", transform: "rotate(-4deg) scaleX(1.1)", opacity: interpolate(frame, [fps * 0.5, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
        )}
        {scene.label && (
          <div style={{ position: "absolute", left: -12, bottom: -18, background: theme.accent, color: "#fff", fontFamily: display, fontWeight: 900, fontSize: 34, padding: "6px 18px", borderRadius: 8, transform: "rotate(-3deg)" }}>{scene.label}</div>
        )}
        {/* meme-format Impact-style captions overlaid ON the photo */}
        {scene.memeTop && (
          <div style={{ position: "absolute", left: 10, right: 10, top: 12, textAlign: "center", fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", fontWeight: 900, fontSize: 56, lineHeight: 1.0, letterSpacing: 1, color: "#fff", textTransform: "uppercase", WebkitTextStroke: "3px #000", paintOrder: "stroke fill", opacity: interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{scene.memeTop}</div>
        )}
        {scene.memeBottom && (
          <div style={{ position: "absolute", left: 10, right: 10, bottom: 12, textAlign: "center", fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", fontWeight: 900, fontSize: 56, lineHeight: 1.0, letterSpacing: 1, color: "#fff", textTransform: "uppercase", WebkitTextStroke: "3px #000", paintOrder: "stroke fill", opacity: interpolate(frame, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{scene.memeBottom}</div>
        )}
      </div>
      {scene.caption && <div style={{ fontFamily: display, fontWeight: 900, fontSize: 50, color: theme.ink, textAlign: "center", maxWidth: 1400 }}>{scene.caption}</div>}
    </AbsoluteFill>
  );
};

// A real animated GIF (meme / reaction / data animation), framed like a photo,
// looping for the whole scene, with optional meme-format Impact captions.
const GifScene_: React.FC<{ scene: GifScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16 } });
  const W = 860, H = 560;
  const meme = (pos: "top" | "bottom", txt?: string) =>
    txt ? (
      <div style={{ position: "absolute", left: 10, right: 10, [pos]: 12, textAlign: "center", fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", fontWeight: 900, fontSize: 56, lineHeight: 1.0, letterSpacing: 1, color: "#fff", textTransform: "uppercase", WebkitTextStroke: "3px #000", paintOrder: "stroke fill", opacity: interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{txt}</div>
    ) : null;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 28 }}>
      <div style={{ position: "relative", transform: `scale(${0.92 + enter * 0.08})`, opacity: enter }}>
        <div style={{ width: W, height: H, borderRadius: 14, overflow: "hidden", border: `6px solid ${theme.ink}`, boxShadow: "0 18px 44px rgba(0,0,0,0.22)", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Gif src={staticFile(scene.src)} width={W} height={H} fit="contain" loopBehavior="loop" />
        </div>
        {scene.label && (
          <div style={{ position: "absolute", left: -12, bottom: -18, background: theme.accent, color: "#fff", fontFamily: display, fontWeight: 900, fontSize: 34, padding: "6px 18px", borderRadius: 8, transform: "rotate(-3deg)" }}>{scene.label}</div>
        )}
        {scene.credit && (
          <div style={{ position: "absolute", right: 10, bottom: 8, background: "rgba(0,0,0,0.5)", color: "#fff", fontFamily: sans, fontWeight: 700, fontSize: 18, padding: "2px 8px", borderRadius: 5 }}>{scene.credit}</div>
        )}
        {meme("top", scene.memeTop)}
        {meme("bottom", scene.memeBottom)}
      </div>
      {scene.caption && <div style={{ fontFamily: display, fontWeight: 900, fontSize: 50, color: theme.ink, textAlign: "center", maxWidth: 1400 }}>{scene.caption}</div>}
    </AbsoluteFill>
  );
};

// A box-and-arrow diagram built step by step: labelled nodes pop in, arrows wire
// them up, and flagged nodes get struck out with a red ✗.
const DiagramScene_: React.FC<{ scene: DiagramScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = 1920, H = 1080;
  const pos = (n: { x: number; y: number }) => ({ x: 170 + n.x * (W - 340), y: 230 + n.y * (H - 400) });
  const nodeOf: Record<string, DiagramScene["nodes"][number]> = Object.fromEntries(scene.nodes.map((n) => [n.id, n]));
  const nodeIdx: Record<string, number> = Object.fromEntries(scene.nodes.map((n, i) => [n.id, i]));
  return (
    <AbsoluteFill>
      {scene.title && <div style={{ position: "absolute", top: 70, width: W, textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 54, color: theme.ink }}>{scene.title}</div>}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {scene.edges.map((e, i) => {
          const a = pos(nodeOf[e.from]), b = pos(nodeOf[e.to]);
          const delay = Math.round(10 + Math.max(nodeIdx[e.from] ?? 0, nodeIdx[e.to] ?? 0) * 16 + 10);
          return <Arrow key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} delay={delay} bend={0.16 * (i % 2 ? 1 : -1)} color={theme.inkSoft} width={5} />;
        })}
      </svg>
      {scene.nodes.map((n, i) => {
        const p = pos(n);
        const s = spring({ frame, fps, delay: 10 + i * 16, config: { damping: 12, mass: 0.6 } });
        if (s <= 0.02) return null;
        const crossRev = n.cross ? interpolate(frame, [fps * 1.7 + i * 5, fps * 2.1 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        return (
          <div key={n.id} style={{ position: "absolute", left: p.x - 135, top: p.y - 78, width: 270, transform: `scale(${Math.min(1, s)})` }}>
            <div style={{ background: "#fff", border: `4px solid ${theme.ink}`, borderRadius: 14, padding: "14px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxShadow: "0 8px 0 rgba(23,18,15,0.08)", position: "relative" }}>
              {n.icon && <Doodle name={n.icon} size={104} />}
              <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 29, color: theme.ink, textAlign: "center", lineHeight: 1.06 }}>{n.label}</div>
              {n.cross && (
                <svg width={270} height={170} style={{ position: "absolute", left: -2, top: -10, opacity: crossRev }}>
                  <path d="M22 22 L248 150 M248 22 L22 150" stroke={theme.accent} strokeWidth={11} strokeLinecap="round" />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// A full-frame animated METAPHOR. Big, bold, no arrows — a picture of the idea.
const StageScene_: React.FC<{ scene: StageScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const VW = 980, VH = 520;
  const ink = theme.ink, gold = "#e8b73a", red = theme.accent, green = "#1f7a3d", blue = "#3a6ea5", parch = "#fbf3d9", tan = "#d8c29a";
  const m = scene.motif;
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  let art: React.ReactNode = null;

  if (m === "housecollapse") {
    const tents: [number, number, number][] = [[250, 430, 0], [490, 430, 0], [730, 430, 0], [370, 300, 1], [610, 300, 1], [490, 170, 2]];
    const start = fps * 1.9;
    art = (
      <svg width={VW} height={VH}>
        {tents.map(([cx, by, row], i) => {
          const appear = spring({ frame, fps, delay: (2 - row) * 9 + i * 2, config: { damping: 12 } });
          const p = Math.max(0, Math.min(1, (frame - start) / (fps * 1.0)));
          const rot = p * (26 + row * 12) * (i % 2 ? 1 : -1);
          const dy = p * p * (380 - by * 0.5);
          return (
            <g key={i} transform={`translate(${cx} ${by + dy}) rotate(${rot})`} opacity={Math.min(1, appear) * (1 - p * 0.3)}>
              <path d="M -72 0 L 0 -112 L 72 0" fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" />
              <path d="M -48 -38 L 48 -38" stroke={ink} strokeWidth={6} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
    );
  } else if (m === "vaultdrain") {
    const vx = VW / 2, vy = 170;
    art = (
      <svg width={VW} height={VH}>
        <rect x={vx - 150} y={vy} width={300} height={210} rx={14} fill="#59707c" stroke={ink} strokeWidth={6} />
        <circle cx={vx} cy={vy + 95} r={46} fill="none" stroke="#cfd8dc" strokeWidth={8} />
        <circle cx={vx} cy={vy + 95} r={10} fill="#cfd8dc" />
        {[0, 1, 2, 3].map((k) => <line key={k} x1={vx} y1={vy + 95} x2={vx + 46 * Math.cos(k * 0.9 + frame * 0.08)} y2={vy + 95 + 46 * Math.sin(k * 0.9 + frame * 0.08)} stroke="#cfd8dc" strokeWidth={5} />)}
        {Array.from({ length: 9 }, (_, i) => {
          const cyc = ((frame * 5 + i * 34) % 230);
          const yy = vy + 200 + cyc;
          const xx = vx - 70 + ((i * 53) % 150) + Math.sin((frame + i * 20) * 0.15) * 10;
          const op = interpolate(cyc, [0, 30, 180, 230], [0, 1, 1, 0]);
          return <g key={i} opacity={op}><circle cx={xx} cy={yy} r={17} fill={gold} stroke={ink} strokeWidth={2.5} /><text x={xx} y={yy + 6} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>;
        })}
      </svg>
    );
  } else if (m === "vanish") {
    const cx = VW / 2, cy = 250;
    const start = fps * 1.5;
    const stackS = frame < start ? 1 : interpolate(frame, [start, start + 10], [1, 0], { extrapolateRight: "clamp" });
    const poof = interpolate(frame, [start, start + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const q = interpolate(frame, [start + 14, start + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${cx} ${cy}) scale(${stackS})`} opacity={stackS}>
          {[0, 1, 2].map((k) => <g key={k}><rect x={-90} y={-30 + k * 26} width={180} height={22} rx={5} fill={green} stroke={ink} strokeWidth={3} /><text x={0} y={-13 + k * 26} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle">$$$</text></g>)}
        </g>
        {poof > 0 && poof < 1 && <circle cx={cx} cy={cy} r={60 + poof * 160} fill="none" stroke={gold} strokeWidth={10 * (1 - poof)} opacity={1 - poof} />}
        {q > 0 && <text x={cx} y={cy + 30} fontSize={140} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" opacity={q}>?</text>}
      </svg>
    );
  } else if (m === "dominoes") {
    art = (
      <svg width={VW} height={VH}>
        <line x1={60} y1={440} x2={VW - 60} y2={440} stroke={ink} strokeWidth={5} strokeLinecap="round" />
        {Array.from({ length: 8 }, (_, i) => {
          const start = fps * 1.0 + i * 5;
          const fall = interpolate(frame, [start, start + 9], [0, 82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const x = 120 + i * 100;
          return <g key={i} transform={`translate(${x} 440) rotate(${fall})`}><rect x={-14} y={-110} width={28} height={110} rx={4} fill="#efe9db" stroke={ink} strokeWidth={4} /><circle cx={0} cy={-80} r={4} fill={ink} /><circle cx={0} cy={-40} r={4} fill={ink} /></g>;
        })}
      </svg>
    );
  } else if (m === "crash") {
    const rev = interpolate(frame, [8, fps * 1.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
    const path = "M 90 360 L 230 300 L 360 330 L 480 180 L 600 240 L 720 120 L 820 470 L 900 620";
    const clipId = React.useId().replace(/:/g, "");
    art = (
      <svg width={VW} height={VH}>
        <line x1={70} y1={470} x2={VW - 40} y2={470} stroke={ink} strokeWidth={5} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={8} seed={5} /></g>
        {rev > 0.9 && <text x={760} y={430} fontSize={70} fill={red} opacity={interpolate(frame, [fps * 1.8, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>💥</text>}
      </svg>
    );
  } else if (m === "inflate") {
    const start = fps * 2.0;
    const r = frame < start ? interpolate(frame, [6, start], [10, 150], { extrapolateLeft: "clamp" }) : 0;
    const pop = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    art = (
      <svg width={VW} height={VH}>
        {frame < start + 2 && <circle cx={VW / 2} cy={260} r={r} fill="#bfe0ef" stroke={ink} strokeWidth={5} opacity={frame < start ? 1 : 0} />}
        {pop > 0 && pop < 1 && Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 6.28; return <line key={i} x1={VW / 2 + 150 * Math.cos(a)} y1={260 + 150 * Math.sin(a)} x2={VW / 2 + (150 + 70 * pop) * Math.cos(a)} y2={260 + (150 + 70 * pop) * Math.sin(a)} stroke={red} strokeWidth={6 * (1 - pop)} />; })}
      </svg>
    );
  } else if (m === "bankrun") {
    const doorX = 820, closeAt = fps * 2.2;
    const shutter = interpolate(frame, [closeAt, closeAt + 12], [0, 230], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    art = (
      <svg width={VW} height={VH}>
        <rect x={doorX} y={120} width={140} height={300} rx={8} fill="#59707c" stroke={ink} strokeWidth={6} />
        <rect x={doorX + 25} y={160} width={90} height={230} fill="#cfe6ef" stroke={ink} strokeWidth={4} />
        {Array.from({ length: 7 }, (_, i) => {
          const base = 120 + i * 95;
          const x = Math.min(doorX - 60 - (i % 3) * 36, base + interpolate(frame, [i * 4, fps * 2], [0, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          const bob = Math.sin((frame + i * 10) * 0.4) * 6;
          return <g key={i} transform={`translate(${x} ${300 + (i % 2) * 40 + bob})`}><circle cx={0} cy={-34} r={16} fill={["#f0cda6", "#e8c49a"][i % 2]} stroke={ink} strokeWidth={3} /><path d="M-15 70 Q-15 -6 0 -6 Q15 -6 15 70" fill={[green, red, "#4a74b8"][i % 3]} stroke={ink} strokeWidth={3} /></g>;
        })}
        {shutter > 0 && <g><rect x={doorX + 20} y={150} width={100} height={shutter} fill="#8a929a" stroke={ink} strokeWidth={4} />{shutter > 120 && <text x={doorX + 70} y={250} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" transform={`rotate(-4 ${doorX + 70} 250)`}>FROZEN</text>}</g>}
      </svg>
    );
  } else if (m === "rocketcrash") {
    const apex = fps * 1.3;
    const up = interpolate(frame, [6, apex], [440, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
    const down = interpolate(frame, [apex, apex + fps * 0.9], [0, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
    const x = interpolate(frame, [6, apex + fps], [VW / 2 - 180, VW / 2 + 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const y = up + down;
    const rot = frame < apex ? -45 : interpolate(frame, [apex, apex + 10], [-45, 135], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1.4)`}>
          <path d="M50 16 Q64 36 64 62 L36 62 Q36 36 50 16 Z" fill="#fff" stroke={ink} strokeWidth={4} transform="translate(-50 -40)" />
          <circle cx={0} cy={0} r={8} fill="#9bc6e3" stroke={ink} strokeWidth={2} />
          <path d="M-14 16 L-26 32 L-14 28 Z M14 16 L26 32 L14 28 Z" fill={red} stroke={ink} strokeWidth={2} />
          {frame < apex && <path d="M-8 26 Q0 54 8 26 Z" fill={gold} />}
        </g>
        {down > 380 && <text x={x} y={y - 20} fontSize={66} opacity={interpolate(frame, [apex + fps * 0.8, apex + fps * 1.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>💥</text>}
      </svg>
    );
  } else if (m === "towerfall") {
    const start = fps * 2.0;
    const blocks = Array.from({ length: 7 }, (_, i) => i);
    art = (
      <svg width={VW} height={VH}>
        {blocks.map((i) => {
          const appear = spring({ frame, fps, delay: 6 + i * 6, config: { damping: 13 } });
          const p = Math.max(0, Math.min(1, (frame - start - i * 2) / (fps * 0.8)));
          const by = 440 - i * 52;
          const rot = p * (20 + i * 6) * (i % 2 ? 1 : -1);
          const dx = p * p * (i % 2 ? 180 : -180);
          const dy = p * p * (420 - by);
          return <g key={i} transform={`translate(${VW / 2 + dx} ${by + dy}) rotate(${rot}) scale(${appear})`} opacity={1 - p * 0.3}>
            <rect x={-80} y={-24} width={160} height={46} rx={6} fill={i === 3 ? red : "#efe9db"} stroke={ink} strokeWidth={4} />
            {i === 3 && <text x={0} y={8} fontSize={24} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">FTT</text>}
          </g>;
        })}
      </svg>
    );
  } else if (m === "stamp") {
    const txt = scene.stampText ?? scene.caption ?? "";
    const s = interpolate(frame, [4, 12], [3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const shake = frame < 20 ? Math.sin(frame * 1.4) * interpolate(frame, [12, 24], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
    art = (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: VH }}>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 150, color: red, border: `10px solid ${red}`, borderRadius: 14, padding: "10px 44px", transform: `scale(${s}) rotate(-6deg) translateX(${shake}px)`, WebkitTextStroke: "2px #17120f" }}>{txt}</div>
      </div>
    );
  } else if (m === "fxmarket") {
    // The world's biggest market: currency "coins" orbit a central FX hub,
    // connected by trading lines that pulse constantly.
    const syms = ["$", "€", "¥", "£", "₹", "Fr"];
    const cx = VW / 2, cy = 250, R = 300;
    art = (
      <svg width={VW} height={VH}>
        {syms.map((s, i) => {
          const a = (i / syms.length) * Math.PI * 2 + frame * 0.012;
          const x = cx + R * Math.cos(a);
          const y = cy + R * 0.55 * Math.sin(a) + Math.sin((frame + i * 20) * 0.08) * 8;
          const appear = spring({ frame, fps, delay: 6 + i * 4, config: { damping: 12 } });
          const pulse = 0.2 + 0.6 * Math.abs(Math.sin((frame + i * 26) * 0.07));
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={theme.grid} strokeWidth={2.4} opacity={pulse} />
              <g transform={`translate(${x} ${y}) scale(${appear})`}>
                <circle cx={0} cy={0} r={46} fill="#fff" stroke={ink} strokeWidth={4} />
                <text x={0} y={16} fontSize={42} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{s}</text>
              </g>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={58} fill={gold} stroke={ink} strokeWidth={5} />
        <text x={cx} y={cy + 13} fontSize={38} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">FX</text>
      </svg>
    );
  } else if (m === "seesaw") {
    // An exchange rate is a relative price: a balance beam between two currencies.
    // It wobbles, then settles with one side heavier (more in demand).
    const cx = VW / 2, cy = 300;
    const tilt = interpolate(frame, [8, fps * 0.9, fps * 1.5, fps * 2.1, fps * 2.8], [0, -13, 9, -11, -11], clampBoth);
    const pan = (dx: number, sym: string, col: string) => (
      <g transform={`translate(${dx} 0)`}>
        <line x1={0} y1={0} x2={0} y2={70} stroke={ink} strokeWidth={4} />
        <circle cx={0} cy={96} r={44} fill={col} stroke={ink} strokeWidth={4} />
        <text x={0} y={110} fontSize={44} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{sym}</text>
      </g>
    );
    art = (
      <svg width={VW} height={VH}>
        <polygon points={`${cx - 46},${cy + 150} ${cx + 46},${cy + 150} ${cx},${cy}`} fill={ink} />
        <g transform={`translate(${cx} ${cy}) rotate(${tilt})`}>
          <RLine x1={-320} y1={0} x2={320} y2={0} stroke={ink} strokeWidth={11} />
          {pan(-300, "$", green)}
          {pan(300, "€", blue)}
        </g>
      </svg>
    );
  } else if (m === "supplydemand") {
    // Supply × demand sets the price. Curves draw in, then demand shifts right
    // (more buyers) and the equilibrium dot climbs — price up.
    const ox = 230, oy = 440, w = 540, h = 330;
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 1.2], [0, 1], clampBoth);
    const s = interpolate(frame, [fps * 1.7, fps * 2.8], [0, 150], clampBoth);
    const ex = ox + (w + s) / 2, ey = oy - (h * (w + s)) / (2 * w);
    const supply = `M ${ox} ${oy} L ${ox + w} ${oy - h}`;
    const demand = `M ${ox + s} ${oy - h} L ${ox + w + s} ${oy}`;
    art = (
      <svg width={VW} height={VH}>
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <RLine x1={ox - 20} y1={oy} x2={ox + w + 180} y2={oy} stroke={ink} strokeWidth={4} />
        <RLine x1={ox - 20} y1={oy} x2={ox - 20} y2={oy - h - 40} stroke={ink} strokeWidth={4} />
        <text x={ox - 34} y={oy - h - 46} fontSize={26} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>price</text>
        <g clipPath={`url(#${clipId})`}>
          <RPath d={supply} stroke={blue} strokeWidth={6} seed={4} />
          <RPath d={demand} stroke={red} strokeWidth={6} seed={6} />
        </g>
        <text x={ox + w + 10} y={oy - h + 6} fontSize={26} fontWeight={800} fill={blue} fontFamily={sans}>supply</text>
        <text x={ox + w + s + 6} y={oy + 2} fontSize={26} fontWeight={800} fill={red} fontFamily={sans}>demand</text>
        {rev > 0.98 && (
          <g opacity={interpolate(frame, [fps * 1.2, fps * 1.5], [0, 1], clampBoth)}>
            <line x1={ex} y1={ey} x2={ox - 20} y2={ey} stroke={ink} strokeWidth={2} strokeDasharray="7 7" />
            <circle cx={ex} cy={ey} r={13} fill={gold} stroke={ink} strokeWidth={3} />
          </g>
        )}
        {s > 80 && <text x={ox - 2} y={ey - 20} fontSize={34} fontWeight={900} fill={green} fontFamily="Georgia, serif" opacity={interpolate(frame, [fps * 2.2, fps * 2.6], [0, 1], clampBoth)}>↑</text>}
      </svg>
    );
  } else if (m === "printmoney") {
    // Print more of it → each unit buys less. A press spits bills onto a growing
    // stack while the "what one unit buys" bar shrinks.
    const px = 250, py = 150;
    const bar = interpolate(frame, [fps * 0.6, fps * 2.6], [300, 70], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <RRect x={px - 90} y={py} w={180} h={96} fill="#59707c" strokeWidth={6} />
        <RRect x={px - 60} y={py + 96} w={120} h={10} fill={ink} strokeWidth={2} />
        {Array.from({ length: 8 }, (_, i) => {
          const cyc = (frame * 6 + i * 40) % 300;
          const yy = py + 110 + cyc;
          const op = interpolate(cyc, [0, 30, 250, 300], [0, 1, 1, 0]);
          return <g key={i} opacity={op}><rect x={px - 34} y={yy} width={68} height={26} rx={4} fill={green} stroke={ink} strokeWidth={3} /><text x={px} y={yy + 19} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text></g>;
        })}
        {Array.from({ length: 7 }, (_, i) => {
          const on = interpolate(frame, [fps * 0.6 + i * 7, fps * 0.9 + i * 7], [0, 1], clampBoth);
          return <g key={i} opacity={on}><rect x={px - 40} y={470 - i * 20} width={80} height={18} rx={3} fill={green} stroke={ink} strokeWidth={3} /></g>;
        })}
        <g transform={`translate(720 ${480 - bar})`}>
          <rect x={0} y={0} width={120} height={bar} rx={6} fill={gold} stroke={ink} strokeWidth={4} />
          <text x={60} y={-18} fontSize={26} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>buys</text>
        </g>
      </svg>
    );
  } else if (m === "wheelbarrow") {
    // Hyperinflation: a barrow of cash rolls in to buy one small loaf of bread.
    const x = interpolate(frame, [6, fps * 1.4], [-340, 170], clampBoth);
    const show = interpolate(frame, [fps * 1.6, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${x} 250)`}>
          <path d="M-150 20 L120 20 L80 110 L-110 110 Z" fill="#9aa6ad" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
          {Array.from({ length: 10 }, (_, i) => <g key={i}><rect x={-140 + (i % 5) * 54} y={-26 + Math.floor(i / 5) * 24} width={48} height={20} rx={3} fill={green} stroke={ink} strokeWidth={2.5} /></g>)}
          <text x={-20} y={-40} fontSize={30} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">$$$$$</text>
          <line x1={120} y1={20} x2={168} y2={2} stroke={ink} strokeWidth={6} strokeLinecap="round" />
          <circle cx={-96} cy={140} r={30} fill="#3a3f45" stroke={ink} strokeWidth={5} />
          <circle cx={-96} cy={140} r={6} fill="#cfd8dc" />
          <line x1={-110} y1={110} x2={-128} y2={150} stroke={ink} strokeWidth={6} strokeLinecap="round" />
        </g>
        <g transform="translate(640 300)" opacity={show}>
          <text x={0} y={-66} fontSize={64} fontWeight={900} fill={ink} textAnchor="middle">=</text>
          <path d="M-56 0 Q-56 -40 0 -40 Q56 -40 56 0 Q56 26 0 26 Q-56 26 -56 0 Z" fill="#d8a85a" stroke={ink} strokeWidth={5} />
          <path d="M-30 -36 L-24 -12 M0 -40 L0 -14 M30 -36 L24 -12" stroke={ink} strokeWidth={3} fill="none" />
          <text x={0} y={70} fontSize={30} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>one loaf</text>
        </g>
      </svg>
    );
  } else if (m === "magnet") {
    // Higher interest rates act like a magnet, pulling capital (coins) in.
    const mx = 300, my = 250;
    art = (
      <svg width={VW} height={VH}>
        <path d={`M${mx - 60} ${my - 70} L${mx - 60} ${my + 40} Q${mx - 60} ${my + 110} ${mx} ${my + 110} Q${mx + 60} ${my + 110} ${mx + 60} ${my + 40} L${mx + 60} ${my - 70}`} fill="none" stroke={red} strokeWidth={34} strokeLinecap="butt" />
        <rect x={mx - 77} y={my - 86} width={34} height={28} fill={red} stroke={ink} strokeWidth={2} />
        <rect x={mx + 43} y={my - 86} width={34} height={28} fill="#c3ccd2" stroke={ink} strokeWidth={2} />
        {Array.from({ length: 6 }, (_, i) => {
          const prog = ((frame * 6 + i * 50) % 300) / 300;
          const startX = 900 - (i % 3) * 40, startY = 160 + (i % 3) * 120;
          const xx = startX + (mx + 100 - startX) * prog;
          const yy = startY + (my - startY) * prog;
          const op = interpolate(prog, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
          return <g key={i} opacity={op}><circle cx={xx} cy={yy} r={20} fill={gold} stroke={ink} strokeWidth={3} /><text x={xx} y={yy + 7} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>;
        })}
        <text x={mx} y={my + 170} fontSize={40} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">5%</text>
      </svg>
    );
  } else if (m === "peg") {
    // A pegged currency: a small note anchored to a big dollar block. It drifts
    // on the waves but the chain holds it in place.
    const drift = Math.sin(frame * 0.06) * 26;
    art = (
      <svg width={VW} height={VH}>
        <rect x={120} y={180} width={200} height={200} rx={16} fill={green} stroke={ink} strokeWidth={6} />
        <text x={220} y={300} fontSize={96} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text>
        <text x={220} y={420} fontSize={30} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>the anchor</text>
        <g transform={`translate(${660 + drift} 250)`}>
          <rect x={-90} y={-54} width={180} height={108} rx={12} fill="#cfe3d4" stroke={ink} strokeWidth={5} />
          <text x={0} y={18} fontSize={56} fontWeight={900} fill="#2f6b46" textAnchor="middle" fontFamily="Georgia, serif">¤</text>
          <text x={0} y={100} fontSize={28} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>held to it</text>
        </g>
        <path d={`M320 250 Q${480 + drift / 2} ${250 + Math.abs(drift)} ${570 + drift} 250`} fill="none" stroke={ink} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" />
      </svg>
    );
  } else if (m === "trustprop") {
    // A currency's value rests on belief: a big coin held up by pillars labelled
    // economy / rule of law / trust. Pull one and it wobbles.
    const wob = interpolate(frame, [fps * 1.8, fps * 2.2, fps * 2.8], [0, 4, 1.5], clampBoth) * Math.sin(frame * 0.5);
    const pillars = ["a real economy", "stable rules", "trust"];
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} 180) rotate(${wob})`}>
          <circle cx={0} cy={0} r={96} fill={gold} stroke={ink} strokeWidth={6} />
          <text x={0} y={26} fontSize={78} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </g>
        {pillars.map((p, i) => {
          const x = VW / 2 - 240 + i * 240;
          const on = spring({ frame, fps, delay: 8 + i * 8, config: { damping: 13 } });
          return <g key={i} opacity={on}><RRect x={x - 26} y={300} w={52} h={150} fill="#efe9db" strokeWidth={4} /><text x={x} y={485} fontSize={26} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>{p}</text></g>;
        })}
      </svg>
    );
  } else if (m === "basket") {
    // Purchasing power: the SAME basket of goods, priced in three currencies.
    const tags = [["$", "5"], ["€", "4.6"], ["¥", "750"]];
    const idx = Math.min(2, Math.floor(interpolate(frame, [fps * 0.6, fps * 2.7], [0, 3], clampBoth)));
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} 210)`}>
          <path d="M-150 -40 L150 -40 L110 150 L-110 150 Z" fill={gold} stroke={ink} strokeWidth={7} strokeLinejoin="round" />
          <path d="M-96 -40 Q-60 -130 0 -130 Q60 -130 96 -40" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
          <line x1={-60} y1={-20} x2={-74} y2={140} stroke={ink} strokeWidth={3} />
          <line x1={0} y1={-20} x2={0} y2={140} stroke={ink} strokeWidth={3} />
          <line x1={60} y1={-20} x2={74} y2={140} stroke={ink} strokeWidth={3} />
          <line x1={-130} y1={40} x2={130} y2={40} stroke={ink} strokeWidth={3} />
        </g>
        <g transform="translate(640 250)">
          <rect x={0} y={0} width={240} height={110} rx={14} fill="#fff" stroke={red} strokeWidth={5} />
          <text x={120} y={78} fontSize={64} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{tags[idx][0]}{tags[idx][1]}</text>
          <text x={120} y={-18} fontSize={26} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>same basket</text>
        </g>
      </svg>
    );
  } else if (m === "yieldspike") {
    // Bond yields stay calm, then spike violently as lenders panic.
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const path = "M 80 380 L 240 372 L 400 384 L 540 366 L 650 370 L 740 250 L 820 120 L 900 60";
    const clipId = React.useId().replace(/:/g, "");
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={70} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        <RLine x1={80} y1={40} x2={80} y2={440} stroke={ink} strokeWidth={4} />
        <text x={70} y={34} fontSize={26} fontWeight={700} fill={theme.inkSoft} textAnchor="end" fontFamily={sans}>yield</text>
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={7} seed={5} /></g>
        {rev > 0.85 && <text x={880} y={48} fontSize={56} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" opacity={interpolate(frame, [fps * 2.0, fps * 2.4], [0, 1], clampBoth)}>↑</text>}
      </svg>
    );
  } else if (m === "capitalflight") {
    // Money flees the country: coins stream out of a bordered "country" box.
    art = (
      <svg width={VW} height={VH}>
        <RRect x={70} y={150} w={360} h={240} fill="#eef2ee" strokeWidth={6} />
        <text x={250} y={130} fontSize={30} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>the country</text>
        {Array.from({ length: 8 }, (_, i) => {
          const prog = ((frame * 7 + i * 44) % 320) / 320;
          const sx = 250 + (i % 3) * 20, sy = 200 + (i % 4) * 44;
          const xx = sx + (940 - sx) * prog;
          const yy = sy - 60 * Math.sin(prog * Math.PI);
          const op = interpolate(prog, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);
          return <g key={i} opacity={op}><circle cx={xx} cy={yy} r={19} fill={gold} stroke={ink} strokeWidth={3} /><text x={xx} y={yy + 6} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>;
        })}
        <path d="M470 270 l40 0 M510 270 l-12 -9 M510 270 l-12 9" stroke={red} strokeWidth={5} fill="none" strokeLinecap="round" />
      </svg>
    );
  } else if (m === "haircut") {
    // Creditors take a haircut: scissors cut a bond, a chunk falls away.
    const cut = interpolate(frame, [fps * 1.0, fps * 1.6], [0, 1], clampBoth);
    const open = interpolate(frame, [fps * 0.4, fps * 1.0, fps * 1.4], [26, 2, 10], clampBoth);
    const fall = interpolate(frame, [fps * 1.5, fps * 2.4], [0, 230], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 180)">
          <rect x={0} y={0} width={260} height={160} rx={10} fill={parch} stroke={ink} strokeWidth={5} />
          <text x={130} y={70} fontSize={30} fontWeight={800} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">BOND</text>
          <text x={130} y={120} fontSize={40} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$100</text>
        </g>
        <g transform={`translate(560 ${180 + fall}) rotate(${fall * 0.1})`} opacity={1 - cut * 0.15}>
          <rect x={0} y={0} width={110} height={160} rx={10} fill="#e9dcc0" stroke={ink} strokeWidth={5} strokeDasharray="6 6" />
          <text x={55} y={92} fontSize={34} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">–70%</text>
        </g>
        <g transform={`translate(560 120) rotate(${-20 + cut * 8})`}>
          <line x1={0} y1={0} x2={120} y2={open} stroke={ink} strokeWidth={6} strokeLinecap="round" />
          <line x1={0} y1={0} x2={120} y2={-open} stroke={ink} strokeWidth={6} strokeLinecap="round" />
          <circle cx={-10} cy={open} r={12} fill="none" stroke={ink} strokeWidth={5} />
          <circle cx={-10} cy={-open} r={12} fill="none" stroke={ink} strokeWidth={5} />
        </g>
      </svg>
    );
  } else if (m === "lifering") {
    // The IMF throws a lifeline to a sinking country — strings attached.
    const sink = interpolate(frame, [10, fps * 2.2], [330, 380], clampBoth);
    const throwIn = spring({ frame, fps, delay: fps * 0.8, config: { damping: 14 } });
    const rx = 760 - throwIn * 300, ry = 150 + throwIn * 150;
    art = (
      <svg width={VW} height={VH}>
        <path d={`M0 340 Q 245 ${320 + Math.sin(frame * 0.1) * 10} 490 340 T 980 340 L 980 520 L 0 520 Z`} fill="#bcd8e6" stroke={ink} strokeWidth={3} />
        <g transform={`translate(360 ${sink})`}>
          <rect x={-46} y={-46} width={92} height={92} rx={8} fill={gold} stroke={ink} strokeWidth={5} />
          <text x={0} y={10} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle">🏛</text>
        </g>
        <line x1={820} y1={90} x2={rx} y2={ry} stroke={ink} strokeWidth={3} strokeDasharray="3 8" />
        <g transform={`translate(${rx} ${ry})`}>
          <circle cx={0} cy={0} r={46} fill={red} stroke={ink} strokeWidth={5} />
          <circle cx={0} cy={0} r={22} fill="#fff" stroke={ink} strokeWidth={4} />
        </g>
        <text x={760} y={80} fontSize={28} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>IMF</text>
      </svg>
    );
  } else if (m === "belttighten") {
    // Austerity: a belt cinches to a tighter notch.
    const notch = interpolate(frame, [fps * 0.6, fps * 2.2], [0, 150], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <rect x={120} y={210} width={740} height={70} rx={14} fill="#6b4a2f" stroke={ink} strokeWidth={5} />
        {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={300 + k * 70} cy={245} r={7} fill="#2e2016" />)}
        <g transform={`translate(${520 - notch} 245)`}>
          <rect x={-44} y={-44} width={88} height={88} rx={8} fill={gold} stroke={ink} strokeWidth={5} />
          <rect x={-10} y={-30} width={20} height={60} rx={4} fill="none" stroke={ink} strokeWidth={4} />
          <line x1={0} y1={0} x2={60} y2={0} stroke={ink} strokeWidth={6} />
        </g>
        <text x={490} y={360} fontSize={34} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">cut, cut, cut</text>
      </svg>
    );
  } else if (m === "vulture") {
    // Vulture funds circle a fallen bond.
    art = (
      <svg width={VW} height={VH}>
        {[0, 1, 2].map((i) => {
          const a = frame * 0.03 + (i / 3) * Math.PI * 2;
          const cx = 490 + Math.cos(a) * 300, cy = 150 + Math.sin(a) * 60;
          return <g key={i} transform={`translate(${cx} ${cy})`}>
            <path d="M-34 0 Q0 -26 34 0 Q0 -8 -34 0 Z" fill="#3a3f45" stroke={ink} strokeWidth={3} />
            <circle cx={0} cy={-4} r={8} fill="#4a5056" stroke={ink} strokeWidth={2} />
          </g>;
        })}
        <g transform="translate(430 320)">
          <rect x={0} y={0} width={130} height={90} rx={8} fill={parch} stroke={ink} strokeWidth={5} transform="rotate(-8)" />
          <text x={70} y={56} fontSize={26} fontWeight={800} fill={ink} textAnchor="middle" fontFamily="Georgia, serif" transform="rotate(-8)">BOND</text>
        </g>
      </svg>
    );
  } else if (m === "downgrade") {
    // Credit rating dial swings from AAA down toward D (junk).
    const cx = VW / 2, cy = 420, R = 250;
    const ang = interpolate(frame, [fps * 0.6, fps * 2.4], [Math.PI, Math.PI * 1.86], clampBoth);
    const labels: [number, string][] = [[Math.PI, "AAA"], [Math.PI * 1.25, "A"], [Math.PI * 1.5, "BBB"], [Math.PI * 1.75, "junk"], [Math.PI * 2, "D"]];
    art = (
      <svg width={VW} height={VH}>
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke={ink} strokeWidth={6} />
        {labels.map(([a, t], i) => <text key={i} x={cx + (R + 34) * Math.cos(a)} y={cy + (R + 34) * Math.sin(a) + 8} fontSize={26} fontWeight={800} fill={i >= 3 ? red : theme.inkSoft} textAnchor="middle" fontFamily={sans}>{t}</text>)}
        <line x1={cx} y1={cy} x2={cx + (R - 30) * Math.cos(ang)} y2={cy + (R - 30) * Math.sin(ang)} stroke={red} strokeWidth={9} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={16} fill={ink} />
      </svg>
    );
  } else if (m === "debtspiral") {
    // Borrow to pay interest — a tightening downward spiral of $.
    const pts: string[] = [];
    for (let t = 0; t < 46; t++) { const a = t * 0.5, r = 230 - t * 4.4; pts.push(`${490 + r * Math.cos(a)},${250 + r * Math.sin(a)}`); }
    const rev = interpolate(frame, [6, fps * 2.6], [0, 46], clampBoth);
    const head = Math.min(45, Math.floor(rev));
    const hx = 490 + (230 - head * 4.4) * Math.cos(head * 0.5), hy = 250 + (230 - head * 4.4) * Math.sin(head * 0.5);
    art = (
      <svg width={VW} height={VH}>
        <polyline points={pts.slice(0, head + 1).join(" ")} fill="none" stroke={red} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={hx} cy={hy} r={16} fill={gold} stroke={ink} strokeWidth={3} />
        <text x={hx} y={hy + 6} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        <text x={490} y={250} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">more debt</text>
      </svg>
    );
  } else if (m === "bondsnowball") {
    // Debt snowballs as it rolls — rolling over loans makes it bigger.
    const roll = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const x = 120 + roll * 620, r = 40 + roll * 90, y = 400 - r;
    art = (
      <svg width={VW} height={VH}>
        <line x1={60} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        <g transform={`translate(${x} ${y}) rotate(${roll * 360})`}>
          <circle cx={0} cy={0} r={r} fill="#eef2ee" stroke={ink} strokeWidth={5} />
          {[0, 1, 2, 3].map((k) => { const a = k * 1.57; return <text key={k} x={r * 0.5 * Math.cos(a)} y={r * 0.5 * Math.sin(a) + 7} fontSize={r * 0.28} fontWeight={900} fill={theme.inkSoft} textAnchor="middle" fontFamily="Georgia, serif">IOU</text>; })}
        </g>
        <text x={x} y={y - r - 20} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">{Math.round(1 + roll * 9)}×</text>
      </svg>
    );
  } else if (m === "hollowout") {
    // The middle of the income distribution empties out — people slide to the
    // rich end and the poor end, and the middle bars shrink away ("barbell").
    const p = interpolate(frame, [fps * 0.6, fps * 2.6], [0, 1], clampBoth);
    const base = [40, 90, 150, 200, 240, 200, 150, 90, 40];
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={60} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        {base.map((h0, i) => {
          const mid = Math.abs(i - 4);
          const h = i === 0 || i === 8 ? h0 + p * 150 : h0 * (1 - p * (1 - mid / 4) * 0.92);
          const x = 110 + i * 85;
          const on = i === 0 || i === 8;
          return <RRect key={i} x={x} y={440 - h} w={64} h={h} fill={on ? gold : i >= 3 && i <= 5 ? red : "#b8afa1"} strokeWidth={2.4} seed={i + 2} />;
        })}
        <text x={VW / 2} y={500} fontSize={28} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the middle hollows out</text>
      </svg>
    );
  } else if (m === "squeeze") {
    // A middle-class house squeezed between rising costs pressing in from both sides.
    const sq = interpolate(frame, [fps * 0.6, fps * 2.4], [0, 150], clampBoth);
    const wall = (x: number, dir: number, label: string) => (
      <g transform={`translate(${x + dir * -sq} 0)`}>
        <RRect x={dir < 0 ? 40 : VW - 150} y={120} w={110} h={320} fill="#9aa6ad" strokeWidth={5} />
        <text x={dir < 0 ? 95 : VW - 95} y={100} fontSize={26} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>{label}</text>
      </g>
    );
    art = (
      <svg width={VW} height={VH}>
        {wall(0, -1, "rent · health · college ↑")}
        {wall(0, 1, "flat wages")}
        <g transform={`translate(${VW / 2} 300)`}>
          <RRect x={-80} y={-20} w={160} h={120} fill="#fff" strokeWidth={5} />
          <RPath d="M-96 -18 L0 -92 L96 -18 Z" fill={red} strokeWidth={5} />
          <RRect x={-26} y={40} w={52} h={60} fill={ink} fillStyle="solid" strokeWidth={3} />
        </g>
      </svg>
    );
  } else if (m === "ladderbreak") {
    // The ladder of upward mobility — with a rung snapping.
    const snap = interpolate(frame, [fps * 1.2, fps * 1.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <line x1={430} y1={60} x2={430} y2={470} stroke={ink} strokeWidth={9} strokeLinecap="round" />
        <line x1={560} y1={60} x2={560} y2={470} stroke={ink} strokeWidth={9} strokeLinecap="round" />
        {[110, 190, 350, 430].map((y, i) => <line key={i} x1={430} y1={y} x2={560} y2={y} stroke={ink} strokeWidth={8} strokeLinecap="round" />)}
        <g transform={`translate(0 ${snap * 70}) rotate(${snap * 16} 495 270)`} opacity={1 - snap * 0.2}>
          <line x1={430} y1={270} x2={495} y2={270} stroke={red} strokeWidth={8} strokeLinecap="round" />
          <line x1={560} y1={270} x2={505} y2={272} stroke={red} strokeWidth={8} strokeLinecap="round" />
        </g>
        <text x={495} y={40} fontSize={26} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>the next rung</text>
        <text x={495} y={515} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">mobility stalls</text>
      </svg>
    );
  } else if (m === "twoincome") {
    // Two earners both working flat-out — and still treading water.
    const bob = Math.sin(frame * 0.25) * 6;
    const worker = (x: number, col: string) => (
      <g transform={`translate(${x} ${270 + bob})`}>
        <circle cx={0} cy={-60} r={26} fill={["#f0cda6", "#e8c49a"][x > 490 ? 1 : 0]} stroke={ink} strokeWidth={4} />
        <path d="M-26 90 Q-26 -24 0 -24 Q26 -24 26 90" fill={col} stroke={ink} strokeWidth={4} />
      </g>
    );
    const water = interpolate(frame, [fps * 0.6, fps * 2.4], [430, 330], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {worker(380, green)}
        {worker(600, blue)}
        <path d={`M0 ${water} Q 245 ${water - 14} 490 ${water} T 980 ${water} L980 520 L0 520 Z`} fill="#bcd8e6" opacity={0.85} stroke={ink} strokeWidth={3} />
        <text x={VW / 2} y={90} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">two incomes — still treading water</text>
      </svg>
    );
  } else if (m === "shrinkpie") {
    // The middle class's slice of the pie shrinks over time.
    const p = interpolate(frame, [fps * 0.6, fps * 2.6], [0, 1], clampBoth);
    const cx = VW / 2, cy = 250, R = 170;
    const midFrac = 0.62 - p * 0.19; // middle share: ~62% → ~43%
    const a0 = -Math.PI / 2, a1 = a0 + midFrac * Math.PI * 2;
    const arc = (s: number, e: number, col: string) => {
      const large = e - s > Math.PI ? 1 : 0;
      return <path d={`M ${cx} ${cy} L ${cx + R * Math.cos(s)} ${cy + R * Math.sin(s)} A ${R} ${R} 0 ${large} 1 ${cx + R * Math.cos(e)} ${cy + R * Math.sin(e)} Z`} fill={col} stroke={ink} strokeWidth={4} />;
    };
    art = (
      <svg width={VW} height={VH}>
        {arc(a1, a0 + Math.PI * 2, "#d9d2c6")}
        {arc(a0, a1, gold)}
        <text x={cx} y={cy + 8} fontSize={40} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{Math.round(midFrac * 100)}%</text>
        <text x={cx} y={470} fontSize={28} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>middle class's share of income</text>
      </svg>
    );
  } else if (m === "escalator") {
    // The "up escalator" of mobility stalling: a figure trying to climb a down-moving step belt.
    const shift = (frame * 2) % 70;
    art = (
      <svg width={VW} height={VH}>
        <line x1={200} y1={460} x2={760} y2={120} stroke={ink} strokeWidth={6} strokeLinecap="round" />
        <line x1={230} y1={470} x2={790} y2={130} stroke={ink} strokeWidth={6} strokeLinecap="round" />
        {Array.from({ length: 9 }, (_, i) => { const t = (i * 70 + shift) / 630; const x = 200 + t * 560, y = 460 - t * 340; return <line key={i} x1={x} y1={y} x2={x + 26} y2={y - 16} stroke={theme.inkSoft} strokeWidth={5} strokeLinecap="round" />; })}
        <g transform="translate(470 300)">
          <circle cx={0} cy={-56} r={24} fill="#f0cda6" stroke={ink} strokeWidth={4} />
          <path d="M-24 60 Q-24 -20 0 -20 Q24 -20 24 60" fill={red} stroke={ink} strokeWidth={4} />
        </g>
        <path d="M470 150 l0 -40 M470 110 l-10 14 M470 110 l10 14" stroke={theme.inkSoft} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
        <text x={VW / 2} y={505} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">running up a down escalator</text>
      </svg>
    );
  } else if (m === "treadmill") {
    // The hedonic treadmill: running hard, going nowhere.
    const run = frame * 0.35;
    const legA = Math.sin(run) * 22, legB = Math.sin(run + Math.PI) * 22;
    const beltX = (frame * 6) % 60;
    art = (
      <svg width={VW} height={VH}>
        <RRect x={300} y={360} w={380} h={34} fill="#3a3f45" strokeWidth={5} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={310 + ((i * 60 + beltX) % 360)} y1={377} x2={330 + ((i * 60 + beltX) % 360)} y2={377} stroke="#cfd8dc" strokeWidth={4} />)}
        <RRect x={300} y={300} w={14} h={120} fill="#59707c" strokeWidth={4} />
        <RRect x={300} y={300} w={120} h={12} fill="#59707c" strokeWidth={4} />
        <g transform="translate(500 300)">
          <circle cx={0} cy={-70} r={26} fill="#f0cda6" stroke={ink} strokeWidth={4} />
          <path d="M-22 60 Q-22 -30 0 -30 Q22 -30 22 60" fill={blue} stroke={ink} strokeWidth={4} />
          <line x1={-6} y1={10} x2={-6 - legA} y2={62} stroke={ink} strokeWidth={6} strokeLinecap="round" />
          <line x1={6} y1={10} x2={6 - legB} y2={62} stroke={ink} strokeWidth={6} strokeLinecap="round" />
        </g>
        <text x={VW / 2} y={470} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">running hard — going nowhere</text>
      </svg>
    );
  } else if (m === "lifestylecreep") {
    // Income rises — but spending rises right alongside it. The gap never opens.
    const p = interpolate(frame, [fps * 0.5, fps * 2.6], [0, 1], clampBoth);
    const base = 440;
    const inc = 120 + p * 260, spend = 110 + p * 250;
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={120} y1={base} x2={VW - 80} y2={base} stroke={ink} strokeWidth={4} />
        <RRect x={300} y={base - inc} w={120} h={inc} fill={green} strokeWidth={3} />
        <RRect x={560} y={base - spend} w={120} h={spend} fill={red} strokeWidth={3} />
        <text x={360} y={base - inc - 16} fontSize={28} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>income</text>
        <text x={620} y={base - spend - 16} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>spending</text>
        <text x={VW / 2} y={base + 44} fontSize={28} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the raise arrives — so does the spending</text>
      </svg>
    );
  } else if (m === "leakybucket") {
    // Money pours into a bucket riddled with holes — nothing stays in.
    art = (
      <svg width={VW} height={VH}>
        {Array.from({ length: 6 }, (_, i) => { const y = 60 + ((frame * 8 + i * 30) % 120); const op = interpolate((frame * 8 + i * 30) % 120, [0, 20, 100, 120], [0, 1, 1, 0]); return <g key={"in" + i} opacity={op}><circle cx={490 + (i % 2 ? 10 : -10)} cy={y} r={15} fill={gold} stroke={ink} strokeWidth={2.5} /><text x={490 + (i % 2 ? 10 : -10)} y={y + 6} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
        <path d="M360 210 L620 210 L580 420 L400 420 Z" fill="#9aa6ad" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
        <path d="M360 210 Q490 180 620 210" fill="none" stroke={ink} strokeWidth={5} />
        {[[420, 320], [540, 300], [470, 370]].map(([hx, hy], i) => <circle key={"h" + i} cx={hx} cy={hy} r={9} fill={ink} />)}
        {[[420, 320, -1], [540, 300, 1], [470, 370, 1]].map(([hx, hy, d], i) => { const y = hy + ((frame * 7 + i * 25) % 110); const op = interpolate((frame * 7 + i * 25) % 110, [0, 15, 95, 110], [0, 1, 1, 0]); return <g key={"out" + i} opacity={op}><circle cx={hx + d * 26} cy={y} r={12} fill={gold} stroke={ink} strokeWidth={2} /></g>; })}
        <text x={VW / 2} y={470} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">it goes out as fast as it comes in</text>
      </svg>
    );
  } else if (m === "goldenhandcuffs") {
    // A big salary that chains you to the job you can't afford to leave.
    const glint = 0.5 + 0.5 * Math.sin(frame * 0.2);
    art = (
      <svg width={VW} height={VH}>
        {[330, 560].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={250} r={70} fill="none" stroke={gold} strokeWidth={22} />
            <circle cx={cx} cy={250} r={70} fill="none" stroke="#fff" strokeWidth={4} opacity={glint} />
          </g>
        ))}
        <rect x={400} y={238} width={90} height={24} rx={6} fill={gold} stroke={ink} strokeWidth={3} />
        <text x={VW / 2} y={250} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif" dy={2}>$</text>
        <text x={VW / 2} y={400} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">a salary you can't afford to lose</text>
      </svg>
    );
  } else if (m === "joneses") {
    // Keeping up with the Joneses: one house upgrades, the neighbour strains to match.
    const up = interpolate(frame, [fps * 0.8, fps * 1.8], [0, 1], clampBoth);
    const house = (x: number, scale: number, col: string, tag: string) => (
      <g transform={`translate(${x} ${420}) scale(${scale})`}>
        <rect x={-80} y={-110} width={160} height={110} fill="#fff" stroke={ink} strokeWidth={5} />
        <path d="M-96 -108 L0 -180 L96 -108 Z" fill={col} stroke={ink} strokeWidth={5} />
        <rect x={-26} y={-60} width={52} height={60} fill={ink} />
        <text x={0} y={34} fontSize={26} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>{tag}</text>
      </g>
    );
    art = (
      <svg width={VW} height={VH}>
        {house(270, 1.0, "#3a6ea5", "the Joneses")}
        {house(690, 0.8 + up * 0.25, red, "…you, matching")}
        <path d="M470 180 l0 -40 M470 140 l-10 14 M470 140 l10 14" stroke={theme.inkSoft} strokeWidth={4} fill="none" strokeLinecap="round" opacity={up} />
        <text x={VW / 2} y={490} fontSize={28} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">keeping up — on credit</text>
      </svg>
    );
  } else if (m === "paycheckgone") {
    // The paycheck lands and is instantly eaten by fixed bills — nothing left.
    const inAt = fps * 0.5, outAt = fps * 1.4;
    const checkX = interpolate(frame, [inAt, outAt], [-200, 430], clampBoth);
    const eaten = interpolate(frame, [outAt, fps * 2.4], [0, 1], clampBoth);
    const bills = ["TAX", "MORTGAGE", "CHILDCARE", "CARS"];
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${checkX} 200)`} opacity={1 - eaten}>
          <rect x={0} y={0} width={220} height={110} rx={8} fill="#eaf4ec" stroke={ink} strokeWidth={5} />
          <text x={110} y={50} fontSize={26} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>PAY</text>
          <text x={110} y={86} fontSize={34} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">$300K</text>
        </g>
        {bills.map((b, i) => { const op = interpolate(frame, [outAt + i * 6, outAt + i * 6 + 8], [0, 1], clampBoth); return <g key={i} opacity={op}><rect x={200 + i * 150} y={330} width={135} height={60} rx={8} fill={red} stroke={ink} strokeWidth={4} /><text x={267 + i * 150} y={368} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>{b}</text></g>; })}
        {eaten > 0.9 && <text x={VW / 2} y={200} fontSize={40} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" opacity={interpolate(frame, [fps * 2.3, fps * 2.7], [0, 1], clampBoth)}>$0 left</text>}
      </svg>
    );
  } else if (m === "keystroke") {
    // A banker types, and a deposit number simply appears from nothing.
    const typed = interpolate(frame, [fps * 0.6, fps * 1.6], [0, 100000], clampBoth);
    const pop = spring({ frame, fps, delay: fps * 1.6, config: { damping: 12 } });
    art = (
      <svg width={VW} height={VH}>
        <RRect x={VW / 2 - 150} y={340} w={300} h={70} fill="#2b2f33" strokeWidth={5} />
        {[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => <rect key={`${r}-${c}`} x={VW / 2 - 132 + c * 38} y={352 + r * 18} width={26} height={12} rx={3} fill="#e8edf0" />))}
        <g transform={`translate(${VW / 2} 200) scale(${0.6 + pop * 0.4})`} opacity={interpolate(frame, [fps * 0.6, fps], [0, 1], clampBoth)}>
          <rect x={-210} y={-60} width={420} height={120} rx={14} fill="#eaf4ec" stroke={ink} strokeWidth={5} />
          <text x={0} y={-6} fontSize={30} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>YOUR ACCOUNT</text>
          <text x={0} y={44} fontSize={56} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">${Math.round(typed).toLocaleString("en-US")}</text>
        </g>
        <text x={VW / 2} y={470} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">created with a keystroke</text>
      </svg>
    );
  } else if (m === "loandeposit") {
    // Double entry: a loan (asset) and a brand-new deposit (liability) appear together.
    const a = spring({ frame, fps, delay: fps * 0.6, config: { damping: 13 } });
    const b = spring({ frame, fps, delay: fps * 1.3, config: { damping: 13 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={90} fontSize={30} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>the bank's ledger — one click</text>
        <g transform={`translate(260 270) scale(${a})`}>
          <rect x={-150} y={-80} width={300} height={160} rx={12} fill="#fff" stroke={ink} strokeWidth={5} />
          <text x={0} y={-36} fontSize={26} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>ASSET</text>
          <text x={0} y={16} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your loan</text>
          <text x={0} y={60} fontSize={30} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">+$100,000</text>
        </g>
        <g transform={`translate(720 270) scale(${b})`}>
          <rect x={-150} y={-80} width={300} height={160} rx={12} fill="#eaf4ec" stroke={ink} strokeWidth={5} />
          <text x={0} y={-36} fontSize={26} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>LIABILITY</text>
          <text x={0} y={16} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your deposit</text>
          <text x={0} y={60} fontSize={30} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">+$100,000</text>
        </g>
        {b > 0.5 && <text x={VW / 2} y={470} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" opacity={interpolate(b, [0.5, 1], [0, 1])}>new money — out of nothing</text>}
      </svg>
    );
  } else if (m === "moneymultiplier") {
    // One deposit spawns a cascade of smaller loans → deposits.
    const rows = [[490], [330, 650], [250, 430, 570, 730]];
    art = (
      <svg width={VW} height={VH}>
        {rows.map((row, r) => row.map((x, i) => {
          const on = spring({ frame, fps, delay: fps * (0.5 + r * 0.6) + i * 3, config: { damping: 13 } });
          const size = 60 - r * 12;
          return <g key={`${r}-${i}`} transform={`translate(${x} ${140 + r * 120}) scale(${on})`}><circle cx={0} cy={0} r={size} fill={gold} stroke={ink} strokeWidth={4} /><text x={0} y={size * 0.3} fontSize={size * 0.8} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>;
        }))}
        <text x={VW / 2} y={490} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">each deposit funds the next loan</text>
      </svg>
    );
  } else if (m === "cashvsdigital") {
    // ~3% of money is physical cash; ~97% is digits in bank computers.
    const grow = interpolate(frame, [fps * 0.6, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(230 360)">
          <circle cx={0} cy={0} r={46} fill={gold} stroke={ink} strokeWidth={4} />
          <text x={0} y={12} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text>
          <text x={0} y={90} fontSize={30} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>3% cash</text>
        </g>
        <g transform="translate(650 360)">
          <rect x={-150} y={-320 * grow} width={300} height={320 * grow} rx={10} fill={green} stroke={ink} strokeWidth={4} />
          <text x={0} y={90} fontSize={30} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>97% digital</text>
          {grow > 0.6 && <text x={0} y={-320 * grow + 50} fontSize={26} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">0100101</text>}
        </g>
      </svg>
    );
  } else if (m === "moneyburn") {
    // Repaying the loan destroys the money — the deposit shrinks back to zero.
    const shrink = interpolate(frame, [fps * 0.6, fps * 2.2], [1, 0], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} 250)`}>
          <rect x={-200} y={-70} width={400} height={140} rx={14} fill="none" stroke={ink} strokeWidth={4} strokeDasharray="8 8" />
          <g opacity={shrink} transform={`scale(${0.3 + shrink * 0.7})`}>
            <rect x={-200} y={-70} width={400} height={140} rx={14} fill="#eaf4ec" stroke={ink} strokeWidth={5} />
            <text x={0} y={18} fontSize={52} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">${Math.round(100000 * shrink).toLocaleString("en-US")}</text>
          </g>
          {shrink < 0.1 && <text x={0} y={18} fontSize={52} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">$0</text>}
        </g>
        <text x={VW / 2} y={420} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">repay the loan → the money vanishes</text>
      </svg>
    );
  } else if (m === "ipopop") {
    // IPO day: a sharp first-day pop, then a long fade back down.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.6], [0, 1], clampBoth);
    const path = "M 80 400 L 150 150 L 240 180 L 360 230 L 480 300 L 600 360 L 740 410 L 880 440";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={70} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={7} seed={5} /></g>
        {rev > 0.2 && <text x={150} y={120} fontSize={26} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif" opacity={interpolate(frame, [fps * 0.6, fps], [0, 1], clampBoth)}>the pop!</text>}
        {rev > 0.9 && <text x={760} y={420} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans} opacity={interpolate(frame, [fps * 2.2, fps * 2.6], [0, 1], clampBoth)}>…the fade</text>}
      </svg>
    );
  } else if (m === "bagholder") {
    // Retail left holding the bag as it deflates.
    const defl = interpolate(frame, [fps * 1.0, fps * 2.4], [1, 0.4], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} 300)`}>
          <circle cx={0} cy={-150} r={34} fill="#f0cda6" stroke={ink} strokeWidth={4} />
          <path d="M-40 10 Q-40 -110 0 -110 Q40 -110 40 10" fill={blue} stroke={ink} strokeWidth={4} />
          <g transform={`translate(0 ${60}) scale(${defl})`}>
            <path d="M-70 -30 Q-80 60 0 70 Q80 60 70 -30 Q40 -50 0 -50 Q-40 -50 -70 -30 Z" fill={tan} stroke={ink} strokeWidth={5} />
            <text x={0} y={30} fontSize={44} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text>
          </g>
        </g>
        <text x={VW / 2} y={470} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">left holding the bag</text>
      </svg>
    );
  } else if (m === "exitramp") {
    // Insiders stream OUT with cash as retail streams IN to buy.
    art = (
      <svg width={VW} height={VH}>
        <rect x={VW / 2 - 70} y={120} width={140} height={300} rx={10} fill="#59707c" stroke={ink} strokeWidth={5} />
        <rect x={VW / 2 - 46} y={150} width={92} height={250} fill="#cfe6ef" stroke={ink} strokeWidth={3} />
        <text x={VW / 2} y={108} fontSize={26} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>IPO</text>
        {Array.from({ length: 4 }, (_, i) => { const p = ((frame * 5 + i * 60) % 300) / 300; const x = VW / 2 + 40 + p * 360; const y = 300 + (i % 2) * 36; const op = interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]); return <g key={"out" + i} opacity={op} transform={`translate(${x} ${y})`}><circle cx={0} cy={-30} r={14} fill="#f0cda6" stroke={ink} strokeWidth={3} /><path d="M-13 40 Q-13 -4 0 -4 Q13 -4 13 40" fill={green} stroke={ink} strokeWidth={3} /><rect x={14} y={-6} width={18} height={14} fill={gold} stroke={ink} strokeWidth={2} /></g>; })}
        {Array.from({ length: 4 }, (_, i) => { const p = ((frame * 5 + i * 60) % 300) / 300; const x = 40 + p * (VW / 2 - 120); const y = 300 + (i % 2) * 36; const op = interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]); return <g key={"in" + i} opacity={op} transform={`translate(${x} ${y})`}><circle cx={0} cy={-30} r={14} fill="#e8c49a" stroke={ink} strokeWidth={3} /><path d="M-13 40 Q-13 -4 0 -4 Q13 -4 13 40" fill={blue} stroke={ink} strokeWidth={3} /></g>; })}
        <text x={VW / 4} y={470} fontSize={24} fontWeight={900} fill={blue} textAnchor="middle" fontFamily={sans}>retail buys in</text>
        <text x={VW * 0.75} y={470} fontSize={24} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>insiders cash out</text>
      </svg>
    );
  } else if (m === "lockupcliff") {
    // The price holds flat during the lock-up, then falls off a cliff when it expires.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const path = "M 80 200 L 520 200 L 560 210 L 640 320 L 740 400 L 880 430";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={70} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        <line x1={540} y1={120} x2={540} y2={440} stroke={theme.inkSoft} strokeWidth={3} strokeDasharray="7 7" />
        <text x={540} y={110} fontSize={24} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>lock-up ends</text>
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={7} seed={4} /></g>
        <text x={VW / 2} y={490} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">insiders can finally sell</text>
      </svg>
    );
  } else if (m === "hotpotato") {
    // Greater-fool: an overpriced asset tossed to the next buyer, until someone's stuck.
    const hop = Math.floor(interpolate(frame, [0, fps * 2.6], [0, 4], clampBoth));
    const xs = [220, 400, 580, 760];
    const px = xs[Math.min(3, hop)];
    const arc = Math.abs(Math.sin(frame * 0.4)) * 60;
    art = (
      <svg width={VW} height={VH}>
        {xs.map((x, i) => <g key={i} transform={`translate(${x} 360)`}><circle cx={0} cy={-30} r={18} fill={i <= hop ? "#e8c49a" : "#f0cda6"} stroke={ink} strokeWidth={3} /><path d="M-16 50 Q-16 -6 0 -6 Q16 -6 16 50" fill={[blue, green, red, "#8a5a2b"][i]} stroke={ink} strokeWidth={3} /></g>)}
        <g transform={`translate(${px} ${300 - arc})`}>
          <circle cx={0} cy={0} r={30} fill={red} stroke={ink} strokeWidth={4} />
          <text x={0} y={10} fontSize={30} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </g>
        {hop >= 3 && <text x={760} y={300} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" opacity={interpolate(frame, [fps * 2.4, fps * 2.8], [0, 1], clampBoth)}>stuck!</text>}
        <text x={VW / 2} y={480} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">pass it to a greater fool</text>
      </svg>
    );
  } else if (m === "circularfinance") {
    const nodes = [["chipmaker", 490, 120], ["AI lab", 760, 340], ["cloud firm", 220, 340]] as const;
    const dot = (frame % 90) / 90;
    art = (
      <svg width={VW} height={VH}>
        {nodes.map((n, i) => {
          const a = nodes[i], b = nodes[(i + 1) % 3];
          const t = (dot + i / 3) % 1;
          const x = a[1] + (b[1] - a[1]) * t, y = a[2] + (b[2] - a[2]) * t;
          return <g key={"d" + i}><line x1={a[1]} y1={a[2]} x2={b[1]} y2={b[2]} stroke={theme.grid} strokeWidth={3} /><circle cx={x} cy={y} r={13} fill={gold} stroke={ink} strokeWidth={2} /><text x={x} y={y + 5} fontSize={13} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>;
        })}
        {nodes.map(([lbl, x, y], i) => {
          const a = spring({ frame, fps, delay: 6 + i * 6, config: { damping: 13 } });
          return <g key={i} transform={`translate(${x} ${y}) scale(${a})`}><circle cx={0} cy={0} r={66} fill="#fff" stroke={ink} strokeWidth={5} /><text x={0} y={8} fontSize={23} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lbl}</text></g>;
        })}
        <text x={VW / 2} y={480} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">the same dollars, going in circles</text>
      </svg>
    );
  } else if (m === "iceberg") {
    const sink = interpolate(frame, [fps * 0.6, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <rect x={0} y={200} width={VW} height={320} fill="#bcd8e6" opacity={0.8} />
        <line x1={0} y1={200} x2={VW} y2={200} stroke={ink} strokeWidth={3} />
        <g transform={`translate(${VW / 2} 0)`}>
          <path d="M-70 200 L0 110 L70 200 Z" fill="#fff" stroke={ink} strokeWidth={5} />
          <text x={0} y={168} fontSize={22} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>hype</text>
          <path d={`M-200 200 L-150 ${200 + sink * 280} L150 ${200 + sink * 280} L200 200 Z`} fill="#dfe9ee" stroke={ink} strokeWidth={5} opacity={0.95} />
          <text x={0} y={360} fontSize={42} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" opacity={sink}>DEBT</text>
        </g>
        <text x={VW / 2} y={500} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a little equity on top, a wall of debt below</text>
      </svg>
    );
  } else if (m === "capexfurnace") {
    art = (
      <svg width={VW} height={VH}>
        <rect x={VW / 2 - 150} y={180} width={300} height={220} rx={10} fill="#2b2f33" stroke={ink} strokeWidth={5} />
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={VW / 2 - 120 + c * 90} y={200 + r * 48} width={72} height={30} fill="#454b50" stroke={ink} strokeWidth={1.5} />))}
        {Array.from({ length: 6 }, (_, i) => { const p = ((frame * 7 + i * 40) % 220) / 220; const x = 120 + p * (VW / 2 - 300); const op = interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]); return <g key={i} opacity={op}><rect x={x} y={300} width={44} height={20} rx={3} fill={green} stroke={ink} strokeWidth={2} /></g>; })}
        {Array.from({ length: 5 }, (_, i) => { const p = ((frame * 6 + i * 36) % 180) / 180; const y = 180 - p * 120; const op = interpolate(p, [0, 0.2, 1], [0.9, 0.6, 0]); return <circle key={"s" + i} cx={VW / 2 - 60 + i * 30} cy={y} r={10 + p * 18} fill="#c7c2b6" opacity={op} />; })}
        <text x={VW / 2} y={450} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">billions in capex, up in smoke</text>
      </svg>
    );
  } else if (m === "gpudecay") {
    const decay = interpolate(frame, [fps * 0.6, fps * 2.4], [1, 0.25], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2 - 180} 230)`}>
          <rect x={-100} y={-100} width={200} height={200} rx={16} fill="#8a5a2b" stroke={ink} strokeWidth={6} />
          <rect x={-64} y={-64} width={128} height={128} rx={8} fill="#b07a3a" stroke={ink} strokeWidth={3} />
          <text x={0} y={8} fontSize={26} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>GPU</text>
        </g>
        <g transform="translate(680 230)">
          <rect x={-70} y={120 - 240 * decay} width={140} height={240 * decay} rx={8} fill={gold} stroke={ink} strokeWidth={4} />
          <text x={0} y={150} fontSize={24} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>value</text>
        </g>
        <text x={VW / 2} y={430} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">today's $40k chip, tomorrow's scrap</text>
      </svg>
    );
  } else if (m === "bubbledebt") {
    const grow = interpolate(frame, [6, fps * 1.8], [40, 150], clampBoth);
    const pop = interpolate(frame, [fps * 2.0, fps * 2.3], [0, 1], clampBoth);
    const sway = Math.sin(frame * 0.08) * 12;
    art = (
      <svg width={VW} height={VH}>
        {pop < 0.5 && <g transform={`translate(${VW / 2 + sway} 180)`}><circle cx={0} cy={0} r={grow} fill="#bfe0ef" stroke={ink} strokeWidth={5} opacity={1 - pop * 2} /><text x={0} y={8} fontSize={30} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans} opacity={1 - pop * 2}>AI hype</text></g>}
        {pop > 0 && pop < 1 && Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * 6.28; return <line key={i} x1={VW / 2 + grow * Math.cos(a)} y1={180 + grow * Math.sin(a)} x2={VW / 2 + (grow + 50 * pop) * Math.cos(a)} y2={180 + (grow + 50 * pop) * Math.sin(a)} stroke={red} strokeWidth={5 * (1 - pop)} />; })}
        <line x1={VW / 2 + sway} y1={180 + grow} x2={VW / 2} y2={400} stroke={ink} strokeWidth={3} strokeDasharray="4 6" />
        <g transform={`translate(${VW / 2} 430)`}>
          <rect x={-90} y={-40} width={180} height={80} rx={8} fill="#59707c" stroke={ink} strokeWidth={5} />
          <text x={0} y={12} fontSize={34} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">DEBT</text>
        </g>
        {pop >= 1 && <text x={VW / 2} y={170} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">hype pops — the debt stays</text>}
      </svg>
    );
  } else if (m === "warboom") {
    // Bombs fall on one side; the stock chart climbs on the other.
    const rev = interpolate(frame, [8, fps * 2.2], [0, 1], clampBoth);
    const clipId = React.useId().replace(/:/g, "");
    const path = "M 540 420 L 620 360 L 700 380 L 780 300 L 860 230 L 920 150";
    art = (
      <svg width={VW} height={VH}>
        <line x1={60} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        {Array.from({ length: 4 }, (_, i) => { const p = ((frame * 6 + i * 50) % 200) / 200; const y = 120 + p * 280; const x = 140 + i * 90; const op = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]); return <g key={i} opacity={op}><ellipse cx={x} cy={y} rx={12} ry={18} fill={ink} /><path d={`M${x} ${y - 20} l-5 -10 M${x} ${y - 20} l5 -10`} stroke={red} strokeWidth={3} /></g>; })}
        {Array.from({ length: 3 }, (_, i) => { const on = frame > fps * (0.8 + i * 0.4) && frame < fps * (1.1 + i * 0.4); return on ? <text key={"b" + i} x={160 + i * 90} y={430} fontSize={48} textAnchor="middle">💥</text> : null; })}
        <text x={250} y={110} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">war ↓</text>
        <defs><clipPath id={clipId}><rect x={520} y={0} width={420 * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={green} strokeWidth={7} seed={6} /></g>
        {rev > 0.8 && <text x={880} y={130} fontSize={28} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">stocks ↑</text>}
      </svg>
    );
  } else if (m === "priceddip") {
    // Shock headline → a quick dip, then a V-shaped recovery (markets "price it in").
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [8, fps * 2.4], [0, 1], clampBoth);
    const path = "M 80 240 L 300 250 L 420 400 L 540 300 L 700 220 L 880 150";
    art = (
      <svg width={VW} height={VH}>
        <line x1={70} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={7} seed={5} /></g>
        {rev > 0.35 && <text x={420} y={430} fontSize={22} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans} opacity={interpolate(frame,[fps*0.9,fps*1.2],[0,1],clampBoth)}>the shock</text>}
        {rev > 0.9 && <text x={840} y={130} fontSize={24} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">…priced in</text>}
      </svg>
    );
  } else if (m === "safehaven") {
    // In chaos, money floods INTO safe assets (dollar / gold / treasuries).
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} 250)`}>
          <rect x={-90} y={-90} width={180} height={180} rx={16} fill="#3a6ea5" stroke={ink} strokeWidth={6} />
          <path d="M-40 0 L-10 30 L45 -35" fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
          <text x={0} y={120} fontSize={26} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>safe haven</text>
        </g>
        {Array.from({ length: 8 }, (_, i) => { const prog = ((frame * 6 + i * 36) % 240) / 240; const a = (i / 8) * 6.28; const sx = VW / 2 + Math.cos(a) * 420, sy = 250 + Math.sin(a) * 240; const xx = sx + (VW / 2 - sx) * prog, yy = sy + (250 - sy) * prog; const op = interpolate(prog, [0, 0.1, 0.85, 1], [0, 1, 1, 0]); return <g key={i} opacity={op}><circle cx={xx} cy={yy} r={16} fill={gold} stroke={ink} strokeWidth={2.5} /><text x={xx} y={yy + 5} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
      </svg>
    );
  } else if (m === "survivorship") {
    // Many market lines; most crash to zero. We only ever plot the survivor.
    const rev = interpolate(frame, [8, fps * 2.0], [0, 1], clampBoth);
    const fade = interpolate(frame, [fps * 2.0, fps * 2.6], [1, 0.12], clampBoth);
    const losers = ["M 80 300 L 300 380 L 420 430", "M 80 280 L 250 330 L 500 430", "M 80 320 L 400 420 L 520 435", "M 80 260 L 220 300 L 360 430"];
    const winner = "M 80 300 L 260 250 L 440 270 L 640 170 L 880 90";
    const clip = React.useId().replace(/:/g, "");
    art = (
      <svg width={VW} height={VH}>
        <line x1={70} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        <defs><clipPath id={clip}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clip})`}>
          {losers.map((d, i) => <g key={i} opacity={fade}><RPath d={d} stroke={theme.inkSoft} strokeWidth={4} seed={i + 2} /></g>)}
          <RPath d={winner} stroke={green} strokeWidth={7} seed={9} />
        </g>
        {fade < 0.5 && <text x={VW / 2} y={490} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">we only ever see the survivor</text>}
      </svg>
    );
  } else if (m === "marketvsreality") {
    // Split screen: a bombed skyline on the left, a rising ticker on the right.
    art = (
      <svg width={VW} height={VH}>
        <line x1={VW / 2} y1={60} x2={VW / 2} y2={460} stroke={ink} strokeWidth={3} strokeDasharray="8 8" />
        <g>
          {[120, 200, 280, 360].map((x, i) => <rect key={i} x={x} y={300 - (i % 2) * 40} width={54} height={160 + (i % 2) * 40} fill="#8a929a" stroke={ink} strokeWidth={3} />)}
          <path d="M150 300 l20 -30 M250 260 l24 -26 M330 300 l18 -24" stroke={red} strokeWidth={3} fill="none" />
          <text key="a" x={250} y={440} fontSize={48} textAnchor="middle">🔥</text>
          <text x={250} y={120} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>the country</text>
        </g>
        <g>
          <RPath d="M560 380 L640 340 L720 350 L800 270 L880 190" stroke={green} strokeWidth={7} seed={4} />
          <text x={740} y={120} fontSize={26} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>the market</text>
        </g>
        <text x={VW / 2} y={500} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the market is not the country</text>
      </svg>
    );
  } else if (m === "dollarshortage") {
    // A shrinking pile of dollars with many hands grabbing for it.
    const shrink = interpolate(frame, [fps * 0.6, fps * 2.4], [1, 0.4], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} 250)`}>
          <circle cx={0} cy={0} r={120 * shrink} fill={green} stroke={ink} strokeWidth={6} />
          <text x={0} y={16} fontSize={70 * shrink + 10} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </g>
        {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * 6.28; const reach = 60 + Math.sin(frame * 0.2 + i) * 20; const x = VW / 2 + Math.cos(a) * (180 + reach), y = 250 + Math.sin(a) * (150 + reach); return <g key={i} transform={`translate(${x} ${y}) rotate(${(a * 180 / Math.PI) + 90})`}><path d="M-10 0 Q-10 -26 0 -26 Q10 -26 10 0 M-10 -8 l-6 6 M10 -8 l6 6" fill="#f0cda6" stroke={ink} strokeWidth={2.5} /></g>; })}
        <text x={VW / 2} y={470} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">everyone scrambles for scarce dollars</text>
      </svg>
    );
  } else if (m === "swapline") {
    // The Fed pipes dollars to a foreign central bank; their currency flows back.
    const flow = (frame % 80) / 80;
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(220 250)"><rect x={-90} y={-70} width={180} height={140} rx={10} fill="#eef2ee" stroke={ink} strokeWidth={5} /><text x={0} y={-10} fontSize={24} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the Fed</text><text x={0} y={40} fontSize={40} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>
        <g transform="translate(760 250)"><rect x={-90} y={-70} width={180} height={140} rx={10} fill="#eef2ee" stroke={ink} strokeWidth={5} /><text x={0} y={-10} fontSize={22} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>foreign bank</text><text x={0} y={40} fontSize={36} fontWeight={900} fill="#3a6ea5" textAnchor="middle" fontFamily="Georgia, serif">¥ €</text></g>
        <line x1={310} y1={210} x2={670} y2={210} stroke={theme.grid} strokeWidth={4} />
        <line x1={310} y1={290} x2={670} y2={290} stroke={theme.grid} strokeWidth={4} />
        {[0, 1, 2].map((i) => { const t = (flow + i / 3) % 1; return <g key={"a" + i}><circle cx={310 + (360) * t} cy={210} r={13} fill={green} stroke={ink} strokeWidth={2} /><text x={310 + 360 * t} y={215} fontSize={13} fontWeight={900} fill="#fff" textAnchor="middle">$</text></g>; })}
        {[0, 1, 2].map((i) => { const t = (flow + i / 3) % 1; return <g key={"b" + i}><circle cx={670 - 360 * t} cy={290} r={13} fill="#3a6ea5" stroke={ink} strokeWidth={2} /></g>; })}
        <text x={490} y={180} fontSize={22} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>dollars out →</text>
        <text x={490} y={330} fontSize={22} fontWeight={800} fill="#3a6ea5" textAnchor="middle" fontFamily={sans}>← their currency as collateral</text>
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a Fed 'swap line'</text>
      </svg>
    );
  } else if (m === "plumbing") {
    // The dollar as the plumbing of the whole global economy — pipes everywhere.
    const flow = (frame * 4) % 40;
    const pipes = [[120, 180, 860, 180], [120, 340, 860, 340], [300, 120, 300, 420], [680, 120, 680, 420]];
    art = (
      <svg width={VW} height={VH}>
        {pipes.map((p, i) => <line key={i} x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]} stroke="#9aa6ad" strokeWidth={18} strokeLinecap="round" />)}
        {pipes.map((p, i) => <line key={"c" + i} x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]} stroke="#59707c" strokeWidth={6} strokeDasharray="6 14" strokeDashoffset={-flow} />)}
        {[[120, 180], [860, 180], [120, 340], [860, 340], [300, 120], [680, 420]].map(([x, y], i) => <g key={"n" + i}><circle cx={x} cy={y} r={26} fill="#fff" stroke={ink} strokeWidth={4} /><text x={x} y={y + 7} fontSize={22} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>)}
        <circle cx={490} cy={260} r={50} fill={green} stroke={ink} strokeWidth={5} />
        <text x={490} y={272} fontSize={44} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text>
        <text x={VW / 2} y={490} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the dollar is the world's plumbing</text>
      </svg>
    );
  } else if (m === "contagionmap") {
    // A fire starts in one currency and threatens to spread across a connected map.
    const spread = interpolate(frame, [fps * 0.6, fps * 2.6], [0, 1], clampBoth);
    const nodes = [[200, 180], [420, 150], [640, 200], [800, 320], [520, 360], [280, 340]];
    art = (
      <svg width={VW} height={VH}>
        {nodes.map((a, i) => nodes.slice(i + 1).map((b, j) => <line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={theme.grid} strokeWidth={2} />))}
        {nodes.map(([x, y], i) => { const lit = spread > i / nodes.length; return <g key={i}><circle cx={x} cy={y} r={30} fill={lit ? red : "#eef2ee"} stroke={ink} strokeWidth={4} />{lit && <text x={x} y={y - 34} fontSize={30} textAnchor="middle">🔥</text>}<text x={x} y={y + 7} fontSize={18} fontWeight={900} fill={lit ? "#fff" : theme.inkSoft} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">a fire in one currency can spread to all</text>
      </svg>
    );
  } else {
    // big centered doodle(s) — no arrows
    const icons = scene.icons ?? [];
    art = (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 70, height: VH }}>
        {icons.map((n, i) => {
          const s = spring({ frame, fps, delay: 6 + i * 10, config: { damping: 11, mass: 0.7 } });
          return <div key={i} style={{ transform: `scale(${s})` }}><Doodle name={n} size={icons.length > 1 ? 300 : 380} /></div>;
        })}
      </div>
    );
  }

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 10 }}>
      {scene.kicker && <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: theme.inkSoft, letterSpacing: 1 }}>{scene.kicker}</div>}
      <div style={{ width: VW, height: VH, position: "relative" }}>{art}</div>
      {scene.caption && m !== "stamp" && <div style={{ fontFamily: display, fontWeight: 900, fontSize: 60, color: scene.accent ? theme.accent : theme.ink, textAlign: "center", maxWidth: 1500, marginTop: -10 }}>{scene.caption}</div>}
    </AbsoluteFill>
  );
};

export const SceneView: React.FC<{ scene: Scene; sources?: Record<string, SourceEntry> }> = ({ scene, sources }) => {
  const frame = useCurrentFrame();
  // near-hard cut: a 4-frame fade only (Casual Finance hard-cuts between shots)
  const fade = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" });
  let inner: React.ReactNode = null;
  switch (scene.type) {
    case "title": inner = <Title scene={scene} />; break;
    case "character": inner = <Character scene={scene} />; break;
    case "callout": inner = <Callout scene={scene} />; break;
    case "screenshot": inner = <Screenshot scene={scene} sources={sources} />; break;
    case "chart": inner = <SceneChart scene={scene} />; break;
    case "doodle": inner = <DoodleScene_ scene={scene} />; break;
    case "chalkboard": inner = <Chalkboard scene={scene} />; break;
    case "compare": inner = <Compare scene={scene} />; break;
    case "timeline": inner = <Timeline scene={scene} />; break;
    case "image": inner = <ImageScene_ scene={scene} />; break;
    case "gif": inner = <GifScene_ scene={scene} />; break;
    case "diagram": inner = <DiagramScene_ scene={scene} />; break;
    case "stage": inner = <StageScene_ scene={scene} />; break;
  }
  return <AbsoluteFill style={{ backgroundColor: theme.bg, opacity: fade }}>{inner}</AbsoluteFill>;
};
