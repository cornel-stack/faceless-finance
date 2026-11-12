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
  // Mascot anchor point that the explanation lines spring out from (near the hands).
  const anchorX = charLeft + mW / 2;
  const anchorY = 560;

  return (
    <AbsoluteFill>
      {/* Animated connector lines drawn FROM the mascot TO each visible prop — the
          "explain" gesture. Each draws on as its prop springs in, so the scene
          reads as the host actively pointing things out, not a static tableau. */}
      {hasProps && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {props.slice(0, slots.length).map((p, i) => {
            if (i >= reveal) return null;
            const slot = slots[i];
            const app = interpolate(frame, [3 + i * 7, 16 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const midX = (anchorX + slot.x) / 2;
            const d = `M ${anchorX} ${anchorY} Q ${midX} ${anchorY - 70} ${slot.x} ${slot.y + slot.s / 2 - 6}`;
            const len = Math.hypot(slot.x - anchorX, slot.y - anchorY) + 120;
            return <path key={i} d={d} fill="none" stroke={theme.accent} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${len}`} strokeDashoffset={len * (1 - app)} opacity={0.55} />;
          })}
        </svg>
      )}
      {/* props: all visible props stay lively — each springs in on a stagger and
          keeps a gentle bob so nothing is ever dead-static. */}
      {hasProps && props.slice(0, slots.length).map((p, i) => {
        if (i >= reveal) return null;
        const slot = slots[i];
        const s = spring({ frame, fps, delay: 3 + i * 7, config: { damping: 11, mass: 0.6 } });
        const bob = Math.sin((frame - i * 11) / 16) * 7;
        const lab = interpolate(frame, [10 + i * 7, 22 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: slot.x - slot.s / 2, top: slot.y - slot.s / 2, width: slot.s, transform: `translateY(${bob}px) scale(${Math.min(1, s)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Doodle name={p.name} size={slot.s} />
            {p.label && <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: theme.ink, textAlign: "center", opacity: lab, transform: `translateY(${(1 - lab) * 10}px)` }}>{p.label}</div>}
          </div>
        );
      })}
      {/* character — a gentle idle sway so the host feels alive, not a cardboard cut-out */}
      <div style={{ position: "absolute", left: charLeft, bottom: 10, width: mW, height: mH, transform: `translateY(${(1 - enter) * 40}px) scale(${0.92 + enter * 0.08}) rotate(${Math.sin(frame / 28) * 0.8}deg)`, transformOrigin: "bottom center" }}>
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
  } else if (m === "lbo") {
    // A PE firm buys a company with a sliver of its own cash + a mountain of debt —
    // and the debt lands on the company, not the buyer.
    const drop = interpolate(frame, [fps * 1.0, fps * 1.8], [-220, 0], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(230 300)">
          <circle cx={0} cy={-70} r={30} fill="#f0cda6" stroke={ink} strokeWidth={4} />
          <path d="M-30 70 Q-30 -36 0 -36 Q30 -36 30 70" fill="#2b2f68" stroke={ink} strokeWidth={4} />
          <text x={0} y={120} fontSize={24} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>PE firm</text>
          <rect x={-40} y={-10} width={80} height={26} rx={4} fill={green} stroke={ink} strokeWidth={3} />
          <text x={0} y={8} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>10% cash</text>
        </g>
        <g transform="translate(720 320)">
          <rect x={-80} y={-60} width={160} height={120} rx={8} fill="#fff" stroke={ink} strokeWidth={5} />
          <path d="M-96 -58 L0 -120 L96 -58 Z" fill={red} stroke={ink} strokeWidth={5} />
          <text x={0} y={10} fontSize={22} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the company</text>
          <g transform={`translate(0 ${drop - 150})`} opacity={interpolate(frame, [fps * 1.0, fps * 1.3], [0, 1], clampBoth)}>
            <rect x={-70} y={-34} width={140} height={60} rx={8} fill="#59707c" stroke={ink} strokeWidth={4} />
            <text x={0} y={6} fontSize={30} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">90% DEBT</text>
          </g>
        </g>
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">bought with debt — dumped on the company</text>
      </svg>
    );
  } else if (m === "loadthedebt") {
    // The company, crushed under a growing pile of debt it now has to carry.
    const load = interpolate(frame, [fps * 0.6, fps * 2.4], [0, 1], clampBoth);
    const squish = 1 - load * 0.3;
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} 360)`}>
          {Array.from({ length: 5 }, (_, i) => load > i / 5 && <g key={i} opacity={interpolate(load, [i / 5, i / 5 + 0.1], [0, 1], clampBoth)}><rect x={-90 + (i % 2) * 14} y={-60 - i * 46} width={180} height={40} rx={6} fill="#59707c" stroke={ink} strokeWidth={4} /><text x={0 + (i % 2) * 14} y={-33 - i * 46} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">DEBT</text></g>)}
          <g transform={`scale(1 ${squish})`}>
            <circle cx={0} cy={-34} r={26} fill="#f0cda6" stroke={ink} strokeWidth={4} />
            <path d="M-40 40 Q-40 -8 0 -8 Q40 -8 40 40" fill={red} stroke={ink} strokeWidth={4} />
          </g>
        </g>
        <text x={VW / 2} y={480} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">the company carries the debt, not the buyer</text>
      </svg>
    );
  } else if (m === "dividendrecap") {
    // Borrow even MORE, and route the cash straight to the PE owner as a dividend.
    const flow = (frame % 70) / 70;
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(240 260)"><rect x={-90} y={-70} width={180} height={140} rx={10} fill="#fff" stroke={ink} strokeWidth={5} /><text x={0} y={-6} fontSize={22} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the company</text><rect x={-70} y={24} width={140} height={28} rx={4} fill="#59707c" stroke={ink} strokeWidth={3} /><text x={0} y={44} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle">+ more debt</text></g>
        <g transform="translate(740 260)"><circle cx={0} cy={0} r={64} fill="#2b2f68" stroke={ink} strokeWidth={5} /><text x={0} y={8} fontSize={24} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>PE firm</text></g>
        {[0, 1, 2].map((i) => { const t = (flow + i / 3) % 1; const x = 330 + 350 * t; return <g key={i}><circle cx={x} cy={230} r={14} fill={gold} stroke={ink} strokeWidth={2} /><text x={x} y={235} fontSize={13} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
        <text x={505} y={200} fontSize={22} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>dividend →</text>
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">borrow more → pay yourself a dividend</text>
      </svg>
    );
  } else if (m === "saleleaseback") {
    // Sell the company's building, pocket the cash, then rent it back forever.
    const sold = interpolate(frame, [fps * 0.8, fps * 1.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${300 + sold * 20} 260)`} opacity={1}>
          <rect x={-90} y={-40} width={180} height={120} fill="#fff" stroke={ink} strokeWidth={5} />
          <path d="M-106 -40 L0 -120 L106 -40 Z" fill={red} stroke={ink} strokeWidth={5} />
          <text x={0} y={30} fontSize={22} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>its building</text>
        </g>
        {sold > 0.3 && <g opacity={sold}><rect x={620} y={300} width={120} height={46} rx={6} fill={gold} stroke={ink} strokeWidth={4} /><text x={680} y={330} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$ cash</text><text x={680} y={290} fontSize={20} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>sold for cash</text></g>}
        {sold > 0.6 && <g opacity={interpolate(sold, [0.6, 1], [0, 1])}><text x={300} y={200} fontSize={24} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">now pays RENT ↩</text></g>}
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">sell what it owns — then rent it back forever</text>
      </svg>
    );
  } else if (m === "stripmine") {
    // Everything of value is carried off; a husk of the company is left behind.
    const strip = interpolate(frame, [fps * 0.6, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} 260)`}>
          <rect x={-120} y={-80} width={240} height={180} rx={10} fill="none" stroke={ink} strokeWidth={5} strokeDasharray="8 8" />
          <rect x={-120} y={-80} width={240} height={180} rx={10} fill="#eef2ee" opacity={1 - strip} />
          <text x={0} y={10} fontSize={26} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans} opacity={1 - strip}>the company</text>
          {strip > 0.9 && <text x={0} y={10} fontSize={26} fontWeight={800} fill={red} textAnchor="middle" fontFamily="Georgia, serif">a husk</text>}
        </g>
        {Array.from({ length: 6 }, (_, i) => { const p = Math.max(0, strip - i * 0.12); const x = VW / 2 + p * (260 + i * 30) * (i % 2 ? 1 : -1); return <g key={i} opacity={p > 0 ? 1 : 0}><circle cx={x} cy={200 + (i % 3) * 30} r={16} fill={gold} stroke={ink} strokeWidth={2.5} /><text x={x} y={206 + (i % 3) * 30} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
        <text x={VW / 2} y={480} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">strip the value, leave the husk</text>
      </svg>
    );
  } else if (m === "passthrough") {
    // A tariff slapped on at the border; the cost passes down to the shopper.
    const step = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 3], clampBoth);
    const stops = [["foreign factory", 170, "factory"], ["the border +tax", 490, "barrier"], ["you, the shopper", 810, "crowd"]];
    art = (
      <svg width={VW} height={VH}>
        <line x1={120} y1={250} x2={860} y2={250} stroke={theme.grid} strokeWidth={4} />
        {stops.map(([lbl, x], i) => <g key={i}><circle cx={x} cy={250} r={54} fill={i === 2 ? "#fde8e4" : "#fff"} stroke={ink} strokeWidth={5} /><text x={x} y={330} fontSize={22} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lbl}</text></g>)}
        <g transform={`translate(${170 + Math.min(step, 2) / 2 * 640} ${180})`}>
          <rect x={-46} y={-30} width={92} height={56} rx={8} fill={red} stroke={ink} strokeWidth={4} />
          <text x={0} y={8} fontSize={30} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">TAX</text>
        </g>
        {step > 2 && <text x={810} y={250} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" dy={8} opacity={interpolate(frame, [fps * 2.2, fps * 2.6], [0, 1], clampBoth)}>pays it</text>}
        <text x={VW / 2} y={470} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">the tariff rolls downhill to you</text>
      </svg>
    );
  } else if (m === "tradewar") {
    // Two countries lob tariffs at each other — both take hits.
    const t = (frame % 60) / 60;
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(220 260)"><rect x={-70} y={-70} width={140} height={140} rx={12} fill="#eef2ee" stroke={ink} strokeWidth={5} /><text x={0} y={10} fontSize={40} textAnchor="middle">🇺🇸</text><text x={0} y={100} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>country A</text></g>
        <g transform="translate(760 260)"><rect x={-70} y={-70} width={140} height={140} rx={12} fill="#eef2ee" stroke={ink} strokeWidth={5} /><text x={0} y={10} fontSize={40} textAnchor="middle">🌏</text><text x={0} y={100} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>country B</text></g>
        <g transform={`translate(${290 + t * 400} ${200 - Math.sin(t * Math.PI) * 60})`}><rect x={-30} y={-18} width={60} height={36} rx={6} fill={red} stroke={ink} strokeWidth={3} /><text x={0} y={7} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle">TAX</text></g>
        <g transform={`translate(${690 - t * 400} ${320 + Math.sin(t * Math.PI) * 60})`}><rect x={-30} y={-18} width={60} height={36} rx={6} fill={red} stroke={ink} strokeWidth={3} /><text x={0} y={7} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle">TAX</text></g>
        <text x={VW / 2} y={470} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">tit-for-tat — everyone loses</text>
      </svg>
    );
  } else if (m === "customsgate") {
    // Goods crossing a border get a tax stamped on; a cut goes to the government.
    const x = interpolate(frame, [6, fps * 1.6], [-120, 760], clampBoth);
    const stamped = x > 420;
    art = (
      <svg width={VW} height={VH}>
        <rect x={430} y={120} width={30} height={300} fill="#8a929a" stroke={ink} strokeWidth={4} />
        <rect x={430} y={150} width={180} height={28} rx={6} fill={red} stroke={ink} strokeWidth={3} transform="rotate(-8 430 164)" />
        <text x={520} y={130} fontSize={24} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>customs</text>
        <g transform={`translate(${x} 300)`}>
          <rect x={-50} y={-40} width={100} height={80} rx={8} fill={gold} stroke={ink} strokeWidth={5} />
          <text x={0} y={8} fontSize={30} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">📦</text>
          {stamped && <g transform="rotate(-12)"><rect x={-40} y={-56} width={80} height={26} rx={4} fill="none" stroke={red} strokeWidth={4} /><text x={0} y={-37} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">+TAX</text></g>}
        </g>
        <text x={VW / 2} y={470} fontSize={28} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a tax, stamped on at the border</text>
      </svg>
    );
  } else if (m === "deadweight") {
    // Supply/demand with a tariff wedge — a triangle of value simply destroyed.
    const rev = interpolate(frame, [6, fps * 1.4], [0, 1], clampBoth);
    const wedge = interpolate(frame, [fps * 1.4, fps * 2.4], [0, 1], clampBoth);
    const ox = 260, oy = 420, w = 500, h = 320;
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={ox - 20} y1={oy} x2={ox + w + 60} y2={oy} stroke={ink} strokeWidth={4} />
        <RLine x1={ox - 20} y1={oy} x2={ox - 20} y2={oy - h - 30} stroke={ink} strokeWidth={4} />
        <g opacity={rev}>
          <RPath d={`M ${ox} ${oy} L ${ox + w} ${oy - h}`} stroke={blue} strokeWidth={6} seed={4} />
          <RPath d={`M ${ox} ${oy - h} L ${ox + w} ${oy}`} stroke={red} strokeWidth={6} seed={6} />
        </g>
        {wedge > 0 && <polygon points={`${ox + w * 0.5},${oy - h * 0.5} ${ox + w * 0.66},${oy - h * 0.34} ${ox + w * 0.66},${oy - h * 0.66}`} fill={red} opacity={wedge * 0.8} />}
        {wedge > 0.6 && <text x={ox + w * 0.72} y={oy - h * 0.5} fontSize={24} fontWeight={900} fill={red} fontFamily={sans} opacity={wedge}>value lost</text>}
        <text x={VW / 2} y={480} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">the tariff just destroys this value</text>
      </svg>
    );
  } else if (m === "pricespiral") {
    const pts: string[] = [];
    for (let i = 0; i < 44; i++) { const a = i * 0.45, r = 230 - i * 4.6; pts.push(`${490 + r * Math.cos(a)},${210 + r * Math.sin(a)}`); }
    const head = Math.min(43, Math.floor(interpolate(frame, [6, fps * 2.6], [0, 44], clampBoth)));
    const labels: [string, number, number][] = [["prices fall", 490, 10], ["buyers wait", 800, 210], ["demand drops", 490, 420], ["prices fall more", 190, 210]];
    art = (
      <svg width={VW} height={VH}>
        {labels.map(([t, x, y], i) => <text key={i} x={x} y={y} fontSize={22} fontWeight={800} fill={i % 2 ? red : theme.inkSoft} textAnchor="middle" fontFamily={sans}>{t}</text>)}
        <polyline points={pts.slice(0, head + 1).join(" ")} fill="none" stroke={red} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={parseFloat(pts[head].split(",")[0])} cy={parseFloat(pts[head].split(",")[1])} r={12} fill={red} />
        <text x={490} y={222} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">↓</text>
        <text x={VW / 2} y={490} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">the deflationary spiral</text>
      </svg>
    );
  } else if (m === "waittobuy") {
    const price = Math.round(interpolate(frame, [fps * 0.4, fps * 2.6], [100, 60], clampBoth));
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 290)">
          <circle cx={0} cy={-80} r={34} fill="#f0cda6" stroke={ink} strokeWidth={4} />
          <path d="M-18 -74 Q0 -62 18 -74" fill="none" stroke={ink} strokeWidth={3} />
          <path d="M-34 110 Q-34 -40 0 -40 Q34 -40 34 110" fill={blue} stroke={ink} strokeWidth={4} />
        </g>
        <g transform="translate(680 240)">
          <rect x={-90} y={-60} width={180} height={120} rx={12} fill="#fff" stroke={ink} strokeWidth={5} />
          <text x={0} y={2} fontSize={56} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">${price}</text>
          <text x={0} y={42} fontSize={22} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>↓ falling</text>
        </g>
        <text x={420} y={170} fontSize={24} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>"I'll just wait…"</text>
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">why buy today if it's cheaper tomorrow?</text>
      </svg>
    );
  } else if (m === "debtheavier") {
    const grow = interpolate(frame, [fps * 0.6, fps * 2.4], [1, 1.7], clampBoth);
    const squish = interpolate(frame, [fps * 0.6, fps * 2.4], [1, 0.72], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} 280)`}>
          <g transform={`translate(0 ${-50 * grow}) scale(${grow})`}>
            <circle cx={0} cy={0} r={64} fill="#59707c" stroke={ink} strokeWidth={5} />
            <text x={0} y={12} fontSize={30} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">DEBT</text>
          </g>
          <g transform={`translate(0 110) scale(1 ${squish})`}>
            <circle cx={0} cy={-26} r={22} fill="#f0cda6" stroke={ink} strokeWidth={4} />
            <path d="M-34 70 Q-34 -6 0 -6 Q34 -6 34 70" fill={red} stroke={ink} strokeWidth={4} />
          </g>
        </g>
        <text x={VW / 2} y={490} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">deflation makes fixed debt heavier</text>
      </svg>
    );
  } else if (m === "japanflat") {
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.2], [0, 1], clampBoth);
    const path = "M 90 180 L 260 160 L 300 250 L 460 255 L 620 248 L 780 258 L 900 252";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        <text x={190} y={150} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>bubble</text>
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={blue} strokeWidth={6} seed={5} /></g>
        {rev > 0.5 && <text x={640} y={300} fontSize={24} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>…decades of flat</text>}
        <text x={VW / 2} y={490} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">Japan's lost decades</text>
      </svg>
    );
  } else if (m === "basketprice") {
    // The CPI basket: the same groceries, total ticking up over time.
    const total = Math.round(interpolate(frame, [fps * 0.4, fps * 2.6], [100, 148], clampBoth));
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} 230)`}>
          <path d="M-150 -40 L150 -40 L110 150 L-110 150 Z" fill={gold} stroke={ink} strokeWidth={7} strokeLinejoin="round" />
          <path d="M-96 -40 Q-60 -130 0 -130 Q60 -130 96 -40" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
          {[-60, 0, 60].map((x, i) => <line key={i} x1={x} y1={-20} x2={x + (i - 1) * 14} y2={140} stroke={ink} strokeWidth={3} />)}
          <line x1={-130} y1={40} x2={130} y2={40} stroke={ink} strokeWidth={3} />
        </g>
        <g transform="translate(680 220)">
          <rect x={-90} y={-54} width={180} height={108} rx={12} fill="#fff" stroke={red} strokeWidth={5} />
          <text x={0} y={16} fontSize={56} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">${total}</text>
          <text x={0} y={-72} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>same basket</text>
        </g>
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the same cart, quietly ticking up</text>
      </svg>
    );
  } else if (m === "demandpull") {
    // Too much money chasing too few goods.
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={90} fontSize={26} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>too much money, too few goods</text>
        {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * 6.28; const r = 150 + Math.sin(frame * 0.1 + i) * 20; const x = VW / 2 + Math.cos(a) * r * 1.5, y = 250 + Math.sin(a) * r * 0.7; return <g key={i}><circle cx={x} cy={y} r={18} fill={green} stroke={ink} strokeWidth={2.5} /><text x={x} y={y + 6} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
        <g transform={`translate(${VW / 2} 250)`}>
          <path d="M-70 -20 L70 -20 L54 90 L-54 90 Z" fill={gold} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
          <text x={0} y={120} fontSize={22} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>one cart</text>
        </g>
        <text x={VW / 2} y={480} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">prices get bid up</text>
      </svg>
    );
  } else if (m === "costpush") {
    // Rising input costs shove the price up from below.
    const push = interpolate(frame, [fps * 0.6, fps * 2.4], [0, -120], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} ${250 + push})`}>
          <rect x={-120} y={-40} width={240} height={80} rx={10} fill="#fff" stroke={ink} strokeWidth={5} />
          <text x={0} y={10} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">PRICE ↑</text>
        </g>
        {[["oil", 360], ["wages", 490], ["shipping", 620]].map(([t, x], i) => <g key={i} transform={`translate(${x} 400)`}><path d={`M0 -40 l-16 24 l10 0 l0 ${40 + 0} l12 0 l0 -40 l10 0 Z`} fill={red} stroke={ink} strokeWidth={2} transform="scale(1.2)" /><text x={0} y={70} fontSize={20} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>{t}</text></g>)}
        <text x={VW / 2} y={120} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">costs push prices up from below</text>
      </svg>
    );
  } else if (m === "erode") {
    // The real value of cash melting away year by year.
    const bars = [100, 84, 70, 59, 49, 41];
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={90} y1={430} x2={VW - 60} y2={430} stroke={ink} strokeWidth={4} />
        {bars.map((v, i) => {
          const on = interpolate(frame, [fps * (0.3 + i * 0.3), fps * (0.6 + i * 0.3)], [0, 1], clampBoth);
          const h = v * 3.4 * on;
          const x = 150 + i * 130;
          return <g key={i}><rect x={x - 45} y={430 - h} width={90} height={h} rx={5} fill={i === 0 ? green : "#c9a24a"} stroke={ink} strokeWidth={3} /><text x={x} y={460} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>Yr {i * 5}</text></g>;
        })}
        <text x={VW / 2} y={120} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">what $100 in cash is really worth</text>
      </svg>
    );
  } else if (m === "shrinkflation") {
    // Same price, shrinking product.
    const shrink = interpolate(frame, [fps * 0.6, fps * 2.4], [1, 0.58], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(360 260) scale(${shrink})`}>
          <path d="M-60 -120 L60 -120 L48 120 L-48 120 Z" fill="#c23b3b" stroke={ink} strokeWidth={5} />
          <rect x={-50} y={-30} width={100} height={60} rx={6} fill="#fff" stroke={ink} strokeWidth={3} />
          <text x={0} y={10} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>CHIPS</text>
        </g>
        <g transform="translate(680 240)">
          <rect x={-70} y={-50} width={140} height={100} rx={12} fill="#fff" stroke={ink} strokeWidth={5} />
          <text x={0} y={12} fontSize={44} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$4</text>
          <text x={0} y={-66} fontSize={22} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>same price</text>
        </g>
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">shrinkflation: same price, less product</text>
      </svg>
    );
  } else if (m === "exportboost") {
    // A weak currency makes exports cheap — goods fly out to the world.
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(200 280)">
          <rect x={-90} y={-70} width={180} height={140} rx={10} fill="#eef2ee" stroke={ink} strokeWidth={5} />
          <text x={0} y={-6} fontSize={22} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>weak-$ country</text>
          <text x={0} y={40} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">cheap!</text>
        </g>
        {Array.from({ length: 6 }, (_, i) => { const p = ((frame * 6 + i * 40) % 240) / 240; const x = 300 + p * 560, y = 200 + (i % 3) * 70 - p * 40; const op = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]); return <g key={i} opacity={op}><rect x={x} y={y} width={46} height={32} rx={4} fill={gold} stroke={ink} strokeWidth={2.5} /><text x={x + 23} y={y + 22} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle">📦</text></g>; })}
        <text x={620} y={150} fontSize={24} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>exports surge →</text>
        <text x={VW / 2} y={480} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a weak currency makes your exports cheap</text>
      </svg>
    );
  } else if (m === "devalue") {
    // The central bank deliberately presses its own currency value DOWN.
    const push = interpolate(frame, [fps * 0.6, fps * 2.4], [0, 150], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <path d="M300 120 q40 -30 80 0" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
        <path d={`M340 120 l0 ${40 + push * 0.3}`} fill="none" stroke={ink} strokeWidth={8} strokeLinecap="round" />
        <g transform={`translate(${VW / 2} ${220 + push})`}>
          <circle cx={0} cy={0} r={80} fill={gold} stroke={ink} strokeWidth={6} />
          <text x={0} y={22} fontSize={70} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </g>
        <path d={`M${VW / 2 - 40} ${150} l0 ${90 + push} m0 0 l-14 -18 m14 18 l14 -18`} fill="none" stroke={red} strokeWidth={5} strokeLinecap="round" />
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">pushing its own value down, on purpose</text>
      </svg>
    );
  } else if (m === "currencywar") {
    // A race to the bottom: several currencies competitively pushed downward.
    const p = interpolate(frame, [fps * 0.5, fps * 2.6], [0, 1], clampBoth);
    const syms = ["$", "¥", "€", "£"];
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={70} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        <text x={VW / 2} y={90} fontSize={26} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>everyone racing their currency down</text>
        {syms.map((s, i) => { const x = 250 + i * 160; const y = 160 + p * (260 - i * 20); return <g key={i} transform={`translate(${x} ${y})`}><circle cx={0} cy={0} r={44} fill={["#2f6b46", red, "#3a6ea5", gold][i]} stroke={ink} strokeWidth={4} /><text x={0} y={14} fontSize={38} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{s}</text></g>; })}
        <text x={VW / 2} y={490} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">the race to the bottom</text>
      </svg>
    );
  } else if (m === "tourismboost") {
    // Cheap currency → tourists pour in with suitcases of foreign cash.
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(760 280)">
          <rect x={-90} y={-80} width={180} height={160} fill="#fff" stroke={ink} strokeWidth={5} />
          <path d="M-106 -78 L0 -150 L106 -78 Z" fill={red} stroke={ink} strokeWidth={5} />
          <text x={0} y={120} fontSize={22} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>cheap country</text>
        </g>
        {Array.from({ length: 5 }, (_, i) => { const p = ((frame * 5 + i * 46) % 230) / 230; const x = 80 + p * 520, y = 300 + (i % 2) * 40; const op = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]); return <g key={i} opacity={op} transform={`translate(${x} ${y})`}><circle cx={0} cy={-34} r={16} fill="#f0cda6" stroke={ink} strokeWidth={3} /><path d="M-14 50 Q-14 -6 0 -6 Q14 -6 14 50" fill={["#3a6ea5", green, gold][i % 3]} stroke={ink} strokeWidth={3} /><rect x={14} y={6} width={16} height={14} fill={gold} stroke={ink} strokeWidth={1.6} /></g>; })}
        <text x={320} y={200} fontSize={24} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>tourists pour in →</text>
        <text x={VW / 2} y={480} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a cheap currency fills the country with visitors</text>
      </svg>
    );
  } else if (m === "zerosum") {
    // Two players: one wins, one loses — and the house rakes a cut off the top.
    const tilt = interpolate(frame, [fps * 0.6, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(260 300)">
          <circle cx={0} cy={-30 - tilt * 60} r={56} fill={green} stroke={ink} strokeWidth={5} />
          <text x={0} y={-22 - tilt * 60} fontSize={30} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">win</text>
          <text x={0} y={70} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>one buyer</text>
        </g>
        <g transform="translate(720 300)">
          <circle cx={0} cy={-30 + tilt * 60} r={56} fill={red} stroke={ink} strokeWidth={5} />
          <text x={0} y={-22 + tilt * 60} fontSize={30} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">lose</text>
          <text x={0} y={70} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>one seller</text>
        </g>
        <g transform="translate(490 150)" opacity={tilt}>
          <rect x={-70} y={-34} width={140} height={60} rx={8} fill={ink} />
          <text x={0} y={6} fontSize={24} fontWeight={900} fill={gold} textAnchor="middle" fontFamily="Georgia, serif">the rake</text>
        </g>
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your gain is someone's loss — minus the rake</text>
      </svg>
    );
  } else if (m === "numbergoup") {
    // A coin chart rocketing up on pure belief… then snapping down.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.6], [0, 1], clampBoth);
    const path = "M 90 400 L 220 360 L 340 300 L 440 160 L 520 70 L 600 260 L 740 400 L 880 440";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={gold} strokeWidth={7} seed={5} /></g>
        {rev > 0.45 && rev < 0.75 && <text x={520} y={50} fontSize={30} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">↑ to the moon</text>}
        {rev > 0.85 && <text x={790} y={420} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">…and back</text>}
        <text x={VW / 2} y={490} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">"number go up" — on belief alone</text>
      </svg>
    );
  } else if (m === "rugpull") {
    // The rug is yanked out and the holders fall.
    const pull = interpolate(frame, [fps * 1.0, fps * 1.5], [0, 1], clampBoth);
    const fall = interpolate(frame, [fps * 1.4, fps * 2.3], [0, 230], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} ${230 + fall}) rotate(${fall * 0.1})`} opacity={1 - pull * 0.1}>
          <circle cx={0} cy={0} r={60} fill={gold} stroke={ink} strokeWidth={5} />
          <text x={0} y={18} fontSize={50} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">₿</text>
        </g>
        <g transform={`translate(${VW / 2 + 260 * pull} 360)`} opacity={pull}>
          <rect x={-80} y={-10} width={160} height={22} rx={6} fill={red} stroke={ink} strokeWidth={3} transform={`skewX(-20)`} />
          <text x={0} y={46} fontSize={20} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>the rug</text>
        </g>
        {fall > 150 && <text x={VW / 2} y={200} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">rug pull</text>}
        <text x={VW / 2} y={490} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">founders vanish, holders crash</text>
      </svg>
    );
  } else if (m === "miningburn") {
    // Mountains of electricity burned to mint a coin.
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 300)">
          {[0, 1, 2].map((i) => <g key={i}><rect x={-80 + i * 60} y={-40} width={44} height={110} rx={4} fill="#2b2f33" stroke={ink} strokeWidth={3} />{[0, 1, 2].map((r) => <rect key={r} x={-74 + i * 60} y={-30 + r * 32} width={32} height={10} fill="#454b50" />)}</g>)}
          {Array.from({ length: 5 }, (_, i) => { const p = ((frame * 6 + i * 36) % 180) / 180; const y = -40 - p * 110; const op = interpolate(p, [0, 0.2, 1], [0.9, 0.6, 0]); return <path key={i} d={`M${-70 + i * 32} ${y} q10 -14 0 -26`} fill="none" stroke="#c7c2b6" strokeWidth={6} opacity={op} strokeLinecap="round" />; })}
        </g>
        <path d="M520 300 l60 0 m0 0 l-16 -12 m16 12 l-16 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(720 300)"><circle cx={0} cy={0} r={56} fill={gold} stroke={ink} strokeWidth={5} /><text x={0} y={18} fontSize={46} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">₿</text></g>
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">a country's worth of power, for one coin</text>
      </svg>
    );
  } else if (m === "onedrop") {
    // One tiny drop of blood promised to run hundreds of tests.
    const fan = interpolate(frame, [fps * 0.5, fps * 2.1], [0, 1], clampBoth);
    const tests = ["cholesterol", "glucose", "cancer markers", "vitamin D", "…240 more"];
    const srcX = 250, srcY = 250;
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${srcX} ${srcY})`}>
          <path d="M -72 36 q 72 -118 144 0 q -32 62 -72 62 q -40 0 -72 -62 z" fill={parch} stroke={ink} strokeWidth={5} />
          <path d="M 0 -4 q -20 -26 0 -44 q 20 18 0 44 z" fill={red} stroke={ink} strokeWidth={4} transform={`translate(0 ${56 + Math.sin(frame / 7) * 3})`} />
        </g>
        <text x={srcX} y={370} fontSize={27} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">one drop</text>
        {tests.map((t, i) => {
          const ty = 86 + i * 72;
          const op = interpolate(fan, [i * 0.16, i * 0.16 + 0.25], [0, 1], clampBoth);
          return (
            <g key={i} opacity={op}>
              <RLine x1={srcX + 70} y1={srcY} x2={688} y2={ty + 22} stroke={tan} strokeWidth={3} seed={i + 2} />
              <rect x={688} y={ty} width={250} height={44} rx={8} fill={parch} stroke={ink} strokeWidth={3} />
              <text x={813} y={ty + 29} fontSize={21} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{t}</text>
            </g>
          );
        })}
        <text x={VW / 2} y={502} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one drop → hundreds of tests — the promise</text>
      </svg>
    );
  } else if (m === "blackbox") {
    // The sleek "Edison" device — its lid lifts to reveal nothing works inside.
    const open = interpolate(frame, [fps * 0.9, fps * 1.9], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 300)">
          <rect x={-140} y={-120} width={280} height={240} rx={14} fill="#2b2f33" stroke={ink} strokeWidth={6} />
          <rect x={-102} y={-92} width={204} height={70} rx={8} fill={blue} opacity={0.85} />
          <text x={0} y={104} fontSize={22} fontWeight={800} fill="#c7c2b6" textAnchor="middle" fontFamily={sans}>"Edison"</text>
          <g transform={`translate(0 ${-120 - open * 78}) rotate(${-open * 7})`}>
            <rect x={-140} y={-24} width={280} height={26} rx={8} fill="#454b50" stroke={ink} strokeWidth={5} />
          </g>
          <g opacity={open}>
            <text x={0} y={16} fontSize={64} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">?</text>
            <text x={0} y={58} fontSize={20} fontWeight={800} fill="#c7c2b6" textAnchor="middle" fontFamily={sans}>it didn't work</text>
          </g>
        </g>
        <text x={VW / 2} y={492} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a sleek black box — empty inside</text>
      </svg>
    );
  } else if (m === "fakedemo") {
    // A device screen flips between the staged "all normal" and the real error.
    const flip = Math.floor((frame / (fps * 0.8)) % 2);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 240)">
          <rect x={-200} y={-120} width={400} height={250} rx={16} fill="#2b2f33" stroke={ink} strokeWidth={6} />
          <rect x={-170} y={-96} width={340} height={158} rx={8} fill={flip ? "#3a1416" : "#13331c"} stroke={ink} strokeWidth={3} />
          {flip === 0 ? (
            <text x={0} y={-8} fontSize={44} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">✓ all normal</text>
          ) : (
            <text x={0} y={-8} fontSize={44} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">ERROR</text>
          )}
          <text x={0} y={40} fontSize={19} fontWeight={700} fill="#c7c2b6" textAnchor="middle" fontFamily={sans}>{flip === 0 ? "what investors saw" : "what the machine really did"}</text>
        </g>
        <text x={VW / 2} y={470} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the demo was staged</text>
      </svg>
    );
  } else if (m === "ninebillionzero") {
    // A $9B valuation falls off the screen and lands on zero.
    const fall = interpolate(frame, [fps * 0.9, fps * 2.1], [0, 320], clampBoth);
    const fade = interpolate(frame, [fps * 1.7, fps * 2.3], [1, 0], clampBoth);
    const zero = interpolate(frame, [fps * 2.1, fps * 2.7], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(${VW / 2} ${180 + fall}) rotate(${fall * 0.12})`} opacity={fade}>
          <text x={0} y={0} fontSize={120} fontWeight={900} fill={gold} textAnchor="middle" fontFamily="Georgia, serif">$9B</text>
        </g>
        <g opacity={zero} transform={`translate(${VW / 2} 300) scale(${0.6 + zero * 0.4})`}>
          <text x={0} y={34} fontSize={150} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">$0</text>
        </g>
        <text x={VW / 2} y={492} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$9 billion → zero</text>
      </svg>
    );
  } else if (m === "whistleblow") {
    // A whistle blasts; a leaked exposé rises into view.
    const blast = interpolate(frame, [fps * 0.7, fps * 1.4], [0, 1], clampBoth);
    const rise = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 270)">
          <circle cx={0} cy={0} r={46} fill={gold} stroke={ink} strokeWidth={5} />
          <rect x={30} y={-18} width={72} height={36} rx={10} fill={gold} stroke={ink} strokeWidth={5} />
          {[0, 1, 2].map((i) => <path key={i} d={`M ${122 + i * 24} ${-28 - i * 8} q 20 ${28 + i * 8} 0 ${56 + i * 16}`} fill="none" stroke={red} strokeWidth={5} opacity={interpolate(blast, [i * 0.25, i * 0.25 + 0.3], [0, 1], clampBoth)} strokeLinecap="round" />)}
        </g>
        <g transform={`translate(650 ${370 - rise * 120})`} opacity={rise}>
          <rect x={-92} y={-112} width={184} height={224} rx={8} fill={parch} stroke={ink} strokeWidth={5} />
          <text x={0} y={-72} fontSize={23} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">EXPOSÉ</text>
          {[0, 1, 2, 3].map((i) => <RLine key={i} x1={-66} y1={-42 + i * 36} x2={66} y2={-42 + i * 36} stroke={theme.inkSoft} strokeWidth={4} seed={i} />)}
        </g>
        <text x={VW / 2} y={502} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one reporter, a few whistleblowers</text>
      </svg>
    );
  } else if (m === "ponziflow") {
    // New investors' money is routed straight to old investors — nothing invested.
    const t = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(150 250)"><circle r={54} fill={green} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={17} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>NEW</text><text y={18} fontSize={17} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>money</text></g>
        <g transform="translate(490 250)"><rect x={-72} y={-62} width={144} height={124} rx={10} fill={ink} /><text y={-6} fontSize={22} fontWeight={900} fill={gold} textAnchor="middle" fontFamily="Georgia, serif">the</text><text y={22} fontSize={22} fontWeight={900} fill={gold} textAnchor="middle" fontFamily="Georgia, serif">"fund"</text></g>
        <g transform="translate(830 250)"><circle r={54} fill={blue} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={17} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>OLD</text><text y={20} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>payouts</text></g>
        <path d={`M 208 250 L ${208 + 202 * Math.min(1, t * 2)} 250`} stroke={green} strokeWidth={6} fill="none" strokeLinecap="round" />
        {t > 0.5 && <path d={`M 566 250 L ${566 + 206 * Math.min(1, (t - 0.5) * 2)} 250`} stroke={blue} strokeWidth={6} fill="none" strokeLinecap="round" />}
        {t > 0.3 && <g opacity={interpolate(t, [0.3, 0.6], [0, 1], clampBoth)}><path d="M490 186 L490 118" stroke={red} strokeWidth={6} fill="none" strokeLinecap="round" /><text x={490} y={104} fontSize={20} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">a skim</text></g>}
        <text x={VW / 2} y={408} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">nothing is invested — new money pays old</text>
        <text x={VW / 2} y={444} fontSize={20} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>…until the new money stops</text>
      </svg>
    );
  } else if (m === "impossiblereturns") {
    // A suspiciously smooth straight-up line vs the jagged real market.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const real = "M 90 420 L 180 356 L 260 404 L 340 300 L 430 352 L 520 250 L 620 322 L 720 208 L 880 262";
    const fake = "M 90 432 L 880 150";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={452} x2={VW - 40} y2={452} stroke={ink} strokeWidth={4} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <RPath d={real} stroke={theme.inkSoft} strokeWidth={5} seed={9} />
          <RPath d={fake} stroke={red} strokeWidth={7} seed={3} />
        </g>
        {rev > 0.6 && <text x={700} y={150} fontSize={22} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">Madoff: always up</text>}
        {rev > 0.4 && <text x={300} y={262} fontSize={20} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>real markets</text>}
        <text x={VW / 2} y={498} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">too smooth to be real</text>
      </svg>
    );
  } else if (m === "fakestatement") {
    // A monthly statement of steady gains — stamped FICTION.
    const stamp = spring({ frame, fps, delay: fps * 1.3, config: { damping: 9, mass: 0.6 } });
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 262)">
          <rect x={-150} y={-180} width={300} height={360} rx={8} fill={parch} stroke={ink} strokeWidth={5} />
          <text x={0} y={-142} fontSize={21} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">YOUR STATEMENT</text>
          {[0, 1, 2, 3, 4].map((i) => <g key={i}><RLine x1={-120} y1={-104 + i * 28} x2={30} y2={-104 + i * 28} stroke={theme.inkSoft} strokeWidth={4} seed={i} /><text x={120} y={-98 + i * 28} fontSize={18} fontWeight={900} fill={green} textAnchor="end" fontFamily={sans}>+{i + 1}.{i * 2}%</text></g>)}
          <RPath d="M-120 64 L-60 50 L0 32 L60 18 L120 -4" stroke={green} strokeWidth={5} seed={2} />
          <text x={0} y={128} fontSize={30} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$1,000,000</text>
        </g>
        <g transform={`translate(490 262) rotate(-14) scale(${Math.min(1, stamp)})`} opacity={Math.min(1, stamp)}>
          <rect x={-142} y={-36} width={284} height={72} rx={8} fill="none" stroke={red} strokeWidth={6} />
          <text x={0} y={18} fontSize={44} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">FICTION</text>
        </g>
        <text x={VW / 2} y={500} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the statements were printed fairy tales</text>
      </svg>
    );
  } else if (m === "redemptionrun") {
    // 2008: everyone demands their money back at once; the vault is empty.
    const rush = interpolate(frame, [fps * 0.5, fps * 1.8], [0, 1], clampBoth);
    const empty = interpolate(frame, [fps * 1.6, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 250)">
          <rect x={-92} y={-92} width={184} height={184} rx={12} fill={tan} stroke={ink} strokeWidth={6} />
          <circle cx={0} cy={0} r={42} fill="none" stroke={ink} strokeWidth={6} />
          <text x={0} y={12} fontSize={40} fontWeight={900} fill={empty > 0.5 ? red : ink} textAnchor="middle" fontFamily="Georgia, serif">{empty > 0.5 ? "$0" : "$"}</text>
        </g>
        {Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * 6.283; const d = 270 - rush * 130; return <g key={i} transform={`translate(${490 + d * Math.cos(a)} ${250 + d * Math.sin(a)})`}><circle r={18} fill={blue} stroke={ink} strokeWidth={3} /><text y={6} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>!</text></g>; })}
        <text x={VW / 2} y={470} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">2008: everyone wants out at once</text>
        <text x={VW / 2} y={505} fontSize={20} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the money was never there</text>
      </svg>
    );
  } else if (m === "clawback") {
    // The trustee drags money back from early winners to repay the losers.
    const pull = interpolate(frame, [fps * 0.6, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(828 250)"><circle r={50} fill={green} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={15} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>early</text><text y={16} fontSize={15} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>winners</text></g>
        <g transform="translate(150 250)"><rect x={-62} y={-56} width={124} height={112} rx={10} fill={ink} /><text y={-2} fontSize={16} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>the</text><text y={22} fontSize={16} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>trustee</text></g>
        {Array.from({ length: 5 }, (_, i) => { const x = 772 - (772 - 224) * interpolate(pull, [i * 0.12, i * 0.12 + 0.5], [0, 1], clampBoth); return <g key={i} transform={`translate(${x} 250)`}><circle r={16} fill={gold} stroke={ink} strokeWidth={3} /><text y={6} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
        <text x={VW / 2} y={452} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">clawed back from winners → repaid to losers</text>
      </svg>
    );
  } else if (m === "buyborrowdie") {
    // The three-step cycle that turns assets into tax-free spending.
    const steps: [string, string, string][] = [["BUY", "assets", green], ["BORROW", "tax-free cash", gold], ["DIE", "heirs reset basis", ink]];
    art = (
      <svg width={VW} height={VH}>
        {steps.map(([t, s, c], i) => { const app = spring({ frame, fps, delay: 8 + i * 14, config: { damping: 12 } }); const x = 200 + i * 290; return (
          <g key={i} transform={`translate(${x} 220) scale(${Math.min(1, app)})`}>
            <rect x={-104} y={-62} width={208} height={124} rx={12} fill={c} stroke={ink} strokeWidth={5} />
            <text y={-8} fontSize={30} fontWeight={900} fill={c === ink ? gold : "#fff"} textAnchor="middle" fontFamily="Georgia, serif">{t}</text>
            <text y={30} fontSize={19} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{s}</text>
          </g>
        ); })}
        {[0, 1].map((i) => { const app = interpolate(frame, [22 + i * 14, 36 + i * 14], [0, 1], clampBoth); return <path key={i} d={`M ${306 + i * 290} 220 L ${384 + i * 290} 220`} stroke={ink} strokeWidth={6} opacity={app} strokeLinecap="round" />; })}
        <text x={VW / 2} y={420} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">buy, borrow, die — and never pay the tax</text>
      </svg>
    );
  } else if (m === "assetvsincome") {
    // A tiny visible salary next to a huge, untaxed mountain of assets.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(250 360)">
          <rect x={-74} y={-42} width={148} height={62} rx={8} fill={green} stroke={ink} strokeWidth={4} />
          <text y={-4} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>"income"</text>
          <text y={56} fontSize={20} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>a $1 salary</text>
        </g>
        <g transform="translate(720 392)">
          <path d={`M -175 0 L 0 ${-300 * grow} L 175 0 Z`} fill={gold} stroke={ink} strokeWidth={5} />
          <text y={-46} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif" opacity={grow}>ASSETS</text>
          <text y={34} fontSize={19} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>$billions, untaxed</text>
        </g>
        <text x={VW / 2} y={470} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">tiny income, a mountain of assets</text>
      </svg>
    );
  } else if (m === "unrealizedgains") {
    // A paper gain balloons; a TAX stamp can't touch it until it's sold.
    const grow = interpolate(frame, [6, fps * 1.8], [0.4, 1.3], clampBoth);
    const bounce = spring({ frame, fps, delay: fps * 1.6, config: { damping: 6, mass: 0.5 } });
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(420 250) scale(${grow})`}>
          <circle r={88} fill={green} stroke={ink} strokeWidth={5} />
          <text y={18} fontSize={60} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </g>
        <text x={420} y={428} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>stock value, on paper</text>
        <g transform={`translate(${760 - 44 * Math.min(1, bounce)} 210) rotate(${-10 + 20 * Math.min(1, bounce)})`} opacity={Math.min(1, bounce)}>
          <rect x={-70} y={-34} width={140} height={64} rx={8} fill="none" stroke={red} strokeWidth={6} />
          <text y={12} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">TAX</text>
          <text y={62} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>can't touch it</text>
        </g>
        <text x={VW / 2} y={494} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">not sold = not taxed</text>
      </svg>
    );
  } else if (m === "frugalflex") {
    // A modest old car in front — a colossal hidden net worth behind.
    const reveal = interpolate(frame, [fps * 1.0, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g opacity={reveal} transform="translate(490 150)">
          <text y={0} fontSize={62} fontWeight={900} fill={gold} textAnchor="middle" fontFamily="Georgia, serif">$100,000,000,000</text>
          <text y={42} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>actual net worth</text>
        </g>
        <g transform="translate(490 360)">
          <path d="M -120 20 L -88 -30 L 70 -30 L 112 20 Z" fill="#6c7a89" stroke={ink} strokeWidth={5} />
          <rect x={-120} y={20} width={232} height={30} rx={8} fill="#6c7a89" stroke={ink} strokeWidth={5} />
          <circle cx={-66} cy={54} r={22} fill={ink} /><circle cx={70} cy={54} r={22} fill={ink} />
          <text y={100} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">…drives a 20-year-old car</text>
        </g>
      </svg>
    );
  } else if (m === "truetaxrate") {
    // Two bars: a worker's rate towering over a billionaire's "true tax rate".
    const g = interpolate(frame, [fps * 0.4, fps * 1.8], [0, 1], clampBoth);
    const bars: [string, string, number, string][] = [["you", "~30%", 0.30, blue], ["a billionaire", "~3%", 0.03, red]];
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={120} y1={430} x2={VW - 120} y2={430} stroke={ink} strokeWidth={4} />
        {bars.map(([lab, val, h, c], i) => { const x = 330 + i * 330; const bh = h * 700 * g; return (
          <g key={i}>
            <rect x={x - 74} y={430 - bh} width={148} height={bh} fill={c} stroke={ink} strokeWidth={4} />
            <text x={x} y={464} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text>
            <text x={x} y={430 - bh - 14} fontSize={26} fontWeight={900} fill={c} textAnchor="middle" fontFamily="Georgia, serif" opacity={g}>{val}</text>
          </g>
        ); })}
        <text x={VW / 2} y={72} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the "true tax rate"</text>
      </svg>
    );
  } else if (m === "leveragewipeout") {
    // A small market dip wipes out a leveraged position entirely.
    const drop = interpolate(frame, [fps * 0.8, fps * 1.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 0)">
          <text x={0} y={130} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>the market</text>
          <rect x={-62} y={160} width={124} height={210} fill={blue} stroke={ink} strokeWidth={4} />
          <rect x={-62} y={160} width={124} height={210 * 0.1 * drop} fill={red} />
          <text x={0} y={400} fontSize={24} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">−10%</text>
        </g>
        <g transform="translate(690 0)">
          <text x={0} y={130} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>you, borrowed 10×</text>
          <rect x={-62} y={370 - 210 * (1 - drop)} width={124} height={210 * (1 - drop)} fill={gold} stroke={ink} strokeWidth={4} />
          <rect x={-62} y={160} width={124} height={210} fill="none" stroke={ink} strokeWidth={2} strokeDasharray="5 5" />
          {drop > 0.9 && <text x={0} y={300} fontSize={28} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">WIPED OUT</text>}
        </g>
        <text x={VW / 2} y={470} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a 10% dip, a 100% loss</text>
      </svg>
    );
  } else if (m === "gamblersruin") {
    // A balance that random-walks relentlessly down to zero.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.6], [0, 1], clampBoth);
    const path = "M 80 240 L 170 200 L 250 260 L 330 210 L 420 290 L 510 250 L 600 330 L 690 300 L 780 400 L 880 442";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={70} y1={442} x2={VW - 40} y2={442} stroke={ink} strokeWidth={4} />
        <text x={92} y={120} fontSize={22} fontWeight={800} fill={theme.inkSoft} fontFamily={sans}>your money</text>
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={6} seed={4} /></g>
        {rev > 0.9 && <text x={835} y={420} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">$0</text>}
        <text x={VW / 2} y={492} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">bad odds + time = ruin, guaranteed</text>
      </svg>
    );
  } else if (m === "aprballoon") {
    // A small loan balloons into a huge debt at a punishing interest rate.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const amt = Math.round(100 * Math.pow(5, grow));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={110} fontSize={24} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>borrow $100 at 400% APR…</text>
        <g transform={`translate(${VW / 2} 300)`}>
          <circle r={58 + 120 * grow} fill={red} stroke={ink} strokeWidth={5} opacity={0.92} />
          <text y={12} fontSize={30 + 18 * grow} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">${amt}</text>
        </g>
        <text x={VW / 2} y={494} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">high-interest debt compounds against you</text>
      </svg>
    );
  } else if (m === "housewins") {
    // A spinning wheel; every bet, a slice flows to the house.
    const spin = frame * 6;
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(360 270)">
          <circle r={120} fill="none" stroke={ink} strokeWidth={6} />
          <g transform={`rotate(${spin})`}>
            {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={0} x2={120 * Math.cos(i * 0.5236)} y2={120 * Math.sin(i * 0.5236)} stroke={i % 2 ? red : ink} strokeWidth={3} />)}
          </g>
          <circle r={12} fill={gold} stroke={ink} strokeWidth={3} />
        </g>
        <path d="M520 270 l70 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(730 270)"><rect x={-72} y={-50} width={144} height={100} rx={10} fill={ink} /><text y={8} fontSize={24} fontWeight={900} fill={gold} textAnchor="middle" fontFamily="Georgia, serif">the house</text></g>
        <text x={VW / 2} y={470} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">every spin, the house takes a cut</text>
      </svg>
    );
  } else if (m === "slowfastwealth") {
    // Wealth climbs slowly for years, then falls off a cliff in moments.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const path = "M 90 420 L 250 384 L 410 322 L 560 250 L 644 212 L 656 212 L 668 440";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={4} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={gold} strokeWidth={7} seed={3} /></g>
        {rev > 0.45 && rev < 0.82 && <text x={470} y={210} fontSize={20} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>years to build…</text>}
        {rev > 0.9 && <text x={760} y={320} fontSize={24} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">…seconds to lose</text>}
        <text x={VW / 2} y={492} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">slow to build, instant to destroy</text>
      </svg>
    );
  } else if (m === "fedspeak") {
    // One careful word from the podium whips the market around.
    const say = interpolate(frame, [fps * 0.4, fps * 1.0], [0, 1], clampBoth);
    const react = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 1], clampBoth);
    const clipId = React.useId().replace(/:/g, "");
    const path = "M 90 300 L 220 300 L 270 292 L 330 150 L 410 420 L 500 300 L 880 300";
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(220 200)">
          <rect x={-50} y={-30} width={100} height={110} fill={tan} stroke={ink} strokeWidth={5} />
          <circle cx={0} cy={-56} r={26} fill={parch} stroke={ink} strokeWidth={4} />
          <line x1={0} y1={-30} x2={0} y2={-14} stroke={ink} strokeWidth={4} />
        </g>
        <g opacity={say} transform="translate(440 120)">
          <rect x={-112} y={-44} width={224} height={78} rx={14} fill="#fff" stroke={ink} strokeWidth={4} />
          <path d="M-30 32 L-10 60 L10 32 Z" fill="#fff" stroke={ink} strokeWidth={4} />
          <text y={8} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">"patient"</text>
        </g>
        <RLine x1={70} y1={430} x2={VW - 40} y2={430} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * react} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`} transform="translate(0 120)"><RPath d={path} stroke={red} strokeWidth={5} seed={6} /></g>
        <text x={VW / 2} y={492} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one word moves trillions</text>
      </svg>
    );
  } else if (m === "ratelever") {
    // The Fed pulls one lever; borrowing, stocks and savings all swing.
    const pull = interpolate(frame, [fps * 0.6, fps * 1.6], [-28, 28], clampBoth);
    const rows = ["mortgages", "car loans", "stocks", "savings"];
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 300)">
          <rect x={-22} y={0} width={44} height={120} fill={ink} />
          <g transform={`rotate(${pull})`}><rect x={-8} y={-140} width={16} height={150} rx={8} fill={red} stroke={ink} strokeWidth={3} /><circle cx={0} cy={-140} r={22} fill={red} stroke={ink} strokeWidth={4} /></g>
          <text x={0} y={162} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">RATES</text>
        </g>
        {rows.map((t, i) => { const app = interpolate(frame, [fps * 1.0 + i * 6, fps * 1.3 + i * 6], [0, 1], clampBoth); return <g key={i} opacity={app} transform={`translate(630 ${140 + i * 78})`}><rect x={0} y={-26} width={240} height={48} rx={8} fill={parch} stroke={ink} strokeWidth={3} /><text x={120} y={6} fontSize={22} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{t}</text></g>; })}
        <text x={VW / 2} y={494} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one rate moves the whole economy</text>
      </svg>
    );
  } else if (m === "forwardguidance") {
    // Markets rush toward a signposted future before the Fed even acts.
    const move = interpolate(frame, [fps * 0.6, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(770 210)">
          <rect x={-10} y={0} width={20} height={190} fill={tan} stroke={ink} strokeWidth={3} />
          <rect x={-122} y={-54} width={244} height={74} rx={8} fill={gold} stroke={ink} strokeWidth={5} />
          <text y={-10} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">rates up, soon</text>
        </g>
        {Array.from({ length: 4 }, (_, i) => { const x = 170 + 540 * interpolate(move, [i * 0.12, i * 0.12 + 0.5], [0, 1], clampBoth); return <g key={i} transform={`translate(${x} ${300 + i * 2})`}><circle r={20} fill={blue} stroke={ink} strokeWidth={3} /><text y={6} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
        <text x={VW / 2} y={470} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">markets move on the hint, not the act</text>
      </svg>
    );
  } else if (m === "tapertantrum") {
    // Calm bond yields spike the instant the Fed hints at 'tapering'.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.2], [0, 1], clampBoth);
    const path = "M 90 360 L 300 352 L 450 356 L 480 356 L 530 150 L 640 182 L 880 160";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={430} x2={VW - 40} y2={430} stroke={ink} strokeWidth={3} />
        <text x={122} y={120} fontSize={22} fontWeight={800} fill={theme.inkSoft} fontFamily={sans}>bond yields</text>
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={6} seed={5} /></g>
        {rev > 0.62 && <text x={540} y={118} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">"taper"</text>}
        <text x={VW / 2} y={490} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one word, a global tantrum</text>
      </svg>
    );
  } else if (m === "dontfightthefed") {
    // A giant Fed dwarfs the lone investor who bets against it.
    const rise = interpolate(frame, [fps * 0.4, fps * 1.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(640 0)" opacity={rise}>
          <path d="M-170 120 L0 40 L170 120 Z" fill={parch} stroke={ink} strokeWidth={6} />
          <rect x={-150} y={120} width={300} height={300} fill={tan} stroke={ink} strokeWidth={6} />
          {[-110, -55, 0, 55, 110].map((x, i) => <line key={i} x1={x} y1={130} x2={x} y2={410} stroke={ink} strokeWidth={6} />)}
          <text y={394} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">THE FED</text>
        </g>
        <g transform="translate(200 350)"><circle cx={0} cy={-40} r={22} fill={parch} stroke={ink} strokeWidth={4} /><line x1={0} y1={-18} x2={0} y2={30} stroke={ink} strokeWidth={4} /><text y={70} fontSize={20} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>you</text></g>
        <text x={VW / 2} y={470} fontSize={25} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">don't fight the Fed</text>
      </svg>
    );
  } else if (m === "pumpdump") {
    // Hype pumps the price, insiders sell the top, the crowd eats the crash.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const path = "M 90 400 L 210 360 L 310 280 L 410 160 L 470 92 L 540 240 L 650 384 L 820 438";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={gold} strokeWidth={7} seed={5} /></g>
        {rev > 0.32 && rev < 0.58 && <text x={300} y={250} fontSize={22} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">PUMP — hype it</text>}
        {rev > 0.55 && <g><circle cx={470} cy={92} r={9} fill={red} /><text x={470} y={66} fontSize={20} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">insiders sell</text></g>}
        {rev > 0.85 && <text x={720} y={404} fontSize={22} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">DUMP — on you</text>}
        <text x={VW / 2} y={490} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">pump the hype, dump on the crowd</text>
      </svg>
    );
  } else if (m === "spoofing") {
    // A huge fake order flashes to fool the book, then vanishes before it fills.
    const phase = (frame / (fps * 1.2)) % 1;
    const show = phase < 0.6;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={110} fontSize={24} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>the order book</text>
        {[0, 1, 2].map((i) => <rect key={i} x={340} y={160 + i * 44} width={120} height={32} rx={4} fill={blue} stroke={ink} strokeWidth={2} />)}
        <g opacity={show ? 1 : 0.08}>
          <rect x={330} y={300} width={380} height={50} rx={6} fill={red} stroke={ink} strokeWidth={3} />
          <text x={520} y={332} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>HUGE fake buy order</text>
        </g>
        {!show && <text x={520} y={332} fontSize={24} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">…gone</text>}
        <text x={VW / 2} y={470} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">fake orders that vanish before they fill</text>
      </svg>
    );
  } else if (m === "washtrade") {
    // One entity buys and sells to itself, faking volume.
    const t = frame * 4;
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 260)">
          <circle r={130} fill="none" stroke={ink} strokeWidth={4} strokeDasharray="8 8" />
          <g transform={`rotate(${t})`}><circle cx={0} cy={-130} r={16} fill={gold} stroke={ink} strokeWidth={3} /><text x={0} y={-124} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>
          <rect x={-62} y={-24} width={124} height={48} rx={8} fill={ink} /><text y={8} fontSize={18} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>same guy</text>
          <text x={-168} y={6} fontSize={18} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>buys</text>
          <text x={168} y={6} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>sells</text>
        </g>
        <text x={VW / 2} y={470} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">trading with yourself to fake volume</text>
      </svg>
    );
  } else if (m === "frontrun") {
    // A broker jumps ahead of a big client order to profit from it.
    const jump = interpolate(frame, [fps * 0.8, fps * 1.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(690 260)"><rect x={-92} y={-52} width={184} height={104} rx={10} fill={blue} stroke={ink} strokeWidth={4} /><text y={-6} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>BIG client</text><text y={22} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>buy order</text></g>
        <g transform={`translate(${520 - jump * 150} 260)`}><circle r={36} fill={red} stroke={ink} strokeWidth={4} /><text y={6} fontSize={15} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>broker</text></g>
        {jump > 0.8 && <text x={350} y={196} fontSize={22} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">buys first!</text>}
        <path d="M300 350 l250 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={4} fill="none" strokeLinecap="round" />
        <text x={VW / 2} y={470} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">jump ahead of the client's order</text>
      </svg>
    );
  } else if (m === "flashcrash") {
    // The market plunges vertically in minutes, then snaps back.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.2], [0, 1], clampBoth);
    const path = "M 90 200 L 300 200 L 400 212 L 432 432 L 470 432 L 520 232 L 880 222";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={452} x2={VW - 40} y2={452} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={6} seed={4} /></g>
        {rev > 0.45 && rev < 0.72 && <text x={452} y={424} fontSize={22} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">−1000 pts in minutes</text>}
        <text x={VW / 2} y={492} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">algorithms crash it in seconds</text>
      </svg>
    );
  } else if (m === "nikkeipeak") {
    // The Nikkei peaks in 1989, crashes, and crawls back over decades.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.6], [0, 1], clampBoth);
    const path = "M 90 400 L 200 300 L 300 160 L 360 92 L 430 240 L 520 300 L 640 320 L 760 230 L 880 150";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={6} seed={5} /></g>
        {rev > 0.3 && <text x={360} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">1989 peak</text>}
        {rev > 0.9 && <text x={818} y={128} fontSize={19} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>back, 34 yrs later</text>}
        <text x={VW / 2} y={490} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">it took ~34 years to recover</text>
      </svg>
    );
  } else if (m === "agingpyramid") {
    // A top-heavy, inverted population pyramid.
    const grow = interpolate(frame, [fps * 0.3, fps * 1.8], [0, 1], clampBoth);
    const bars: [string, number][] = [["65+", 300], ["40–64", 240], ["20–39", 150], ["0–19", 90]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={96} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">more old than young</text>
        {bars.map(([lab, w], i) => { const y = 130 + i * 72; const ww = w * grow; return (
          <g key={i}>
            <rect x={490 - ww / 2} y={y} width={ww} height={54} rx={6} fill={i === 0 ? red : (i === 3 ? green : tan)} stroke={ink} strokeWidth={3} />
            <text x={490} y={y + 35} fontSize={20} fontWeight={900} fill={i === 1 || i === 2 ? ink : "#fff"} textAnchor="middle" fontFamily={sans}>{lab}</text>
          </g>
        ); })}
        <text x={VW / 2} y={470} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a shrinking, top-heavy population</text>
      </svg>
    );
  } else if (m === "debtownedinside") {
    // A mountain of government debt — but owed to its own citizens.
    const grow = interpolate(frame, [fps * 0.3, fps * 1.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(360 300)">
          <path d={`M -150 120 L 0 ${120 - 300 * grow} L 150 120 Z`} fill={tan} stroke={ink} strokeWidth={5} />
          <text y={152} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">govt debt ~250%</text>
        </g>
        <g transform="translate(760 250)"><circle r={56} fill={blue} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>its own</text><text y={18} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>citizens</text></g>
        <path d="M520 210 q130 -70 196 24" fill="none" stroke={green} strokeWidth={4} strokeDasharray="7 7" />
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">huge debt — but owed to itself</text>
      </svg>
    );
  } else if (m === "richbutstuck") {
    // Left: flat growth. Right: a comfortable, modern life.
    const rev = interpolate(frame, [6, fps * 2.0], [0, 1], clampBoth);
    const clipId = React.useId().replace(/:/g, "");
    art = (
      <svg width={VW} height={VH}>
        <line x1={490} y1={90} x2={490} y2={430} stroke={ink} strokeWidth={3} strokeDasharray="6 6" />
        <text x={250} y={120} fontSize={22} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">growth: flat</text>
        <RLine x1={120} y1={300} x2={440} y2={300} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d="M120 300 L250 296 L440 298" stroke={red} strokeWidth={5} seed={3} /></g>
        <text x={740} y={120} fontSize={22} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">life: comfortable</text>
        <g transform="translate(640 200)">{[0, 1, 2].map((i) => <rect key={i} x={i * 54} y={-i * 22} width={40} height={140 + i * 22} fill={tan} stroke={ink} strokeWidth={4} />)}</g>
        <text x={VW / 2} y={482} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">stuck on paper, rich in life</text>
      </svg>
    );
  } else if (m === "zombiefirms") {
    // A failing firm kept alive by an IV drip of near-zero-rate credit.
    const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(410 290)">
          <rect x={-82} y={-72} width={164} height={154} rx={8} fill={tan} stroke={ink} strokeWidth={5} />
          {[0, 1].map((i) => <rect key={i} x={-56 + i * 62} y={-46} width={36} height={36} fill="#cfd8dc" stroke={ink} strokeWidth={2} />)}
          <text y={58} fontSize={18} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>a failing firm</text>
        </g>
        <g transform="translate(650 150)">
          <rect x={-26} y={-42} width={52} height={74} rx={6} fill="#bfe0ef" stroke={ink} strokeWidth={4} opacity={0.6 + 0.4 * pulse} />
          <text x={0} y={2} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">0%</text>
          <line x1={0} y1={32} x2={-150} y2={210} stroke={red} strokeWidth={4} />
        </g>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">zombie firms, alive on cheap debt</text>
      </svg>
    );
  } else if (m === "goldwindow") {
    // Nixon slams the 'gold window' shut; the dollar floats free in 1971.
    const shut = interpolate(frame, [fps * 0.8, fps * 1.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(360 270)">
          <rect x={-110} y={-110} width={220} height={220} rx={8} fill={parch} stroke={ink} strokeWidth={6} />
          {shut < 0.5 && <g><circle cx={0} cy={0} r={46} fill={gold} stroke={ink} strokeWidth={4} /><text y={12} fontSize={30} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">Au</text></g>}
          <rect x={-110} y={-110} width={220} height={220 * shut} fill={ink} />
          <text x={0} y={-128} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the "gold window"</text>
          {shut > 0.5 && <text x={0} y={12} fontSize={30} fontWeight={900} fill={gold} textAnchor="middle" fontFamily="Georgia, serif">CLOSED</text>}
        </g>
        <g transform={`translate(740 ${270 - shut * 36})`} opacity={shut}><circle r={56} fill={green} stroke={ink} strokeWidth={5} /><text y={16} fontSize={50} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text><text y={92} fontSize={18} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>floats free, 1971</text></g>
        <text x={VW / 2} y={492} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">Nixon cuts the dollar from gold</text>
      </svg>
    );
  } else if (m === "petrodealflow") {
    // The petrodollar loop: oil for dollars, dollars back into US Treasuries.
    const t = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(220 270)"><rect x={-82} y={-60} width={164} height={120} rx={10} fill={blue} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>USA</text><text y={22} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>buys oil in $</text></g>
        <g transform="translate(760 270)"><rect x={-92} y={-60} width={184} height={120} rx={10} fill={gold} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>OPEC / Saudi</text><text y={22} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>gets the $</text></g>
        <g opacity={interpolate(t, [0, 0.3], [0, 1], clampBoth)}><path d="M304 220 q226 -70 372 0" fill="none" stroke={green} strokeWidth={5} /><text x={490} y={150} fontSize={18} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>$ for oil →</text></g>
        <g opacity={interpolate(t, [0.4, 0.7], [0, 1], clampBoth)}><path d="M676 322 q-186 80 -372 0" fill="none" stroke={red} strokeWidth={5} /><text x={490} y={402} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>← buys US Treasuries</text></g>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">oil for dollars, dollars back to America</text>
      </svg>
    );
  } else if (m === "dollarreserve") {
    // Dollars orbit the globe — the world's reserve currency.
    const grow = interpolate(frame, [fps * 0.3, fps * 1.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={92} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the world's reserve currency</text>
        <g transform="translate(490 290)"><circle r={118} fill="#bfe0ef" stroke={ink} strokeWidth={5} /><path d="M-118 0 H118 M0 -118 V118 M-90 -70 Q0 -30 90 -70 M-90 70 Q0 30 90 70" fill="none" stroke={ink} strokeWidth={2} /></g>
        {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * 6.283; const r = 188 * grow; return <g key={i} transform={`translate(${490 + r * Math.cos(a)} ${290 + r * Math.sin(a)})`} opacity={grow}><circle r={22} fill={green} stroke={ink} strokeWidth={3} /><text y={7} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
        <text x={VW / 2} y={492} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">everyone needs dollars</text>
      </svg>
    );
  } else if (m === "swiftweapon") {
    // A nation's plug is yanked from the dollar/SWIFT system.
    const pull = interpolate(frame, [fps * 0.9, fps * 1.7], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 270)">
          <rect x={-92} y={-72} width={184} height={144} rx={12} fill={blue} stroke={ink} strokeWidth={5} /><text y={-8} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>$ system</text><text y={20} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>SWIFT</text>
          <rect x={72} y={-18} width={20} height={14} fill="#fff" /><rect x={72} y={6} width={20} height={14} fill="#fff" />
        </g>
        <g transform={`translate(${560 + pull * 170} 270)`}>
          <rect x={0} y={-24} width={62} height={48} rx={6} fill={ink} />
          <rect x={-18} y={-16} width={18} height={10} fill={ink} /><rect x={-18} y={6} width={18} height={10} fill={ink} />
          <text x={30} y={58} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>cut off</text>
        </g>
        {pull > 0.7 && <text x={VW / 2} y={150} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">locked out of the dollar</text>}
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the dollar becomes a weapon</text>
      </svg>
    );
  } else if (m === "dedollarize") {
    // A giant dollar pipe vs a small but growing alternative.
    const grow = interpolate(frame, [fps * 0.5, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(360 240)"><rect x={-120} y={-50} width={240} height={100} rx={12} fill={green} stroke={ink} strokeWidth={5} /><text y={12} fontSize={44} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text><text y={92} fontSize={18} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>most of world trade</text></g>
        <g transform="translate(730 300)"><rect x={-50} y={-24} width={100} height={48 * (0.4 + 0.6 * grow)} rx={8} fill="#c0392b" stroke={ink} strokeWidth={4} /><text y={8} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">¥</text><text y={96} fontSize={16} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>small, but growing</text></g>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a slow drift away from the dollar</text>
      </svg>
    );
  } else if (m === "dumbvssmart") {
    // A boring straight-up index beats a frantic 'genius' trader.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const dumb = "M 90 400 L 300 330 L 520 250 L 740 170 L 880 130";
    const smart = "M 90 400 L 180 350 L 260 400 L 360 300 L 460 384 L 560 310 L 680 360 L 820 300 L 880 294";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={430} x2={VW - 40} y2={430} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <RPath d={smart} stroke={theme.inkSoft} strokeWidth={5} seed={9} />
          <RPath d={dumb} stroke={green} strokeWidth={7} seed={3} />
        </g>
        {rev > 0.8 && <text x={818} y={112} fontSize={20} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">the "dumb" index</text>}
        {rev > 0.5 && <text x={430} y={344} fontSize={19} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>frantic "genius"</text>}
        <text x={VW / 2} y={492} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">doing nothing beats doing lots</text>
      </svg>
    );
  } else if (m === "feedrag") {
    // A small annual fee compounds into an enormous gap over time.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.2], [0, 1], clampBoth);
    const gross = "M 90 410 L 300 320 L 520 220 L 740 120 L 880 80";
    const net = "M 90 410 L 300 350 L 520 290 L 740 244 L 880 222";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={430} x2={VW - 40} y2={430} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <RPath d={gross} stroke={green} strokeWidth={6} seed={3} />
          <RPath d={net} stroke={red} strokeWidth={6} seed={5} />
        </g>
        {rev > 0.85 && <g><text x={812} y={66} fontSize={18} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>no fees</text><text x={812} y={212} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>after 2% fees</text></g>}
        <text x={VW / 2} y={490} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">small fees, enormous gap</text>
      </svg>
    );
  } else if (m === "donothing") {
    // A finger hovers over SELL during a panic — and never presses.
    const reach = 0.5 + 0.5 * Math.sin(frame / 12);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 270)">
          <rect x={-122} y={-62} width={244} height={124} rx={14} fill={red} stroke={ink} strokeWidth={6} />
          <text y={14} fontSize={42} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">SELL!</text>
        </g>
        <circle cx={490} cy={128 + 22 * reach} r={26} fill={parch} stroke={ink} strokeWidth={4} />
        <text x={490} y={450} fontSize={28} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">…don't.</text>
        <text x={VW / 2} y={494} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the hardest trade is no trade</text>
      </svg>
    );
  } else if (m === "indexbasket") {
    // One basket quietly holds the entire market.
    const fillA = interpolate(frame, [fps * 0.3, fps * 1.8], [0, 1], clampBoth);
    const names = ["AAPL", "MSFT", "AMZN", "…+500"];
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 320)">
          <path d="M-150 -40 L150 -40 L120 120 L-120 120 Z" fill={tan} stroke={ink} strokeWidth={6} />
          <path d="M-150 -40 Q0 -92 150 -40" fill="none" stroke={ink} strokeWidth={6} />
        </g>
        {names.map((n, i) => { const op = interpolate(fillA, [i * 0.2, i * 0.2 + 0.3], [0, 1], clampBoth); return <g key={i} opacity={op} transform={`translate(${440 + (i % 2) * 100} ${270 + (i < 2 ? 0 : 56)})`}><rect x={-46} y={-18} width={92} height={34} rx={6} fill="#fff" stroke={ink} strokeWidth={3} /><text y={7} fontSize={15} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>{n}</text></g>; })}
        <text x={VW / 2} y={478} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">own everything, pick nothing</text>
      </svg>
    );
  } else if (m === "behaviorgap") {
    // What investors actually earn falls short of the market itself.
    const g = interpolate(frame, [fps * 0.4, fps * 1.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={78} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what you earn vs what the market earns</text>
        <RLine x1={120} y1={430} x2={VW - 120} y2={430} stroke={ink} strokeWidth={4} />
        <rect x={300 - 70} y={430 - 260 * g} width={140} height={260 * g} fill={green} stroke={ink} strokeWidth={4} />
        <text x={300} y={462} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>the market</text>
        <rect x={680 - 70} y={430 - 150 * g} width={140} height={150 * g} fill={red} stroke={ink} strokeWidth={4} />
        <text x={680} y={462} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>the investor</text>
        {g > 0.9 && <text x={490} y={175} fontSize={22} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">the behavior gap</text>}
      </svg>
    );
  } else if (m === "fakebalance") {
    // €1.9bn of 'cash' on the balance sheet; the vault is empty.
    const open = interpolate(frame, [fps * 0.9, fps * 1.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 270)">
          <rect x={-110} y={-120} width={220} height={240} rx={8} fill={parch} stroke={ink} strokeWidth={5} />
          <text y={-92} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">BALANCE SHEET</text>
          {[0, 1, 2].map((i) => <RLine key={i} x1={-84} y1={-58 + i * 30} x2={84} y2={-58 + i * 30} stroke={theme.inkSoft} strokeWidth={4} seed={i} />)}
          <rect x={-96} y={48} width={192} height={44} rx={6} fill={green} opacity={0.3} />
          <text y={78} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">cash: €1.9bn</text>
        </g>
        <g transform="translate(730 270)">
          <rect x={-80} y={-80} width={160} height={160} rx={10} fill={tan} stroke={ink} strokeWidth={6} />
          <circle cx={0} cy={0} r={34} fill="none" stroke={ink} strokeWidth={5} />
          <text y={12} fontSize={38} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" opacity={open}>€0</text>
        </g>
        <path d="M420 270 l70 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <text x={VW / 2} y={470} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the cash on paper wasn't there</text>
      </svg>
    );
  } else if (m === "escrowtrust") {
    // Billions supposedly held in Asian escrow accounts — that were empty.
    const t = interpolate(frame, [fps * 0.5, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(260 270)"><rect x={-82} y={-50} width={164} height={100} rx={10} fill={blue} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>Wirecard</text><text y={20} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>"our billions"</text></g>
        <g transform="translate(720 270)"><rect x={-104} y={-62} width={208} height={124} rx={10} fill={parch} stroke={ink} strokeWidth={5} strokeDasharray="7 7" /><text y={-16} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">"escrow" in Asia</text><text y={16} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" opacity={t}>EMPTY</text></g>
        <g opacity={t}><path d="M346 250 q180 -50 268 0" fill="none" stroke={theme.inkSoft} strokeWidth={4} strokeDasharray="6 6" /></g>
        <text x={VW / 2} y={462} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">held by a trustee who… wasn't</text>
      </svg>
    );
  } else if (m === "regulatorbackwards") {
    // The watchdog investigates the reporters, not the fraud.
    const aim = interpolate(frame, [fps * 0.6, fps * 1.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 150)"><rect x={-72} y={-40} width={144} height={80} rx={10} fill={ink} /><text y={6} fontSize={22} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>regulator</text></g>
        <g opacity={aim}><path d="M430 182 L300 300" stroke={red} strokeWidth={6} fill="none" strokeLinecap="round" /><text x={248} y={338} fontSize={17} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>investigates the reporters</text></g>
        <g opacity={0.4}><rect x={640} y={250} width={184} height={92} rx={10} fill={tan} stroke={ink} strokeWidth={4} /><text x={732} y={302} fontSize={17} fontWeight={900} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>the real fraud →</text></g>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the watchdog aimed the wrong way</text>
      </svg>
    );
  } else if (m === "fugitivejet") {
    // The COO flees on a private jet and vanishes.
    const fly = interpolate(frame, [fps * 0.6, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <path d={`M200 300 q${fly * 300} -40 ${fly * 600} -130`} fill="none" stroke="#cfd8dc" strokeWidth={5} opacity={0.6} />
        <g transform={`translate(${200 + fly * 620} ${280 - fly * 130}) rotate(-10)`}>
          <path d="M-70 0 L40 -10 L82 0 L40 14 Z" fill="#dfe6ea" stroke={ink} strokeWidth={5} />
          <path d="M-10 -8 L-32 -42 L2 -10 Z" fill="#cfd8dc" stroke={ink} strokeWidth={3} />
          <path d="M-10 8 L-32 42 L2 10 Z" fill="#cfd8dc" stroke={ink} strokeWidth={3} />
        </g>
        <text x={300} y={430} fontSize={22} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">…vanished</text>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the COO fled, and disappeared</text>
      </svg>
    );
  } else if (m === "stocktozero") {
    // A DAX-darling share price that collapses to nothing.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const path = "M 90 360 L 220 300 L 340 230 L 440 150 L 520 170 L 560 430 L 640 440 L 880 442";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={442} x2={VW - 40} y2={442} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={6} seed={5} /></g>
        {rev > 0.4 && rev < 0.62 && <text x={460} y={128} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a €24bn darling</text>}
        {rev > 0.85 && <text x={760} y={420} fontSize={24} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">€0</text>}
        <text x={VW / 2} y={490} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">from DAX star to worthless in days</text>
      </svg>
    );
  } else if (m === "subprimestack") {
    // Risky mortgages bundled up and stamped AAA 'safe'.
    const build = interpolate(frame, [fps * 0.3, fps * 1.8], [0, 1], clampBoth);
    const stamp = spring({ frame, fps, delay: fps * 1.6, config: { damping: 9 } });
    art = (
      <svg width={VW} height={VH}>
        {[0, 1, 2, 3].map((i) => { const op = interpolate(build, [i * 0.2, i * 0.2 + 0.3], [0, 1], clampBoth); return <g key={i} opacity={op} transform={`translate(490 ${382 - i * 72})`}><rect x={-120} y={-30} width={240} height={56} rx={6} fill={i < 2 ? red : "#d98b5f"} stroke={ink} strokeWidth={4} /><text y={6} fontSize={18} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>risky mortgages</text></g>; })}
        <g transform={`translate(690 110) rotate(-12) scale(${Math.min(1, stamp)})`} opacity={Math.min(1, stamp)}><rect x={-62} y={-32} width={124} height={64} rx={8} fill="none" stroke={green} strokeWidth={6} /><text y={14} fontSize={38} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">AAA</text></g>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">junk loans, stamped 'safe'</text>
      </svg>
    );
  } else if (m === "leveragetower") {
    // A huge asset tower on a sliver of capital — it topples.
    const topple = interpolate(frame, [fps * 1.4, fps * 2.3], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(490 430) rotate(${topple * 16})`}>
          <rect x={-60} y={-320} width={120} height={300} fill={tan} stroke={ink} strokeWidth={5} />
          <text x={0} y={-160} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$600bn</text>
          <text x={0} y={-130} fontSize={16} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>in assets</text>
          <rect x={-60} y={-20} width={120} height={20} fill={red} stroke={ink} strokeWidth={4} />
        </g>
        <text x={490} y={462} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>~3% capital underneath</text>
        <text x={VW / 2} y={492} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">borrowed ~30× — one wobble topples it</text>
      </svg>
    );
  } else if (m === "weekendphones") {
    // Frantic weekend calls to find a buyer — all say no.
    const t = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const buyers = ["Barclays", "Bank of America", "the government"];
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(240 270)"><rect x={-80} y={-50} width={160} height={100} rx={10} fill={ink} /><text y={-6} fontSize={20} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>Lehman</text><text y={20} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>needs a buyer</text></g>
        {buyers.map((b, i) => { const op = interpolate(t, [i * 0.25, i * 0.25 + 0.2], [0, 1], clampBoth); const y = 150 + i * 112; return <g key={i} opacity={op}><path d={`M320 270 L 618 ${y}`} stroke={theme.inkSoft} strokeWidth={2} strokeDasharray="5 5" /><rect x={618} y={y - 32} width={256} height={64} rx={8} fill={parch} stroke={ink} strokeWidth={3} /><text x={746} y={y - 5} fontSize={18} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{b}</text><text x={746} y={y + 18} fontSize={16} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">…NO</text></g>; })}
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one weekend, every rescue falls through</text>
      </svg>
    );
  } else if (m === "creditfreeze") {
    // Banks stop lending to each other; the system freezes.
    const freeze = interpolate(frame, [fps * 0.6, fps * 1.8], [0, 1], clampBoth);
    const banks: [number, number][] = [[320, 200], [660, 200], [320, 360], [660, 360]];
    const links: [number, number, number, number][] = [[384, 200, 596, 200], [320, 244, 320, 316], [660, 244, 660, 316], [384, 360, 596, 360]];
    art = (
      <svg width={VW} height={VH}>
        {links.map((c, i) => <line key={i} x1={c[0]} y1={c[1]} x2={c[2]} y2={c[3]} stroke={freeze > 0.5 ? "#7fb6d6" : ink} strokeWidth={5} strokeDasharray={freeze > 0.5 ? "4 8" : "0"} />)}
        {banks.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><rect x={-60} y={-40} width={120} height={80} rx={8} fill={tan} stroke={ink} strokeWidth={4} /><text y={6} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>bank</text></g>)}
        {freeze > 0.6 && <text x={490} y={288} fontSize={30} fontWeight={900} fill="#3a6ea5" textAnchor="middle" fontFamily="Georgia, serif">FROZEN</text>}
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">nobody will lend — credit freezes</text>
      </svg>
    );
  } else if (m === "toobigtofail") {
    // The bailout dilemma: let it fail, or save it.
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 140)"><rect x={-92} y={-40} width={184} height={80} rx={10} fill={ink} /><text y={6} fontSize={22} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>the choice</text></g>
        <g transform="translate(260 320)"><rect x={-112} y={-52} width={224} height={104} rx={10} fill={red} stroke={ink} strokeWidth={4} /><text y={-8} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>let it FAIL</text><text y={18} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>chaos, but fair</text></g>
        <g transform="translate(720 320)"><rect x={-112} y={-52} width={224} height={104} rx={10} fill={green} stroke={ink} strokeWidth={4} /><text y={-8} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>BAIL it out</text><text y={18} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>calm, but unfair</text></g>
        <path d="M430 180 L300 268 M550 180 L680 268" stroke={ink} strokeWidth={4} fill="none" strokeLinecap="round" />
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">too big to fail — or not?</text>
      </svg>
    );
  } else if (m === "dotcompeak") {
    // The Nasdaq rockets to its March 2000 peak, then crashes ~78%.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.6], [0, 1], clampBoth);
    const path = "M 90 420 L 240 360 L 360 280 L 440 160 L 500 82 L 560 200 L 640 330 L 740 400 L 880 420";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={442} x2={VW - 40} y2={442} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={red} strokeWidth={6} seed={5} /></g>
        {rev > 0.33 && <text x={500} y={58} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">Mar 2000 peak</text>}
        {rev > 0.85 && <text x={800} y={408} fontSize={24} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">−78%</text>}
        <text x={VW / 2} y={492} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the Nasdaq fell about 78%</text>
      </svg>
    );
  } else if (m === "eyeballs") {
    // 'Eyeballs' soar while profit flatlines on the floor.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.2], [0, 1], clampBoth);
    const eye = "M 100 400 L 300 300 L 500 180 L 700 92 L 880 60";
    const profit = "M 100 402 L 300 406 L 500 410 L 700 420 L 880 430";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={90} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <RPath d={eye} stroke={green} strokeWidth={6} seed={3} />
          <RPath d={profit} stroke={red} strokeWidth={6} seed={5} />
        </g>
        {rev > 0.8 && <g><text x={806} y={48} fontSize={18} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>"eyeballs"</text><text x={806} y={420} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>profit</text></g>}
        <text x={VW / 2} y={490} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">clicks soared, profits never came</text>
      </svg>
    );
  } else if (m === "burnrate") {
    // A pile of venture cash burning down fast.
    const burn = interpolate(frame, [fps * 0.4, fps * 2.2], [1, 0.1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 330)">
          <rect x={-120} y={-160 * burn} width={240} height={160 * burn} rx={6} fill={green} stroke={ink} strokeWidth={5} />
          <text y={-160 * burn - 16} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">VC cash</text>
          {Array.from({ length: 6 }, (_, i) => { const p = ((frame * 6 + i * 30) % 120) / 120; const x = -100 + i * 40; return <path key={i} d={`M${x} ${-160 * burn} q10 -30 0 -52 q-10 22 0 52`} fill={i % 2 ? red : gold} opacity={1 - p} stroke="none" />; })}
        </g>
        <text x={VW / 2} y={470} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">burning millions, earning nothing</text>
      </svg>
    );
  } else if (m === "profitlessvaluation") {
    // A ballooning valuation wrapped around zero profit.
    const grow = interpolate(frame, [fps * 0.3, fps * 1.8], [0.3, 1.2], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(490 270) scale(${grow})`}>
          <circle r={120} fill="#bfe0ef" stroke={ink} strokeWidth={5} />
          <text y={-8} fontSize={32} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$10bn</text>
          <text y={32} fontSize={20} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>profit: $0</text>
        </g>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">billion-dollar price, zero profit</text>
      </svg>
    );
  } else if (m === "bubbleecho") {
    // Two rhyming curves: the 2000 dot-com peak and a 2026 echo.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.2], [0, 1], clampBoth);
    const a = "M 100 400 L 260 320 L 380 200 L 460 112 L 520 92";
    const b = "M 520 92 L 600 112 L 700 182 L 800 150 L 880 110";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={90} y1={430} x2={VW - 40} y2={430} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <RPath d={a} stroke={theme.inkSoft} strokeWidth={5} seed={3} />
          <RPath d={b} stroke={red} strokeWidth={6} seed={6} />
        </g>
        {rev > 0.4 && <text x={300} y={300} fontSize={18} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>2000: dot-com</text>}
        {rev > 0.8 && <text x={760} y={126} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>2026: AI?</text>}
        <text x={VW / 2} y={480} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">history doesn't repeat — it rhymes</text>
      </svg>
    );
  } else if (m === "threeprofit") {
    // Three revenue streams feed the bank: interest, interchange, fees.
    const t = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const streams: [string, string, string][] = [["interest", "from you", red], ["interchange", "from shops", gold], ["fees", "from you", red]];
    art = (
      <svg width={VW} height={VH}>
        {streams.map(([lab, src, c], i) => { const x = 180 + i * 310; const op = interpolate(t, [i * 0.22, i * 0.22 + 0.3], [0, 1], clampBoth); return <g key={i} opacity={op}><path d={`M${x} 120 L490 250`} stroke={theme.inkSoft} strokeWidth={3} strokeDasharray="5 5" /><rect x={x - 92} y={92} width={184} height={74} rx={8} fill={c} stroke={ink} strokeWidth={4} /><text x={x} y={122} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>{lab}</text><text x={x} y={146} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{src}</text></g>; })}
        <g transform="translate(490 300)"><rect x={-92} y={-58} width={184} height={120} rx={10} fill={ink} /><text y={-8} fontSize={22} fontWeight={900} fill={gold} textAnchor="middle" fontFamily="Georgia, serif">the bank</text><text y={22} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>profits 3 ways</text></g>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">interest · interchange · fees</text>
      </svg>
    );
  } else if (m === "minimumpaymenttrap") {
    // Paying only the minimum keeps a balance alive for decades.
    const t = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={120} fontSize={24} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>pay only the minimum…</text>
        <g transform="translate(490 290)">
          <rect x={-160} y={-40} width={320 * (1 - 0.12 * t)} height={80} rx={8} fill={red} stroke={ink} strokeWidth={5} />
          <text x={-146} y={10} fontSize={24} fontWeight={900} fill="#fff" fontFamily="Georgia, serif">$5,000</text>
        </g>
        <text x={490} y={400} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">…{Math.round(t * 20)} years later</text>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the minimum keeps you in debt for decades</text>
      </svg>
    );
  } else if (m === "interchangeskim") {
    // Every swipe skims a small percentage for the banks.
    const swipe = interpolate(frame, [fps * 0.4, fps * 1.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 270)"><rect x={-72} y={-12} width={144} height={92} rx={8} fill="#3a6ea5" stroke={ink} strokeWidth={5} /><rect x={-72 + swipe * 120} y={-42} width={16} height={30} rx={3} fill={gold} stroke={ink} strokeWidth={2} /></g>
        <g transform="translate(720 270)"><rect x={-72} y={-52} width={144} height={104} rx={10} fill={ink} /><text y={6} fontSize={20} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>banks</text></g>
        <g opacity={swipe}><circle cx={520} cy={210} r={18} fill={gold} stroke={ink} strokeWidth={3} /><text x={520} y={216} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>%</text><path d="M400 240 L640 250" stroke={theme.inkSoft} strokeWidth={2} strokeDasharray="5 5" /></g>
        <text x={VW / 2} y={462} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">every swipe skims ~2% for the banks</text>
      </svg>
    );
  } else if (m === "rewardsfunnel") {
    // Fees and interest from debtors flow into the wealthy's rewards.
    const t = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(250 220)"><circle r={56} fill="#8a929a" stroke={ink} strokeWidth={5} /><text y={-2} fontSize={14} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>people in</text><text y={18} fontSize={14} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>debt</text></g>
        <g transform="translate(730 360)"><circle r={56} fill={gold} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={14} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>wealthy</text><text y={18} fontSize={14} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>'points'</text></g>
        <path d="M304 244 q220 60 376 92" fill="none" stroke={red} strokeWidth={5} strokeDasharray="6 6" opacity={t} />
        <text x={500} y={248} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans} opacity={t}>fees + interest →</text>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the poor quietly fund the rich's rewards</text>
      </svg>
    );
  } else if (m === "gracefloat") {
    // Transactor (pays in full, 0% interest) vs revolver (carries a balance).
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(260 270)"><rect x={-112} y={-72} width={224} height={144} rx={10} fill={green} stroke={ink} strokeWidth={5} /><text y={-20} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>pays in full</text><text y={14} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>0% interest</text><text y={42} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>'transactor'</text></g>
        <g transform="translate(720 270)"><rect x={-112} y={-72} width={224} height={144} rx={10} fill={red} stroke={ink} strokeWidth={5} /><text y={-20} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>carries a balance</text><text y={14} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>20%+ interest</text><text y={42} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>'revolver'</text></g>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">two customers, opposite outcomes</text>
      </svg>
    );
  } else if (m === "investorspectrum") {
    // A spectrum from patient investing to reckless gambling.
    const reveal = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const pts: [string, number, string][] = [["index", 0.1, green], ["value", 0.3, blue], ["growth", 0.5, gold], ["momentum", 0.7, "#d98b5f"], ["day trade", 0.92, red]];
    art = (
      <svg width={VW} height={VH}>
        <line x1={110} y1={270} x2={VW - 110} y2={270} stroke={ink} strokeWidth={5} />
        <text x={150} y={330} fontSize={18} fontWeight={800} fill={green} fontFamily={sans}>◄ investing</text>
        <text x={VW - 150} y={330} fontSize={18} fontWeight={800} fill={red} textAnchor="end" fontFamily={sans}>gambling ►</text>
        {pts.map(([lab, x, c], i) => { const op = interpolate(reveal, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth); const px = 110 + (VW - 220) * x; return <g key={i} opacity={op}><circle cx={px} cy={270} r={12} fill={c} stroke={ink} strokeWidth={3} /><text x={px} y={228} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={420} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one long line, patient to reckless</text>
      </svg>
    );
  } else if (m === "valuevsgrowth") {
    // Value (buy cheap) vs growth (pay up for the future).
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(270 270)"><rect x={-132} y={-122} width={264} height={244} rx={12} fill={blue} stroke={ink} strokeWidth={5} /><text y={-70} fontSize={26} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">VALUE</text><text y={-20} fontSize={18} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>buy it cheap</text><text y={14} fontSize={17} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>'a dollar for 50¢'</text><text y={56} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>margin of safety</text></g>
        <g transform="translate(720 270)"><rect x={-132} y={-122} width={264} height={244} rx={12} fill={gold} stroke={ink} strokeWidth={5} /><text y={-70} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">GROWTH</text><text y={-20} fontSize={18} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>pay up for the future</text><text y={14} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>'the next big thing'</text><text y={56} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>bet on the story</text></g>
        <text x={VW / 2} y={462} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">cheap-and-proven vs expensive-and-promising</text>
      </svg>
    );
  } else if (m === "timehorizons") {
    // The real axis: time horizon, from seconds to decades.
    const reveal = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    const rows: [string, string, string][] = [["seconds–minutes", "day trader", red], ["days–weeks", "swing trader", gold], ["years", "the investor", blue], ["decades", "the patient", green]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={92} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the one axis that matters: time</text>
        {rows.map(([t, who, c], i) => { const op = interpolate(reveal, [i * 0.18, i * 0.18 + 0.25], [0, 1], clampBoth); const y = 150 + i * 76; return <g key={i} opacity={op}><rect x={200} y={y - 28} width={290} height={56} rx={8} fill={c} stroke={ink} strokeWidth={3} /><text x={345} y={y + 6} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>{t}</text><text x={520} y={y + 6} fontSize={18} fontWeight={800} fill={ink} fontFamily={sans}>{who}</text></g>; })}
        <text x={VW / 2} y={468} fontSize={21} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">shorter horizon = closer to a casino</text>
      </svg>
    );
  } else if (m === "whowins") {
    // Who actually wins long-term: the patient, not the frantic.
    const grow = interpolate(frame, [fps * 0.4, fps * 1.8], [0, 1], clampBoth);
    const bars: [string, number, string][] = [["patient index", 260, green], ["value investor", 200, blue], ["day trader", 48, red]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={82} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">who actually wins, long-term</text>
        <RLine x1={120} y1={430} x2={VW - 120} y2={430} stroke={ink} strokeWidth={4} />
        {bars.map(([lab, h, c], i) => { const x = 290 + i * 210; const bh = h * grow; return <g key={i}><rect x={x - 78} y={430 - bh} width={156} height={bh} fill={c} stroke={ink} strokeWidth={4} /><text x={x} y={460} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
      </svg>
    );
  } else if (m === "dividendstream") {
    // A share quietly dripping dividends into steady income.
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 170)"><rect x={-82} y={-56} width={164} height={112} rx={10} fill={blue} stroke={ink} strokeWidth={5} /><text y={8} fontSize={24} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">a share</text></g>
        {Array.from({ length: 6 }, (_, i) => { const p = ((frame * 5 + i * 40) % 200) / 200; const y = 240 + p * 170; return <g key={i} transform={`translate(${490 - 60 + (i % 3) * 60} ${y})`} opacity={1 - p * 0.5}><circle r={18} fill={gold} stroke={ink} strokeWidth={3} /><text y={6} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
        <g transform="translate(490 440)"><rect x={-92} y={-18} width={184} height={44} rx={8} fill={green} stroke={ink} strokeWidth={4} /><text y={12} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>steady income</text></g>
        <text x={VW / 2} y={500} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">paid just for holding</text>
      </svg>
    );
  } else if (m === "contrarian") {
    // The crowd panics and flees one way; the contrarian calmly buys the other.
    const flee = interpolate(frame, [fps * 0.3, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={150} fontSize={21} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>everyone panics and sells →</text>
        {Array.from({ length: 6 }, (_, i) => { const x = 180 + i * 90 + flee * 320; return <g key={i} transform={`translate(${x} ${230 + (i % 2) * 40})`}><circle r={20} fill="#8a929a" stroke={ink} strokeWidth={3} /><text y={6} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>!</text></g>; })}
        <g transform={`translate(${720 - flee * 280} 380)`}><circle r={32} fill={green} stroke={ink} strokeWidth={4} /><text y={8} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>buy</text></g>
        <text x={VW / 2} y={456} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">be greedy when others are fearful</text>
      </svg>
    );
  } else if (m === "quantbot") {
    // An algorithm crunching data and firing trades in microseconds.
    const t = frame;
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(430 260)">
          <rect x={-92} y={-92} width={184} height={184} rx={16} fill="#2b2f33" stroke={ink} strokeWidth={6} />
          <rect x={-62} y={-62} width={124} height={62} rx={6} fill="#13331c" stroke={ink} strokeWidth={2} />
          {[0, 1, 2].map((i) => <text key={i} x={0} y={-50 + ((t * 3 + i * 22) % 62)} fontSize={14} fill="#7fe08a" textAnchor="middle" fontFamily="monospace">{i % 2 ? "BUY 0101" : "SELL 1100"}</text>)}
          <circle cx={-40} cy={44} r={9} fill={gold} /><circle cx={40} cy={44} r={9} fill={gold} />
        </g>
        {Array.from({ length: 6 }, (_, i) => { const p = ((t * 6 + i * 22) % 120) / 120; return <circle key={i} cx={540 + p * 320} cy={244 - 20 + i * 8} r={7} fill={i % 2 ? green : red} opacity={1 - p} />; })}
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">algorithms trading in microseconds</text>
      </svg>
    );
  } else if (m === "fundpool") {
    // Many small investors' money flows into one shared fund.
    const t = interpolate(frame, [fps * 0.3, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * 6.283; const x0 = 490 + 300 * Math.cos(a); const y0 = 270 + 300 * Math.sin(a); const x = x0 + (490 - x0) * t; const y = y0 + (270 - y0) * t; return <g key={i} transform={`translate(${x} ${y})`} opacity={1 - t * 0.4}><circle r={22} fill="#8a929a" stroke={ink} strokeWidth={3} /><text y={6} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text></g>; })}
        <g transform="translate(490 270)"><circle r={70 * (0.6 + 0.4 * t)} fill={gold} stroke={ink} strokeWidth={6} /><text y={8} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one fund</text></g>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">many wallets → one big pool</text>
      </svg>
    );
  } else if (m === "mutualvsetf") {
    // A mutual fund prices once a day (clock) vs an ETF trading live (ticker).
    const tick = frame;
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(270 250)"><circle r={90} fill="#fff" stroke={ink} strokeWidth={6} /><line x1={0} y1={0} x2={0} y2={-60} stroke={ink} strokeWidth={5} transform={`rotate(${(tick * 0.6) % 360})`} /><text y={150} fontSize={20} fontWeight={900} fill={blue} textAnchor="middle" fontFamily={sans}>MUTUAL FUND</text><text y={178} fontSize={16} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>priced once a day</text></g>
        <g transform="translate(720 250)"><rect x={-100} y={-70} width={200} height={140} rx={10} fill="#2b2f33" stroke={ink} strokeWidth={5} /><path d={`M-80 ${20 + Math.sin(tick / 8) * 18} L-40 ${0 + Math.sin(tick / 7) * 18} L0 ${20 + Math.sin(tick / 9) * 18} L40 ${-10 + Math.sin(tick / 6) * 18} L80 ${5 + Math.sin(tick / 8) * 18}`} fill="none" stroke={green} strokeWidth={4} /><text y={150} fontSize={20} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>ETF</text><text y={178} fontSize={16} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>trades all day long</text></g>
        <text x={VW / 2} y={480} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">same idea, different plumbing</text>
      </svg>
    );
  } else if (m === "fundmatrix") {
    // A four-cell grid comparing the fund types.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const cells: [string, string, string][] = [["Index", "cheap · passive", green], ["Mutual", "active · daily", blue], ["ETF", "cheap · trades live", gold], ["Hedge", "pricey · exclusive", red]];
    art = (
      <svg width={VW} height={VH}>
        {cells.map(([n, d, c], i) => { const op = interpolate(reveal, [i * 0.2, i * 0.2 + 0.25], [0, 1], clampBoth); const x = 300 + (i % 2) * 380; const y = 190 + Math.floor(i / 2) * 180; return <g key={i} opacity={op} transform={`translate(${x} ${y})`}><rect x={-162} y={-70} width={324} height={140} rx={12} fill={c} stroke={ink} strokeWidth={5} /><text y={-14} fontSize={28} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{n}</text><text y={28} fontSize={18} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{d}</text></g>; })}
        <text x={VW / 2} y={500} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">four ways to own a basket of assets</text>
      </svg>
    );
  } else if (m === "twentytwenty") {
    // The hedge-fund '2 and 20' fee eating into your gains.
    const t = interpolate(frame, [fps * 0.4, fps * 1.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={490} y={120} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">"2 and 20"</text>
        <g transform="translate(490 290)">
          <rect x={-160} y={-120} width={320} height={240} rx={10} fill={green} stroke={ink} strokeWidth={5} />
          <text y={-74} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>your gains</text>
          <rect x={-160} y={-120} width={320} height={44 * t} fill={red} opacity={0.85} />
          <rect x={44} y={-120} width={116} height={240 * t} fill={red} opacity={0.6} />
        </g>
        <text x={VW / 2} y={470} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">2% of everything + 20% of profits</text>
      </svg>
    );
  } else if (m === "feeladder") {
    // Expense ratios climbing: index tiny, active bigger, hedge enormous.
    const grow = interpolate(frame, [fps * 0.4, fps * 1.8], [0, 1], clampBoth);
    const bars: [string, string, number, string][] = [["index fund", "0.05%", 20, green], ["active mutual", "~1%", 120, blue], ["hedge fund", "2 + 20", 280, red]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={78} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what they charge you</text>
        <RLine x1={120} y1={430} x2={VW - 120} y2={430} stroke={ink} strokeWidth={4} />
        {bars.map(([lab, val, h, c], i) => { const x = 300 + i * 210; const bh = h * grow; return <g key={i}><rect x={x - 76} y={430 - bh} width={152} height={bh} fill={c} stroke={ink} strokeWidth={4} /><text x={x} y={460} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text><text x={x} y={430 - bh - 12} fontSize={18} fontWeight={900} fill={c} textAnchor="middle" fontFamily="Georgia, serif">{val}</text></g>; })}
      </svg>
    );
  } else if (m === "accessgate") {
    // Index/ETF open to all; hedge funds behind a velvet rope.
    const t = interpolate(frame, [fps * 0.4, fps * 1.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(270 270)"><rect x={-92} y={-112} width={184} height={224} rx={8} fill={green} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>INDEX / ETF</text><text y={30} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>open to all</text></g>
        <g transform="translate(720 270)"><rect x={-92} y={-112} width={184} height={224} rx={8} fill={ink} /><text y={-6} fontSize={20} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>HEDGE FUND</text><text y={22} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>the rich only</text><g opacity={t}><circle cx={-70} cy={70} r={8} fill={gold} /><circle cx={70} cy={70} r={8} fill={gold} /><path d="M-70 70 Q0 96 70 70" fill="none" stroke={red} strokeWidth={8} /></g></g>
        <text x={VW / 2} y={470} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one of them has a velvet rope</text>
      </svg>
    );
  } else if (m === "gdpshare") {
    // The US slice of the world economy shrinking as others grow.
    const shrink = interpolate(frame, [fps * 0.5, fps * 2.2], [0, 1], clampBoth);
    const us = 0.40 - 0.15 * shrink;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={100} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">US share of the world economy</text>
        <g transform="translate(490 280)">
          <rect x={-260} y={-70} width={520} height={140} rx={10} fill="#8a929a" stroke={ink} strokeWidth={5} />
          <rect x={-260} y={-70} width={520 * us} height={140} rx={10} fill={blue} stroke={ink} strokeWidth={5} />
          <text x={-260 + 520 * us / 2} y={12} fontSize={28} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{Math.round(us * 100)}%</text>
          <text x={210} y={12} fontSize={20} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>rest of world</text>
        </g>
        <text x={VW / 2} y={452} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">shrinking as the world grows up</text>
      </svg>
    );
  } else if (m === "convergemath") {
    // Poorer economies grow faster and converge on the rich ones.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const rich = "M 100 160 L 300 150 L 500 145 L 700 142 L 880 140";
    const poor = "M 100 420 L 300 340 L 500 260 L 700 190 L 880 150";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={90} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <RPath d={rich} stroke={blue} strokeWidth={6} seed={3} />
          <RPath d={poor} stroke={red} strokeWidth={6} seed={6} />
        </g>
        {rev > 0.3 && <text x={320} y={132} fontSize={18} fontWeight={900} fill={blue} textAnchor="middle" fontFamily={sans}>rich: slow growth</text>}
        {rev > 0.5 && <text x={320} y={372} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>poor: fast growth</text>}
        {rev > 0.9 && <text x={800} y={120} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">they converge</text>}
        <text x={VW / 2} y={492} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">poorer economies grow faster — and catch up</text>
      </svg>
    );
  } else if (m === "fourpercent") {
    // 4% of the world's people, but ~25% of its GDP.
    const g = interpolate(frame, [fps * 0.3, fps * 1.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={92} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">4% of the world's people…</text>
        <g transform="translate(490 200)"><rect x={-300} y={-28} width={600} height={56} rx={8} fill="#8a929a" stroke={ink} strokeWidth={4} /><rect x={-300} y={-28} width={600 * 0.04 * g} height={56} fill={blue} /><text x={-294} y={70} fontSize={18} fontWeight={800} fill={blue} fontFamily={sans}>US = 4% of people</text></g>
        <g transform="translate(490 360)"><rect x={-300} y={-28} width={600} height={56} rx={8} fill="#8a929a" stroke={ink} strokeWidth={4} /><rect x={-300} y={-28} width={600 * 0.25 * g} height={56} fill={gold} /><text x={-294} y={70} fontSize={18} fontWeight={800} fill={ink} fontFamily={sans}>US = ~25% of GDP</text></g>
        <text x={VW / 2} y={476} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">…an outsized slice of the wealth</text>
      </svg>
    );
  } else if (m === "multipolarshift") {
    // One dominant US pole gives way to several rising powers.
    const t = interpolate(frame, [fps * 0.5, fps * 2.0], [0, 1], clampBoth);
    const poles: [string, number, number, string][] = [["China", 250, 330, red], ["EU", 730, 230, "#3a6ea5"], ["India", 730, 410, "#d98b5f"]];
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 270)"><circle r={120 * (1 - 0.5 * t)} fill={blue} stroke={ink} strokeWidth={5} /><text y={8} fontSize={26 * (1 - 0.3 * t)} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">US</text></g>
        {poles.map(([lab, x, y, c], i) => <g key={i} opacity={t} transform={`translate(${x} ${y})`}><circle r={72 * t} fill={c} stroke={ink} strokeWidth={4} /><text y={6} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>{lab}</text></g>)}
        <text x={VW / 2} y={476} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">from one superpower to many</text>
      </svg>
    );
  } else if (m === "pppcross") {
    // China's economy crossing the US on a purchasing-power basis.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const us = "M 100 300 L 300 270 L 500 250 L 700 235 L 880 225";
    const cn = "M 100 420 L 300 350 L 500 268 L 700 200 L 880 150";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={90} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <RPath d={us} stroke={blue} strokeWidth={6} seed={3} />
          <RPath d={cn} stroke={red} strokeWidth={6} seed={6} />
        </g>
        {rev > 0.52 && <circle cx={525} cy={260} r={10} fill={ink} />}
        {rev > 0.9 && <g><text x={824} y={214} fontSize={18} fontWeight={900} fill={blue} textAnchor="middle" fontFamily={sans}>US</text><text x={824} y={136} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>China</text></g>}
        <text x={VW / 2} y={492} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">on some measures, already overtaken</text>
      </svg>
    );
  } else if (m === "debtburden") {
    // A mountain of national debt with rising interest.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(470 400)">
          <path d={`M -220 0 L 0 ${-340 * grow} L 220 0 Z`} fill={tan} stroke={ink} strokeWidth={5} />
          <text y={-120} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif" opacity={grow}>$36 trillion</text>
        </g>
        {grow > 0.6 && <g opacity={interpolate(grow, [0.6, 1], [0, 1], clampBoth)}><rect x={700} y={130} width={210} height={60} rx={8} fill={red} stroke={ink} strokeWidth={3} /><text x={805} y={168} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>interest ↑↑</text></g>}
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a mountain of debt, and rising interest</text>
      </svg>
    );
  } else if (m === "privilegeperks") {
    // The four perks of issuing the world's reserve currency.
    const t = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const perks: [string, string][] = [["borrow cheap", green], ["import cheap", gold], ["sanction foes", blue], ["print at will", red]];
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 270)"><circle r={74} fill={blue} stroke={ink} strokeWidth={6} /><text y={-4} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">US</text><text y={22} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>$ issuer</text></g>
        {perks.map(([lab, c], i) => { const a = (i / 4) * 6.283 - 1.57; const op = interpolate(t, [i * 0.18, i * 0.18 + 0.25], [0, 1], clampBoth); const x = 490 + 270 * Math.cos(a); const y = 270 + 185 * Math.sin(a); return <g key={i} opacity={op} transform={`translate(${x} ${y})`}><rect x={-92} y={-26} width={184} height={52} rx={8} fill={c} stroke={ink} strokeWidth={4} /><text y={6} fontSize={17} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={500} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the 'exorbitant privilege'</text>
      </svg>
    );
  } else if (m === "crownslips") {
    // The crown slides off the dollar as global demand fades.
    const slip = interpolate(frame, [fps * 0.8, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 300)"><circle r={90} fill={green} stroke={ink} strokeWidth={6} /><text y={18} fontSize={60} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text></g>
        <g transform={`translate(${490 + slip * 130} ${195 - slip * 20}) rotate(${slip * 42})`}>
          <path d="M-50 20 L-50 -16 L-28 2 L0 -24 L28 2 L50 -16 L50 20 Z" fill={gold} stroke={ink} strokeWidth={4} />
        </g>
        {slip > 0.6 && <text x={VW / 2} y={130} fontSize={24} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">losing the crown</text>}
        <text x={VW / 2} y={470} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">if the world needs fewer dollars…</text>
      </svg>
    );
  } else if (m === "importinflation") {
    // A weaker dollar makes the imported grocery bag cost more.
    const rise = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 300)">
          <path d="M-72 -42 L72 -42 L58 92 L-58 92 Z" fill={tan} stroke={ink} strokeWidth={5} />
          <text y={34} fontSize={30} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">${Math.round(100 + 100 * rise)}</text>
        </g>
        <g opacity={rise}><path d="M490 196 L490 118" stroke={red} strokeWidth={6} fill="none" strokeLinecap="round" /><text x={490} y={100} fontSize={22} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">prices ↑↑</text></g>
        <text x={VW / 2} y={476} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a weaker dollar → costlier imports</text>
      </svg>
    );
  } else if (m === "nobuyers") {
    // US bonds with fewer automatic buyers, so rates spike.
    const t = interpolate(frame, [fps * 0.5, fps * 1.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 170)"><rect x={-120} y={-40} width={240} height={80} rx={8} fill={ink} /><text y={8} fontSize={22} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>US bonds for sale</text></g>
        {Array.from({ length: 5 }, (_, i) => { const gone = t > i * 0.2; return <g key={i} transform={`translate(${250 + i * 120} 340)`} opacity={gone ? 0.25 : 1}><rect x={-30} y={-30} width={60} height={60} rx={6} fill={gone ? "#d8d2c4" : blue} stroke={ink} strokeWidth={3} />{!gone && <text y={8} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>$</text>}</g>; })}
        {t > 0.7 && <text x={VW / 2} y={250} fontSize={24} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">fewer buyers → higher rates</text>}
        <text x={VW / 2} y={470} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">US borrowing gets expensive, fast</text>
      </svg>
    );
  } else if (m === "noreplacement") {
    // Every candidate to replace the dollar has a fatal flaw.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const cands: [string, string][] = [["€ euro", "fragmented"], ["¥ yuan", "not free"], ["gold", "too clunky"], ["₿ bitcoin", "too wild"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={92} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">who could replace it?</text>
        {cands.map(([n, flaw], i) => { const op = interpolate(reveal, [i * 0.2, i * 0.2 + 0.25], [0, 1], clampBoth); const x = 300 + (i % 2) * 380; const y = 200 + Math.floor(i / 2) * 170; return <g key={i} opacity={op} transform={`translate(${x} ${y})`}><rect x={-150} y={-55} width={300} height={110} rx={10} fill={parch} stroke={ink} strokeWidth={4} /><text y={-12} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{n}</text><text y={22} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>✗ {flaw}</text></g>; })}
        <text x={VW / 2} y={500} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">every candidate has a fatal flaw</text>
      </svg>
    );
  } else if (m === "goldrecord") {
    // Gold's price soaring to an all-time high.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const path = "M 90 420 L 250 400 L 400 352 L 540 300 L 660 220 L 780 140 L 880 90";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={gold} strokeWidth={7} seed={3} /></g>
        {rev > 0.85 && <g><circle cx={880} cy={90} r={12} fill={gold} stroke={ink} strokeWidth={3} /><text x={812} y={70} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">all-time high</text></g>}
        <text x={VW / 2} y={492} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the highest gold price in history</text>
      </svg>
    );
  } else if (m === "goldvsrates") {
    // The old inverse rule: real rates up, gold down.
    const tilt = interpolate(frame, [fps * 0.6, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <polygon points="490,304 458,364 522,364" fill={ink} />
        <g transform={`translate(490 300) rotate(${tilt * 14})`}>
          <RLine x1={-280} y1={0} x2={280} y2={0} stroke={ink} strokeWidth={10} />
          <g transform="translate(-240 -44)"><circle r={44} fill={blue} stroke={ink} strokeWidth={4} /><text y={0} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>real</text><text y={18} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>rates</text></g>
          <g transform="translate(240 -44)"><circle r={44} fill={gold} stroke={ink} strokeWidth={4} /><text y={6} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">Au</text></g>
        </g>
        <text x={VW / 2} y={452} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the old rule: rates up → gold down</text>
      </svg>
    );
  } else if (m === "relationshipbreaks") {
    // Two lines that used to move opposite now rise together.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.4], [0, 1], clampBoth);
    const rates = "M 90 360 L 300 360 L 500 280 L 700 220 L 880 190";
    const goldl = "M 90 360 L 300 360 L 500 280 L 700 180 L 880 110";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={3} />
        <line x1={500} y1={90} x2={500} y2={440} stroke={ink} strokeWidth={2} strokeDasharray="6 6" />
        <text x={300} y={128} fontSize={18} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>used to move opposite</text>
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <RPath d={rates} stroke={blue} strokeWidth={6} seed={3} />
          <RPath d={goldl} stroke={gold} strokeWidth={6} seed={6} />
        </g>
        {rev > 0.7 && <text x={710} y={132} fontSize={20} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">now both rise!</text>}
        <text x={VW / 2} y={492} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a 50-year relationship just broke</text>
      </svg>
    );
  } else if (m === "cbgoldbuying") {
    // Central-bank vaults filling with gold bars at a record pace.
    const fill = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={92} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">central-bank vaults, filling up</text>
        <g transform="translate(490 300)">
          <rect x={-160} y={-150} width={320} height={300} rx={10} fill={tan} stroke={ink} strokeWidth={6} />
          {Array.from({ length: 12 }, (_, i) => { const show = fill > i / 12; const row = Math.floor(i / 3); const col = i % 3; return show ? <rect key={i} x={-120 + col * 80} y={120 - row * 44} width={70} height={34} rx={4} fill={gold} stroke={ink} strokeWidth={3} /> : null; })}
        </g>
        <text x={VW / 2} y={492} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">buying gold at a record pace</text>
      </svg>
    );
  } else if (m === "antidollar") {
    // Gold as the anti-dollar: no counterparty, can't be printed or frozen.
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(270 270)"><circle r={90} fill={green} stroke={ink} strokeWidth={6} /><text y={18} fontSize={54} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text><text y={134} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>printed & freezable</text></g>
        <g transform="translate(720 270)"><circle r={90} fill={gold} stroke={ink} strokeWidth={6} /><text y={18} fontSize={44} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">Au</text><text y={134} fontSize={18} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>no counterparty</text></g>
        <text x={VW / 2} y={476} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">gold is the anti-dollar</text>
      </svg>
    );
  } else if (m === "insurancenotengine") {
    // Gold is flat insurance; stocks are the growth engine.
    const clipId = React.useId().replace(/:/g, "");
    const rev = interpolate(frame, [6, fps * 2.2], [0, 1], clampBoth);
    const stocks = "M 100 400 L 300 320 L 500 240 L 700 150 L 880 90";
    const goldl = "M 100 360 L 300 350 L 500 340 L 700 330 L 880 320";
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={90} y1={440} x2={VW - 40} y2={440} stroke={ink} strokeWidth={3} />
        <defs><clipPath id={clipId}><rect x={0} y={0} width={VW * rev} height={VH} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <RPath d={stocks} stroke={green} strokeWidth={6} seed={3} />
          <RPath d={goldl} stroke={gold} strokeWidth={6} seed={6} />
        </g>
        {rev > 0.8 && <g><text x={812} y={78} fontSize={18} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>stocks: the engine</text><text x={812} y={342} fontSize={18} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>gold: the insurance</text></g>}
        <text x={VW / 2} y={490} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">gold protects; it doesn't compound</text>
      </svg>
    );
  } else if (m === "sellmoney") {
    // The perfect product: lend $100, get $120 back, and the product returns.
    const out = interpolate(frame, [fps * 0.4, fps * 1.2], [0, 1], clampBoth);
    const back = interpolate(frame, [fps * 1.3, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(250 270)"><rect x={-80} y={-60} width={160} height={120} rx={10} fill={ink} /><text y={6} fontSize={22} fontWeight={900} fill={gold} textAnchor="middle" fontFamily={sans}>the bank</text></g>
        <g transform="translate(730 270)"><circle r={54} fill="#8a929a" stroke={ink} strokeWidth={4} /><text y={6} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>you</text></g>
        <g opacity={out}><path d="M340 230 q190 -50 334 0" fill="none" stroke={green} strokeWidth={5} /><text x={500} y={168} fontSize={20} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>lend $100 →</text></g>
        <g opacity={back}><path d="M674 322 q-190 60 -334 0" fill="none" stroke={red} strokeWidth={5} /><text x={500} y={392} fontSize={20} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>← get $120 back</text></g>
        <text x={VW / 2} y={476} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">sell money, get more money back</text>
      </svg>
    );
  } else if (m === "freerawmaterial") {
    // Banks create the money they lend with a keystroke.
    const pop = spring({ frame, fps, delay: fps * 0.8, config: { damping: 8 } });
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 280)"><rect x={-90} y={-60} width={180} height={120} rx={8} fill="#2b2f33" stroke={ink} strokeWidth={5} /><rect x={-70} y={-40} width={140} height={44} rx={4} fill={green} opacity={0.8} /><text y={42} fontSize={16} fontWeight={800} fill="#c7c2b6" textAnchor="middle" fontFamily={sans}>a keystroke</text></g>
        <path d="M410 280 l70 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform={`translate(720 280) scale(${Math.min(1, pop)})`}><circle r={70} fill={gold} stroke={ink} strokeWidth={5} /><text y={18} fontSize={50} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>
        <text x={VW / 2} y={470} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the raw material is created from nothing</text>
      </svg>
    );
  } else if (m === "thespread") {
    // Borrow cheap, lend dear; the gap is the profit.
    const g = interpolate(frame, [fps * 0.4, fps * 1.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">borrow cheap, lend dear</text>
        <RLine x1={120} y1={430} x2={VW - 120} y2={430} stroke={ink} strokeWidth={3} />
        <g transform="translate(290 0)"><rect x={-74} y={430 - 50 * g} width={148} height={50 * g} fill={blue} stroke={ink} strokeWidth={4} /><text x={0} y={462} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>pays you 1%</text></g>
        <g transform="translate(700 0)"><rect x={-74} y={430 - 260 * g} width={148} height={260 * g} fill={red} stroke={ink} strokeWidth={4} /><text x={0} y={462} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>charges you 7%</text></g>
        {g > 0.85 && <g><rect x={430} y={200} width={160} height={70} rx={8} fill={gold} stroke={ink} strokeWidth={4} /><text x={510} y={244} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the spread</text></g>}
      </svg>
    );
  } else if (m === "securitizemachine") {
    // Loans packaged into a bond, sold to investors, capital recycled.
    const t = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(200 260)"><rect x={-70} y={-50} width={140} height={100} rx={8} fill="#d98b5f" stroke={ink} strokeWidth={4} /><text y={6} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>loans</text></g>
        <g transform="translate(490 260)"><rect x={-70} y={-50} width={140} height={100} rx={8} fill={gold} stroke={ink} strokeWidth={4} /><text y={6} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>a bond</text></g>
        <g transform="translate(780 260)" opacity={interpolate(t, [0.5, 0.8], [0, 1], clampBoth)}><circle r={52} fill={green} stroke={ink} strokeWidth={4} /><text y={6} fontSize={14} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>investors</text></g>
        <path d="M278 260 L410 260 M562 260 L720 260" stroke={ink} strokeWidth={4} fill="none" />
        <path d="M780 322 q-130 120 -580 20" fill="none" stroke={green} strokeWidth={4} strokeDasharray="6 6" opacity={interpolate(t, [0.72, 1], [0, 1], clampBoth)} />
        <text x={420} y={430} fontSize={16} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans} opacity={interpolate(t, [0.72, 1], [0, 1], clampBoth)}>cash back → lend again</text>
        <text x={VW / 2} y={488} fontSize={21} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">package debt, sell it, lend the same dollar again</text>
      </svg>
    );
  } else if (m === "debtcompounds") {
    // A debt snowball growing via interest on interest.
    const grow = interpolate(frame, [fps * 0.3, fps * 2.0], [0, 1], clampBoth);
    const amt = Math.round(1000 * Math.pow(3, grow));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={110} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>interest on interest…</text>
        <g transform={`translate(${VW / 2} 300)`}>
          <circle r={58 + 130 * grow} fill={red} stroke={ink} strokeWidth={5} />
          <text y={10} fontSize={26 + 14 * grow} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">${amt.toLocaleString("en-US")}</text>
        </g>
        <text x={VW / 2} y={494} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">it compounds, forever</text>
      </svg>
    );
  } else if (m === "debteverywhere") {
    // Debt radiating into every corner of life.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const items = ["a mortgage", "a car loan", "credit cards", "student loans", "government debt"];
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 270)"><circle r={64} fill={red} stroke={ink} strokeWidth={6} /><text y={10} fontSize={34} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">debt</text></g>
        {items.map((lab, i) => { const a = (i / 5) * 6.283 - 1.57; const op = interpolate(reveal, [i * 0.16, i * 0.16 + 0.2], [0, 1], clampBoth); const x = 490 + 290 * Math.cos(a); const y = 270 + 180 * Math.sin(a); return <g key={i} opacity={op}><line x1={490} y1={270} x2={x} y2={y} stroke={theme.inkSoft} strokeWidth={2} strokeDasharray="5 5" /><g transform={`translate(${x} ${y})`}><rect x={-98} y={-26} width={196} height={52} rx={8} fill={parch} stroke={ink} strokeWidth={3} /><text y={6} fontSize={18} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g></g>; })}
        <text x={VW / 2} y={502} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">it's embedded in everything</text>
      </svg>
    );
  } else if (m === "fiatdecree") {
    // A plain scrap of paper becomes money the instant the state stamps it.
    const stamp = spring({ frame, fps, delay: fps * 0.9, config: { damping: 9 } });
    const become = interpolate(frame, [fps * 1.3, fps * 2.1], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>a worthless scrap of paper…</text>
        <g transform="translate(490 290)">
          <rect x={-150} y={-85} width={300} height={170} rx={10} fill={interpolate(become, [0, 1], [0.0001, 1]) < 0.5 ? "#efe9da" : green} stroke={ink} strokeWidth={5} />
          <rect x={-150} y={-85} width={300} height={170} rx={10} fill={green} stroke={ink} strokeWidth={5} opacity={become} />
          <text y={-6} fontSize={64} fontWeight={900} fill={become > 0.5 ? "#fff" : "#b9b3a4"} textAnchor="middle" fontFamily="Georgia, serif">$20</text>
          <text y={40} fontSize={18} fontWeight={800} fill={become > 0.5 ? "#eafaf0" : "#b9b3a4"} textAnchor="middle" fontFamily={sans} opacity={become}>now worth $20</text>
        </g>
        <g transform={`translate(490 170) scale(${Math.min(1.1, stamp)}) rotate(-12)`} opacity={Math.min(1, stamp)}>
          <rect x={-120} y={-34} width={240} height={68} rx={8} fill="none" stroke={red} strokeWidth={6} />
          <text y={12} fontSize={30} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">LEGAL TENDER</text>
        </g>
        <text x={VW / 2} y={492} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">value by declaration, not substance</text>
      </svg>
    );
  } else if (m === "taxdemand") {
    // The taxman accepts only the state's currency — so everyone must get it.
    const reveal = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    const people = [0, 1, 2, 3];
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 150)">
          <rect x={-110} y={-56} width={220} height={112} rx={10} fill={tan} stroke={ink} strokeWidth={5} />
          <text y={-14} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>THE TAXMAN</text>
          <text y={22} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>"pay me in $ — only $"</text>
        </g>
        {people.map((i) => {
          const op = interpolate(reveal, [i * 0.18, i * 0.18 + 0.25], [0, 1], clampBoth);
          const x = 140 + i * 240;
          const y = 400;
          return (
            <g key={i} opacity={op}>
              <circle cx={x} cy={y} r={26} fill={parch} stroke={ink} strokeWidth={4} />
              <text x={x} y={y + 7} fontSize={22} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">$</text>
              <path d={`M${x} ${y - 32} Q${490} ${y - 170} 490 ${210}`} fill="none" stroke={green} strokeWidth={3} strokeDasharray="6 6" />
              <text x={x} y={y + 54} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>must get $</text>
            </g>
          );
        })}
        <text x={VW / 2} y={492} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">taxes manufacture the demand</text>
      </svg>
    );
  } else if (m === "moneyjobs") {
    // The three jobs money has to do.
    const jobs: [string, string, number][] = [
      ["medium of\nexchange", "swap it for stuff", 0],
      ["unit of\naccount", "price everything in it", 1],
      ["store of\nvalue", "hold wealth over time", 2],
    ];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">money has three jobs</text>
        {jobs.map(([title, sub, i]) => {
          const pop = spring({ frame, fps, delay: fps * (0.5 + (i as number) * 0.5), config: { damping: 10 } });
          const x = 190 + (i as number) * 300;
          return (
            <g key={i as number} transform={`translate(${x} 290) scale(${Math.min(1, pop)})`}>
              <circle r={92} fill={[blue, gold, green][i as number]} stroke={ink} strokeWidth={5} />
              {(title as string).split("\n").map((ln, k) => (
                <text key={k} y={-8 + k * 24} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>{ln}</text>
              ))}
              <text y={130} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{sub as string}</text>
            </g>
          );
        })}
        <text x={VW / 2} y={492} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">do all three, and you are money</text>
      </svg>
    );
  } else if (m === "sharedbelief") {
    // A ring of people all accepting the same note — value from consensus.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const n = 7;
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 280)">
          <circle r={62} fill={green} stroke={ink} strokeWidth={5} />
          <text y={10} fontSize={40} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </g>
        {Array.from({ length: n }).map((_, i) => {
          const a = (i / n) * 6.283 - 1.57;
          const op = interpolate(reveal, [i * 0.1, i * 0.1 + 0.2], [0, 1], clampBoth);
          const x = 490 + 230 * Math.cos(a);
          const y = 280 + 170 * Math.sin(a);
          return (
            <g key={i} opacity={op}>
              <line x1={490} y1={280} x2={x} y2={y} stroke={gold} strokeWidth={2.5} strokeDasharray="5 5" />
              <circle cx={x} cy={y} r={24} fill={parch} stroke={ink} strokeWidth={4} />
              <text x={x} y={y + 6} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>✓</text>
            </g>
          );
        })}
        <text x={VW / 2} y={498} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">it works because we all agree it does</text>
      </svg>
    );
  } else if (m === "goldcut") {
    // 1971: the chain tethering the dollar to gold is cut; it floats free.
    const cut = interpolate(frame, [fps * 1.1, fps * 1.5], [0, 1], clampBoth);
    const drift = interpolate(frame, [fps * 1.5, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>August 15, 1971</text>
        <g transform="translate(300 360)">
          <rect x={-70} y={-40} width={140} height={80} rx={8} fill={gold} stroke={ink} strokeWidth={5} />
          <text y={8} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>GOLD</text>
        </g>
        <path d={`M300 320 Q400 ${230 + cut * 0} 490 ${200 - drift * 110}`} fill="none" stroke={ink} strokeWidth={5} strokeDasharray="10 8" opacity={1 - cut} />
        <g transform={`translate(${490 + drift * 150} ${200 - drift * 120}) rotate(${drift * 18})`}>
          <rect x={-74} y={-44} width={148} height={88} rx={8} fill={green} stroke={ink} strokeWidth={5} />
          <text y={12} fontSize={44} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$</text>
        </g>
        {cut > 0.2 && (
          <g transform="translate(400 258)" opacity={interpolate(cut, [0.2, 0.6], [0, 1], clampBoth)}>
            <text fontSize={40} textAnchor="middle" fontFamily={sans}>✂</text>
          </g>
        )}
        <text x={VW / 2} y={494} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the gold anchor is cut — money floats free</text>
      </svg>
    );
  } else if (m === "confidencecollapse") {
    // Confidence gauge drops; the note's real value melts toward zero.
    const drop = interpolate(frame, [fps * 0.6, fps * 2.4], [0, 1], clampBoth);
    const conf = Math.round(100 * (1 - drop));
    const worth = Math.max(0, Math.round(100 * Math.pow(1 - drop, 3)));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>lose the trust, lose the money</text>
        <g transform="translate(290 300)">
          <text y={-120} fontSize={18} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>confidence</text>
          <rect x={-46} y={-100} width={92} height={200} rx={10} fill="#efe9da" stroke={ink} strokeWidth={5} />
          <rect x={-46} y={100 - 2 * conf} width={92} height={2 * conf} rx={6} fill={drop > 0.6 ? red : green} />
          <text y={140} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{conf}%</text>
        </g>
        <path d="M400 290 l80 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform={`translate(700 300) scale(${0.6 + 0.4 * (worth / 100)})`} opacity={0.35 + 0.65 * (worth / 100)}>
          <rect x={-100} y={-58} width={200} height={116} rx={8} fill={green} stroke={ink} strokeWidth={5} />
          <text y={2} fontSize={34} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">worth</text>
          <text y={40} fontSize={26} fontWeight={900} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>{worth}¢</text>
        </g>
        <text x={VW / 2} y={494} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">when trust dies, so does the money</text>
      </svg>
    );
  } else if (m === "networthladder") {
    // Climbing the wealth levels $0 → $100M, each step higher than the last.
    const levels: [string, number][] = [["$0", 0], ["$10K", 1], ["$100K", 2], ["$1M", 3], ["$10M", 4], ["$100M", 5]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {levels.map(([lab, i]) => {
          const x = 90 + (i as number) * 150;
          const h = 40 + (i as number) * 70;
          const op = interpolate(climb, [(i as number) * 0.14, (i as number) * 0.14 + 0.22], [0, 1], clampBoth);
          return (
            <g key={i as number} opacity={op}>
              <rect x={x} y={470 - h} width={130} height={h} fill={[parch, tan, "#cfe3d4", green, gold, red][i as number]} stroke={ink} strokeWidth={4} />
              <text x={x + 65} y={470 - h - 12} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{lab as string}</text>
            </g>
          );
        })}
        <RLine x1={70} y1={470} x2={VW - 40} y2={470} stroke={ink} strokeWidth={3} />
        <text x={VW / 2} y={70} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">every ×10 is a different world</text>
      </svg>
    );
  } else if (m === "moneycrossover") {
    // Income from work (flat) vs income from assets (rising) — they cross.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    const x0 = 120, x1 = 860, y0 = 440, yTop = 110;
    const workY = 330;
    const px = x0 + (x1 - x0) * draw;
    const assetY = (t: number) => y0 - (y0 - yTop) * Math.pow(t, 2.2);
    const ay = assetY(draw);
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <RLine x1={x0} y1={yTop} x2={x0} y2={y0} stroke={ink} strokeWidth={3} />
        <line x1={x0} y1={workY} x2={px} y2={workY} stroke={blue} strokeWidth={6} />
        <text x={x1 - 10} y={workY - 14} fontSize={17} fontWeight={800} fill={blue} textAnchor="end" fontFamily={sans}>income from your job</text>
        <path d={`M${x0} ${y0} Q${(x0 + px) / 2} ${y0} ${px} ${ay}`} fill="none" stroke={green} strokeWidth={6} />
        <text x={px} y={ay - 14} fontSize={17} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>income from investments</text>
        {draw > 0.74 && (
          <g>
            <circle cx={720} cy={workY} r={12} fill={red} stroke={ink} strokeWidth={3} />
            <text x={720} y={workY + 42} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">the crossover</text>
          </g>
        )}
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">when money out-earns you, you're free</text>
      </svg>
    );
  } else if (m === "wealthpyramid") {
    // US wealth distribution as a pyramid: bottom 50% holds little, top 1% holds a lot.
    const tiers: [string, string, number][] = [
      ["top 1%", "~30% of wealth", 0],
      ["next 9%", "~37%", 1],
      ["next 40%", "~30%", 2],
      ["bottom 50%", "~3% of wealth", 3],
    ];
    const rise = interpolate(frame, [fps * 0.3, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([lab, share, i]) => {
          const w = 160 + (i as number) * 200;
          const y = 150 + (i as number) * 78;
          const op = interpolate(rise, [(i as number) * 0.18, (i as number) * 0.18 + 0.25], [0, 1], clampBoth);
          return (
            <g key={i as number} opacity={op}>
              <rect x={VW / 2 - w / 2} y={y} width={w} height={70} fill={[red, gold, green, parch][i as number]} stroke={ink} strokeWidth={4} />
              <text x={VW / 2} y={y + 30} fontSize={18} fontWeight={900} fill={(i as number) === 3 ? ink : "#fff"} textAnchor="middle" fontFamily={sans}>{lab as string}</text>
              <text x={VW / 2} y={y + 54} fontSize={15} fontWeight={700} fill={(i as number) === 3 ? ink : "#f3efe2"} textAnchor="middle" fontFamily={sans}>{share as string}</text>
            </g>
          );
        })}
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">who owns what in America</text>
      </svg>
    );
  } else if (m === "levelgaps") {
    // The jumps between levels are each 10x — the climb is exponential.
    const labels: [string, number][] = [["$0", 0], ["$10K", 1], ["$100K", 2], ["$1M", 3], ["$10M", 4], ["$100M", 5]];
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={80} y1={300} x2={VW - 80} y2={300} stroke={ink} strokeWidth={4} />
        {labels.map(([lab, i]) => {
          const x = 110 + (i as number) * 155;
          const op = interpolate(reveal, [(i as number) * 0.14, (i as number) * 0.14 + 0.2], [0, 1], clampBoth);
          return (
            <g key={i as number} opacity={op}>
              <circle cx={x} cy={300} r={10} fill={[parch, tan, green, gold, "#d98b5f", red][i as number]} stroke={ink} strokeWidth={4} />
              <text x={x} y={345} fontSize={19} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{lab as string}</text>
              {(i as number) > 0 && <text x={x - 77} y={270} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>×10</text>}
            </g>
          );
        })}
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">each level is 10× the last</text>
        <text x={VW / 2} y={430} fontSize={18} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>the same-sized step, an entirely different leap</text>
      </svg>
    );
  } else if (m === "twophases") {
    // Phase 1: you push the boulder uphill. Phase 2: the snowball rolls on its own.
    const t = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const roll = interpolate(frame, [fps * 1.4, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={245} y={90} fontSize={20} fontWeight={900} fill={blue} textAnchor="middle" fontFamily="Georgia, serif">phase 1: you push</text>
        <path d="M120 400 L360 250" stroke={ink} strokeWidth={4} fill="none" />
        <g transform={`translate(${130 + 170 * t} ${395 - 150 * t})`}><circle r={34} fill={tan} stroke={ink} strokeWidth={4} /><text y={7} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>$</text></g>
        <g transform={`translate(${90 + 170 * t} ${410 - 150 * t})`} stroke={ink} strokeWidth={4} fill="none"><circle cx={0} cy={-10} r={10} fill={parch} /><line x1={0} y1={0} x2={0} y2={18} /><line x1={0} y1={6} x2={22} y2={-6} /></g>
        <text x={720} y={90} fontSize={20} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">phase 2: it rolls itself</text>
        <path d="M560 250 L900 410" stroke={ink} strokeWidth={4} fill="none" />
        <g transform={`translate(${575 + 300 * roll} ${255 + 140 * roll}) rotate(${roll * 360})`}><circle r={30 + 26 * roll} fill={gold} stroke={ink} strokeWidth={4} /><text y={7} fontSize={14 + 8 * roll} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>$</text></g>
        <text x={VW / 2} y={492} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the first $100K is the hardest climb</text>
      </svg>
    );
  } else if (m === "richworlds") {
    // Three worlds: survive / secure / power at wildly different levels.
    const worlds: [string, string, string, number][] = [
      ["$10K", "survive", "rent + groceries covered", 0],
      ["$1M", "secure", "work becomes optional", 1],
      ["$100M", "power", "you move markets & families", 2],
    ];
    art = (
      <svg width={VW} height={VH}>
        {worlds.map(([amt, word, sub, i]) => {
          const pop = spring({ frame, fps, delay: fps * (0.4 + (i as number) * 0.55), config: { damping: 11 } });
          const x = 180 + (i as number) * 300;
          return (
            <g key={i as number} transform={`translate(${x} 280) scale(${Math.min(1, pop)})`}>
              <rect x={-120} y={-120} width={240} height={240} rx={14} fill={[parch, "#cfe3d4", gold][i as number]} stroke={ink} strokeWidth={5} />
              <text y={-58} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{amt as string}</text>
              <text y={0} fontSize={26} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>{word as string}</text>
              <text y={70} fontSize={15} fontWeight={700} fill={ink} textAnchor="middle" fontFamily={sans}>{sub as string}</text>
            </g>
          );
        })}
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">money means something new at each level</text>
      </svg>
    );
  } else if (m === "agecurve") {
    // The life-cycle hump: net worth rises with age, peaks near retirement, then dips.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const pts: [number, number][] = [[120, 430], [270, 400], [430, 320], [600, 220], [760, 180], [880, 250]];
    const totalLen = pts.length - 1;
    const segs = pts.slice(1).map(([x, y], i) => {
      const [px, py] = pts[i];
      const segStart = i / totalLen, segEnd = (i + 1) / totalLen;
      const t = interpolate(draw, [segStart, segEnd], [0, 1], clampBoth);
      return `L${px + (x - px) * t} ${py + (y - py) * t}`;
    });
    const ages = ["<35", "35-44", "45-54", "55-64", "65-74", "75+"];
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={100} y1={450} x2={VW - 60} y2={450} stroke={ink} strokeWidth={3} />
        <RLine x1={100} y1={140} x2={100} y2={450} stroke={ink} strokeWidth={3} />
        <text x={70} y={150} fontSize={14} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>net worth</text>
        <path d={`M120 430 ${segs.join(" ")}`} fill="none" stroke={green} strokeWidth={6} strokeLinecap="round" />
        {pts.map(([x], i) => <text key={i} x={x} y={478} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{ages[i]}</text>)}
        {draw > 0.82 && <text x={760} y={158} fontSize={16} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>peak, then drawdown</text>}
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">wealth is a life-cycle hump</text>
      </svg>
    );
  } else if (m === "rankmeter") {
    // A percentile ranking bar: where do you land for your age?
    const slide = interpolate(frame, [fps * 0.6, fps * 2.0], [0, 1], clampBoth);
    const youX = 180 + 560 * slide;
    const marks: [number, string][] = [[180, "bottom"], [460, "median\n(50th)"], [740, "top 10%"]];
    art = (
      <svg width={VW} height={VH}>
        <defs>
          <linearGradient id="rankgrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#efe9da" />
            <stop offset="1" stopColor={green} />
          </linearGradient>
        </defs>
        <rect x={180} y={280} width={560} height={46} rx={23} fill="url(#rankgrad)" stroke={ink} strokeWidth={4} />
        {marks.map(([x, lab], i) => (
          <g key={i}>
            <line x1={x} y1={326} x2={x} y2={352} stroke={ink} strokeWidth={3} />
            {lab.split("\n").map((ln, k) => <text key={k} x={x} y={374 + k * 18} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{ln}</text>)}
          </g>
        ))}
        <g transform={`translate(${youX} 250)`}>
          <path d="M0 24 L-14 0 L14 0 Z" fill={red} stroke={ink} strokeWidth={3} />
          <text y={-10} fontSize={20} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">YOU?</text>
        </g>
        <text x={VW / 2} y={100} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">where do you rank, for your age?</text>
      </svg>
    );
  } else if (m === "medianvsmean") {
    // A seesaw: the median person vs the mean, dragged up by a few huge fortunes.
    const tip = interpolate(frame, [fps * 0.8, fps * 2.2], [0, 10], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">why the "average" lies</text>
        <g transform="translate(260 300)">
          <circle r={56} fill={green} stroke={ink} strokeWidth={5} />
          <text y={-4} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>median</text>
          <text y={20} fontSize={16} fontWeight={900} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>$39K</text>
          <text y={100} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the typical person</text>
        </g>
        <g transform="translate(720 300)">
          <circle r={56} fill={gold} stroke={ink} strokeWidth={5} />
          <text y={-4} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>mean</text>
          <text y={20} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>$184K</text>
          <text y={100} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>dragged up by the rich</text>
        </g>
        <g transform={`translate(880 ${180 - tip * 3})`} opacity={interpolate(tip, [2, 6], [0, 1], clampBoth)}>
          <circle r={30} fill={red} stroke={ink} strokeWidth={4} />
          <text y={6} fontSize={14} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>$10M+</text>
        </g>
        <path d={`M770 250 Q840 ${210 - tip * 2} 870 ${200 - tip * 2}`} fill="none" stroke={red} strokeWidth={3} strokeDasharray="5 5" opacity={interpolate(tip, [2, 6], [0, 1], clampBoth)} />
      </svg>
    );
  } else if (m === "salarymultiple") {
    // Fidelity-style milestones: multiples of salary saved by each age.
    const mults: [string, string, number][] = [["30", "1×", 0], ["40", "3×", 1], ["50", "6×", 2], ["60", "8×", 3], ["67", "10×", 4]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={66} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a cleaner target: multiples of your salary</text>
        <RLine x1={90} y1={450} x2={VW - 60} y2={450} stroke={ink} strokeWidth={3} />
        {mults.map(([age, mult, i]) => {
          const x = 140 + (i as number) * 170;
          const h = 55 + (i as number) * 70;
          const op = interpolate(climb, [(i as number) * 0.16, (i as number) * 0.16 + 0.22], [0, 1], clampBoth);
          return (
            <g key={i as number} opacity={op}>
              <rect x={x} y={450 - h} width={120} height={h} rx={6} fill={[parch, tan, "#cfe3d4", green, gold][i as number]} stroke={ink} strokeWidth={4} />
              <text x={x + 60} y={450 - h - 32} fontSize={30} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{mult as string}</text>
              <text x={x + 60} y={450 - h - 10} fontSize={15} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>salary</text>
              <text x={x + 60} y={474} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>by {age as string}</text>
            </g>
          );
        })}
      </svg>
    );
  } else if (m === "generationgap") {
    // Boomers hold a huge pile; younger generations a small one at the same age.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    const gens: [string, number, string][] = [["Boomers", 260, gold], ["Gen X", 150, green], ["Millennials", 70, blue], ["Gen Z", 28, tan]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={66} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">share of US wealth, by generation</text>
        <RLine x1={120} y1={450} x2={VW - 90} y2={450} stroke={ink} strokeWidth={3} />
        {gens.map(([lab, h, col], i) => {
          const x = 170 + i * 180;
          const hh = (h as number) * grow;
          return (
            <g key={i}>
              <rect x={x} y={450 - hh} width={120} height={hh} fill={col as string} stroke={ink} strokeWidth={4} />
              <text x={x + 60} y={450 - hh - 12} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>{lab as string}</text>
              <text x={x + 60} y={474} fontSize={14} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>{["~51%", "~26%", "~10%", "~3%"][i]}</text>
            </g>
          );
        })}
        <text x={VW / 2} y={500} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the young hold a sliver — even adjusting for age</text>
      </svg>
    );
  } else if (m === "startearly") {
    // Two savers: start at 25 vs 35 — the early starter ends far ahead by 65.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const early = Math.round(900 * Math.pow(grow, 1.6));
    const late = Math.round(380 * Math.pow(grow, 1.6));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={66} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the one asset you can't buy back: time</text>
        <RLine x1={100} y1={440} x2={VW - 60} y2={440} stroke={ink} strokeWidth={3} />
        <path d={`M140 440 Q500 ${440 - 260 * grow} 860 ${440 - 300 * grow}`} fill="none" stroke={green} strokeWidth={6} />
        <path d={`M300 440 Q580 ${440 - 90 * grow} 860 ${440 - 130 * grow}`} fill="none" stroke={blue} strokeWidth={6} />
        <text x={150} y={430} fontSize={15} fontWeight={800} fill={green} fontFamily={sans}>starts at 25</text>
        <text x={310} y={430} fontSize={15} fontWeight={800} fill={blue} fontFamily={sans}>starts at 35</text>
        <g transform={`translate(880 ${440 - 300 * grow})`}><text fontSize={18} fontWeight={900} fill={green} textAnchor="end" fontFamily="Georgia, serif">${early}K</text></g>
        <g transform={`translate(880 ${440 - 130 * grow})`}><text fontSize={18} fontWeight={900} fill={blue} textAnchor="end" fontFamily="Georgia, serif">${late}K</text></g>
        <text x={VW / 2} y={496} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>a 10-year head start can double your finish</text>
      </svg>
    );
  } else if (m === "savingsrate") {
    // The savings rate dial: the % you keep decides years-to-freedom.
    const sweep = interpolate(frame, [fps * 0.5, fps * 2.2], [0, 1], clampBoth);
    const rows: [string, string, string][] = [["save 5%", "~50 years", red], ["save 20%", "~37 years", gold], ["save 50%", "~17 years", green]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your savings RATE sets the clock</text>
        {rows.map(([lab, yrs, col], i) => {
          const y = 170 + i * 100;
          const w = [120, 420, 760][i] * sweep;
          return (
            <g key={i}>
              <text x={90} y={y + 6} fontSize={20} fontWeight={900} fill={ink} fontFamily={sans}>{lab}</text>
              <rect x={260} y={y - 26} width={w} height={48} rx={8} fill={col as string} stroke={ink} strokeWidth={4} />
              <text x={260 + w + 14} y={y + 7} fontSize={18} fontWeight={900} fill={ink} fontFamily="Georgia, serif">{yrs}</text>
            </g>
          );
        })}
        <text x={VW / 2} y={492} fontSize={18} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>years until work is optional</text>
      </svg>
    );
  } else if (m === "fiftythirtytwenty") {
    // The 50/30/20 split of a paycheck.
    const grow = interpolate(frame, [fps * 0.4, fps * 1.8], [0, 1], clampBoth);
    const parts: [string, string, number, number, string][] = [["50%", "needs", 0, 50, blue], ["30%", "wants", 50, 30, gold], ["20%", "savings", 80, 20, green]];
    const barX = 160, barW = 660, barY = 250, barH = 90;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={120} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the 50 / 30 / 20 paycheck</text>
        {parts.map(([pct, lab, start, span, col], i) => {
          const x = barX + barW * ((start as number) / 100);
          const w = barW * ((span as number) / 100) * grow;
          return (
            <g key={i}>
              <rect x={x} y={barY} width={w} height={barH} fill={col as string} stroke={ink} strokeWidth={4} />
              <text x={x + w / 2} y={barY + 42} fontSize={26} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif" opacity={grow}>{pct}</text>
              <text x={x + w / 2} y={barY + 70} fontSize={16} fontWeight={800} fill="#f3efe2" textAnchor="middle" fontFamily={sans} opacity={grow}>{lab}</text>
            </g>
          );
        })}
        <text x={820} y={barY + 58} fontSize={16} fontWeight={800} fill={green} fontFamily={sans} opacity={interpolate(grow, [0.8, 1], [0, 1], clampBoth)}>pay this first</text>
      </svg>
    );
  } else if (m === "emergencyfund") {
    // A moat/buffer of months of expenses absorbing a shock.
    const fill = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 6], clampBoth);
    const hit = interpolate(frame, [fps * 2.1, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">first: a 3–6 month buffer</text>
        <g transform="translate(300 300)">
          <circle r={70} fill={parch} stroke={ink} strokeWidth={5} />
          <text y={-6} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>YOU</text>
          <text y={18} fontSize={13} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>+ your life</text>
        </g>
        {Array.from({ length: 6 }).map((_, i) => {
          const on = fill > i + 0.5;
          const a = (i / 6) * 6.283 - 1.57;
          const x = 300 + 150 * Math.cos(a), y = 300 + 150 * Math.sin(a);
          return <g key={i} opacity={on ? 1 : 0.15}><rect x={x - 22} y={y - 16} width={44} height={32} rx={5} fill={green} stroke={ink} strokeWidth={3} /><text x={x} y={y + 6} fontSize={13} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>1mo</text></g>;
        })}
        <g transform={`translate(${760 - hit * 300} 300)`} opacity={hit < 1 ? 1 : 0.25}>
          <path d="M0 -30 L18 0 L0 30 L-18 0 Z" fill={red} stroke={ink} strokeWidth={4} />
          <text y={54} fontSize={15} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>a shock</text>
        </g>
        <text x={VW / 2} y={494} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">it absorbs the hit, so debt doesn't</text>
      </svg>
    );
  } else if (m === "employermatch") {
    // Employer match = free money: you put in, they double part of it.
    const t = interpolate(frame, [fps * 0.4, fps * 1.6], [0, 1], clampBoth);
    const pop = spring({ frame, fps, delay: fps * 1.7, config: { damping: 9 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the employer match = free money</text>
        <g transform="translate(260 290)" opacity={t}>
          <circle r={58} fill={blue} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>you</text><text y={22} fontSize={16} fontWeight={900} fill="#eaf0fa" textAnchor="middle" fontFamily={sans}>$100</text>
        </g>
        <text x={490} y={300} fontSize={40} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif" opacity={interpolate(t, [0.5, 1], [0, 1], clampBoth)}>+</text>
        <g transform={`translate(720 290) scale(${Math.min(1, pop)})`}>
          <circle r={58} fill={green} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>boss</text><text y={22} fontSize={16} fontWeight={900} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>+$100</text>
        </g>
        <text x={VW / 2} y={430} fontSize={22} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif" opacity={Math.min(1, pop)}>= $200, an instant 100% return</text>
        <text x={VW / 2} y={494} fontSize={18} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>never leave it on the table</text>
      </svg>
    );
  } else if (m === "ruleof72") {
    // Rule of 72: 72 ÷ rate = years to double.
    const show = interpolate(frame, [fps * 0.5, fps * 1.4], [0, 1], clampBoth);
    const rows: [string, string][] = [["at 6%", "~12 yrs to double"], ["at 8%", "~9 yrs to double"], ["at 10%", "~7 yrs to double"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={90} fontSize={26} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the Rule of 72</text>
        <text x={VW / 2} y={140} fontSize={22} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>72 ÷ your return = years to double</text>
        {rows.map(([r, yrs], i) => {
          const op = interpolate(show, [i * 0.2, i * 0.2 + 0.3], [0, 1], clampBoth);
          const y = 230 + i * 70;
          return <g key={i} opacity={op}><text x={360} y={y} fontSize={22} fontWeight={900} fill={ink} textAnchor="end" fontFamily="Georgia, serif">{r}</text><text x={420} y={y} fontSize={22} fontWeight={800} fill={green} fontFamily={sans}>{yrs}</text></g>;
        })}
        <text x={VW / 2} y={492} fontSize={18} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>a little math that shows the magic</text>
      </svg>
    );
  } else if (m === "bankladder") {
    // The tiers of banking, from unbanked to family office.
    const tiers: [string, string][] = [["unbanked", "pays the most"], ["basic checking", "$35 fees"], ["mass market", "ignored"], ["'preferred'", "perks begin"], ["private bank", "a personal banker"], ["family office", "a whole team"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([lab, sub], i) => {
          const w = 150 + i * 130;
          const y = 90 + i * 66;
          const op = interpolate(climb, [i * 0.13, i * 0.13 + 0.2], [0, 1], clampBoth);
          return (
            <g key={i} opacity={op}>
              <rect x={VW / 2 - w / 2} y={y} width={w} height={54} rx={7} fill={[parch, "#e8d7bf", tan, "#cfe3d4", green, gold][i]} stroke={ink} strokeWidth={4} />
              <text x={VW / 2} y={y + 24} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text>
              <text x={VW / 2} y={y + 44} fontSize={13} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>{sub}</text>
            </g>
          );
        })}
        <text x={150} y={130} fontSize={14} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>poor</text>
        <text x={830} y={470} fontSize={14} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>ultra-rich</text>
      </svg>
    );
  } else if (m === "feesupperksdown") {
    // Fees flow up from the poor; perks flow down to the rich.
    const up = interpolate(frame, [fps * 0.5, fps * 1.8], [0, 1], clampBoth);
    const down = interpolate(frame, [fps * 1.4, fps * 2.7], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(300 120)"><circle r={58} fill={gold} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>the rich</text><text y={22} fontSize={13} fontWeight={700} fill={ink} textAnchor="middle" fontFamily={sans}>get perks</text></g>
        <g transform="translate(300 450)"><circle r={58} fill={parch} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>the poor</text><text y={22} fontSize={13} fontWeight={700} fill={ink} textAnchor="middle" fontFamily={sans}>pay fees</text></g>
        <g opacity={up}><path d="M420 440 L420 160" stroke={red} strokeWidth={6} fill="none" markerEnd="" /><path d="M420 160 l-12 22 m12 -22 l12 22" stroke={red} strokeWidth={6} fill="none" strokeLinecap="round" /><text x={448} y={300} fontSize={20} fontWeight={900} fill={red} fontFamily="Georgia, serif">FEES ↑</text></g>
        <g opacity={down}><path d="M620 160 L620 440" stroke={green} strokeWidth={6} fill="none" /><path d="M620 440 l-12 -22 m12 22 l12 -22" stroke={green} strokeWidth={6} fill="none" strokeLinecap="round" /><text x={648} y={300} fontSize={20} fontWeight={900} fill={green} fontFamily="Georgia, serif">PERKS ↓</text></g>
        <text x={VW / 2} y={40} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the poor quietly subsidize the rich</text>
      </svg>
    );
  } else if (m === "overdrafttrap") {
    // A $3 coffee triggers a $35 overdraft fee.
    const buy = spring({ frame, fps, delay: fps * 0.7, config: { damping: 10 } });
    const fee = spring({ frame, fps, delay: fps * 1.7, config: { damping: 8 } });
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(280 290) scale(${Math.min(1, buy)})`}><circle r={60} fill={tan} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={30} textAnchor="middle" fontFamily={sans}>☕</text><text y={30} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>$3 coffee</text></g>
        <path d="M360 290 l90 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" opacity={interpolate(fee, [0, 0.4], [0, 1], clampBoth)} />
        <g transform={`translate(680 290) scale(${Math.min(1.05, fee)})`}><circle r={78} fill={red} stroke={ink} strokeWidth={6} /><text y={-6} fontSize={40} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$35</text><text y={30} fontSize={16} fontWeight={800} fill="#ffe8e4" textAnchor="middle" fontFamily={sans}>overdraft fee</text></g>
        <text x={VW / 2} y={470} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a 1,000%+ penalty — for being broke</text>
      </svg>
    );
  } else if (m === "privatebanker") {
    // The concierge treatment for the wealthy client.
    const pop = spring({ frame, fps, delay: fps * 0.7, config: { damping: 11 } });
    const perks = ["waived fees", "best rates", "24/7 banker", "exclusive access"];
    const reveal = interpolate(frame, [fps * 1.0, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(260 280) scale(${Math.min(1, pop)})`}>
          <circle r={66} fill={gold} stroke={ink} strokeWidth={5} />
          <text y={-6} fontSize={30} textAnchor="middle" fontFamily={sans}>🤵</text>
          <text y={30} fontSize={15} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>your banker</text>
        </g>
        {perks.map((p, i) => {
          const op = interpolate(reveal, [i * 0.2, i * 0.2 + 0.25], [0, 1], clampBoth);
          return <g key={i} opacity={op} transform={`translate(560 ${160 + i * 76})`}><rect x={-10} y={-26} width={330} height={52} rx={10} fill="#cfe3d4" stroke={ink} strokeWidth={3} /><text x={155} y={8} fontSize={19} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>✓ {p}</text></g>;
        })}
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the bank now works for you</text>
      </svg>
    );
  } else if (m === "poorpaymore") {
    // The paradox: low balance = high cost; high balance = paid to bank.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    const x0 = 120, x1 = 860, y0 = 440, yTop = 120;
    const px = x0 + (x1 - x0) * draw;
    const curveY = (t: number) => y0 - (y0 - yTop) * Math.pow(1 - t, 2.4);
    art = (
      <svg width={VW} height={VH}>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <RLine x1={x0} y1={yTop} x2={x0} y2={y0} stroke={ink} strokeWidth={3} />
        <text x={70} y={yTop} fontSize={13} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>cost of</text>
        <text x={70} y={yTop + 16} fontSize={13} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>banking</text>
        <path d={`M${x0} ${curveY(0)} ${Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `L${x0 + (x1 - x0) * t} ${curveY(t)}`; }).join(" ")}`} fill="none" stroke={red} strokeWidth={6} />
        <text x={180} y={190} fontSize={16} fontWeight={900} fill={red} fontFamily={sans}>broke = you pay</text>
        <text x={640} y={420} fontSize={16} fontWeight={900} fill={green} fontFamily={sans}>rich = you get paid</text>
        <text x={x0 + 10} y={468} fontSize={14} fontWeight={800} fill={ink} fontFamily={sans}>$0</text>
        <text x={x1 - 40} y={468} fontSize={14} fontWeight={800} fill={ink} fontFamily={sans}>$10M+</text>
        <text x={VW / 2} y={66} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the less you have, the more you pay</text>
      </svg>
    );
  } else if (m === "familyoffice") {
    // A whole team orbiting one wealthy family.
    const reveal = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const team = ["investing", "taxes", "estate", "legal", "philanthropy"];
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 290)"><circle r={62} fill={gold} stroke={ink} strokeWidth={6} /><text y={-4} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>one</text><text y={20} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>family</text></g>
        {team.map((t, i) => {
          const a = (i / team.length) * 6.283 - 1.57;
          const op = interpolate(reveal, [i * 0.14, i * 0.14 + 0.2], [0, 1], clampBoth);
          const x = 490 + 240 * Math.cos(a), y = 290 + 165 * Math.sin(a);
          return <g key={i} opacity={op}><line x1={490} y1={290} x2={x} y2={y} stroke={theme.inkSoft} strokeWidth={2} strokeDasharray="5 5" /><g transform={`translate(${x} ${y})`}><rect x={-72} y={-24} width={144} height={48} rx={9} fill="#cfe3d4" stroke={ink} strokeWidth={3} /><text y={6} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{t}</text></g></g>;
        })}
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a private staff for one family's fortune</text>
      </svg>
    );
  } else if (m === "twentyfivex") {
    // Your number = annual spending × 25.
    const pop = spring({ frame, fps, delay: fps * 1.2, config: { damping: 9 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your retirement number</text>
        <g transform="translate(220 280)"><circle r={78} fill={blue} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>yearly</text><text y={16} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>spending</text><text y={42} fontSize={18} fontWeight={900} fill="#eaf0fa" textAnchor="middle" fontFamily={sans}>$50K</text></g>
        <text x={420} y={296} fontSize={50} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">× 25</text>
        <path d="M520 280 l70 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform={`translate(760 280) scale(${Math.min(1, pop)})`}><circle r={92} fill={green} stroke={ink} strokeWidth={6} /><text y={-6} fontSize={18} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>nest egg</text><text y={24} fontSize={26} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$1.25M</text></g>
        <text x={VW / 2} y={470} fontSize={20} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">spending, not income, sets the number</text>
      </svg>
    );
  } else if (m === "safewithdrawal") {
    // The 4% rule: draw 4% a year, growth refills it, it lasts.
    const yr = Math.floor(interpolate(frame, [fps * 0.5, fps * 2.6], [0, 5], clampBoth));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the 4% rule</text>
        <g transform="translate(300 300)">
          <circle r={96} fill={gold} stroke={ink} strokeWidth={6} />
          <text y={-6} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>nest egg</text>
          <text y={22} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>stays full</text>
        </g>
        <path d="M400 260 q120 -30 190 0" fill="none" stroke={green} strokeWidth={5} strokeDasharray="6 6" />
        <text x={500} y={226} fontSize={15} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>growth refills it</text>
        <path d="M400 340 l170 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={red} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(680 340)"><rect x={-70} y={-34} width={140} height={68} rx={8} fill={red} stroke={ink} strokeWidth={4} /><text y={-4} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>take 4%/yr</text><text y={20} fontSize={15} fontWeight={800} fill="#ffe8e4" textAnchor="middle" fontFamily={sans}>to live on</text></g>
        <text x={VW / 2} y={470} fontSize={18} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>draw 4% a year → it can last 30+ years · year {yr + 1}</text>
      </svg>
    );
  } else if (m === "earlycostmore") {
    // The younger you retire, the bigger the pile you need.
    const grow = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const bars: [string, number, string][] = [["retire 40", 300, red], ["retire 50", 230, "#d98b5f"], ["retire 55", 190, gold], ["retire 65", 140, green]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={66} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">retire younger, need a bigger pile</text>
        <RLine x1={90} y1={440} x2={VW - 60} y2={440} stroke={ink} strokeWidth={3} />
        {bars.map(([lab, h, col], i) => {
          const x = 150 + i * 190; const hh = (h as number) * grow;
          return <g key={i}><rect x={x} y={440 - hh} width={130} height={hh} fill={col as string} stroke={ink} strokeWidth={4} /><text x={x + 65} y={440 - hh - 12} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text><text x={x + 65} y={464} fontSize={14} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>{["~33×","~28×","~27×","~25×"][i]} spend</text></g>;
        })}
        <text x={VW / 2} y={498} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>more years to fund · no Social Security yet</text>
      </svg>
    );
  } else if (m === "bridgeyears") {
    // The self-funded gap before Social Security & Medicare.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const x0 = 120, x1 = 880;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">retire early = build a bridge</text>
        <RLine x1={x0} y1={300} x2={x1} y2={300} stroke={ink} strokeWidth={3} />
        {[["40", x0], ["62", 560], ["65", 700], ["90", x1]].map(([lab, x], i) => <g key={i}><line x1={x as number} y1={294} x2={x as number} y2={312} stroke={ink} strokeWidth={3} /><text x={x as number} y={338} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>age {lab}</text></g>)}
        <rect x={x0} y={250} width={(560 - x0) * draw} height={40} rx={6} fill={red} stroke={ink} strokeWidth={3} />
        <text x={(x0 + 560) / 2} y={236} fontSize={16} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>you fund 100% of this</text>
        <rect x={560} y={250} width={(x1 - 560) * interpolate(draw, [0.6, 1], [0, 1], clampBoth)} height={40} rx={6} fill={green} stroke={ink} strokeWidth={3} opacity={0.8} />
        <text x={(560 + x1) / 2} y={378} fontSize={15} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>Social Security + Medicare help</text>
        <text x={VW / 2} y={470} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>no SS till 62, no Medicare till 65 — the bridge is all you</text>
      </svg>
    );
  } else if (m === "sequencerisk") {
    // A crash early in retirement is far more dangerous than a late one.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">timing of a crash decides everything</text>
        <g>
          <text x={250} y={120} fontSize={16} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>crash EARLY</text>
          <RLine x1={120} y1={240} x2={380} y2={240} stroke={ink} strokeWidth={2} />
          <path d={`M120 180 Q160 320 ${120 + 260 * draw} ${Math.min(360, 180 + 260 * draw)}`} fill="none" stroke={red} strokeWidth={5} />
          <text x={250} y={300} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>runs out</text>
        </g>
        <g>
          <text x={720} y={120} fontSize={16} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>crash LATE</text>
          <RLine x1={600} y1={240} x2={860} y2={240} stroke={ink} strokeWidth={2} />
          <path d={`M600 230 Q720 120 ${600 + 260 * draw} ${230 - 70 * draw}`} fill="none" stroke={green} strokeWidth={5} />
          <text x={760} y={150} fontSize={15} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>survives</text>
        </g>
        <text x={VW / 2} y={470} fontSize={18} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>same crash, opposite outcome — this is sequence risk</text>
      </svg>
    );
  } else if (m === "longevityrisk") {
    // The money has to outlast you — and you might live to 95.
    const race = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your money has to outlast you</text>
        <RLine x1={120} y1={250} x2={880} y2={250} stroke={ink} strokeWidth={3} />
        {[["65", 120], ["80", 430], ["95", 740], ["100+", 860]].map(([lab, x], i) => <g key={i}><line x1={x as number} y1={244} x2={x as number} y2={262} stroke={ink} strokeWidth={3} /><text x={x as number} y={286} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>)}
        <rect x={120} y={200} width={620 * race} height={36} rx={6} fill={green} stroke={ink} strokeWidth={3} />
        <text x={120 + 620 * race} y={190} fontSize={14} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>your money</text>
        <text x={740} y={340} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>plan to ~95, not ~78</text>
        <text x={VW / 2} y={470} fontSize={18} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>running out at 85 is the real retirement nightmare</text>
      </svg>
    );
  } else if (m === "hundredamonth") {
    // $100/month dripping in and compounding into a big pile by 65.
    const drip = Math.floor(interpolate(frame, [fps * 0.3, fps * 2.6], [0, 6], clampBoth));
    const grow = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">just $100 a month</text>
        <g transform="translate(220 280)"><rect x={-60} y={-40} width={120} height={80} rx={10} fill={blue} stroke={ink} strokeWidth={5} /><text y={8} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$100</text></g>
        {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={320 + i * 60} cy={280} r={10} fill={gold} stroke={ink} strokeWidth={2} opacity={drip > i ? 1 : 0.12} />)}
        <g transform={`translate(760 ${300 - 20 * grow})`}><circle r={60 + 60 * grow} fill={green} stroke={ink} strokeWidth={6} /><text y={6} fontSize={16 + 10 * grow} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$$$</text></g>
        <text x={VW / 2} y={478} fontSize={20} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">quietly becomes a fortune by 65</text>
      </svg>
    );
  } else if (m === "startagebars") {
    // Ending balance at 65 by the age you start $100/mo.
    const grow = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const bars: [string, number, string][] = [["start 25", 300, green], ["start 35", 128, gold], ["start 45", 51, "#d98b5f"], ["start 55", 16, red]];
    const vals = ["$349K", "$149K", "$59K", "$18K"];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={62} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$100/mo → your balance at 65</text>
        <RLine x1={90} y1={440} x2={VW - 60} y2={440} stroke={ink} strokeWidth={3} />
        {bars.map(([lab, h, col], i) => {
          const x = 150 + i * 190; const hh = (h as number) * grow;
          return <g key={i}><rect x={x} y={440 - hh} width={130} height={hh} fill={col as string} stroke={ink} strokeWidth={4} /><text x={x + 65} y={440 - hh - 12} fontSize={19} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{vals[i]}</text><text x={x + 65} y={464} fontSize={16} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>{lab}</text></g>;
        })}
        <text x={VW / 2} y={498} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>same $100 — the start date changes everything</text>
      </svg>
    );
  } else if (m === "costofwaiting") {
    // Each decade you wait slashes the ending balance.
    const show = interpolate(frame, [fps * 0.5, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the price of waiting 10 years</text>
        <g transform="translate(290 290)"><circle r={88} fill={green} stroke={ink} strokeWidth={6} /><text y={-6} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>start at 25</text><text y={24} fontSize={26} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$349K</text></g>
        <g transform="translate(690 290)" opacity={interpolate(show, [0.4, 1], [0, 1], clampBoth)}><circle r={58} fill={gold} stroke={ink} strokeWidth={6} /><text y={-4} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>start at 35</text><text y={22} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$149K</text></g>
        <text x={VW / 2} y={470} fontSize={20} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">waiting one decade cost ~$200,000</text>
        <text x={VW / 2} y={500} fontSize={15} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>…for just $12,000 less invested</text>
      </svg>
    );
  } else if (m === "contribvsgrowth") {
    // Of the final pile, only a sliver was your money; the rest is growth.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const barX = 380, barW = 220, baseY = 440, fullH = 300;
    const contribH = fullH * (48 / 349);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$48K in → $349K out</text>
        <rect x={barX} y={baseY - contribH * grow} width={barW} height={contribH * grow} fill={blue} stroke={ink} strokeWidth={4} />
        <rect x={barX} y={baseY - fullH * grow} width={barW} height={(fullH - contribH) * grow} fill={green} stroke={ink} strokeWidth={4} />
        <text x={barX + barW + 20} y={baseY - contribH / 2} fontSize={18} fontWeight={800} fill={blue} fontFamily={sans} opacity={grow}>your $48K</text>
        <text x={barX + barW + 20} y={baseY - fullH + 60} fontSize={18} fontWeight={800} fill={green} fontFamily={sans} opacity={grow}>+$301K growth</text>
        <text x={VW / 2} y={492} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>compounding did 86% of the work</text>
      </svg>
    );
  } else if (m === "fivedollarday") {
    // A $5/day coffee reframed as a fortune by retirement.
    const pop = spring({ frame, fps, delay: fps * 1.3, config: { damping: 9 } });
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(230 290)"><circle r={66} fill={tan} stroke={ink} strokeWidth={5} /><text y={-8} fontSize={34} textAnchor="middle" fontFamily={sans}>☕</text><text y={28} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>$5 / day</text></g>
        <path d="M320 290 l80 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform={`translate(700 290) scale(${Math.min(1, pop)})`}><circle r={96} fill={green} stroke={ink} strokeWidth={6} /><text y={-6} fontSize={18} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>by 65</text><text y={26} fontSize={30} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$500K+</text></g>
        <text x={VW / 2} y={478} fontSize={20} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">invested instead of sipped, for 40 years</text>
      </svg>
    );
  } else if (m === "dcathroughcrashes") {
    // $100/mo keeps buying through crashes — more shares when cheap.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const pts: [number, number][] = [[120, 320], [250, 260], [370, 380], [500, 300], [620, 420], [760, 240], [880, 180]];
    const segs = pts.slice(1).map(([x, y], i) => { const [px, py] = pts[i]; const t = interpolate(draw, [i / 6, (i + 1) / 6], [0, 1], clampBoth); return `L${px + (x - px) * t} ${py + (y - py) * t}`; });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={66} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">keep buying — especially when it's cheap</text>
        <RLine x1={100} y1={450} x2={VW - 60} y2={450} stroke={ink} strokeWidth={3} />
        <path d={`M120 320 ${segs.join(" ")}`} fill="none" stroke={blue} strokeWidth={5} />
        {pts.map(([x, y], i) => { const on = draw > i / 6; const cheap = y > 340; return <g key={i} opacity={on ? 1 : 0}><circle cx={x} cy={y} r={cheap ? 15 : 9} fill={cheap ? green : gold} stroke={ink} strokeWidth={3} /><text x={x} y={y - (cheap ? 24 : 18)} fontSize={12} fontWeight={800} fill={cheap ? green : theme.inkSoft} textAnchor="middle" fontFamily={sans}>{cheap ? "more!" : "buy"}</text></g>; })}
        <text x={VW / 2} y={492} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>crashes become discounts — dollar-cost averaging</text>
      </svg>
    );
  } else if (m === "longclimb") {
    // $1,000 in 1950 → millions by 2024, with crash dips along the way.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.8], [0, 1], clampBoth);
    const pts: [number, number][] = [[120, 440], [250, 400], [360, 350], [430, 410], [520, 300], [600, 360], [690, 230], [760, 320], [840, 150], [900, 110]];
    const segs = pts.slice(1).map(([x, y], i) => { const [px, py] = pts[i]; const t = interpolate(draw, [i / (pts.length - 1), (i + 1) / (pts.length - 1)], [0, 1], clampBoth); return `L${px + (x - px) * t} ${py + (y - py) * t}`; });
    const amt = Math.round(1 + 2999 * Math.pow(draw, 2));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={60} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$1,000 in 1950 → today</text>
        <RLine x1={110} y1={460} x2={VW - 50} y2={460} stroke={ink} strokeWidth={3} />
        <path d={`M120 440 ${segs.join(" ")}`} fill="none" stroke={green} strokeWidth={5} strokeLinecap="round" />
        <text x={130} y={436} fontSize={15} fontWeight={800} fill={ink} fontFamily={sans}>$1K</text>
        <g transform="translate(900 110)"><circle r={8} fill={green} stroke={ink} strokeWidth={3} /></g>
        <text x={VW / 2} y={430} fontSize={30} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">${amt >= 3000 ? "3,000,000" : (amt * 1000).toLocaleString("en-US")}</text>
        <text x={VW / 2} y={496} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>…if you survived every crash on the way up</text>
      </svg>
    );
  } else if (m === "dividendsnowball") {
    // Price-only vs dividends-reinvested — dividends did most of the work.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const priceH = 300 * (400 / 3000), totalH = 300;
    const baseY = 440;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">dividends did most of the work</text>
        <g transform="translate(300 0)"><rect x={-70} y={baseY - priceH * grow} width={140} height={priceH * grow} fill={blue} stroke={ink} strokeWidth={4} /><text x={0} y={baseY + 26} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>price only</text><text x={0} y={baseY - priceH * grow - 12} fontSize={17} fontWeight={900} fill={blue} textAnchor="middle" fontFamily="Georgia, serif">~$400K</text></g>
        <g transform="translate(640 0)"><rect x={-70} y={baseY - totalH * grow} width={140} height={totalH * grow} fill={green} stroke={ink} strokeWidth={4} /><text x={0} y={baseY + 26} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>dividends reinvested</text><text x={0} y={baseY - totalH * grow - 12} fontSize={17} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">~$3M</text></g>
        <RLine x1={110} y1={baseY} x2={VW - 60} y2={baseY} stroke={ink} strokeWidth={3} />
        <text x={VW / 2} y={496} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>reinvesting dividends was ~7× the difference</text>
      </svg>
    );
  } else if (m === "crashgauntlet") {
    // The series of crashes the $1,000 had to survive.
    const crashes: [string, string][] = [["1973", "−48%"], ["1987", "−22%"], ["2000", "−49%"], ["2008", "−57%"], ["2020", "−34%"]];
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the gauntlet you had to survive</text>
        {crashes.map(([yr, pct], i) => {
          const op = interpolate(reveal, [i * 0.17, i * 0.17 + 0.22], [0, 1], clampBoth);
          const x = 150 + i * 170;
          return <g key={i} opacity={op}><circle cx={x} cy={270} r={52} fill={red} stroke={ink} strokeWidth={4} /><text x={x} y={262} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{yr}</text><text x={x} y={286} fontSize={16} fontWeight={900} fill="#ffe8e4" textAnchor="middle" fontFamily={sans}>{pct}</text><text x={x} y={350} fontSize={13} fontWeight={700} fill={green} textAnchor="middle" fontFamily={sans}>recovered</text></g>;
        })}
        <text x={VW / 2} y={430} fontSize={18} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>every one felt like the end of the world</text>
        <text x={VW / 2} y={462} fontSize={18} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">every one was a buying opportunity</text>
      </svg>
    );
  } else if (m === "panicvshold") {
    // Panic-seller locks in the loss; holder recovers and soars.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={60} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the crash: two choices</text>
        <RLine x1={110} y1={300} x2={VW - 60} y2={300} stroke={ink} strokeWidth={2} />
        <path d="M120 240 Q200 420 280 420" fill="none" stroke={ink} strokeWidth={4} />
        <circle cx={280} cy={420} r={10} fill={red} stroke={ink} strokeWidth={3} />
        <text x={300} y={426} fontSize={16} fontWeight={900} fill={red} fontFamily={sans}>PANIC: sells at the bottom, loss locked in</text>
        <path d={`M120 240 Q200 420 ${120 + 740 * draw} ${draw < 0.5 ? 420 - (draw - 0.3) * 0 : interpolate(draw, [0.5, 1], [400, 130], clampBoth)}`} fill="none" stroke={green} strokeWidth={5} opacity={interpolate(draw, [0.45, 0.6], [0, 1], clampBoth)} />
        <text x={620} y={150} fontSize={16} fontWeight={900} fill={green} fontFamily={sans}>HOLD: rides it back up, soars higher</text>
        <text x={VW / 2} y={492} fontSize={18} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the loss was only real for the one who sold</text>
      </svg>
    );
  } else if (m === "realvsnominal") {
    // $3M nominal vs ~$250K in 1950 purchasing power — both still huge.
    const pop = spring({ frame, fps, delay: fps * 1.0, config: { damping: 10 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">but inflation takes a bite</text>
        <g transform="translate(300 290)"><circle r={96} fill={green} stroke={ink} strokeWidth={6} /><text y={-10} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>on paper</text><text y={20} fontSize={30} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$3M</text></g>
        <path d="M410 290 l80 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform={`translate(700 290) scale(${Math.min(1, pop)})`}><circle r={70} fill={gold} stroke={ink} strokeWidth={5} /><text y={-8} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>in 1950 money</text><text y={20} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">~$250K</text></g>
        <text x={VW / 2} y={468} fontSize={18} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>still a ~250× REAL gain — it crushed inflation</text>
      </svg>
    );
  } else if (m === "missedbestdays") {
    // Missing the handful of best days guts the return.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    const bars: [string, number, string][] = [["stayed fully invested", 300, green], ["missed 10 best days", 150, gold], ["missed 30 best days", 60, red]];
    const vals = ["$3M", "$1.1M", "$250K"];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">miss a few days, lose a fortune</text>
        <RLine x1={90} y1={440} x2={VW - 60} y2={440} stroke={ink} strokeWidth={3} />
        {bars.map(([lab, h, col], i) => { const x = 160 + i * 250; const hh = (h as number) * grow; return <g key={i}><rect x={x} y={440 - hh} width={160} height={hh} fill={col as string} stroke={ink} strokeWidth={4} /><text x={x + 80} y={440 - hh - 12} fontSize={19} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{vals[i]}</text><text x={x + 80} y={462} fontSize={13} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>{lab as string}</text></g>; })}
        <text x={VW / 2} y={496} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>and the best days cluster right after the crashes</text>
      </svg>
    );
  } else if (m === "salaryladder") {
    // The salary tiers and what each roughly means.
    const tiers: [string, string][] = [["$30K", "survival"], ["$50K", "getting by"], ["$75K", "comfortable"], ["$100K", "the 'rich' mirage"], ["$250K", "genuinely rich"], ["$1M", "a different game"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => {
          const w = 150 + i * 128;
          const y = 90 + i * 66;
          const op = interpolate(climb, [i * 0.13, i * 0.13 + 0.2], [0, 1], clampBoth);
          return <g key={i} opacity={op}><rect x={VW / 2 - w / 2} y={y} width={w} height={54} rx={7} fill={[parch, "#e8d7bf", "#cfe3d4", gold, green, "#bfa0d8"][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 40} y={y + 34} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><text x={VW / 2 + 55} y={y + 33} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>;
        })}
        <text x={VW / 2} y={470} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>each rung buys less extra than the last</text>
      </svg>
    );
  } else if (m === "grossnetshrink") {
    // Gross salary shrinks to take-home after taxes.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    const rows: [string, string, number][] = [["$50K", "$42K", 0.84], ["$100K", "$75K", 0.75], ["$250K", "$168K", 0.67], ["$1M", "$600K", 0.60]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the headline salary is a lie</text>
        {rows.map(([gross, net, frac], i) => {
          const y = 130 + i * 86;
          const fullW = 520;
          return <g key={i}><text x={120} y={y + 28} fontSize={18} fontWeight={900} fill={ink} fontFamily="Georgia, serif">{gross}</text><rect x={250} y={y} width={fullW} height={44} rx={6} fill="#efe9da" stroke={ink} strokeWidth={3} /><rect x={250} y={y} width={fullW * (frac as number) * grow} height={44} rx={6} fill={green} stroke={ink} strokeWidth={3} /><text x={250 + fullW * (frac as number) * grow + 46} y={y + 29} fontSize={16} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans} opacity={grow}>{net}</text></g>;
        })}
        <text x={VW / 2} y={476} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the higher you earn, the bigger the bite</text>
      </svg>
    );
  } else if (m === "happinessplateau") {
    // Happiness rises fast with income, then flattens.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, y0 = 440, yTop = 150;
    const f = (t: number) => y0 - (y0 - yTop) * (1 - Math.exp(-3.2 * t));
    const segs = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${f(t)}`; });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">money buys happiness — then it plateaus</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <RLine x1={x0} y1={yTop} x2={x0} y2={y0} stroke={ink} strokeWidth={3} />
        <text x={70} y={yTop + 10} fontSize={13} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>happy</text>
        <path d={segs.join(" ")} fill="none" stroke={green} strokeWidth={6} />
        <line x1={430} y1={yTop} x2={430} y2={y0} stroke={red} strokeWidth={2} strokeDasharray="6 6" />
        <text x={430} y={y0 + 26} fontSize={14} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>~$75-100K</text>
        <text x={700} y={y0 + 26} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>$1M+</text>
        <text x={690} y={200} fontSize={15} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>barely rises here</text>
      </svg>
    );
  } else if (m === "bracketladder") {
    // Marginal brackets: only the top slice of income is taxed higher.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    const slabs: [string, string, number, string][] = [["first $11K", "10%", 60, parch], ["up to $48K", "12%", 120, "#e8d7bf"], ["up to $100K", "22%", 90, gold], ["up to $192K", "24%", 70, "#d98b5f"], ["above that", "32%+", 50, red]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">only your TOP dollars hit the top rate</text>
        {slabs.map(([lab, rate, w, col], i) => {
          const y = 120 + i * 64;
          return <g key={i} opacity={interpolate(grow, [i * 0.14, i * 0.14 + 0.2], [0, 1], clampBoth)}><rect x={200} y={y} width={(w as number) * 3.4} height={50} rx={5} fill={col as string} stroke={ink} strokeWidth={3} /><text x={210} y={y + 31} fontSize={16} fontWeight={800} fill={ink} fontFamily={sans}>{lab}</text><text x={210 + (w as number) * 3.4 + 40} y={y + 31} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{rate}</text></g>;
        })}
        <text x={VW / 2} y={476} fontSize={16} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>a raise never drops your whole take-home</text>
      </svg>
    );
  } else if (m === "raiseeaten") {
    // A raise comes in; lifestyle balloon inflates to eat it.
    const raise = interpolate(frame, [fps * 0.4, fps * 1.4], [0, 1], clampBoth);
    const balloon = interpolate(frame, [fps * 1.4, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the raise that vanished</text>
        <g transform="translate(220 290)" opacity={raise}><rect x={-70} y={-40} width={140} height={80} rx={8} fill={green} stroke={ink} strokeWidth={4} /><text y={6} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>+$20K raise</text></g>
        <path d="M310 290 l80 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" opacity={interpolate(balloon, [0, 0.3], [0, 1], clampBoth)} />
        <g transform={`translate(680 290) scale(${0.5 + 0.7 * balloon})`}><circle r={70} fill={red} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>nicer car,</text><text y={16} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>bigger rent</text></g>
        <text x={VW / 2} y={476} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">lifestyle inflates to swallow it whole</text>
      </svg>
    );
  } else if (m === "samesalarydifferentlife") {
    // $100K buys a wildly different life depending on cost of living.
    const pop = spring({ frame, fps, delay: fps * 0.8, config: { damping: 11 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$100K — two completely different lives</text>
        <g transform={`translate(280 300) scale(${Math.min(1, pop)})`}><rect x={-130} y={-110} width={260} height={220} rx={14} fill="#cfe3d4" stroke={ink} strokeWidth={5} /><text y={-60} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">low-cost town</text><text y={-10} fontSize={34} textAnchor="middle" fontFamily={sans}>🏡</text><text y={44} fontSize={16} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>house, savings,</text><text y={68} fontSize={16} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>feels rich</text></g>
        <g transform={`translate(700 300) scale(${Math.min(1, pop)})`}><rect x={-130} y={-110} width={260} height={220} rx={14} fill={parch} stroke={ink} strokeWidth={5} /><text y={-60} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">big city</text><text y={-10} fontSize={34} textAnchor="middle" fontFamily={sans}>🏙️</text><text y={44} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>tiny rental,</text><text y={68} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>paycheck to paycheck</text></g>
      </svg>
    );
  } else if (m === "rule2836") {
    // The 28/36 rule as two slices of your income.
    const grow = interpolate(frame, [fps * 0.4, fps * 1.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the 28 / 36 rule</text>
        <text x={VW / 2} y={110} fontSize={18} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>of your gross monthly income…</text>
        <g transform="translate(290 300)"><circle r={100} fill="#efe9da" stroke={ink} strokeWidth={5} /><path d={`M0 0 L0 -100 A100 100 0 ${0.28 * grow > 0.5 ? 1 : 0} 1 ${100 * Math.sin(2 * Math.PI * 0.28 * grow)} ${-100 * Math.cos(2 * Math.PI * 0.28 * grow)} Z`} fill={green} stroke={ink} strokeWidth={4} /><text y={130} fontSize={18} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">≤ 28% housing</text></g>
        <g transform="translate(690 300)"><circle r={100} fill="#efe9da" stroke={ink} strokeWidth={5} /><path d={`M0 0 L0 -100 A100 100 0 ${0.36 * grow > 0.5 ? 1 : 0} 1 ${100 * Math.sin(2 * Math.PI * 0.36 * grow)} ${-100 * Math.cos(2 * Math.PI * 0.36 * grow)} Z`} fill={gold} stroke={ink} strokeWidth={4} /><text y={130} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">≤ 36% all debt</text></g>
      </svg>
    );
  } else if (m === "salarytohouse") {
    // Salary → the house price it can actually afford.
    const grow = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const rows: [string, string, number][] = [["$40K", "~$135K", 110], ["$60K", "~$205K", 170], ["$100K", "~$340K", 280], ["$200K", "~$680K", 420]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={66} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">salary → the house it really buys</text>
        {rows.map(([sal, price, w], i) => {
          const y = 130 + i * 86;
          return <g key={i} opacity={interpolate(grow, [i * 0.16, i * 0.16 + 0.2], [0, 1], clampBoth)}><text x={140} y={y + 34} fontSize={20} fontWeight={900} fill={ink} fontFamily="Georgia, serif">{sal}</text><rect x={240} y={y} width={(w as number) * grow} height={54} rx={7} fill={[parch, "#cfe3d4", gold, green][i]} stroke={ink} strokeWidth={4} /><text x={240 + (w as number) * grow + 60} y={y + 34} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{price}</text></g>;
        })}
        <text x={VW / 2} y={480} fontSize={15} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>~3.5× income, at a 7% rate, 20% down</text>
      </svg>
    );
  } else if (m === "ratekillsaffordability") {
    // Same salary, higher rate → much less house.
    const grow = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const bars: [string, number, string][] = [["3%", 300, green], ["5%", 240, gold], ["7%", 190, "#d98b5f"], ["9%", 150, red]];
    const vals = ["$400K", "$320K", "$255K", "$200K"];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">same $100K salary — the rate decides</text>
        <RLine x1={90} y1={440} x2={VW - 60} y2={440} stroke={ink} strokeWidth={3} />
        {bars.map(([lab, h, col], i) => { const x = 150 + i * 190; const hh = (h as number) * grow; return <g key={i}><rect x={x} y={440 - hh} width={130} height={hh} fill={col as string} stroke={ink} strokeWidth={4} /><text x={x + 65} y={440 - hh - 12} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{vals[i]}</text><text x={x + 65} y={464} fontSize={16} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>{lab} rate</text></g>; })}
        <text x={VW / 2} y={496} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>higher rates quietly shrink the house in half</text>
      </svg>
    );
  } else if (m === "truehousecost") {
    // The iceberg: the mortgage is only the tip.
    const reveal = interpolate(frame, [fps * 0.5, fps * 2.2], [0, 1], clampBoth);
    const below = ["property tax", "insurance", "maintenance ~1%/yr", "HOA + utilities"];
    art = (
      <svg width={VW} height={VH}>
        <line x1={80} y1={200} x2={VW - 80} y2={200} stroke={blue} strokeWidth={3} strokeDasharray="8 6" />
        <g transform="translate(490 150)"><path d="M-80 50 L0 -60 L80 50 Z" fill="#dbeffb" stroke={ink} strokeWidth={4} /><text y={30} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>mortgage</text></g>
        <path d="M-180 50 L180 50 L150 320 L-150 320 Z" transform="translate(490 150)" fill="#8fb8cf" stroke={ink} strokeWidth={4} opacity={reveal} />
        {below.map((t, i) => <text key={i} x={490} y={260 + i * 44} fontSize={18} fontWeight={800} fill="#14303f" textAnchor="middle" fontFamily={sans} opacity={interpolate(reveal, [i * 0.18, i * 0.18 + 0.25], [0, 1], clampBoth)}>{t}</text>)}
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the mortgage is only the tip</text>
      </svg>
    );
  } else if (m === "downpaymentpmi") {
    // 20% down avoids PMI; less triggers the penalty.
    const t = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the 20% down line</text>
        <g transform="translate(290 290)" opacity={t}><circle r={92} fill={green} stroke={ink} strokeWidth={6} /><text y={-10} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">20%+ down</text><text y={20} fontSize={15} fontWeight={800} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>no PMI,</text><text y={42} fontSize={15} fontWeight={800} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>lower payment</text></g>
        <g transform="translate(690 290)" opacity={interpolate(t, [0.4, 1], [0, 1], clampBoth)}><circle r={92} fill={red} stroke={ink} strokeWidth={6} /><text y={-10} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">under 20%</text><text y={20} fontSize={15} fontWeight={800} fill="#ffe8e4" textAnchor="middle" fontFamily={sans}>pay PMI —</text><text y={42} fontSize={15} fontWeight={800} fill="#ffe8e4" textAnchor="middle" fontFamily={sans}>a monthly penalty</text></g>
        <text x={VW / 2} y={470} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>under 20%, you rent your risk from an insurer</text>
      </svg>
    );
  } else if (m === "housepoor") {
    // Approved for the max → the house eats everything.
    const eat = interpolate(frame, [fps * 0.5, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">approved ≠ affordable</text>
        <g transform="translate(490 300)">
          <path d="M-150 40 L0 -110 L150 40 Z" fill={red} stroke={ink} strokeWidth={5} />
          <rect x={-110} y={40} width={220} height={120} fill={red} stroke={ink} strokeWidth={5} />
          <text y={110} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">the house</text>
        </g>
        {["savings", "travel", "freedom", "fun"].map((t, i) => { const a = (i / 4) * 6.283; const op = 1 - interpolate(eat, [i * 0.18, i * 0.18 + 0.3], [0, 1], clampBoth); return <text key={i} x={200 + (i % 2) * 580} y={200 + Math.floor(i / 2) * 200} fontSize={18} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans} opacity={op}>{t} ✗</text>; })}
        <text x={VW / 2} y={492} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>max out the house, and it devours the rest of your life</text>
      </svg>
    );
  } else if (m === "debtladder") {
    // The levels of personal debt by type and amount.
    const tiers: [string, string][] = [["$0", "debt-free"], ["$6K", "credit cards"], ["$30K", "car loan"], ["$40K", "student loans"], ["$300K", "mortgage"], ["$1M+", "leverage… or ruin"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => {
          const w = 150 + i * 128; const y = 90 + i * 66;
          const op = interpolate(climb, [i * 0.13, i * 0.13 + 0.2], [0, 1], clampBoth);
          return <g key={i} opacity={op}><rect x={VW / 2 - w / 2} y={y} width={w} height={54} rx={7} fill={[green, "#e8d7bf", gold, "#cfe3d4", "#d98b5f", red][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 45} y={y + 34} fontSize={19} fontWeight={900} fill={i === 0 ? "#fff" : ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><text x={VW / 2 + 55} y={y + 33} fontSize={14} fontWeight={800} fill={i === 0 ? "#fff" : ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>;
        })}
        <text x={VW / 2} y={470} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>it's not the amount — it's the type</text>
      </svg>
    );
  } else if (m === "rateladder") {
    // The interest-rate spectrum, cheap to predatory.
    const grow = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const rows: [string, string, number, string][] = [["mortgage", "~7%", 70, green], ["student", "~6%", 60, "#cfe3d4"], ["car loan", "~9%", 90, gold], ["credit card", "~24%", 240, red], ["payday loan", "~400%", 520, "#7a1f16"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={62} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the real cost of each debt</text>
        {rows.map(([lab, rate, w, col], i) => {
          const y = 100 + i * 74;
          return <g key={i} opacity={interpolate(grow, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><text x={230} y={y + 30} fontSize={17} fontWeight={800} fill={ink} textAnchor="end" fontFamily={sans}>{lab}</text><rect x={250} y={y + 6} width={Math.min(560, (w as number)) * grow} height={40} rx={6} fill={col as string} stroke={ink} strokeWidth={3} /><text x={250 + Math.min(560, (w as number)) * grow + 42} y={y + 32} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{rate}</text></g>;
        })}
      </svg>
    );
  } else if (m === "goodbaddebt") {
    // Good debt buys growing assets; bad debt buys shrinking junk.
    const t = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(290 290)">
          <circle r={92} fill={green} stroke={ink} strokeWidth={6} /><text y={-30} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">GOOD debt</text><text y={2} fontSize={15} fontWeight={800} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>buys assets</text><text y={24} fontSize={15} fontWeight={800} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>that GROW</text>
          <path d={`M-10 50 l0 ${30 * t}`} stroke="#eafaf0" strokeWidth={3} /><text y={100} fontSize={22} fill="#eafaf0" textAnchor="middle" opacity={t}>↑</text>
        </g>
        <g transform="translate(690 290)">
          <circle r={92} fill={red} stroke={ink} strokeWidth={6} /><text y={-30} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">BAD debt</text><text y={2} fontSize={15} fontWeight={800} fill="#ffe8e4" textAnchor="middle" fontFamily={sans}>buys junk</text><text y={24} fontSize={15} fontWeight={800} fill="#ffe8e4" textAnchor="middle" fontFamily={sans}>that SHRINKS</text>
          <text y={110} fontSize={22} fill="#ffe8e4" textAnchor="middle" opacity={t}>↓</text>
        </g>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one builds you up, one eats you alive</text>
      </svg>
    );
  } else if (m === "avalanchesnowball") {
    // Two payoff strategies side by side.
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">two ways to dig out</text>
        <g transform="translate(270 0)">
          <text x={0} y={120} fontSize={20} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">Avalanche</text>
          <text x={0} y={150} fontSize={14} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>highest rate first</text>
          {[["payday 400%", red], ["card 24%", "#d98b5f"], ["car 9%", gold], ["student 6%", green]].map(([l, c], i) => <g key={i}><rect x={-120} y={180 + i * 58} width={240} height={46} rx={6} fill={c as string} stroke={ink} strokeWidth={3} opacity={interpolate(frame, [fps * (0.4 + i * 0.3), fps * (0.8 + i * 0.3)], [1, 0.25], clampBoth)} /><text x={0} y={180 + i * 58 + 29} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{l as string}</text></g>)}
          <text x={0} y={470} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>saves the most money</text>
        </g>
        <g transform="translate(710 0)">
          <text x={0} y={120} fontSize={20} fontWeight={900} fill={blue} textAnchor="middle" fontFamily="Georgia, serif">Snowball</text>
          <text x={0} y={150} fontSize={14} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>smallest balance first</text>
          {[["$500", green], ["$2K", gold], ["$8K", "#d98b5f"], ["$20K", red]].map(([l, c], i) => <g key={i}><rect x={-120} y={180 + i * 58} width={240} height={46} rx={6} fill={c as string} stroke={ink} strokeWidth={3} opacity={interpolate(frame, [fps * (0.4 + i * 0.3), fps * (0.8 + i * 0.3)], [1, 0.25], clampBoth)} /><text x={0} y={180 + i * 58 + 29} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{l as string}</text></g>)}
          <text x={0} y={470} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>feels the most motivating</text>
        </g>
      </svg>
    );
  } else if (m === "debtfreedom") {
    // The weight of debt lifting off at $0.
    const lift = interpolate(frame, [fps * 0.8, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <g transform={`translate(490 ${330 - 120 * lift})`}>
          <circle cx={0} cy={-40} r={30} fill={parch} stroke={ink} strokeWidth={5} />
          <path d="M0 -10 L0 60 M0 10 L-34 40 M0 10 L34 40 M0 60 L-26 110 M0 60 L26 110" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
          {lift > 0.5 && <text x={0} y={-70} fontSize={26} fill={gold} textAnchor="middle">✦</text>}
        </g>
        <g transform={`translate(490 440)`} opacity={1 - lift}><rect x={-70} y={-30} width={140} height={56} rx={8} fill={ink} /><text y={8} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>DEBT</text></g>
        <text x={VW / 2} y={492} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$0 debt is a weight lifting off your chest</text>
      </svg>
    );
  } else if (m === "underwaterdebt") {
    // Owing more than the thing is worth.
    const sink = interpolate(frame, [fps * 0.5, fps * 2.2], [0, 1], clampBoth);
    const waterY = 230;
    art = (
      <svg width={VW} height={VH}>
        <rect x={0} y={waterY} width={VW} height={VH - waterY} fill="#bfe0ee" opacity={0.55} />
        <line x1={0} y1={waterY} x2={VW} y2={waterY} stroke={blue} strokeWidth={3} />
        <text x={150} y={waterY - 14} fontSize={16} fontWeight={800} fill={blue} fontFamily={sans}>what it's worth</text>
        <g transform={`translate(490 ${270 + 150 * sink})`}>
          <rect x={-90} y={-50} width={180} height={100} rx={10} fill={gold} stroke={ink} strokeWidth={5} />
          <text y={-6} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>$40K car</text>
          <text y={22} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>$30K still owed</text>
        </g>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">'underwater': you owe more than it's worth</text>
      </svg>
    );
  } else if (m === "stateheatmap") {
    // Stylized cheap-vs-expensive states.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const cheap: [string, string][] = [["Mississippi", "85"], ["Arkansas", "87"], ["Oklahoma", "87"], ["Kansas", "88"]];
    const pricey: [string, string][] = [["Hawaii", "190"], ["California", "140"], ["Massachusetts", "135"], ["New York", "125"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={270} y={90} fontSize={20} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">cheapest</text>
        <text x={720} y={90} fontSize={20} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">priciest</text>
        {cheap.map(([st, idx], i) => <g key={i} opacity={interpolate(reveal, [i * 0.12, i * 0.12 + 0.2], [0, 1], clampBoth)}><rect x={120} y={120 + i * 72} width={300} height={56} rx={8} fill="#cfe3d4" stroke={ink} strokeWidth={3} /><text x={140} y={155 + i * 72} fontSize={18} fontWeight={800} fill={ink} fontFamily={sans}>{st}</text><text x={400} y={155 + i * 72} fontSize={18} fontWeight={900} fill={green} textAnchor="end" fontFamily="Georgia, serif">{idx}</text></g>)}
        {pricey.map(([st, idx], i) => <g key={i} opacity={interpolate(reveal, [i * 0.12 + 0.2, i * 0.12 + 0.4], [0, 1], clampBoth)}><rect x={560} y={120 + i * 72} width={300} height={56} rx={8} fill="#f3cfc8" stroke={ink} strokeWidth={3} /><text x={580} y={155 + i * 72} fontSize={18} fontWeight={800} fill={ink} fontFamily={sans}>{st}</text><text x={840} y={155 + i * 72} fontSize={18} fontWeight={900} fill={red} textAnchor="end" fontFamily="Georgia, serif">{idx}</text></g>)}
        <text x={VW / 2} y={476} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>cost-of-living index — 100 = US average</text>
      </svg>
    );
  } else if (m === "colindex100") {
    // The index number line, 100 = average.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const x0 = 120, x1 = 880;
    const pts: [string, number][] = [["MS 85", 85], ["US 100", 100], ["CA 140", 140], ["HI 190", 190]];
    const xfor = (v: number) => x0 + (x1 - x0) * ((v - 80) / 120);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={90} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the cost-of-living scale</text>
        <RLine x1={x0} y1={280} x2={x1} y2={280} stroke={ink} strokeWidth={4} />
        <line x1={xfor(100)} y1={240} x2={xfor(100)} y2={320} stroke={blue} strokeWidth={3} strokeDasharray="6 6" />
        {pts.map(([lab, v], i) => <g key={i} opacity={interpolate(draw, [i * 0.18, i * 0.18 + 0.2], [0, 1], clampBoth)}><circle cx={xfor(v)} cy={280} r={11} fill={v < 100 ? green : v < 130 ? gold : red} stroke={ink} strokeWidth={4} /><text x={xfor(v)} y={250} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{lab}</text></g>)}
        <text x={VW / 2} y={360} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>Hawaii costs more than double Mississippi</text>
      </svg>
    );
  } else if (m === "samesalarystates") {
    // Same salary, different real life by state.
    const pop = spring({ frame, fps, delay: fps * 0.8, config: { damping: 11 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a $60K salary — two different lives</text>
        <g transform={`translate(280 300) scale(${Math.min(1, pop)})`}><rect x={-130} y={-110} width={260} height={220} rx={14} fill="#cfe3d4" stroke={ink} strokeWidth={5} /><text y={-62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">Mississippi</text><text y={-12} fontSize={34} textAnchor="middle" fontFamily={sans}>🏡</text><text y={44} fontSize={16} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>feels like $70K</text><text y={68} fontSize={15} fontWeight={700} fill={ink} textAnchor="middle" fontFamily={sans}>house + savings</text></g>
        <g transform={`translate(700 300) scale(${Math.min(1, pop)})`}><rect x={-130} y={-110} width={260} height={220} rx={14} fill="#f3cfc8" stroke={ink} strokeWidth={5} /><text y={-62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">California</text><text y={-12} fontSize={34} textAnchor="middle" fontFamily={sans}>🏙️</text><text y={44} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>feels like $43K</text><text y={68} fontSize={15} fontWeight={700} fill={ink} textAnchor="middle" fontFamily={sans}>tiny rental</text></g>
      </svg>
    );
  } else if (m === "housingdriver") {
    // Housing swings far more than other costs.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    const rows: [string, number][] = [["housing", 460], ["groceries", 90], ["gas", 70], ["utilities", 80]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">housing is the whole story</text>
        {rows.map(([lab, w], i) => { const y = 120 + i * 80; return <g key={i}><text x={230} y={y + 30} fontSize={18} fontWeight={800} fill={ink} textAnchor="end" fontFamily={sans}>{lab}</text><rect x={250} y={y + 4} width={(w as number) * grow} height={42} rx={6} fill={i === 0 ? red : gold} stroke={ink} strokeWidth={3} /></g>; })}
        <text x={VW / 2} y={476} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>rent & home prices swing wildly; a gallon of milk barely moves</text>
      </svg>
    );
  } else if (m === "notaxstates") {
    // The no-income-tax states (but they claw it back).
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.0], [0, 1], clampBoth);
    const states = ["Texas", "Florida", "Washington", "Nevada", "Tennessee"];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">states with no income tax</text>
        {states.map((s, i) => { const op = interpolate(reveal, [i * 0.14, i * 0.14 + 0.2], [0, 1], clampBoth); const x = 170 + (i % 3) * 300; const y = 160 + Math.floor(i / 3) * 110; return <g key={i} opacity={op} transform={`translate(${x} ${y})`}><rect x={-120} y={-34} width={240} height={68} rx={10} fill={green} stroke={ink} strokeWidth={4} /><text y={8} fontSize={19} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>{s}</text></g>; })}
        <text x={VW / 2} y={430} fontSize={18} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>…but they claw it back via property & sales tax</text>
      </svg>
    );
  } else if (m === "realwealthformula") {
    // Real wealth = salary ÷ cost of living.
    const pop = spring({ frame, fps, delay: fps * 1.0, config: { damping: 10 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={120} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your REAL wealth</text>
        <g transform="translate(300 290)"><rect x={-130} y={-40} width={260} height={80} rx={10} fill={green} stroke={ink} strokeWidth={5} /><text y={8} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>your salary</text></g>
        <line x1={170} y1={350} x2={430} y2={350} stroke={ink} strokeWidth={4} />
        <g transform="translate(300 400)"><text y={8} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>cost of living</text></g>
        <text x={520} y={360} fontSize={44} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">=</text>
        <g transform={`translate(720 350) scale(${Math.min(1, pop)})`}><circle r={78} fill={gold} stroke={ink} strokeWidth={6} /><text y={-6} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>what you're</text><text y={18} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">really worth</text></g>
      </svg>
    );
  } else if (m === "richtiers") {
    // The tiers of rich with thresholds.
    const tiers: [string, string][] = [["$1M", "Comfortable"], ["$5M", "Wealthy"], ["$30M", "Rich (UHNWI)"], ["$100M", "Ultra-Rich"], ["$1B+", "A different planet"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => {
          const w = 180 + i * 150; const y = 110 + i * 74;
          const op = interpolate(climb, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth);
          return <g key={i} opacity={op}><rect x={VW / 2 - w / 2} y={y} width={w} height={58} rx={8} fill={["#cfe3d4", green, gold, "#d98b5f", "#bfa0d8"][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 55} y={y + 37} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><text x={VW / 2 + 60} y={y + 36} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>;
        })}
        <text x={VW / 2} y={62} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the levels of rich</text>
      </svg>
    );
  } else if (m === "howmoneyheld") {
    // Where the money actually sits at each level.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const rows: [string, string, string][] = [["Comfortable", "a paycheck + a nest egg", "#cfe3d4"], ["Wealthy", "investments & property", green], ["Rich", "businesses they own", gold], ["Ultra-Rich", "influence & whole industries", "#bfa0d8"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">where the money actually sits</text>
        {rows.map(([lvl, what, col], i) => {
          const y = 110 + i * 86;
          return <g key={i} opacity={interpolate(reveal, [i * 0.18, i * 0.18 + 0.25], [0, 1], clampBoth)}><rect x={120} y={y} width={220} height={60} rx={8} fill={col as string} stroke={ink} strokeWidth={3} /><text x={230} y={y + 37} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>{lvl}</text><path d={`M350 ${y + 30} l40 0 m0 0 l-12 -8 m12 8 l-12 8`} stroke={ink} strokeWidth={3} fill="none" /><text x={410} y={y + 37} fontSize={17} fontWeight={800} fill={ink} fontFamily={sans}>{what}</text></g>;
        })}
        <text x={VW / 2} y={476} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>you climb by owning more, and earning wages less</text>
      </svg>
    );
  } else if (m === "lifestylevspower") {
    // Lifestyle flattens; power keeps rising.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, y0 = 440, yTop = 120;
    const life = (t: number) => y0 - (y0 - yTop) * 0.75 * (1 - Math.exp(-4 * t));
    const power = (t: number) => y0 - (y0 - yTop) * Math.pow(t, 1.5);
    const seg = (f: (t: number) => number) => Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${f(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">lifestyle plateaus — power doesn't</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <path d={seg(life)} fill="none" stroke={blue} strokeWidth={6} />
        <path d={seg(power)} fill="none" stroke={red} strokeWidth={6} />
        <text x={760} y={life(1) - 16} fontSize={16} fontWeight={800} fill={blue} textAnchor="middle" fontFamily={sans}>lifestyle</text>
        <text x={780} y={power(1) + 6} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>power</text>
        <text x={VW / 2} y={476} fontSize={15} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>$1M → $1B: your daily life barely changes; your influence explodes</text>
      </svg>
    );
  } else if (m === "spendingplateau") {
    // You can only consume so much.
    const t = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">you can only consume so much</text>
        <g transform="translate(260 300)"><rect x={-90} y={-60} width={180} height={120} rx={10} fill={green} stroke={ink} strokeWidth={5} /><text y={-16} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>one home</text><text y={10} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>one bed</text><text y={36} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>three meals</text></g>
        <path d="M370 300 l80 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" opacity={t} />
        <g transform={`translate(680 300)`} opacity={t}><circle r={92} fill={gold} stroke={ink} strokeWidth={6} /><text y={-6} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the rest just</text><text y={18} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">compounds</text></g>
        <text x={VW / 2} y={476} fontSize={17} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>past 'rich', money stops being for spending</text>
      </svg>
    );
  } else if (m === "oldvsnewmoney") {
    // New money flashes; old money hides.
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">new money vs. old money</text>
        <g transform="translate(275 300)"><circle r={100} fill="#f3cfc8" stroke={ink} strokeWidth={5} /><text y={-44} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">NEW money</text><text y={-10} fontSize={30} textAnchor="middle" fontFamily={sans}>🏎️</text><text y={34} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>flashy, loud,</text><text y={56} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>spends to show it</text></g>
        <g transform="translate(725 300)"><circle r={100} fill="#cfe3d4" stroke={ink} strokeWidth={5} /><text y={-44} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">OLD money</text><text y={-10} fontSize={30} textAnchor="middle" fontFamily={sans}>🤫</text><text y={34} fontSize={15} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>quiet, invisible,</text><text y={56} fontSize={15} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>preserves & hides it</text></g>
        <text x={VW / 2} y={484} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the truly rich are often the ones you can't spot</text>
      </svg>
    );
  } else if (m === "dynastywealth") {
    // Multi-generational wealth tree.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the ultra-rich build dynasties</text>
        <g transform="translate(490 150)"><circle r={44} fill={gold} stroke={ink} strokeWidth={5} /><text y={6} fontSize={15} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>founder</text></g>
        {[-240, -80, 80, 240].map((dx, i) => <g key={i} opacity={interpolate(grow, [0.3 + i * 0.12, 0.5 + i * 0.12], [0, 1], clampBoth)}><line x1={490} y1={194} x2={490 + dx} y2={300} stroke={theme.inkSoft} strokeWidth={2} strokeDasharray="5 5" /><circle cx={490 + dx} cy={330} r={34} fill="#cfe3d4" stroke={ink} strokeWidth={4} /><text x={490 + dx} y={336} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>heir</text></g>)}
        {[-300, -160, -20, 120, 260, 360].map((dx, i) => <circle key={i} cx={430 + dx} cy={440} r={20} fill={parch} stroke={ink} strokeWidth={3} opacity={interpolate(grow, [0.6, 0.95], [0, 1], clampBoth)} />)}
        <text x={VW / 2} y={490} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>wealth engineered to outlive everyone who made it</text>
      </svg>
    );
  } else if (m === "ratetimecurve") {
    // Savings rate vs years-to-freedom — a steep dropping curve.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 130, x1 = 870, y0 = 440, yTop = 110;
    const f = (t: number) => yTop + (y0 - yTop) * Math.pow(1 - t, 1.6);
    const segs = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${f(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">save more → retire sooner</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <RLine x1={x0} y1={yTop} x2={x0} y2={y0} stroke={ink} strokeWidth={3} />
        <text x={70} y={yTop + 10} fontSize={13} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>years</text>
        <path d={segs} fill="none" stroke={green} strokeWidth={6} />
        {[["10%", 0.06, "51 yrs"], ["25%", 0.28, "32 yrs"], ["50%", 0.6, "17 yrs"], ["75%", 0.95, "7 yrs"]].map(([lab, t, yr], i) => <g key={i} opacity={draw >= (t as number) ? 1 : 0}><circle cx={x0 + (x1 - x0) * (t as number)} cy={f(t as number)} r={8} fill={red} stroke={ink} strokeWidth={3} /><text x={x0 + (x1 - x0) * (t as number)} y={f(t as number) - 16} fontSize={14} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{yr}</text></g>)}
        <text x={x1} y={y0 + 24} fontSize={14} fontWeight={800} fill={ink} textAnchor="end" fontFamily={sans}>savings rate →</text>
      </svg>
    );
  } else if (m === "thesimpletable") {
    // The famous savings-rate → years table.
    const rows: [string, string][] = [["10%", "~51"], ["20%", "~37"], ["30%", "~28"], ["40%", "~22"], ["50%", "~17"], ["65%", "~10.5"], ["75%", "~7"]];
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={60} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the shockingly simple math</text>
        <text x={340} y={100} fontSize={16} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>savings rate</text>
        <text x={640} y={100} fontSize={16} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>years to retire</text>
        {rows.map(([r, y], i) => { const yy = 130 + i * 52; const op = interpolate(reveal, [i * 0.12, i * 0.12 + 0.18], [0, 1], clampBoth); return <g key={i} opacity={op}><text x={340} y={yy + 22} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{r}</text><text x={640} y={yy + 22} fontSize={22} fontWeight={900} fill={i >= 4 ? green : i >= 2 ? gold : red} textAnchor="middle" fontFamily="Georgia, serif">{y}</text></g>; })}
      </svg>
    );
  } else if (m === "incomeirrelevant") {
    // Same savings rate, different incomes, same timeline.
    const t = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={66} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your income barely matters</text>
        <g transform="translate(270 230)"><circle r={60} fill={blue} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>earns $40K</text><text y={20} fontSize={15} fontWeight={900} fill="#eaf0fa" textAnchor="middle" fontFamily={sans}>saves 50%</text></g>
        <g transform="translate(710 230)"><circle r={60} fill={gold} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>earns $400K</text><text y={20} fontSize={15} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>saves 50%</text></g>
        <g transform={`translate(490 400)`} opacity={t}><rect x={-150} y={-36} width={300} height={72} rx={10} fill={green} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>BOTH retire in</text><text y={22} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">~17 years</text></g>
        <path d="M300 290 Q400 360 345 366" fill="none" stroke={ink} strokeWidth={3} opacity={t} /><path d="M680 290 Q580 360 635 366" fill="none" stroke={ink} strokeWidth={3} opacity={t} />
      </svg>
    );
  } else if (m === "twosidedeffect") {
    // Saving more does double duty: bigger savings + smaller target.
    const t = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">saving more works twice</text>
        <g transform="translate(275 300)"><circle r={70 + 30 * t} fill={green} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>you save</text><text y={16} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>MORE ↑</text></g>
        <g transform="translate(715 300)"><circle r={100 - 36 * t} fill={gold} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>you need</text><text y={16} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>LESS ↓</text></g>
        <text x={275} y={440} fontSize={15} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>bigger pile, faster</text>
        <text x={715} y={440} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>smaller finish line</text>
        <text x={VW / 2} y={492} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">both race toward each other — that's why it's so fast</text>
      </svg>
    );
  } else if (m === "savingsgapfuel") {
    // The gap between earning and spending is the fuel.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the gap is the whole engine</text>
        <RLine x1={120} y1={440} x2={VW - 90} y2={440} stroke={ink} strokeWidth={3} />
        <g transform="translate(240 0)"><rect x={-70} y={440 - 280} width={140} height={280} rx={6} fill={blue} stroke={ink} strokeWidth={4} /><text x={0} y={464} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>you earn</text></g>
        <g transform="translate(500 0)"><rect x={-70} y={440 - 160} width={140} height={160} rx={6} fill={tan} stroke={ink} strokeWidth={4} /><text x={0} y={464} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>you spend</text></g>
        <g transform="translate(760 0)"><rect x={-70} y={440 - 120 * grow} width={140} height={120 * grow} rx={6} fill={green} stroke={ink} strokeWidth={4} /><text x={0} y={464} fontSize={16} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>THE GAP</text></g>
        <text x={VW / 2} y={70 + 0} />
        <text x={VW / 2} y={496} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>widen the gap, and the years to freedom collapse</text>
      </svg>
    );
  } else if (m === "fiftypercentclub") {
    // Save 50% → one working life becomes two.
    const t = interpolate(frame, [fps * 0.5, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">save half, retire in ~17 years</text>
        <RRect x={140} y={230} w={720} h={60} fill="#efe9da" strokeWidth={4} />
        <rect x={140} y={230} width={360 * Math.min(1, t * 1.2)} height={60} fill={gold} stroke={ink} strokeWidth={4} />
        <text x={320} y={268} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>~17 yrs working</text>
        <text x={680} y={268} fontSize={17} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>then decades free</text>
        <text x={VW / 2} y={360} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>start at 25, done by ~42</text>
        <text x={VW / 2} y={430} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>a 50% saver works one career and funds two lifetimes</text>
      </svg>
    );
  } else if (m === "passiveincomeladder") {
    // The monthly passive-income tiers and what each covers.
    const tiers: [string, string][] = [["$100/mo", "a phone bill"], ["$500/mo", "groceries"], ["$1,000/mo", "a car + more"], ["$2,500/mo", "the rent"], ["$5,000/mo", "a modest life"], ["$10,000/mo", "quit forever"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => {
          const w = 160 + i * 128; const y = 90 + i * 66;
          const op = interpolate(climb, [i * 0.13, i * 0.13 + 0.2], [0, 1], clampBoth);
          return <g key={i} opacity={op}><rect x={VW / 2 - w / 2} y={y} width={w} height={54} rx={7} fill={[parch, "#e8d7bf", "#cfe3d4", gold, green, "#bfa0d8"][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 55} y={y + 34} fontSize={19} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><text x={VW / 2 + 62} y={y + 33} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>;
        })}
        <text x={VW / 2} y={62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">money that arrives while you sleep</text>
      </svg>
    );
  } else if (m === "capitalyieldconverter") {
    // capital × yield = monthly income.
    const pop = spring({ frame, fps, delay: fps * 1.0, config: { damping: 10 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={110} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the one formula of passive income</text>
        <g transform="translate(250 290)"><circle r={78} fill={green} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>your capital</text><text y={18} fontSize={16} fontWeight={900} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>(the pile)</text></g>
        <text x={430} y={300} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">×</text>
        <g transform="translate(560 290)"><circle r={60} fill={gold} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>yield</text><text y={20} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>~4-5%</text></g>
        <text x={700} y={300} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">=</text>
        <g transform={`translate(820 290) scale(${Math.min(1, pop)})`}><circle r={58} fill={blue} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>income</text><text y={20} fontSize={14} fontWeight={800} fill="#eaf0fa" textAnchor="middle" fontFamily={sans}>/month</text></g>
        <text x={VW / 2} y={456} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>passive income is just capital, doing a job for you</text>
      </svg>
    );
  } else if (m === "incometocapital") {
    // How much invested you need for each monthly income.
    const grow = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const rows: [string, string, number][] = [["$500/mo", "~$150K", 120], ["$1,000/mo", "~$300K", 190], ["$2,500/mo", "~$750K", 320], ["$10,000/mo", "~$3M", 470]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what each income needs invested</text>
        {rows.map(([inc, cap, w], i) => { const y = 120 + i * 86; return <g key={i} opacity={interpolate(grow, [i * 0.16, i * 0.16 + 0.2], [0, 1], clampBoth)}><text x={200} y={y + 34} fontSize={18} fontWeight={900} fill={ink} textAnchor="end" fontFamily="Georgia, serif">{inc}</text><rect x={220} y={y} width={(w as number) * grow} height={54} rx={7} fill={[parch, "#cfe3d4", gold, green][i]} stroke={ink} strokeWidth={4} /><text x={220 + (w as number) * grow + 56} y={y + 34} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{cap}</text></g>; })}
        <text x={VW / 2} y={476} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>passive income isn't free — it's bought with capital</text>
      </svg>
    );
  } else if (m === "passivespectrum") {
    // From truly passive to basically a job.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const items: [string, number][] = [["index funds", 0.08], ["dividends", 0.26], ["bonds / HYSA", 0.42], ["rental property", 0.68], ["a business", 0.92]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">how 'passive' is it, really?</text>
        <defs><linearGradient id="passgrad" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={green} /><stop offset="1" stopColor={red} /></linearGradient></defs>
        <rect x={120} y={250} width={740} height={40} rx={20} fill="url(#passgrad)" stroke={ink} strokeWidth={4} />
        <text x={120} y={320} fontSize={15} fontWeight={800} fill={green} fontFamily={sans}>truly passive</text>
        <text x={860} y={320} fontSize={15} fontWeight={800} fill={red} textAnchor="end" fontFamily={sans}>basically a job</text>
        {items.map(([lab, t], i) => <g key={i} opacity={interpolate(draw, [t as number, (t as number) + 0.12], [0, 1], clampBoth)}><line x1={120 + 740 * (t as number)} y1={244} x2={120 + 740 * (t as number)} y2={210 - (i % 2) * 36} stroke={ink} strokeWidth={2} /><text x={120 + 740 * (t as number)} y={200 - (i % 2) * 36} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>)}
        <text x={VW / 2} y={380} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>'passive' is a spectrum — some of it is real work</text>
      </svg>
    );
  } else if (m === "sourcemenu") {
    // The menu of passive-income sources.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const srcs: [string, string][] = [["dividends", "own companies"], ["interest", "lend money"], ["rent", "own property"], ["royalties", "own creations"], ["index funds", "own the market"], ["a business", "own a system"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the menu — every one is 'own something'</text>
        {srcs.map(([s, how], i) => { const op = interpolate(reveal, [i * 0.12, i * 0.12 + 0.2], [0, 1], clampBoth); const x = 180 + (i % 3) * 300; const y = 170 + Math.floor(i / 3) * 150; return <g key={i} opacity={op} transform={`translate(${x} ${y})`}><rect x={-120} y={-44} width={240} height={88} rx={10} fill="#cfe3d4" stroke={ink} strokeWidth={4} /><text y={-8} fontSize={19} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{s}</text><text y={22} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{how}</text></g>; })}
        <text x={VW / 2} y={470} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the common thread: you must OWN an asset</text>
      </svg>
    );
  } else if (m === "moneywhileyousleep") {
    // Income landing while the person sleeps.
    const drops = Math.floor(interpolate(frame, [fps * 0.5, fps * 2.6], [0, 6], clampBoth));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">it earns while you sleep</text>
        <g transform="translate(300 340)"><rect x={-110} y={-30} width={220} height={70} rx={12} fill={tan} stroke={ink} strokeWidth={5} /><circle cx={-60} cy={-10} r={20} fill={parch} stroke={ink} strokeWidth={4} /><text x={10} y={2} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>💤 asleep</text></g>
        {Array.from({ length: 6 }).map((_, i) => <g key={i} opacity={drops > i ? 1 : 0}><circle cx={620 + (i % 3) * 70} cy={200 + Math.floor(i / 3) * 70} r={22} fill={gold} stroke={ink} strokeWidth={3} /><text x={620 + (i % 3) * 70} y={206 + Math.floor(i / 3) * 70} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$</text></g>)}
        <text x={VW / 2} y={470} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>your assets clock in so you don't have to</text>
      </svg>
    );
  } else if (m === "lifedecades") {
    // The arc of a financial life, decade by decade.
    const decades: [string, string, number][] = [["20s", "building", 420], ["30s", "the squeeze", 370], ["40s", "peak earning", 290], ["50s", "catch-up", 210], ["60s", "the pivot", 150], ["70s+", "spend down", 200]];
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const xs = decades.map((_, i) => 140 + i * 140);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={60} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a money life, decade by decade</text>
        <RLine x1={100} y1={470} x2={VW - 50} y2={470} stroke={ink} strokeWidth={3} />
        <path d={`M${xs[0]} ${decades[0][2]} ${decades.slice(1).map(([, , y], i) => { const t = interpolate(draw, [(i + 1) / 6, (i + 2) / 6], [0, 1], clampBoth); return `L${xs[i] + (xs[i + 1] - xs[i]) * t} ${decades[i][2] + ((y as number) - decades[i][2]) * t}`; }).join(" ")}`} fill="none" stroke={green} strokeWidth={6} strokeLinecap="round" />
        {decades.map(([d, lab, y], i) => <g key={i} opacity={interpolate(draw, [i / 6, i / 6 + 0.1], [0, 1], clampBoth)}><circle cx={xs[i]} cy={y as number} r={7} fill={red} stroke={ink} strokeWidth={3} /><text x={xs[i]} y={490} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{d}</text><text x={xs[i]} y={(y as number) - 16} fontSize={12} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>{lab}</text></g>)}
      </svg>
    );
  } else if (m === "twentiestime") {
    // 20s: little money, but the most time — the secret asset.
    const t = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your 20s: broke, but time-rich</text>
        <g transform="translate(280 300)"><circle r={55} fill="#efe9da" stroke={ink} strokeWidth={5} /><text y={-2} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>money</text><text y={20} fontSize={16} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">tiny</text></g>
        <g transform="translate(700 300)"><circle r={55 + 55 * t} fill={gold} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>TIME</text><text y={20} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">enormous</text></g>
        <text x={VW / 2} y={476} fontSize={17} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the one decade you can never get back — spend it investing</text>
      </svg>
    );
  } else if (m === "fortiesfork") {
    // The mid-life fork: on track vs behind.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the mid-life fork in the road</text>
        <circle cx={300} cy={300} r={14} fill={ink} />
        <path d={`M300 300 L${300 + 540 * draw} ${300 - 150 * draw}`} fill="none" stroke={green} strokeWidth={6} />
        <path d={`M300 300 L${300 + 540 * draw} ${300 + 150 * draw}`} fill="none" stroke={red} strokeWidth={6} />
        <text x={860} y={135} fontSize={16} fontWeight={800} fill={green} textAnchor="end" fontFamily={sans}>on track → compounding takes over</text>
        <text x={860} y={475} fontSize={16} fontWeight={800} fill={red} textAnchor="end" fontFamily={sans}>behind → a frantic sprint begins</text>
        <text x={VW / 2} y={300} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>age 40</text>
      </svg>
    );
  } else if (m === "peaktodrawdown") {
    // The pivot from accumulation to drawdown.
    const t = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, peak = 560, y0 = 440, yTop = 130;
    const f = (x: number) => x < peak ? y0 - (y0 - yTop) * ((x - x0) / (peak - x0)) : yTop + (y0 - yTop) * 0.5 * ((x - peak) / (x1 - peak));
    const px = x0 + (x1 - x0) * t;
    const segs = Array.from({ length: 40 }).map((_, i) => { const x = x0 + (px - x0) * (i / 39); return `${i === 0 ? "M" : "L"}${x} ${f(x)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the great pivot: build → spend</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <path d={segs} fill="none" stroke={green} strokeWidth={6} />
        <line x1={peak} y1={yTop} x2={peak} y2={y0} stroke={red} strokeWidth={2} strokeDasharray="6 6" />
        <text x={peak} y={yTop - 10} fontSize={15} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>retirement</text>
        <text x={340} y={y0 + 26} fontSize={15} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>accumulate (20s-60s)</text>
        <text x={720} y={y0 + 26} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>draw down (60s+)</text>
      </svg>
    );
  } else if (m === "prioritiesbydecade") {
    // What money is FOR shifts each decade.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const rows: [string, string][] = [["20s", "freedom & fun"], ["30s", "family & home"], ["40s", "security & catch-up"], ["50s", "the final sprint"], ["60s+", "legacy & peace"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what money is FOR keeps changing</text>
        {rows.map(([d, p], i) => { const y = 120 + i * 70; return <g key={i} opacity={interpolate(reveal, [i * 0.16, i * 0.16 + 0.22], [0, 1], clampBoth)}><rect x={200} y={y} width={120} height={54} rx={8} fill={gold} stroke={ink} strokeWidth={3} /><text x={260} y={y + 34} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{d}</text><path d={`M330 ${y + 28} l40 0 m0 0 l-12 -8 m12 8 l-12 8`} stroke={ink} strokeWidth={3} fill="none" /><text x={390} y={y + 34} fontSize={19} fontWeight={800} fill={ink} fontFamily={sans}>{p}</text></g>; })}
      </svg>
    );
  } else if (m === "catchupdecade") {
    // The 50s catch-up sprint.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the 50s: the catch-up sprint</text>
        <RLine x1={120} y1={430} x2={VW - 90} y2={430} stroke={ink} strokeWidth={3} />
        <g transform="translate(260 0)"><rect x={-60} y={430 - 150} width={120} height={150} rx={6} fill={tan} stroke={ink} strokeWidth={4} /><text x={0} y={454} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>normal limit</text></g>
        <g transform="translate(560 0)"><rect x={-60} y={430 - 210 * grow} width={120} height={210 * grow} rx={6} fill={green} stroke={ink} strokeWidth={4} /><text x={0} y={454} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>+catch-up</text></g>
        <g transform="translate(790 0)"><text x={0} y={250} fontSize={34} textAnchor="middle" fontFamily={sans}>🏃</text></g>
        <text x={VW / 2} y={480} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>after 50, the tax code lets you save extra — use it</text>
      </svg>
    );
  } else if (m === "millionvsbillionscale") {
    // A $1M stack vs a $1B stack — 1000x taller.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={60} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a million vs a billion</text>
        <g transform="translate(250 0)"><rect x={-30} y={440 - 20 * grow} width={60} height={20 * grow} fill={green} stroke={ink} strokeWidth={3} /><text x={0} y={470} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$1M</text><text x={0} y={414} fontSize={13} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>knee-high</text></g>
        <g transform="translate(680 0)"><rect x={-40} y={110} width={80} height={330 * grow} fill={gold} stroke={ink} strokeWidth={4} /><text x={0} y={470} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$1B</text><text x={0} y={95} fontSize={13} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>a skyscraper</text></g>
        <text x={VW / 2} y={300} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">1,000× bigger</text>
      </svg>
    );
  } else if (m === "secondsscale") {
    // A million seconds vs a billion seconds.
    const pop = spring({ frame, fps, delay: fps * 1.2, config: { damping: 10 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={100} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">count it in seconds</text>
        <g transform="translate(280 290)"><circle r={90} fill={green} stroke={ink} strokeWidth={6} /><text y={-16} fontSize={18} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>1 million sec</text><text y={14} fontSize={24} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">11 days</text></g>
        <g transform={`translate(710 290) scale(${Math.min(1, pop)})`}><circle r={90} fill={red} stroke={ink} strokeWidth={6} /><text y={-16} fontSize={18} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>1 billion sec</text><text y={14} fontSize={24} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">32 years</text></g>
        <text x={VW / 2} y={456} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>that's the real gap between a millionaire and a billionaire</text>
      </svg>
    );
  } else if (m === "whatitbuys") {
    // What each tier can literally buy.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const rows: [string, string, string][] = [["$1M", "a paid-off home", "🏡"], ["$10M", "a private-jet life", "✈️"], ["$100M", "a mega-yacht, a team", "🛥️"], ["$1B", "islands, media, power", "🌍"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what each level actually buys</text>
        {rows.map(([amt, what, emo], i) => { const y = 110 + i * 86; return <g key={i} opacity={interpolate(reveal, [i * 0.16, i * 0.16 + 0.22], [0, 1], clampBoth)}><rect x={150} y={y} width={140} height={62} rx={8} fill={["#cfe3d4", green, gold, "#bfa0d8"][i]} stroke={ink} strokeWidth={4} /><text x={220} y={y + 40} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><text x={330} y={y + 42} fontSize={30} textAnchor="middle" fontFamily={sans}>{emo}</text><text x={400} y={y + 40} fontSize={19} fontWeight={800} fill={ink} fontFamily={sans}>{what}</text></g>; })}
      </svg>
    );
  } else if (m === "timetospend") {
    // At $1,000/day, how long to burn each fortune.
    const grow = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const rows: [string, string, number][] = [["$1M", "~3 years", 40], ["$10M", "~27 years", 120], ["$100M", "~274 years", 300], ["$1B", "~2,740 years", 560]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">spending $1,000 a day, every day</text>
        {rows.map(([amt, t, w], i) => { const y = 110 + i * 84; return <g key={i} opacity={interpolate(grow, [i * 0.16, i * 0.16 + 0.2], [0, 1], clampBoth)}><text x={200} y={y + 34} fontSize={20} fontWeight={900} fill={ink} textAnchor="end" fontFamily="Georgia, serif">{amt}</text><rect x={220} y={y + 4} width={Math.min(620, (w as number)) * grow} height={44} rx={6} fill={[green, "#cfe3d4", gold, red][i]} stroke={ink} strokeWidth={3} /><text x={220 + Math.min(620, (w as number)) * grow + 70} y={y + 34} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{t}</text></g>; })}
        <text x={VW / 2} y={476} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>you could never spend a billion in a lifetime</text>
      </svg>
    );
  } else if (m === "millionairerarity") {
    // How many of each exist.
    const pop = (d: number) => spring({ frame, fps, delay: d, config: { damping: 11 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">how rare is each?</text>
        <g transform={`translate(230 290) scale(${Math.min(1, pop(fps * 0.4))})`}><circle r={86} fill={green} stroke={ink} strokeWidth={5} /><text y={-10} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>millionaires</text><text y={18} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">~22M</text></g>
        <g transform={`translate(500 290) scale(${Math.min(1, pop(fps * 1.0))})`}><circle r={52} fill={gold} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>$100M+</text><text y={16} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">~10K</text></g>
        <g transform={`translate(740 290) scale(${Math.min(1, pop(fps * 1.6))})`}><circle r={30} fill={red} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>billionaires</text><text y={16} fontSize={13} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">~2.7K</text></g>
        <text x={VW / 2} y={456} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>(US millionaires; billionaires worldwide)</text>
      </svg>
    );
  } else if (m === "millionairetiers") {
    // The $1M/$10M/$100M/$1B ladder with 'what changes'.
    const tiers: [string, string][] = [["$1M", "freedom"], ["$10M", "luxury"], ["$100M", "power"], ["$1B", "a different planet"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => {
          const w = 200 + i * 180; const y = 130 + i * 86;
          const op = interpolate(climb, [i * 0.18, i * 0.18 + 0.22], [0, 1], clampBoth);
          return <g key={i} opacity={op}><rect x={VW / 2 - w / 2} y={y} width={w} height={66} rx={8} fill={["#cfe3d4", green, gold, red][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 55} y={y + 42} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><text x={VW / 2 + 70} y={y + 41} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>;
        })}
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">each ×10 is a new universe</text>
      </svg>
    );
  } else if (m === "scorebands") {
    // The 300-850 credit score gauge with bands.
    const sweep = interpolate(frame, [fps * 0.5, fps * 2.2], [0, 1], clampBoth);
    const bands: [string, string, string][] = [["300-579", "poor", red], ["580-669", "fair", "#d98b5f"], ["670-739", "good", gold], ["740-799", "very good", "#9cc47f"], ["800-850", "excellent", green]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the credit score bands</text>
        {bands.map(([rng, lab, col], i) => { const x = 120 + i * 150; return <g key={i} opacity={interpolate(sweep, [i * 0.14, i * 0.14 + 0.2], [0, 1], clampBoth)}><rect x={x} y={200} width={135} height={90} rx={8} fill={col as string} stroke={ink} strokeWidth={4} /><text x={x + 67} y={238} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>{rng}</text><text x={x + 67} y={266} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={190} y={340} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>pay the most</text>
        <text x={790} y={340} fontSize={15} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>pay the least</text>
        <text x={VW / 2} y={420} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>a 3-digit number that prices your whole life</text>
      </svg>
    );
  } else if (m === "fivefactors") {
    // The 5 factors as a pie.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    const parts: [string, number, string][] = [["payment history", 35, green], ["utilization", 30, gold], ["age of credit", 15, blue], ["credit mix", 10, "#d98b5f"], ["new credit", 10, "#bfa0d8"]];
    let acc = 0;
    const cx = 320, cy = 290, r = 130;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what builds your score</text>
        {parts.map(([lab, pct, col], i) => { const a0 = acc / 100 * 6.283 - 1.5708; acc += (pct as number) * grow; const a1 = acc / 100 * 6.283 - 1.5708; const large = (a1 - a0) > Math.PI ? 1 : 0; const x0 = cx + r * Math.cos(a0), y0v = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1); return <path key={i} d={`M${cx} ${cy} L${x0} ${y0v} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={col as string} stroke={ink} strokeWidth={3} />; })}
        {parts.map(([lab, pct], i) => <g key={i}><rect x={560} y={150 + i * 56} width={26} height={26} fill={["#5aa469", "#e8b73a", "#4a7fb5", "#d98b5f", "#bfa0d8"][i]} stroke={ink} strokeWidth={2} /><text x={598} y={170 + i * 56} fontSize={17} fontWeight={800} fill={ink} fontFamily={sans}>{lab} — {pct}%</text></g>)}
      </svg>
    );
  } else if (m === "ratebyband") {
    // Mortgage rate by credit band.
    const grow = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const rows: [string, string, number, string][] = [["excellent", "6.5%", 160, green], ["good", "7.1%", 200, gold], ["fair", "8.2%", 280, "#d98b5f"], ["poor", "9.5%+", 360, red]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">same mortgage, different rate</text>
        {rows.map(([lab, rate, w, col], i) => { const y = 120 + i * 82; return <g key={i} opacity={interpolate(grow, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><text x={240} y={y + 34} fontSize={17} fontWeight={800} fill={ink} textAnchor="end" fontFamily={sans}>{lab}</text><rect x={260} y={y + 6} width={(w as number) * grow} height={42} rx={6} fill={col as string} stroke={ink} strokeWidth={3} /><text x={260 + (w as number) * grow + 48} y={y + 34} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{rate}</text></g>; })}
        <text x={VW / 2} y={476} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>a low score adds 3%+ to every loan you'll ever take</text>
      </svg>
    );
  } else if (m === "lifetimecost") {
    // The lifetime extra cost of a poor score.
    const pop = spring({ frame, fps, delay: fps * 1.0, config: { damping: 9 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={100} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the lifetime price of a bad score</text>
        <g transform="translate(270 300)"><circle r={78} fill={green} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>excellent</text><text y={18} fontSize={16} fontWeight={900} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>pays $X</text></g>
        <text x={470} y={310} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">+</text>
        <g transform={`translate(700 300) scale(${Math.min(1, pop)})`}><circle r={98} fill={red} stroke={ink} strokeWidth={6} /><text y={-10} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>poor pays</text><text y={18} fontSize={26} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">+$100K+</text></g>
        <text x={VW / 2} y={460} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>same houses, same cars — a six-figure penalty for bad credit</text>
      </svg>
    );
  } else if (m === "creditspiral") {
    // Bad score → high rates → struggle → worse score.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const steps = ["low score", "high rates", "payments strain", "missed payments", "score drops more"];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the credit trap, going in circles</text>
        {steps.map((s, i) => { const a = (i / steps.length) * 6.283 - 1.5708; const op = interpolate(reveal, [i * 0.16, i * 0.16 + 0.2], [0, 1], clampBoth); const x = 490 + 180 * Math.cos(a), y = 290 + 150 * Math.sin(a); return <g key={i} opacity={op}><circle cx={x} cy={y} r={54} fill={i % 2 ? "#f3cfc8" : red} stroke={ink} strokeWidth={4} /><text x={x} y={y + 5} fontSize={13} fontWeight={800} fill={i % 2 ? ink : "#fff"} textAnchor="middle" fontFamily={sans}>{s}</text></g>; })}
        <text x={490} y={296} fontSize={30} textAnchor="middle" fontFamily={sans}>↻</text>
        <text x={VW / 2} y={492} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>a bad score makes it harder to fix a bad score</text>
      </svg>
    );
  } else if (m === "climbthebands") {
    // The moves to climb from poor to excellent.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const moves: [string, string][] = [["pay on time", "35% of your score"], ["use < 30% of limits", "30% of your score"], ["keep old cards open", "ages your credit"], ["don't over-apply", "limits new dings"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">how to climb the bands — free</text>
        {moves.map(([m2, why], i) => { const y = 120 + i * 82; return <g key={i} opacity={interpolate(reveal, [i * 0.16, i * 0.16 + 0.22], [0, 1], clampBoth)}><rect x={160} y={y} width={640} height={62} rx={10} fill={i === 0 ? green : "#cfe3d4"} stroke={ink} strokeWidth={4} /><text x={190} y={y + 38} fontSize={19} fontWeight={900} fill={ink} fontFamily={sans}>✓ {m2}</text><text x={780} y={y + 38} fontSize={15} fontWeight={700} fill={ink} textAnchor="end" fontFamily={sans}>{why}</text></g>; })}
      </svg>
    );
  } else if (m === "estatetaxcliff") {
    // The exemption cliff: $0 tax below ~$13.6M, then ~40%.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, cliff = 560, y0 = 420;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the estate-tax cliff</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <line x1={cliff} y1={140} x2={cliff} y2={y0} stroke={red} strokeWidth={2} strokeDasharray="6 6" />
        <rect x={x0} y={y0 - 20} width={(cliff - x0) * Math.min(1, draw * 2)} height={20} fill={green} stroke={ink} strokeWidth={3} />
        <text x={(x0 + cliff) / 2} y={y0 - 34} fontSize={16} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>0% tax</text>
        <rect x={cliff} y={y0 - 230 * interpolate(draw, [0.5, 1], [0, 1], clampBoth)} width={x1 - cliff} height={230 * interpolate(draw, [0.5, 1], [0, 1], clampBoth)} fill={red} stroke={ink} strokeWidth={3} />
        <text x={(cliff + x1) / 2} y={160} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">~40% tax</text>
        <text x={cliff} y={y0 + 26} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>~$13.6M</text>
        <text x={VW / 2} y={470} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>below the line: nothing. above it: nearly half.</text>
      </svg>
    );
  } else if (m === "inheritancetiers") {
    // Inheritance tiers and what the govt takes.
    const rows: [string, string, string][] = [["$10K", "$0 — tax-free", green], ["$100K", "$0 — tax-free", green], ["$1M", "$0 — tax-free", green], ["$10M", "$0 federal*", "#9cc47f"], ["$100M", "tens of millions", red]];
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what the government takes</text>
        {rows.map(([amt, take, col], i) => { const y = 100 + i * 74; return <g key={i} opacity={interpolate(reveal, [i * 0.14, i * 0.14 + 0.2], [0, 1], clampBoth)}><text x={300} y={y + 34} fontSize={22} fontWeight={900} fill={ink} textAnchor="end" fontFamily="Georgia, serif">{amt}</text><rect x={330} y={y} width={320} height={52} rx={8} fill={col as string} stroke={ink} strokeWidth={3} /><text x={490} y={y + 33} fontSize={16} fontWeight={800} fill={i < 4 ? ink : "#fff"} textAnchor="middle" fontFamily={sans}>{take}</text></g>; })}
        <text x={VW / 2} y={476} fontSize={14} fontWeight={700} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>*under the ~$13.6M exemption</text>
      </svg>
    );
  } else if (m === "estatevsinheritance") {
    // Who pays: the estate, or the heir.
    const t = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">two different 'death taxes'</text>
        <g transform="translate(275 300)" opacity={t}><circle r={92} fill={tan} stroke={ink} strokeWidth={5} /><text y={-28} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">ESTATE tax</text><text y={2} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>paid by the estate,</text><text y={24} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>before you get it</text></g>
        <g transform={`translate(715 300)`} opacity={interpolate(t, [0.4, 1], [0, 1], clampBoth)}><circle r={92} fill="#cfe3d4" stroke={ink} strokeWidth={5} /><text y={-28} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">INHERITANCE tax</text><text y={2} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>paid by you,</text><text y={24} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the heir</text></g>
        <text x={VW / 2} y={456} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the US has a federal ESTATE tax — and no federal inheritance tax</text>
      </svg>
    );
  } else if (m === "steppedupbasis") {
    // The loophole: basis resets to death-value, gains vanish.
    const t = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the stepped-up basis loophole</text>
        <g transform="translate(250 280)"><rect x={-90} y={-50} width={180} height={100} rx={8} fill={tan} stroke={ink} strokeWidth={4} /><text y={-12} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>bought for</text><text y={14} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$100K</text></g>
        <path d="M350 280 l80 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(560 280)"><rect x={-90} y={-50} width={180} height={100} rx={8} fill={gold} stroke={ink} strokeWidth={4} /><text y={-12} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>worth at death</text><text y={14} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$1M</text></g>
        <g transform="translate(820 280)" opacity={t}><circle r={60} fill={green} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>$900K gain</text><text y={16} fontSize={15} fontWeight={900} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>taxed: $0</text></g>
        <text x={VW / 2} y={456} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>heirs inherit at today's value — the lifetime of gains vanishes, untaxed</text>
      </svg>
    );
  } else if (m === "dodgetheestatetax") {
    // Trusts/gifting shrink the taxable estate.
    const shrink = interpolate(frame, [fps * 0.5, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">how the rich dodge the 40%</text>
        <g transform="translate(300 300)"><circle r={110 - 50 * shrink} fill={gold} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>taxable</text><text y={18} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>estate ↓</text></g>
        {["trusts", "gifting", "charity"].map((t, i) => <g key={i} transform={`translate(${620 + (i % 2) * 150} ${220 + i * 70})`} opacity={interpolate(shrink, [i * 0.2, i * 0.2 + 0.3], [0, 1], clampBoth)}><rect x={-80} y={-26} width={160} height={52} rx={9} fill="#cfe3d4" stroke={ink} strokeWidth={3} /><text y={6} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{t}</text></g>)}
        <text x={VW / 2} y={470} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>shrink the taxable estate, shrink the tax</text>
      </svg>
    );
  } else if (m === "iratax") {
    // The hidden trap: inherited traditional IRA/401k taxed as income.
    const t = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the inherited-IRA trap</text>
        <g transform="translate(250 290)"><rect x={-80} y={-50} width={160} height={100} rx={10} fill={gold} stroke={ink} strokeWidth={5} /><text y={-8} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>inherited</text><text y={16} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>401(k)/IRA</text></g>
        <path d="M345 290 l80 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(540 290)"><rect x={-70} y={-40} width={140} height={80} rx={8} fill={red} stroke={ink} strokeWidth={4} /><text y={-4} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>taxed as</text><text y={20} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>INCOME</text></g>
        <g transform="translate(790 290)" opacity={t}><text y={-6} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>+ must empty it</text><text y={18} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>within 10 years</text></g>
        <text x={VW / 2} y={470} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>a cash inheritance is tax-free; an inherited IRA is not</text>
      </svg>
    );
  } else if (m === "ownershipstages") {
    // The stages from renting to paid-off.
    const stages: [string, string][] = [["rent", "0% yours"], ["save", "the down payment"], ["buy", "a sliver yours"], ["build", "equity grows"], ["refi / trade up", "optimize"], ["paid off", "100% yours"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {stages.map(([lab, sub], i) => {
          const w = 150 + i * 128; const y = 90 + i * 66;
          const op = interpolate(climb, [i * 0.13, i * 0.13 + 0.2], [0, 1], clampBoth);
          return <g key={i} opacity={op}><rect x={VW / 2 - w / 2} y={y} width={w} height={54} rx={7} fill={[parch, "#e8d7bf", "#cfe3d4", "#9cc47f", gold, green][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 45} y={y + 34} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{lab}</text><text x={VW / 2 + 60} y={y + 33} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{sub}</text></g>;
        })}
        <text x={VW / 2} y={62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the home-ownership journey</text>
      </svg>
    );
  } else if (m === "equitybuilds") {
    // Equity grows as the loan shrinks and value rises.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, y0 = 440, yTop = 120;
    const loan = (t: number) => yTop + (y0 - yTop) * t;
    const value = (t: number) => (y0 - 40) - 120 * t;
    const seg = (f: (t: number) => number) => Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${f(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your equity quietly grows</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <path d={seg(value)} fill="none" stroke={green} strokeWidth={5} />
        <path d={seg(loan)} fill="none" stroke={red} strokeWidth={5} />
        <text x={x1 - 10} y={value(1) - 12} fontSize={15} fontWeight={800} fill={green} textAnchor="end" fontFamily={sans}>home value ↑</text>
        <text x={x1 - 10} y={loan(1) + 24} fontSize={15} fontWeight={800} fill={red} textAnchor="end" fontFamily={sans}>loan owed ↓</text>
        <text x={620} y={300} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">= your equity</text>
        <text x={VW / 2} y={y0 + 26} fontSize={14} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>years →</text>
      </svg>
    );
  } else if (m === "interestvsprincipal") {
    // The amortization curve flipping interest→principal.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    const bars = 10;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">where your payment really goes</text>
        <RLine x1={90} y1={420} x2={VW - 60} y2={420} stroke={ink} strokeWidth={3} />
        {Array.from({ length: bars }).map((_, i) => { const on = draw > i / bars; const x = 120 + i * 75; const intFrac = 1 - i / (bars - 1); const h = 220; return <g key={i} opacity={on ? 1 : 0.12}><rect x={x} y={420 - h * intFrac} width={56} height={h * intFrac} fill={red} stroke={ink} strokeWidth={2} /><rect x={x} y={420 - h} width={56} height={h * (1 - intFrac)} fill={green} stroke={ink} strokeWidth={2} /></g>; })}
        <text x={160} y={448} fontSize={13} fontWeight={800} fill={red} fontFamily={sans}>year 1</text>
        <text x={800} y={448} fontSize={13} fontWeight={800} fill={green} fontFamily={sans}>year 30</text>
        <g><rect x={360} y={452} width={18} height={18} fill={red} /><text x={384} y={466} fontSize={14} fontWeight={800} fill={ink} fontFamily={sans}>interest</text><rect x={500} y={452} width={18} height={18} fill={green} /><text x={524} y={466} fontSize={14} fontWeight={800} fill={ink} fontFamily={sans}>principal (yours)</text></g>
      </svg>
    );
  } else if (m === "rentvsownjourney") {
    // Renter's $0 equity vs owner's growing equity over time.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, y0 = 430;
    const own = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${y0 - 280 * t * t}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">30 years of rent vs. owning</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * draw} y2={y0} stroke={red} strokeWidth={6} />
        <path d={own} fill="none" stroke={green} strokeWidth={6} />
        <text x={x1 - 10} y={y0 - 14} fontSize={15} fontWeight={800} fill={red} textAnchor="end" fontFamily={sans}>renter: $0 equity</text>
        <text x={x1 - 10} y={y0 - 280 * draw * draw - 14} fontSize={15} fontWeight={800} fill={green} textAnchor="end" fontFamily={sans}>owner: a paid-off house</text>
        <text x={VW / 2} y={y0 + 28} fontSize={15} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>same monthly cost, wildly different ending</text>
      </svg>
    );
  } else if (m === "paidoffmilestone") {
    // Mortgage-free: housing cost collapses.
    const burn = interpolate(frame, [fps * 0.6, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the day the mortgage dies</text>
        <g transform="translate(300 300)"><rect x={-90} y={-60} width={180} height={120} rx={10} fill={green} stroke={ink} strokeWidth={6} /><text y={-8} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>100%</text><text y={18} fontSize={16} fontWeight={800} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>yours</text></g>
        <g transform="translate(680 300)"><rect x={-90} y={60 - 120 * (1 - burn)} width={180} height={120 * (1 - burn)} rx={6} fill={red} stroke={ink} strokeWidth={4} opacity={1 - burn} /><text y={90} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>monthly payment</text>{burn > 0.8 && <text y={0} fontSize={20} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">$0</text>}</g>
        <text x={VW / 2} y={470} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>your biggest bill vanishes — just taxes & upkeep remain</text>
      </svg>
    );
  } else if (m === "equityformula") {
    // Equity = market value − loans owed.
    const pop = spring({ frame, fps, delay: fps * 1.0, config: { damping: 10 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={120} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what 'equity' actually is</text>
        <g transform="translate(250 290)"><rect x={-110} y={-45} width={220} height={90} rx={10} fill={green} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>home's value</text><text y={18} fontSize={16} fontWeight={900} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>$400K</text></g>
        <text x={440} y={300} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">−</text>
        <g transform="translate(590 290)"><rect x={-100} y={-45} width={200} height={90} rx={10} fill={red} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>loan owed</text><text y={18} fontSize={16} fontWeight={900} fill="#ffe8e4" textAnchor="middle" fontFamily={sans}>$250K</text></g>
        <text x={735} y={300} fontSize={34} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">=</text>
        <g transform={`translate(840 290) scale(${Math.min(1, pop)})`}><circle r={56} fill={gold} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>yours</text><text y={20} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$150K</text></g>
        <text x={VW / 2} y={430} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>every payment quietly moves value from the bank's side to yours</text>
      </svg>
    );
  } else if (m === "crashseverityladder") {
    // The severity ladder: -10 to -80%.
    const tiers: [string, string, string][] = [["−5%", "a dip", "#9cc47f"], ["−10%", "correction", gold], ["−20%", "bear market", "#d98b5f"], ["−40%", "a crash", red], ["−80%", "depression", "#7a1f16"]];
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the levels of a market fall</text>
        {tiers.map(([pct, lab, col], i) => { const y = 100 + i * 72; const w = 180 + i * 130; return <g key={i} opacity={interpolate(reveal, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><rect x={120} y={y} width={w} height={56} rx={7} fill={col as string} stroke={ink} strokeWidth={4} /><text x={150} y={y + 36} fontSize={22} fontWeight={900} fill="#fff" fontFamily="Georgia, serif">{pct}</text><text x={150 + w - 20} y={y + 35} fontSize={16} fontWeight={800} fill="#fff" textAnchor="end" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={476} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the deeper it falls, the rarer — and the longer to climb back</text>
      </svg>
    );
  } else if (m === "recoverytime") {
    // How long each severity took to recover.
    const grow = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const rows: [string, string, number, string][] = [["correction −10%", "~4 months", 90, "#9cc47f"], ["bear −20%", "~2 years", 200, gold], ["crash −40%", "~4 years", 330, "#d98b5f"], ["depression −80%", "~decades", 520, red]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">how long to climb back</text>
        {rows.map(([lab, t, w, col], i) => { const y = 120 + i * 82; return <g key={i} opacity={interpolate(grow, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><text x={260} y={y + 32} fontSize={15} fontWeight={800} fill={ink} textAnchor="end" fontFamily={sans}>{lab}</text><rect x={280} y={y + 6} width={Math.min(560, (w as number)) * grow} height={40} rx={6} fill={col as string} stroke={ink} strokeWidth={3} /><text x={280 + Math.min(560, (w as number)) * grow + 60} y={y + 32} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{t}</text></g>; })}
        <text x={VW / 2} y={476} fontSize={16} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>but every single one, eventually, fully recovered</text>
      </svg>
    );
  } else if (m === "crashfrequency") {
    // How often each severity happens.
    const pop = (d: number) => spring({ frame, fps, delay: d, config: { damping: 11 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">how often they strike</text>
        <g transform={`translate(230 300) scale(${Math.min(1, pop(fps * 0.4))})`}><circle r={80} fill="#9cc47f" stroke={ink} strokeWidth={5} /><text y={-6} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>correction</text><text y={18} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>~every year</text></g>
        <g transform={`translate(500 300) scale(${Math.min(1, pop(fps * 1.0))})`}><circle r={56} fill={gold} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={15} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>bear</text><text y={16} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>~6 years</text></g>
        <g transform={`translate(740 300) scale(${Math.min(1, pop(fps * 1.6))})`}><circle r={34} fill={red} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={12} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>depression</text><text y={15} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>~a century</text></g>
        <text x={VW / 2} y={460} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>small dips are constant; true catastrophes are rare</text>
      </svg>
    );
  } else if (m === "whattodoincrash") {
    // The right action at each severity.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const rows: [string, string][] = [["a dip / correction", "ignore it — it's noise"], ["a bear market", "keep buying on schedule"], ["a −40% crash", "buy more if you can; never sell"], ["any crash", "do NOT panic-sell"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what to actually do</text>
        {rows.map(([sit, act], i) => { const y = 120 + i * 80; return <g key={i} opacity={interpolate(reveal, [i * 0.16, i * 0.16 + 0.22], [0, 1], clampBoth)}><rect x={150} y={y} width={290} height={60} rx={9} fill="#f3cfc8" stroke={ink} strokeWidth={3} /><text x={295} y={y + 37} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{sit}</text><path d={`M445 ${y + 30} l35 0 m0 0 l-12 -8 m12 8 l-12 8`} stroke={ink} strokeWidth={3} fill="none" /><rect x={495} y={y} width={320} height={60} rx={9} fill={green} stroke={ink} strokeWidth={3} /><text x={655} y={y + 37} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{act}</text></g>; })}
      </svg>
    );
  } else if (m === "interestratelevels") {
    // Rate levels 0-20% and who wins at each.
    const rows: [string, string, string][] = [["0%", "free money: borrowers win, savers lose", red], ["2-3%", "cheap: assets boom", "#d98b5f"], ["5%", "normal: savers get real yield", gold], ["10%", "high: savers win, borrowers hurt", "#9cc47f"], ["20%", "extreme: inflation-killer, recession", green]];
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the levels of interest rate</text>
        {rows.map(([pct, lab, col], i) => { const y = 100 + i * 72; return <g key={i} opacity={interpolate(reveal, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><rect x={120} y={y} width={120} height={56} rx={7} fill={col as string} stroke={ink} strokeWidth={4} /><text x={180} y={y + 37} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{pct}</text><text x={260} y={y + 35} fontSize={16} fontWeight={800} fill={ink} fontFamily={sans}>{lab}</text></g>; })}
      </svg>
    );
  } else if (m === "saversvsborrowers") {
    // A seesaw: rates help one side, hurt the other.
    const tip = interpolate(frame, [fps * 0.6, fps * 2.2], [-12, 12], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">every rate is a see-saw</text>
        <g transform={`translate(490 300) rotate(${tip})`}>
          <RLine x1={-320} y1={0} x2={320} y2={0} stroke={ink} strokeWidth={8} />
          <g transform="translate(-280 -60)"><circle r={54} fill={green} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>savers</text><text y={20} fontSize={13} fontWeight={800} fill="#eafaf0" textAnchor="middle" fontFamily={sans}>love high</text></g>
          <g transform="translate(280 -60)"><circle r={54} fill={red} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>borrowers</text><text y={20} fontSize={13} fontWeight={800} fill="#ffe8e4" textAnchor="middle" fontFamily={sans}>love low</text></g>
        </g>
        <path d="M490 300 L460 380 L520 380 Z" fill={ink} />
        <text x={VW / 2} y={470} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>a rate that helps one side always hurts the other</text>
      </svg>
    );
  } else if (m === "rateripple") {
    // The Fed's base rate ripples to everything.
    const reveal = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    const spokes = ["mortgages", "credit cards", "savings", "car loans", "the economy"];
    art = (
      <svg width={VW} height={VH}>
        <g transform="translate(490 290)"><circle r={60} fill={gold} stroke={ink} strokeWidth={6} /><text y={-6} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the Fed's</text><text y={16} fontSize={15} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>base rate</text></g>
        {spokes.map((s, i) => { const a = (i / spokes.length) * 6.283 - 1.5708; const op = interpolate(reveal, [i * 0.14, i * 0.14 + 0.2], [0, 1], clampBoth); const x = 490 + 250 * Math.cos(a), y = 290 + 170 * Math.sin(a); return <g key={i} opacity={op}><line x1={490} y1={290} x2={x} y2={y} stroke={theme.inkSoft} strokeWidth={2} strokeDasharray="5 5" /><g transform={`translate(${x} ${y})`}><rect x={-72} y={-24} width={144} height={48} rx={9} fill="#cfe3d4" stroke={ink} strokeWidth={3} /><text y={6} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{s}</text></g></g>; })}
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">one rate ripples through everything</text>
      </svg>
    );
  } else if (m === "realrate") {
    // nominal rate − inflation = real rate.
    const pop = spring({ frame, fps, delay: fps * 1.0, config: { damping: 10 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={120} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the rate that actually matters</text>
        <g transform="translate(250 290)"><rect x={-100} y={-45} width={200} height={90} rx={10} fill={gold} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>your rate</text><text y={18} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">5%</text></g>
        <text x={420} y={300} fontSize={30} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">−</text>
        <g transform="translate(560 290)"><rect x={-100} y={-45} width={200} height={90} rx={10} fill={red} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>inflation</text><text y={18} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">3%</text></g>
        <text x={710} y={300} fontSize={30} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">=</text>
        <g transform={`translate(830 290) scale(${Math.min(1, pop)})`}><circle r={56} fill={green} stroke={ink} strokeWidth={5} /><text y={-2} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>real</text><text y={20} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">2%</text></g>
        <text x={VW / 2} y={430} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>if inflation beats your rate, you're quietly losing money</text>
      </svg>
    );
  } else if (m === "efundlevels") {
    // Emergency-fund levels and who survives.
    const tiers: [string, string, string][] = [["$0", "one bill from disaster", red], ["$1K", "small emergencies", "#d98b5f"], ["3 months", "survive a job loss", gold], ["6 months", "the solid standard", "#9cc47f"], ["1 year", "bulletproof", green]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab, col], i) => { const w = 170 + i * 130; const y = 100 + i * 72; return <g key={i} opacity={interpolate(climb, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><rect x={VW / 2 - w / 2} y={y} width={w} height={56} rx={7} fill={col as string} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 50} y={y + 36} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><text x={VW / 2 + 55} y={y + 35} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the levels of a safety net</text>
      </svg>
    );
  } else if (m === "survivalbyshock") {
    // Which shock you survive at each level.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const rows: [string, string][] = [["$1K", "a flat tire, a vet bill"], ["3 months", "a layoff, a job hunt"], ["6 months", "a long layoff + medical"], ["1 year", "almost any disaster"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what each level lets you survive</text>
        {rows.map(([amt, shock], i) => { const y = 110 + i * 82; return <g key={i} opacity={interpolate(reveal, [i * 0.16, i * 0.16 + 0.22], [0, 1], clampBoth)}><rect x={150} y={y} width={180} height={60} rx={9} fill={gold} stroke={ink} strokeWidth={3} /><text x={240} y={y + 37} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><path d={`M340 ${y + 30} l35 0 m0 0 l-12 -8 m12 8 l-12 8`} stroke={ink} strokeWidth={3} fill="none" /><rect x={390} y={y} width={420} height={60} rx={9} fill="#cfe3d4" stroke={ink} strokeWidth={3} /><text x={600} y={y + 37} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>✓ {shock}</text></g>; })}
      </svg>
    );
  } else if (m === "peaceofmindcurve") {
    // Calm rises fast then plateaus.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, y0 = 440, yTop = 130;
    const f = (t: number) => y0 - (y0 - yTop) * (1 - Math.exp(-3.4 * t));
    const segs = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${f(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the peace-of-mind curve</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <RLine x1={x0} y1={yTop} x2={x0} y2={y0} stroke={ink} strokeWidth={3} />
        <text x={66} y={yTop + 10} fontSize={13} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>calm</text>
        <path d={segs} fill="none" stroke={green} strokeWidth={6} />
        <text x={300} y={y0 + 26} fontSize={13} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>$0 → 3 mo: huge</text>
        <text x={740} y={y0 + 26} fontSize={13} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>1yr+: flattens</text>
        <text x={VW / 2} y={y0 - 20} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>most of the calm comes early</text>
      </svg>
    );
  } else if (m === "cashdrag") {
    // Too much cash loses to inflation.
    const shrink = interpolate(frame, [fps * 0.5, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">you can hold too much cash</text>
        <g transform="translate(300 300)"><circle r={96} fill="#efe9da" stroke={ink} strokeWidth={5} /><text y={-6} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>2 years cash</text><text y={18} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>idle</text></g>
        <path d="M410 300 l80 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(700 300)"><circle r={96 - 36 * shrink} fill={red} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>loses to</text><text y={18} fontSize={15} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>inflation</text></g>
        <text x={VW / 2} y={460} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>past ~1 year, extra cash should be invested, not idle</text>
      </svg>
    );
  } else if (m === "k401ladder") {
    // 401(k) balance milestones and what each means.
    const tiers: [string, string][] = [["$0", "the start line"], ["$50K", "momentum"], ["$100K", "the hard part's done"], ["$250K", "compounding visible"], ["$500K", "coasting toward it"], ["$1M+", "the millionaire club"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => { const w = 150 + i * 128; const y = 90 + i * 66; return <g key={i} opacity={interpolate(climb, [i * 0.13, i * 0.13 + 0.2], [0, 1], clampBoth)}><rect x={VW / 2 - w / 2} y={y} width={w} height={54} rx={7} fill={[parch, "#e8d7bf", "#cfe3d4", "#9cc47f", gold, green][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 50} y={y + 34} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><text x={VW / 2 + 55} y={y + 33} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">your 401(k) milestones</text>
      </svg>
    );
  } else if (m === "balancetoincome") {
    // balance × 4% = annual retirement income.
    const pop = spring({ frame, fps, delay: fps * 1.0, config: { damping: 10 } });
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={110} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what your balance really pays you</text>
        <g transform="translate(250 290)"><circle r={78} fill={gold} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>balance</text><text y={18} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$500K</text></g>
        <text x={430} y={300} fontSize={28} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">× 4%</text>
        <path d="M520 290 l70 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform={`translate(760 290) scale(${Math.min(1, pop)})`}><circle r={70} fill={green} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>income</text><text y={18} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">$20K/yr</text></g>
        <text x={VW / 2} y={460} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>every $100K ≈ $4,000 a year in retirement, forever</text>
      </svg>
    );
  } else if (m === "k401millionaire") {
    // The 401(k) millionaire milestone & time to reach it.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    const amt = Math.round(1000000 * Math.pow(grow, 1.8));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the 401(k) millionaire</text>
        <g transform={`translate(${VW / 2} 290)`}>
          <circle r={70 + 50 * grow} fill={green} stroke={ink} strokeWidth={6} />
          <text y={10} fontSize={22 + 6 * grow} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">${amt.toLocaleString("en-US")}</text>
        </g>
        <text x={VW / 2} y={470} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>max it out from 25, and you're a millionaire by your 40s</text>
      </svg>
    );
  } else if (m === "sideincomeladder") {
    // Side-income tiers $500 → $10K/mo and what each unlocks.
    const tiers: [string, string][] = [["$500", "a bill covered"], ["$1K", "groceries + breathing room"], ["$2.5K", "rent covered"], ["$5K", "a second salary"], ["$10K", "quit-your-job money"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => { const w = 170 + i * 135; const y = 100 + i * 74; return <g key={i} opacity={interpolate(climb, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><rect x={VW / 2 - w / 2} y={y} width={w} height={58} rx={7} fill={[parch, "#e8d7bf", gold, "#9cc47f", green][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 55} y={y + 37} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}/mo</text><text x={VW / 2 + 60} y={y + 36} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the side-income ladder</text>
      </svg>
    );
  } else if (m === "activevsscalable") {
    // The spectrum: trade time for money vs build an asset.
    const slide = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the side-income spectrum</text>
        <defs><linearGradient id="spec74" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={red} /><stop offset="1" stopColor={green} /></linearGradient></defs>
        <rect x={120} y={200} width={740} height={34} rx={17} fill="url(#spec74)" stroke={ink} strokeWidth={4} />
        <g transform="translate(220 320)" opacity={interpolate(slide, [0, 0.5], [0, 1], clampBoth)}><rect x={-120} y={-44} width={240} height={88} rx={10} fill={red} stroke={ink} strokeWidth={4} /><text y={-10} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>ACTIVE</text><text y={14} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>trade time for money</text><text y={32} fontSize={11} fontWeight={700} fill="#fff" textAnchor="middle" fontFamily={sans}>gig · freelance · services</text></g>
        <g transform="translate(760 320)" opacity={interpolate(slide, [0.4, 0.9], [0, 1], clampBoth)}><rect x={-120} y={-44} width={240} height={88} rx={10} fill={green} stroke={ink} strokeWidth={4} /><text y={-10} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>SCALABLE</text><text y={14} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>build an asset once</text><text y={32} fontSize={11} fontWeight={700} fill="#fff" textAnchor="middle" fontFamily={sans}>content · products · apps</text></g>
        <text x={VW / 2} y={460} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the goal: slide from selling hours to building assets</text>
      </svg>
    );
  } else if (m === "hoursvsincome") {
    // Active caps out with hours; scalable keeps rising.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 130, x1 = 870, y0 = 430, yTop = 120;
    const flat = (t: number) => y0 - (y0 - 250) * Math.min(1, t * 1.6);
    const rise = (t: number) => y0 - (y0 - yTop) * (t * t);
    const seg = (f: (t: number) => number) => Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${f(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">income vs the hours you put in</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <RLine x1={x0} y1={yTop} x2={x0} y2={y0} stroke={ink} strokeWidth={3} />
        <text x={VW / 2} y={y0 + 28} fontSize={13} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>hours worked →</text>
        <path d={seg(flat)} fill="none" stroke={red} strokeWidth={6} />
        <path d={seg(rise)} fill="none" stroke={green} strokeWidth={6} />
        <text x={x1 - 60} y={255} fontSize={13} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>active: caps out</text>
        <text x={x1 - 90} y={yTop + 20} fontSize={13} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>scalable: keeps climbing</text>
      </svg>
    );
  } else if (m === "sidetaxbite") {
    // Self-employment tax takes a slice of 1099 income.
    const cut = interpolate(frame, [fps * 0.5, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the side-hustle tax bite</text>
        <g transform="translate(250 300)"><circle r={92} fill={gold} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>you earn</text><text y={20} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$5,000</text></g>
        <path d="M365 300 l80 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(540 230)" opacity={cut}><rect x={-70} y={-26} width={150} height={52} rx={8} fill={red} stroke={ink} strokeWidth={4} /><text y={-2} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>self-employ. tax</text><text y={16} fontSize={14} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>~15.3%</text></g>
        <g transform="translate(540 320)" opacity={cut}><rect x={-70} y={-26} width={150} height={52} rx={8} fill="#d98b5f" stroke={ink} strokeWidth={4} /><text y={-2} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>income tax</text><text y={16} fontSize={14} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>your bracket</text></g>
        <g transform="translate(800 300)"><circle r={92 - 30 * cut} fill={green} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>you keep</text><text y={18} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">less</text></g>
        <text x={VW / 2} y={470} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>no employer withholds for you — set aside ~25-30% yourself</text>
      </svg>
    );
  } else if (m === "hustletobusiness") {
    // When a side hustle becomes a real business.
    const stages: [string, string][] = [["side hustle", "a few hours, pocket money"], ["side business", "systems, repeat clients"], ["real business", "runs without you"]];
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">when a hustle becomes a business</text>
        {stages.map(([t, d], i) => { const x = 180 + i * 300; const op = interpolate(reveal, [i * 0.28, i * 0.28 + 0.25], [0, 1], clampBoth); return <g key={i} opacity={op}><rect x={x - 115} y={220} width={230} height={100} rx={12} fill={[parch, gold, green][i]} stroke={ink} strokeWidth={4} /><text x={x} y={258} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{t}</text><text x={x} y={288} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{d}</text>{i < 2 ? <path d={`M${x + 125} 270 l50 0 m0 0 l-14 -9 m14 9 l-14 9`} stroke={ink} strokeWidth={4} fill="none" strokeLinecap="round" /> : null}</g>; })}
        <text x={VW / 2} y={400} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the line you cross: it earns while you sleep</text>
      </svg>
    );
  } else if (m === "renttierladder") {
    // Rent tiers $800 → $8K and what each gets you.
    const tiers: [string, string][] = [["$800", "a room or rural town"], ["$1,500", "a modest 1-bed, mid city"], ["$2,500", "a nice place, big city"], ["$4,000", "luxury / prime metro"], ["$8,000", "ultra-prime NYC / SF"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => { const w = 180 + i * 130; const y = 100 + i * 74; return <g key={i} opacity={interpolate(climb, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><rect x={VW / 2 - w / 2} y={y} width={w} height={58} rx={7} fill={[parch, "#e8d7bf", gold, "#d98b5f", red][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 55} y={y + 37} fontSize={18} fontWeight={900} fill={i >= 3 ? "#fff" : ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}/mo</text><text x={VW / 2 + 60} y={y + 36} fontSize={13} fontWeight={800} fill={i >= 3 ? "#fff" : ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the rent ladder</text>
      </svg>
    );
  } else if (m === "thirtypercentrule") {
    // The 30%-of-income rule; above it you're rent-burdened.
    const fill = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const barY = 160, barH = 220, barX = VW / 2 - 70;
    const thirty = barY + barH * 0.7;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={90} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the 30% rule</text>
        <rect x={barX} y={barY} width={140} height={barH} rx={8} fill="#efe9da" stroke={ink} strokeWidth={4} />
        <rect x={barX} y={barY + barH * (1 - 0.7 * fill)} width={140} height={barH * 0.7 * fill} rx={8} fill={green} stroke={ink} strokeWidth={3} />
        <RLine x1={barX - 30} y1={thirty} x2={barX + 170} y2={thirty} stroke={red} strokeWidth={4} />
        <text x={barX + 180} y={thirty + 5} fontSize={15} fontWeight={900} fill={red} fontFamily={sans}>30% of income</text>
        <text x={barX + 70} y={barY + barH + 30} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>your rent</text>
        <text x={VW / 2} y={450} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>spend more than 30% on rent and you're "rent-burdened"</text>
      </svg>
    );
  } else if (m === "rentvsownlifetime") {
    // Rent over a lifetime = a fortune, nothing owned.
    const grow = interpolate(frame, [fps * 0.5, fps * 2.6], [0, 1], clampBoth);
    const total = Math.round(960000 * grow);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$2,000/mo rent, for 40 years</text>
        <g transform={`translate(${VW / 2} 250)`}>
          <circle r={95} fill={red} stroke={ink} strokeWidth={6} />
          <text y={-6} fontSize={16} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>paid out</text>
          <text y={24} fontSize={26} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">${total.toLocaleString("en-US")}</text>
        </g>
        <text x={VW / 2} y={400} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>nearly a million dollars — and you own nothing</text>
        <text x={VW / 2} y={432} fontSize={14} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>(rent buys a place to live, never an asset)</text>
      </svg>
    );
  } else if (m === "whatrentbuys") {
    // Rent pays for three things: location, space, amenities.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const cols: [string, string][] = [["location", "the #1 price driver"], ["space", "beds, baths, square feet"], ["amenities", "gym, doorman, parking"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={90} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what your rent actually pays for</text>
        {cols.map(([t, d], i) => { const x = 200 + i * 290; const op = interpolate(reveal, [i * 0.22, i * 0.22 + 0.25], [0, 1], clampBoth); return <g key={i} opacity={op}><rect x={x - 120} y={200} width={240} height={110} rx={12} fill={[gold, "#9cc47f", "#cfe3d4"][i]} stroke={ink} strokeWidth={4} /><text x={x} y={242} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{t}</text><text x={x} y={274} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{d}</text></g>; })}
        <text x={VW / 2} y={400} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>same salary buys a mansion in one city, a studio in another</text>
      </svg>
    );
  } else if (m === "renthiddencosts") {
    // The move-in costs stacked on top of rent.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const items: [string, string][] = [["first month", "$2,000"], ["security deposit", "$2,000"], ["broker fee", "$2,000"], ["utilities + insurance", "$200/mo"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the real cost of moving in</text>
        {items.map(([lab, amt], i) => { const y = 120 + i * 72; return <g key={i} opacity={interpolate(reveal, [i * 0.18, i * 0.18 + 0.22], [0, 1], clampBoth)}><rect x={260} y={y} width={300} height={56} rx={8} fill={i === 3 ? "#e8d7bf" : "#efe9da"} stroke={ink} strokeWidth={3} /><text x={280} y={y + 35} fontSize={15} fontWeight={800} fill={ink} fontFamily={sans}>{lab}</text><rect x={580} y={y} width={160} height={56} rx={8} fill={red} stroke={ink} strokeWidth={3} /><text x={660} y={y + 35} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{amt}</text></g>; })}
        <text x={VW / 2} y={450} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>a $2K apartment can need $6K+ just to walk in the door</text>
      </svg>
    );
  } else if (m === "carpaymentladder") {
    // Car-payment tiers $300 → $1,200/mo and what each means.
    const tiers: [string, string][] = [["$300", "a modest used car"], ["$500", "an average new car"], ["$700", "a nicer new car"], ["$900", "entry luxury / big truck"], ["$1,200+", "the payment trap"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => { const w = 180 + i * 130; const y = 100 + i * 74; return <g key={i} opacity={interpolate(climb, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><rect x={VW / 2 - w / 2} y={y} width={w} height={58} rx={7} fill={[parch, "#e8d7bf", gold, "#d98b5f", red][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 55} y={y + 37} fontSize={18} fontWeight={900} fill={i >= 3 ? "#fff" : ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}/mo</text><text x={VW / 2 + 60} y={y + 36} fontSize={13} fontWeight={800} fill={i >= 3 ? "#fff" : ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the car-payment ladder</text>
      </svg>
    );
  } else if (m === "depreciationcliff") {
    // A new car's value falling off a cliff over 5 years.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 130, x1 = 870, y0 = 430, yTop = 130;
    const val = (t: number) => y0 - (y0 - yTop) * Math.exp(-1.9 * t);
    const seg = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${val(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the depreciation cliff</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <RLine x1={x0} y1={yTop} x2={x0} y2={y0} stroke={ink} strokeWidth={3} />
        <path d={seg} fill="none" stroke={red} strokeWidth={6} />
        <text x={x0 + 30} y={yTop + 4} fontSize={13} fontWeight={800} fill={ink} fontFamily={sans}>new: 100%</text>
        <text x={x0 + 150} y={val(0.08 * 1) - 14} fontSize={13} fontWeight={900} fill={red} fontFamily={sans}>−20% off the lot</text>
        <text x={x1 - 60} y={y0 - 24} fontSize={13} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>~40% left at 5 yrs</text>
        <text x={VW / 2} y={y0 + 30} fontSize={14} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>years of ownership →</text>
      </svg>
    );
  } else if (m === "truecarcost") {
    // The payment is only part of the real monthly cost.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const items: [string, string][] = [["loan payment", "$500"], ["insurance", "$180"], ["gas", "$180"], ["maintenance + repairs", "$120"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the payment is only the start</text>
        {items.map(([lab, amt], i) => { const y = 104 + i * 64; return <g key={i} opacity={interpolate(reveal, [i * 0.16, i * 0.16 + 0.22], [0, 1], clampBoth)}><rect x={250} y={y} width={320} height={50} rx={8} fill={i === 0 ? gold : "#efe9da"} stroke={ink} strokeWidth={3} /><text x={270} y={y + 32} fontSize={15} fontWeight={800} fill={ink} fontFamily={sans}>{lab}</text><rect x={590} y={y} width={140} height={50} rx={8} fill={i === 0 ? ink : "#d98b5f"} stroke={ink} strokeWidth={3} /><text x={660} y={y + 32} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{amt}</text></g>; })}
        <g opacity={interpolate(reveal, [0.75, 1], [0, 1], clampBoth)}><rect x={250} y={372} width={480} height={56} rx={9} fill={red} stroke={ink} strokeWidth={4} /><text x={270} y={407} fontSize={16} fontWeight={900} fill="#fff" fontFamily={sans}>REAL monthly cost</text><text x={700} y={407} fontSize={20} fontWeight={900} fill="#fff" textAnchor="end" fontFamily="Georgia, serif">~$980</text></g>
      </svg>
    );
  } else if (m === "car2041010rule") {
    // The 20/4/10 rule for buying a car sanely.
    const pop = (d: number) => Math.min(1, spring({ frame, fps, delay: d, config: { damping: 11 } }));
    const items: [string, string, string][] = [["20%", "down payment", gold], ["4 yrs", "max loan length", green], ["10%", "of income on all car costs", blue]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={90} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the 20 / 4 / 10 rule</text>
        {items.map(([big, lab, col], i) => { const x = 200 + i * 290; return <g key={i} transform={`translate(${x} 270) scale(${pop(fps * (0.4 + i * 0.4))})`}><circle r={82} fill={col as string} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={26} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{big}</text><text y={20} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={430} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>break any of the three, and the car is too expensive</text>
      </svg>
    );
  } else if (m === "underwaterloan") {
    // Long loans leave you owing more than the car is worth.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 130, x1 = 870, yTop = 140, mid = 300, y0 = 430;
    const value = (t: number) => mid - (mid - yTop) + (y0 - yTop) * (1 - Math.exp(-1.6 * t));
    const owed = (t: number) => yTop + (y0 - yTop) * t * 0.72;
    const segV = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${value(t)}`; }).join(" ");
    const segO = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${owed(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">upside-down: owing more than it's worth</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <path d={segO} fill="none" stroke={red} strokeWidth={6} />
        <path d={segV} fill="none" stroke={green} strokeWidth={6} />
        <text x={x1 - 40} y={owed(1) - 12} fontSize={13} fontWeight={900} fill={red} textAnchor="end" fontFamily={sans}>loan owed</text>
        <text x={x1 - 40} y={value(1) + 24} fontSize={13} fontWeight={900} fill={green} textAnchor="end" fontFamily={sans}>car value</text>
        <text x={VW / 2} y={y0 + 30} fontSize={14} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>a 72-84 month loan keeps you underwater for years</text>
      </svg>
    );
  } else if (m === "caroppcost") {
    // A big car payment invested instead becomes a fortune.
    const grow = interpolate(frame, [fps * 0.5, fps * 2.6], [0, 1], clampBoth);
    const amt = Math.round(1800000 * Math.pow(grow, 1.7));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$1,200/mo, invested instead, for 40 years</text>
        <g transform={`translate(${VW / 2} 270)`}>
          <circle r={80 + 45 * grow} fill={green} stroke={ink} strokeWidth={6} />
          <text y={6} fontSize={24 + 4 * grow} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">${amt.toLocaleString("en-US")}</text>
        </g>
        <text x={VW / 2} y={450} fontSize={16} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the luxury payment is a multi-million-dollar choice</text>
      </svg>
    );
  } else if (m === "studentdebtladder") {
    // Student-debt tiers $10K → $300K and what each means.
    const tiers: [string, string][] = [["$10K", "manageable"], ["$30K", "the US average"], ["$60K", "a grad degree"], ["$100K", "professional school"], ["$300K", "med / law / dental"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => { const w = 180 + i * 130; const y = 100 + i * 74; return <g key={i} opacity={interpolate(climb, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><rect x={VW / 2 - w / 2} y={y} width={w} height={58} rx={7} fill={[parch, gold, "#d98b5f", "#c0583a", red][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 55} y={y + 37} fontSize={18} fontWeight={900} fill={i >= 2 ? "#fff" : ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><text x={VW / 2 + 60} y={y + 36} fontSize={13} fontWeight={800} fill={i >= 2 ? "#fff" : ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the student-debt ladder</text>
      </svg>
    );
  } else if (m === "debttoincomebyfield") {
    // Which degrees pay the debt back — salary vs debt by field.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    const rows: [string, string, boolean][] = [["engineering / CS", "high pay, low debt", true], ["nursing", "steady pay, fair debt", true], ["business", "it depends", true], ["law (non-elite)", "big debt, uneven pay", false], ["arts / humanities", "low pay, same debt", false]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={60} fontSize={21} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">does the degree pay the debt back?</text>
        {rows.map(([field, note, good], i) => { const y = 92 + i * 72; return <g key={i} opacity={interpolate(reveal, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><rect x={200} y={y} width={360} height={56} rx={8} fill="#efe9da" stroke={ink} strokeWidth={3} /><text x={220} y={y + 34} fontSize={15} fontWeight={800} fill={ink} fontFamily={sans}>{field}</text><rect x={580} y={y} width={220} height={56} rx={8} fill={good ? green : red} stroke={ink} strokeWidth={3} /><text x={690} y={y + 29} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{good ? "✓" : "✕"} {note}</text></g>; })}
      </svg>
    );
  } else if (m === "interestballoon") {
    // Negative amortization — paying, but the balance still grows.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 130, x1 = 870, y0 = 430, yTop = 150;
    const bal = (t: number) => y0 - (y0 - yTop) * (0.45 + 0.55 * t);
    const seg = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${bal(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">paying every month — and it still grows</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <RLine x1={x0} y1={yTop} x2={x0} y2={y0} stroke={ink} strokeWidth={3} />
        <path d={seg} fill="none" stroke={red} strokeWidth={6} />
        <text x={x0 + 120} y={bal(0) + 30} fontSize={13} fontWeight={800} fill={ink} fontFamily={sans}>you start here</text>
        <text x={x1 - 40} y={bal(1) - 14} fontSize={14} fontWeight={900} fill={red} textAnchor="end" fontFamily={sans}>balance keeps rising</text>
        <text x={VW / 2} y={y0 + 30} fontSize={14} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>when the payment is less than the interest, the debt grows</text>
      </svg>
    );
  } else if (m === "collegeroi") {
    // Degree wage premium vs no degree.
    const grow = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the college wage premium</text>
        <g transform="translate(320 0)"><rect x={-70} y={430 - 150 * grow} width={140} height={150 * grow} rx={6} fill="#bdbdbd" stroke={ink} strokeWidth={4} /><text x={0} y={456} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>no degree</text><text x={0} y={420 - 150 * grow} fontSize={15} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">~$44K</text></g>
        <g transform="translate(660 0)"><rect x={-70} y={430 - 250 * grow} width={140} height={250 * grow} rx={6} fill={green} stroke={ink} strokeWidth={4} /><text x={0} y={456} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>bachelor's</text><text x={0} y={420 - 250 * grow} fontSize={15} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">~$70K</text></g>
        <text x={VW / 2} y={110} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>a degree pays — but only if the debt stays sane</text>
      </svg>
    );
  } else if (m === "repaymentpaths") {
    // Three repayment paths.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.2], [0, 1], clampBoth);
    const cols: [string, string][] = [["standard", "10 yrs, highest payment, least interest"], ["income-driven", "% of income, longer, more interest"], ["forgiveness", "PSLF: 10 yrs of public service, wiped"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">three ways to pay it back</text>
        {cols.map(([t, d], i) => { const x = 200 + i * 290; const op = interpolate(reveal, [i * 0.22, i * 0.22 + 0.25], [0, 1], clampBoth); return <g key={i} opacity={op}><rect x={x - 125} y={190} width={250} height={130} rx={12} fill={[gold, "#9cc47f", "#cfe3d4"][i]} stroke={ink} strokeWidth={4} /><text x={x} y={226} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{t}</text><text x={x} y={258} fontSize={11.5} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{d.split(",").map((ln, j) => <tspan key={j} x={x} dy={j === 0 ? 0 : 16}>{ln.trim()}</tspan>)}</text></g>; })}
        <text x={VW / 2} y={400} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>pick the path that fits your field and your salary</text>
      </svg>
    );
  } else if (m === "delayedlife") {
    // Debt delays the milestones of adult life.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const items: [string][] = [["buying a house"], ["getting married"], ["having kids"], ["starting a business"], ["saving for retirement"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what the debt quietly delays</text>
        {items.map(([lab], i) => { const y = 112 + i * 64; return <g key={i} opacity={interpolate(reveal, [i * 0.16, i * 0.16 + 0.22], [0, 1], clampBoth)}><rect x={280} y={y} width={440} height={50} rx={9} fill="#efe9da" stroke={ink} strokeWidth={3} /><text x={310} y={y + 32} fontSize={16} fontWeight={800} fill={ink} fontFamily={sans}>{lab}</text><text x={690} y={y + 32} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>⏳</text></g>; })}
        <text x={VW / 2} y={456} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the real cost isn't just money — it's years of your life</text>
      </svg>
    );
  } else if (m === "lotterywinladder") {
    // Lottery-win tiers $1K → $1B and what each does.
    const tiers: [string, string][] = [["$1K", "a nice weekend"], ["$100K", "a car or down payment"], ["$1M", "life-changing, not forever"], ["$100M", "true generational wealth"], ["$1B", "a dynasty"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([amt, lab], i) => { const w = 180 + i * 130; const y = 100 + i * 74; return <g key={i} opacity={interpolate(climb, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><rect x={VW / 2 - w / 2} y={y} width={w} height={58} rx={7} fill={[parch, "#e8d7bf", gold, "#9cc47f", green][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 55} y={y + 37} fontSize={18} fontWeight={900} fill={i >= 4 ? "#fff" : ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><text x={VW / 2 + 60} y={y + 36} fontSize={13} fontWeight={800} fill={i >= 4 ? "#fff" : ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the lottery-win ladder</text>
      </svg>
    );
  } else if (m === "lotteryoddsscale") {
    // The odds: lightning vs the jackpot.
    const pop = (d: number) => Math.min(1, spring({ frame, fps, delay: d, config: { damping: 12 } }));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the odds you never hear about</text>
        <g transform={`translate(300 270) scale(${pop(fps * 0.4)})`}><circle r={92} fill={gold} stroke={ink} strokeWidth={5} /><text y={-16} fontSize={30} textAnchor="middle">⚡</text><text y={16} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>struck by lightning</text><text y={38} fontSize={13} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>~1 in 1 million</text></g>
        <g transform={`translate(700 270) scale(${pop(fps * 1.0)})`}><circle r={92} fill={red} stroke={ink} strokeWidth={5} /><text y={-16} fontSize={26} textAnchor="middle">🎟️</text><text y={16} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>the jackpot</text><text y={38} fontSize={13} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>~1 in 300 million</text></g>
        <text x={VW / 2} y={430} fontSize={16} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>you're ~300× likelier to be hit by lightning than win</text>
      </svg>
    );
  } else if (m === "lumpsumvsannuity") {
    // Lump sum (~half now) vs annuity (full, over 30 yrs).
    const reveal = interpolate(frame, [fps * 0.4, fps * 2.0], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$1 billion jackpot — two choices</text>
        <g opacity={interpolate(reveal, [0, 0.5], [0, 1], clampBoth)} transform="translate(300 270)"><rect x={-130} y={-70} width={260} height={150} rx={12} fill={gold} stroke={ink} strokeWidth={4} /><text y={-38} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>LUMP SUM</text><text y={-4} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">~$500M</text><text y={28} fontSize={12} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>cash now</text><text y={52} fontSize={11} fontWeight={700} fill={ink} textAnchor="middle" fontFamily={sans}>(before tax)</text></g>
        <g opacity={interpolate(reveal, [0.4, 0.9], [0, 1], clampBoth)} transform="translate(700 270)"><rect x={-130} y={-70} width={260} height={150} rx={12} fill="#9cc47f" stroke={ink} strokeWidth={4} /><text y={-38} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>ANNUITY</text><text y={-4} fontSize={24} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$1B</text><text y={28} fontSize={12} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>full amount</text><text y={52} fontSize={11} fontWeight={700} fill={ink} textAnchor="middle" fontFamily={sans}>over 30 years</text></g>
        <text x={VW / 2} y={430} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the headline number is the annuity — the cash is about half</text>
      </svg>
    );
  } else if (m === "lotterytaxbite") {
    // The tax bite on the lump sum.
    const cut = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$1B headline → what you keep</text>
        <g transform="translate(220 280)"><circle r={78} fill={gold} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>headline</text><text y={18} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$1B</text></g>
        <g transform="translate(490 280)" opacity={cut}><rect x={-80} y={-50} width={160} height={46} rx={7} fill="#d98b5f" stroke={ink} strokeWidth={3} /><text y={-20} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>lump sum: ~half</text><rect x={-80} y={6} width={160} height={46} rx={7} fill={red} stroke={ink} strokeWidth={3} /><text y={36} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>taxes: ~37%+</text></g>
        <g transform="translate(790 280)"><circle r={78 - 34 * cut} fill={green} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>you keep</text><text y={18} fontSize={17} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">~$300M</text></g>
        <text x={VW / 2} y={450} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>a $1B jackpot is really about $300M in the bank</text>
      </svg>
    );
  } else if (m === "lotterycurse") {
    // The lottery curse: a third go bankrupt.
    const fill = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const total = 30, bankrupt = Math.round(10 * fill);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the lottery curse</text>
        {Array.from({ length: total }).map((_, i) => { const col = i % 10, row = Math.floor(i / 10); const x = 320 + col * 48; const y = 130 + row * 70; const isB = i < bankrupt * 3; return <g key={i}><circle cx={x} cy={y} r={16} fill={isB ? red : "#9cc47f"} stroke={ink} strokeWidth={2.5} /></g>; })}
        <text x={VW / 2} y={360} fontSize={17} fontWeight={900} fill={red} textAnchor="middle" fontFamily={sans}>roughly 1 in 3 big winners goes broke</text>
        <text x={VW / 2} y={400} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>sudden money with no money skills is a time bomb</text>
      </svg>
    );
  } else if (m === "wintoincome") {
    // What each win safely generates at 4%.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const rows: [string, string][] = [["$100K", "$4,000 / year"], ["$1M", "$40,000 / year"], ["$10M", "$400,000 / year"], ["$100M", "$4,000,000 / year"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={21} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what the win safely pays, forever (4%)</text>
        {rows.map(([amt, inc], i) => { const y = 100 + i * 72; return <g key={i} opacity={interpolate(reveal, [i * 0.18, i * 0.18 + 0.22], [0, 1], clampBoth)}><rect x={250} y={y} width={200} height={56} rx={8} fill={gold} stroke={ink} strokeWidth={3} /><text x={350} y={y + 35} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{amt}</text><path d={`M460 ${y + 28} l50 0 m0 0 l-14 -9 m14 9 l-14 9`} stroke={ink} strokeWidth={3} fill="none" /><rect x={520} y={y} width={230} height={56} rx={8} fill={green} stroke={ink} strokeWidth={3} /><text x={635} y={y + 35} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{inc}</text></g>; })}
        <text x={VW / 2} y={448} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>$1M sounds infinite — it's really a solid salary</text>
      </svg>
    );
  } else if (m === "lotteryplaybook") {
    // The smart-money steps after a win.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    const steps: string[] = ["stay anonymous, tell no one", "hire a lawyer + fee-only advisor", "take the lump sum, invest in index funds", "set a safe withdrawal rate", "don't quit your life overnight"];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the smart-money playbook</text>
        {steps.map((t, i) => { const y = 98 + i * 62; return <g key={i} opacity={interpolate(reveal, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><circle cx={250} cy={y + 24} r={18} fill={gold} stroke={ink} strokeWidth={3} /><text x={250} y={y + 30} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{i + 1}</text><rect x={288} y={y} width={440} height={48} rx={8} fill="#efe9da" stroke={ink} strokeWidth={3} /><text x={308} y={y + 30} fontSize={14} fontWeight={800} fill={ink} fontFamily={sans}>{t}</text></g>; })}
      </svg>
    );
  } else if (m === "retireageladder") {
    // Retirement age ladder 40 → 70.
    const tiers: [string, string][] = [["40", "FIRE — decades of freedom"], ["50", "early & bold"], ["55", "the sweet spot for some"], ["62", "earliest Social Security"], ["67", "full Social Security"], ["70", "max Social Security"]];
    const climb = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        {tiers.map(([age, lab], i) => { const w = 160 + i * 128; const y = 90 + i * 66; return <g key={i} opacity={interpolate(climb, [i * 0.13, i * 0.13 + 0.2], [0, 1], clampBoth)}><rect x={VW / 2 - w / 2} y={y} width={w} height={54} rx={7} fill={[green, "#9cc47f", gold, "#e8d7bf", "#d8c29a", parch][i]} stroke={ink} strokeWidth={4} /><text x={VW / 2 - 50} y={y + 34} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{age}</text><text x={VW / 2 + 55} y={y + 33} fontSize={12} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text></g>; })}
        <text x={VW / 2} y={60} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the retirement-age dial</text>
      </svg>
    );
  } else if (m === "eggneededbyage") {
    // Nest egg needed to retire at each age (earlier = bigger).
    const draw = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    const bars: [string, number, string][] = [["40", 100, red], ["50", 80, "#d98b5f"], ["60", 55, gold], ["67", 38, green]];
    const maxH = 240, base = 430;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={21} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">nest egg needed to retire at…</text>
        <RLine x1={120} y1={base} x2={860} y2={base} stroke={ink} strokeWidth={3} />
        {bars.map(([age, pct, col], i) => { const h = maxH * (pct / 100) * draw; const x = 210 + i * 160; return <g key={i}><rect x={x - 55} y={base - h} width={110} height={h} rx={6} fill={col as string} stroke={ink} strokeWidth={4} /><text x={x} y={base + 26} fontSize={16} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">age {age}</text><text x={x} y={base - h - 12} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{["biggest", "huge", "smaller", "smallest"][i]}</text></g>; })}
        <text x={VW / 2} y={110} fontSize={14} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>retire earlier → you need a far bigger pile</text>
      </svg>
    );
  } else if (m === "ssclaimingage") {
    // Social Security: claim at 62 (haircut) vs 70 (bonus).
    const pop = (d: number) => Math.min(1, spring({ frame, fps, delay: d, config: { damping: 11 } }));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">when you claim Social Security</text>
        <g transform={`translate(260 280) scale(${pop(fps * 0.4)})`}><circle r={82} fill={red} stroke={ink} strokeWidth={5} /><text y={-16} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">62</text><text y={10} fontSize={14} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>−30%</text><text y={34} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle" fontFamily={sans}>smaller forever</text></g>
        <g transform={`translate(520 280) scale(${pop(fps * 0.9)})`}><circle r={72} fill={gold} stroke={ink} strokeWidth={5} /><text y={-12} fontSize={20} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">67</text><text y={14} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>full</text></g>
        <g transform={`translate(780 280) scale(${pop(fps * 1.4)})`}><circle r={92} fill={green} stroke={ink} strokeWidth={5} /><text y={-16} fontSize={24} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">70</text><text y={12} fontSize={14} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>+24%</text><text y={36} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle" fontFamily={sans}>bigger forever</text></g>
        <text x={VW / 2} y={430} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>wait, and each check is far larger — for life</text>
      </svg>
    );
  } else if (m === "healthcaregap") {
    // The healthcare gap before Medicare at 65.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    const x0 = 120, x1 = 860, y = 250;
    const gapEnd = x0 + (x1 - x0) * 0.72;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={90} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the pre-Medicare gap</text>
        <RLine x1={x0} y1={y} x2={x1} y2={y} stroke={ink} strokeWidth={3} />
        <rect x={x0} y={y - 30} width={(gapEnd - x0) * draw} height={60} rx={6} fill={red} opacity={0.85} stroke={ink} strokeWidth={3} />
        <text x={(x0 + gapEnd) / 2} y={y + 6} fontSize={14} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>buy your own insurance</text>
        <text x={x0} y={y + 52} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>retire early</text>
        <g transform={`translate(${gapEnd} ${y})`}><circle r={30} fill={green} stroke={ink} strokeWidth={4} /><text y={5} fontSize={13} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>65</text></g>
        <text x={gapEnd} y={y + 52} fontSize={13} fontWeight={800} fill={green} textAnchor="middle" fontFamily={sans}>Medicare</text>
        <text x={VW / 2} y={400} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>retire before 65 and you self-fund health insurance</text>
      </svg>
    );
  } else if (m === "oneyearsyndrome") {
    // 'One more year' syndrome.
    const reveal = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={90} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">"one more year" syndrome</text>
        <g transform="translate(300 270)"><circle r={92} fill={gold} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>enough to retire</text><text y={18} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>but scared</text></g>
        <g opacity={reveal} transform="translate(700 270)"><circle r={92} fill="#e0e0e0" stroke={ink} strokeWidth={5} /><text y={-6} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>'just one more'</text><text y={18} fontSize={13} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>…every year</text></g>
        <path d={`M400 270 C 480 220, 560 220, 600 270`} fill="none" stroke={ink} strokeWidth={4} strokeDasharray="7 7" opacity={reveal} />
        <text x={VW / 2} y={430} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the trap: trading your healthiest years for more money you won't need</text>
      </svg>
    );
  } else if (m === "yearsfreevsyearssaving") {
    // The core trade-off: years free vs years still saving.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the core trade-off</text>
        <g transform="translate(300 0)"><rect x={-90} y={430 - 240 * draw} width={180} height={240 * draw} rx={6} fill={green} stroke={ink} strokeWidth={4} /><text x={0} y={456} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>retire at 45</text><text x={0} y={420 - 240 * draw} fontSize={13} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>more free years</text></g>
        <g transform="translate(680 0)"><rect x={-90} y={430 - 120 * draw} width={180} height={120 * draw} rx={6} fill={gold} stroke={ink} strokeWidth={4} /><text x={0} y={456} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>retire at 65</text><text x={0} y={420 - 120 * draw} fontSize={13} fontWeight={900} fill={ink} textAnchor="middle" fontFamily={sans}>more money + SS</text></g>
        <text x={VW / 2} y={110} fontSize={14} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>free years vs security — you can't max both</text>
      </svg>
    );
  } else if (m === "rateladdergrowth") {
    // What $10K becomes over 40 years at each rate.
    const draw = interpolate(frame, [fps * 0.3, fps * 2.8], [0, 1], clampBoth);
    const bars: [string, string, number, string][] = [["1%", "$15K", 6, parch], ["3%", "$33K", 13, "#e8d7bf"], ["6%", "$103K", 40, gold], ["8%", "$217K", 84, "#9cc47f"], ["10%", "$453K", 175, "#3a9d53"], ["15%", "$2.7M", 240, green]];
    const base = 440;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={54} fontSize={21} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">$10,000 over 40 years, by rate</text>
        <RLine x1={90} y1={base} x2={910} y2={base} stroke={ink} strokeWidth={3} />
        {bars.map(([rate, amt, h, col], i) => { const x = 150 + i * 125; const hh = h * draw; return <g key={i}><rect x={x - 48} y={base - hh} width={96} height={hh} rx={5} fill={col as string} stroke={ink} strokeWidth={3.5} /><text x={x} y={base + 24} fontSize={15} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{rate}</text><text x={x} y={base - hh - 10} fontSize={12} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{amt}</text></g>; })}
        <text x={VW / 2} y={base + 48} fontSize={14} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>a few % points = a life-changing gap</text>
      </svg>
    );
  } else if (m === "hockeystickcurve") {
    // The exponential hockey-stick of compounding.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.8], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, y0 = 440, yTop = 110;
    const f = (t: number) => y0 - (y0 - yTop) * (Math.exp(2.6 * t) - 1) / (Math.exp(2.6) - 1);
    const seg = Array.from({ length: 48 }).map((_, i) => { const t = (i / 47) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${f(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the hockey stick of compounding</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <RLine x1={x0} y1={yTop} x2={x0} y2={y0} stroke={ink} strokeWidth={3} />
        <path d={seg} fill="none" stroke={green} strokeWidth={6} />
        <text x={x0 + 160} y={y0 - 18} fontSize={13} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>slow, boring start…</text>
        <text x={x1 - 110} y={f(0.82 * draw) - 16} fontSize={14} fontWeight={900} fill={green} textAnchor="middle" fontFamily={sans}>…then it explodes</text>
        <text x={VW / 2} y={y0 + 30} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>time →   (most growth comes at the very end)</text>
      </svg>
    );
  } else if (m === "doublingtime") {
    // Rule of 72: doubling time by rate.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const rows: [string, string][] = [["1%", "72 years"], ["3%", "24 years"], ["6%", "12 years"], ["10%", "7 years"], ["15%", "~5 years"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the Rule of 72: time to double</text>
        <text x={VW / 2} y={100} fontSize={14} fontWeight={800} fill={theme.inkSoft} textAnchor="middle" fontFamily={sans}>72 ÷ your rate = years to double your money</text>
        {rows.map(([rate, yrs], i) => { const y = 130 + i * 62; return <g key={i} opacity={interpolate(reveal, [i * 0.16, i * 0.16 + 0.22], [0, 1], clampBoth)}><rect x={300} y={y} width={150} height={48} rx={8} fill={gold} stroke={ink} strokeWidth={3} /><text x={375} y={y + 31} fontSize={17} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{rate}</text><path d={`M460 ${y + 24} l40 0 m0 0 l-12 -8 m12 8 l-12 8`} stroke={ink} strokeWidth={3} fill="none" /><rect x={510} y={y} width={190} height={48} rx={8} fill={green} stroke={ink} strokeWidth={3} /><text x={605} y={y + 31} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{yrs}</text></g>; })}
      </svg>
    );
  } else if (m === "ratefeedrag") {
    // Fees compound against you — the dark side.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, y0 = 430, yTop = 130;
    const full = (t: number) => y0 - (y0 - yTop) * (Math.exp(2.3 * t) - 1) / (Math.exp(2.3) - 1);
    const afterFee = (t: number) => y0 - (y0 - yTop) * 0.5 * (Math.exp(2.3 * t) - 1) / (Math.exp(2.3) - 1);
    const segA = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${full(t)}`; }).join(" ");
    const segB = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${afterFee(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">fees compound against you, too</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <path d={segA} fill="none" stroke={green} strokeWidth={6} />
        <path d={segB} fill="none" stroke={red} strokeWidth={6} />
        <text x={x1 - 60} y={full(1) - 12} fontSize={13} fontWeight={900} fill={green} textAnchor="end" fontFamily={sans}>no fees</text>
        <text x={x1 - 60} y={afterFee(1) + 22} fontSize={13} fontWeight={900} fill={red} textAnchor="end" fontFamily={sans}>−2% fee</text>
        <text x={VW / 2} y={y0 + 30} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>a 2% fee can quietly eat HALF your lifetime returns</text>
      </svg>
    );
  } else if (m === "timevsrate") {
    // Starting early beats a higher rate later.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">time usually beats rate</text>
        <g transform="translate(300 0)"><rect x={-95} y={430 - 250 * draw} width={190} height={250 * draw} rx={6} fill={green} stroke={ink} strokeWidth={4} /><text x={0} y={456} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>starts at 25, 7%</text><text x={0} y={418 - 250 * draw} fontSize={14} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">more</text></g>
        <g transform="translate(680 0)"><rect x={-95} y={430 - 150 * draw} width={190} height={150 * draw} rx={6} fill={gold} stroke={ink} strokeWidth={4} /><text x={0} y={456} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>starts at 40, 10%</text><text x={0} y={418 - 150 * draw} fontSize={14} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">less</text></g>
        <text x={VW / 2} y={115} fontSize={14} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>15 extra years can beat a 3-point-higher return</text>
      </svg>
    );
  } else if (m === "inflationnegcompound") {
    // Inflation as compounding working against you.
    const shrink = interpolate(frame, [fps * 0.5, fps * 2.6], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">inflation: compounding in reverse</text>
        <g transform="translate(280 290)"><circle r={96} fill={gold} stroke={ink} strokeWidth={5} /><text y={-6} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>$100 today</text><text y={18} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>full value</text></g>
        <path d="M395 290 l90 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(720 290)"><circle r={96 - 44 * shrink} fill={red} stroke={ink} strokeWidth={5} /><text y={-4} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>in 30 yrs</text><text y={18} fontSize={14} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>~$40</text></g>
        <text x={VW / 2} y={470} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>3% inflation halves your money's value in ~24 years</text>
      </svg>
    );
  } else if (m === "pricetoincomeladder") {
    // Price-to-income ratio by city; healthy = 3-5.
    const draw = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    const bars: [string, number, string][] = [["healthy", 4, "#9cc47f"], ["US avg", 5, gold], ["Toronto", 10, "#d98b5f"], ["Vancouver", 12, red]];
    const base = 440, maxH = 250, maxV = 12;
    const healthyY = base - maxH * (4 / maxV);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={60} fontSize={21} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">home price ÷ yearly income</text>
        <RLine x1={110} y1={base} x2={880} y2={base} stroke={ink} strokeWidth={3} />
        {bars.map(([lab, v, col], i) => { const h = maxH * (v / maxV) * draw; const x = 220 + i * 180; return <g key={i}><rect x={x - 60} y={base - h} width={120} height={h} rx={5} fill={col as string} stroke={ink} strokeWidth={3.5} /><text x={x} y={base + 24} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text><text x={x} y={base - h - 10} fontSize={14} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{v}×</text></g>; })}
        <line x1={110} y1={healthyY} x2={880} y2={healthyY} stroke={green} strokeWidth={3} strokeDasharray="8 6" />
        <text x={820} y={healthyY - 8} fontSize={12} fontWeight={800} fill={green} textAnchor="end" fontFamily={sans}>affordable ≈ 3-5×</text>
      </svg>
    );
  } else if (m === "thelockout") {
    // Young buyers locked out behind a gate.
    const pull = interpolate(frame, [fps * 0.5, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">a generation locked out</text>
        <g transform="translate(640 250)"><rect x={-70} y={-10} width={140} height={110} fill="#efe9da" stroke={ink} strokeWidth={5} /><path d="M-80 -10 L0 -70 L80 -10 Z" fill={gold} stroke={ink} strokeWidth={5} /><rect x={-20} y={40} width={40} height={60} fill={ink} /></g>
        <g transform={`translate(${260 - 60 * pull} 300)`}><circle r={26} fill={gold} stroke={ink} strokeWidth={4} /><rect x={-18} y={26} width={36} height={56} rx={8} fill={blue} stroke={ink} strokeWidth={4} /></g>
        {[0, 1, 2, 3].map((i) => <RLine key={i} x1={430 + i * 30} y1={180} x2={430 + i * 30} y2={420} stroke={ink} strokeWidth={6} />)}
        <text x={VW / 2} y={470} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the ladder's been pulled up behind them</text>
      </svg>
    );
  } else if (m === "demandvssupply") {
    // Too many buyers, too few homes — a tipping scale.
    const tip = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    const ang = -10 * tip;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">too many buyers, too few homes</text>
        <g transform={`translate(${VW / 2} 230) rotate(${ang})`}>
          <RLine x1={-250} y1={0} x2={250} y2={0} stroke={ink} strokeWidth={8} />
          <g transform="translate(-250 40)"><circle r={44} fill={red} stroke={ink} strokeWidth={4} /><text y={-2} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>demand</text><text y={16} fontSize={11} fontWeight={700} fill="#fff" textAnchor="middle" fontFamily={sans}>buyers++</text></g>
          <g transform="translate(250 40)"><circle r={30} fill={blue} stroke={ink} strokeWidth={4} /><text y={2} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>supply</text></g>
        </g>
        <RLine x1={VW / 2} y1={230} x2={VW / 2} y2={420} stroke={ink} strokeWidth={8} />
        <text x={VW / 2} y={460} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>immigration + investors up, building down → prices soar</text>
      </svg>
    );
  } else if (m === "canadarisecurve") {
    // The 2002->2022 price explosion.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.8], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, y0 = 440, yTop = 110;
    const f = (t: number) => y0 - (y0 - yTop) * Math.pow(t, 1.7);
    const seg = Array.from({ length: 44 }).map((_, i) => { const t = (i / 43) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${f(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={64} fontSize={21} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">Canadian home prices, 2002 → today</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <RLine x1={x0} y1={yTop} x2={x0} y2={y0} stroke={ink} strokeWidth={3} />
        <path d={seg} fill="none" stroke={red} strokeWidth={6} />
        <text x={x0 + 70} y={y0 - 14} fontSize={13} fontWeight={800} fill={theme.inkSoft} fontFamily={sans}>2002</text>
        <text x={x1 - 40} y={f(1) + 24} fontSize={14} fontWeight={900} fill={red} textAnchor="end" fontFamily={sans}>roughly tripled</text>
        <text x={VW / 2} y={y0 + 30} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>incomes crept up; prices went vertical</text>
      </svg>
    );
  } else if (m === "sameplaybook") {
    // The 4 shared ingredients of expensive housing.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    const items: [string, string][] = [["cheap credit", "a decade of low rates"], ["under-building", "supply never kept up"], ["homes as assets", "investors piled in"], ["tight zoning", "hard to build density"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the same four-part recipe, everywhere</text>
        {items.map(([t, d], i) => { const x = i % 2 === 0 ? 300 : 660; const y = i < 2 ? 120 : 290; const op = interpolate(reveal, [i * 0.18, i * 0.18 + 0.25], [0, 1], clampBoth); return <g key={i} opacity={op}><rect x={x - 150} y={y} width={300} height={130} rx={12} fill={[gold, "#9cc47f", "#d98b5f", "#cfe3d4"][i]} stroke={ink} strokeWidth={4} /><text x={x} y={y + 52} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">{t}</text><text x={x} y={y + 84} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{d}</text></g>; })}
      </svg>
    );
  } else if (m === "buildingdeficit") {
    // Homes built vs homes needed — a widening gap.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.6], [0, 1], clampBoth);
    const x0 = 120, x1 = 880, y0 = 430, yTop = 130;
    const needed = (t: number) => y0 - (y0 - yTop) * (0.3 + 0.7 * t);
    const built = (t: number) => y0 - (y0 - yTop) * (0.3 + 0.18 * t);
    const segN = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${needed(t)}`; }).join(" ");
    const segB = Array.from({ length: 40 }).map((_, i) => { const t = (i / 39) * draw; return `${i === 0 ? "M" : "L"}${x0 + (x1 - x0) * t} ${built(t)}`; }).join(" ");
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">homes needed vs homes built</text>
        <RLine x1={x0} y1={y0} x2={x1} y2={y0} stroke={ink} strokeWidth={3} />
        <path d={segN} fill="none" stroke={red} strokeWidth={6} />
        <path d={segB} fill="none" stroke={blue} strokeWidth={6} />
        <text x={x1 - 40} y={needed(1) - 12} fontSize={13} fontWeight={900} fill={red} textAnchor="end" fontFamily={sans}>homes needed</text>
        <text x={x1 - 40} y={built(1) + 22} fontSize={13} fontWeight={900} fill={blue} textAnchor="end" fontFamily={sans}>homes built</text>
        <text x={VW / 2} y={y0 + 30} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>the gap between the lines is the shortage</text>
      </svg>
    );
  } else if (m === "homesasinvestment") {
    // A house turned into a stock chart.
    const draw = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">when a home becomes a stock</text>
        <g transform="translate(300 270)"><rect x={-80} y={-30} width={160} height={110} fill="#efe9da" stroke={ink} strokeWidth={5} /><path d="M-95 -30 L0 -95 L95 -30 Z" fill={gold} stroke={ink} strokeWidth={5} /><rect x={-22} y={28} width={44} height={52} fill={ink} /></g>
        <path d={`M470 390 L560 ${390 - 110 * draw} L620 ${390 - 70 * draw} L700 ${390 - 190 * draw} L780 ${390 - 240 * draw}`} fill="none" stroke={green} strokeWidth={6} />
        <path d={`M780 ${390 - 240 * draw} l0 14 m0 -14 l-14 4`} stroke={green} strokeWidth={6} fill="none" strokeLinecap="round" opacity={draw} />
        <text x={VW / 2} y={460} fontSize={15} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>shelter becomes a speculative asset — and prices detach from wages</text>
      </svg>
    );
  } else if (m === "healthspendbars") {
    // Health spend per person by country.
    const draw = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    const bars: [string, number, string][] = [["UK", 5, "#9cc47f"], ["Australia", 6, gold], ["Canada", 6, gold], ["US", 13, red]];
    const base = 440, maxH = 250, maxV = 13;
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={58} fontSize={21} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">health spending per person ($K/year)</text>
        <RLine x1={110} y1={base} x2={880} y2={base} stroke={ink} strokeWidth={3} />
        {bars.map(([lab, v, col], i) => { const h = maxH * (v / maxV) * draw; const x = 210 + i * 170; return <g key={i}><rect x={x - 58} y={base - h} width={116} height={h} rx={5} fill={col as string} stroke={ink} strokeWidth={3.5} /><text x={x} y={base + 24} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>{lab}</text><text x={x} y={base - h - 10} fontSize={14} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">${v}K</text></g>; })}
        <text x={VW / 2} y={base + 46} fontSize={14} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>the US pays about double — for worse results</text>
      </svg>
    );
  } else if (m === "spendvsoutcome") {
    // US: spends the most, lives the shortest.
    const pop = (d: number) => Math.min(1, spring({ frame, fps, delay: d, config: { damping: 11 } }));
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">more money, shorter lives</text>
        <g transform={`translate(300 280) scale(${pop(fps * 0.4)})`}><circle r={96} fill={red} stroke={ink} strokeWidth={5} /><text y={-18} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>US spends</text><text y={8} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">the MOST</text><text y={34} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>~$13K/person</text></g>
        <g transform={`translate(720 280) scale(${pop(fps * 1.0)})`}><circle r={76} fill={gold} stroke={ink} strokeWidth={5} /><text y={-14} fontSize={14} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>yet lives</text><text y={10} fontSize={18} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">SHORTER</text><text y={34} fontSize={12} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>lower life expectancy</text></g>
        <text x={VW / 2} y={450} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>spending more clearly isn't buying more health</text>
      </svg>
    );
  } else if (m === "uscostdrivers") {
    // Why US healthcare costs so much.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    const items: [string, string][] = [["admin overhead", "armies of billing staff"], ["drug prices", "no national negotiator"], ["fee-for-service", "paid per procedure"], ["no price caps", "prices set in secret"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={62} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">why the US bill is so huge</text>
        {items.map(([t, d], i) => { const x = i % 2 === 0 ? 300 : 660; const y = i < 2 ? 110 : 290; const op = interpolate(reveal, [i * 0.18, i * 0.18 + 0.25], [0, 1], clampBoth); return <g key={i} opacity={op}><rect x={x - 150} y={y} width={300} height={130} rx={12} fill={["#d98b5f", red, gold, "#c0583a"][i]} stroke={ink} strokeWidth={4} /><text x={x} y={y + 52} fontSize={17} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{t}</text><text x={x} y={y + 84} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{d}</text></g>; })}
      </svg>
    );
  } else if (m === "medicalbankruptcy") {
    // Medical debt as a uniquely-American driver of bankruptcy.
    const fill = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the uniquely American outcome</text>
        <g transform="translate(280 280)"><rect x={-70} y={-70} width={140} height={150} rx={10} fill="#efe9da" stroke={ink} strokeWidth={5} /><text y={-30} fontSize={30} textAnchor="middle">🏥</text><text y={40} fontSize={15} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">$$$ bill</text></g>
        <path d="M380 280 l90 0 m0 0 l-18 -12 m18 12 l-18 12" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" opacity={fill} />
        <g transform="translate(700 280)" opacity={fill}><rect x={-90} y={-60} width={180} height={130} rx={10} fill={red} stroke={ink} strokeWidth={5} /><text y={-20} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>BANKRUPT</text><text y={10} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>a top cause of US</text><text y={30} fontSize={13} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>personal bankruptcy</text></g>
        <text x={VW / 2} y={460} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>getting sick can bankrupt you — almost only in America</text>
      </svg>
    );
  } else if (m === "statepriceladder") {
    // Most expensive vs cheapest states by median home price.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.6], [0, 1], clampBoth);
    const high: [string, string][] = [["Hawaii", "$850K"], ["California", "$780K"], ["Massachusetts", "$600K"]];
    const low: [string, string][] = [["West Virginia", "$160K"], ["Mississippi", "$180K"], ["Ohio", "$230K"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={300} y={70} fontSize={18} fontWeight={900} fill={red} textAnchor="middle" fontFamily="Georgia, serif">most expensive</text>
        <text x={680} y={70} fontSize={18} fontWeight={900} fill={green} textAnchor="middle" fontFamily="Georgia, serif">cheapest</text>
        {high.map(([s, p], i) => { const y = 110 + i * 70; return <g key={i} opacity={interpolate(reveal, [i * 0.15, i * 0.15 + 0.2], [0, 1], clampBoth)}><rect x={120} y={y} width={360} height={56} rx={8} fill="#d98b5f" stroke={ink} strokeWidth={3} /><text x={150} y={y + 35} fontSize={16} fontWeight={800} fill="#fff" fontFamily={sans}>{s}</text><text x={450} y={y + 35} fontSize={16} fontWeight={900} fill="#fff" textAnchor="end" fontFamily="Georgia, serif">{p}</text></g>; })}
        {low.map(([s, p], i) => { const y = 110 + i * 70; return <g key={i} opacity={interpolate(reveal, [i * 0.15 + 0.3, i * 0.15 + 0.5], [0, 1], clampBoth)}><rect x={500} y={y} width={360} height={56} rx={8} fill="#9cc47f" stroke={ink} strokeWidth={3} /><text x={530} y={y + 35} fontSize={15} fontWeight={800} fill={ink} fontFamily={sans}>{s}</text><text x={830} y={y + 35} fontSize={16} fontWeight={900} fill={ink} textAnchor="end" fontFamily="Georgia, serif">{p}</text></g>; })}
        <text x={VW / 2} y={400} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>a 5× price gap — within one country</text>
      </svg>
    );
  } else if (m === "whatfourhundredkbuys") {
    // What $400K buys in different states.
    const reveal = interpolate(frame, [fps * 0.3, fps * 2.4], [0, 1], clampBoth);
    const cols: [string, string][] = [["San Francisco", "a tiny studio"], ["Austin", "a starter home"], ["rural Ohio", "a mansion + land"]];
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={23} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">what $400,000 buys</text>
        {cols.map(([place, what], i) => { const x = 200 + i * 290; const op = interpolate(reveal, [i * 0.22, i * 0.22 + 0.25], [0, 1], clampBoth); return <g key={i} opacity={op}><rect x={x - 125} y={180} width={250} height={150} rx={12} fill={[red, gold, green][i]} stroke={ink} strokeWidth={4} /><text x={x} y={228} fontSize={15} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">{place}</text><text x={x} y={262} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{what.split(" ").slice(0,2).join(" ")}</text><text x={x} y={284} fontSize={14} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>{what.split(" ").slice(2).join(" ")}</text></g>; })}
        <text x={VW / 2} y={400} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>same money, a closet or a palace</text>
      </svg>
    );
  } else if (m === "sunbeltmigration") {
    // Migration flowing to the Sun Belt.
    const flow = interpolate(frame, [fps * 0.4, fps * 2.4], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={70} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">the great migration south</text>
        <g transform="translate(220 250)"><rect x={-70} y={-40} width={140} height={90} rx={10} fill="#cfe3d4" stroke={ink} strokeWidth={4} /><text y={-8} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>NY · CA · IL</text><text y={16} fontSize={12} fontWeight={800} fill={red} textAnchor="middle" fontFamily={sans}>pricey, leaving</text></g>
        <path d={`M300 250 C 450 200, 550 320, ${300 + 380 * flow} 300`} fill="none" stroke={gold} strokeWidth={5} strokeLinecap="round" />
        <path d={`M${300 + 380 * flow} 300 l-16 -6 m16 6 l-10 12`} stroke={gold} strokeWidth={5} fill="none" strokeLinecap="round" opacity={flow} />
        <g transform="translate(730 280)"><rect x={-80} y={-45} width={160} height={100} rx={10} fill="#9cc47f" stroke={ink} strokeWidth={4} /><text y={-12} fontSize={13} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>TX · FL · NC</text><text y={12} fontSize={12} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>cheaper, building</text><text y={32} fontSize={12} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>booming</text></g>
        <text x={VW / 2} y={450} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>people chase affordability — and reshape the map</text>
      </svg>
    );
  } else if (m === "crashornocrash") {
    // The 2026 crash debate — a tug of war.
    const t = interpolate(frame, [fps * 0.4, fps * 2.2], [0, 1], clampBoth);
    art = (
      <svg width={VW} height={VH}>
        <text x={VW / 2} y={80} fontSize={22} fontWeight={900} fill={ink} textAnchor="middle" fontFamily="Georgia, serif">is a crash coming in 2026?</text>
        <g transform="translate(270 280)" opacity={interpolate(t, [0, 0.5], [0, 1], clampBoth)}><rect x={-140} y={-70} width={280} height={150} rx={12} fill={red} stroke={ink} strokeWidth={4} /><text y={-40} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>CRASH side</text><text y={-10} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>prices vs incomes stretched</text><text y={14} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>high rates cooling demand</text><text y={40} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>affordability at record lows</text></g>
        <g transform="translate(730 280)" opacity={interpolate(t, [0.4, 0.9], [0, 1], clampBoth)}><rect x={-140} y={-70} width={280} height={150} rx={12} fill={green} stroke={ink} strokeWidth={4} /><text y={-40} fontSize={16} fontWeight={900} fill="#fff" textAnchor="middle" fontFamily={sans}>NO-CRASH side</text><text y={-10} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>chronic housing shortage</text><text y={14} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>locked-in low-rate owners</text><text y={40} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily={sans}>strong demand, few sellers</text></g>
        <text x={VW / 2} y={450} fontSize={15} fontWeight={800} fill={ink} textAnchor="middle" fontFamily={sans}>most likely: stall, not collapse — a slow grind</text>
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
