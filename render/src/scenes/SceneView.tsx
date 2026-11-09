import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
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
  ImageScene, DiagramScene,
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
    case "diagram": inner = <DiagramScene_ scene={scene} />; break;
  }
  return <AbsoluteFill style={{ backgroundColor: theme.bg, opacity: fade }}>{inner}</AbsoluteFill>;
};
