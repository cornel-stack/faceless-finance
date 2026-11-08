import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme, money } from "../theme";
import { display, sans } from "../fonts";
import { Mascot } from "../components/Mascot";
import { Doodle, DoodleName } from "../components/Doodle";
import { SpeechBubble } from "../components/SpeechBubble";
import { ScreenshotSource } from "../components/ScreenshotSource";
import { RRect, RPath, RLine } from "../motion/rough";
import type { SourceEntry } from "../SourceCardDemo";
import type {
  Scene, TitleScene, CharacterScene, CalloutScene, ScreenshotScene,
  ChartScene, DoodleScene, ChalkboardScene, CompareScene,
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

// Scattered slots for the prop cluster to the right of the character.
const PROP_SLOTS: { x: number; y: number; s: number }[][] = [
  [],
  [{ x: 1200, y: 420, s: 400 }],
  [{ x: 1010, y: 300, s: 340 }, { x: 1470, y: 560, s: 320 }],
  [{ x: 1000, y: 270, s: 310 }, { x: 1500, y: 330, s: 280 }, { x: 1230, y: 640, s: 330 }],
  [{ x: 970, y: 250, s: 270 }, { x: 1440, y: 270, s: 260 }, { x: 1120, y: 580, s: 290 }, { x: 1560, y: 610, s: 240 }],
];

const PropCluster: React.FC<{ props: { name: DoodleName; label?: string }[] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slots = PROP_SLOTS[Math.min(props.length, 4)];
  return (
    <>
      {props.slice(0, 4).map((p, i) => {
        const slot = slots[i];
        const s = spring({ frame, fps, delay: 8 + i * 7, config: { damping: 12, mass: 0.6 } });
        return (
          <div key={i} style={{ position: "absolute", left: slot.x - slot.s / 2, top: slot.y - slot.s / 2, width: slot.s, transform: `scale(${s})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Doodle name={p.name} size={slot.s} />
            {p.label && <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: theme.ink, textAlign: "center" }}>{p.label}</div>}
          </div>
        );
      })}
    </>
  );
};

const Character: React.FC<{ scene: CharacterScene }> = ({ scene }) => {
  const { width } = useVideoConfig();
  const hasProps = Boolean(scene.props && scene.props.length);
  const hasBubble = Boolean(scene.bubble);
  const mW = 520, mH = 880;
  const left = hasProps || hasBubble ? 110 : (width - mW) / 2;
  return (
    <AbsoluteFill>
      {hasProps && <PropCluster props={scene.props!} />}
      <div style={{ position: "absolute", left, bottom: 10, width: mW, height: mH }}>
        <Mascot pose={scene.pose ?? "stand"} expression={scene.expression} variant={scene.variant} width={mW} height={mH} />
      </div>
      {hasBubble && (
        <div style={{ position: "absolute", left: left + 40, top: 120, width: 660 }}>
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
  const sub = interpolate(frame, [14, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 210, color: scene.break ? theme.accent : theme.ink, transform: `scale(${s}) translateX(${shake}px)`, lineHeight: 1 }}>
        {scene.text}
      </div>
      {scene.sub && <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 52, color: theme.inkSoft, marginTop: 28, opacity: sub, textAlign: "center", maxWidth: 1400 }}>{scene.sub}</div>}
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
      <div style={{ transform: `scale(${zoom})` }}>
        <ScreenshotSource image={entry.image} naturalW={entry.width} naturalH={entry.height} url={entry.url} quoteRect={entry.quoteRect} width={w} />
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
              <defs><clipPath id={clipId}><rect x={padL - 6} y={0} width={(plotW + 12) * reveal} height={H} /></clipPath></defs>
              <g clipPath={`url(#${clipId})`}><RPath d={path} stroke={theme.accent} strokeWidth={6} seed={7} /></g>
            </>
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
      </svg>
    </AbsoluteFill>
  );
};

const DoodleScene_: React.FC<{ scene: DoodleScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 40 }}>
      <div style={{ display: "flex", gap: 90, alignItems: "flex-end" }}>
        {scene.items.map((name, i) => {
          const s = spring({ frame, fps, delay: 6 + i * 7, config: { damping: 12, mass: 0.6 } });
          return (
            <div key={i} style={{ transform: `scale(${s})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <Doodle name={name} size={260} />
              {scene.labels?.[i] && <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: theme.ink }}>{scene.labels[i]}</div>}
            </div>
          );
        })}
      </div>
      {scene.caption && <div style={{ fontFamily: display, fontWeight: 900, fontSize: 56, color: theme.ink, textAlign: "center", maxWidth: 1500 }}>{scene.caption}</div>}
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
  const l = spring({ frame, fps, delay: 4, config: { damping: 16 } });
  const r = spring({ frame, fps, delay: 12, config: { damping: 16 } });
  const card = (c: { title: string; value: string }, p: number, accent: boolean) => (
    <div style={{ width: 640, padding: "60px 40px", borderRadius: 18, border: `4px solid ${accent ? theme.accent : theme.ink}`, background: "#fff", textAlign: "center", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`, boxShadow: "0 12px 0 rgba(23,18,15,0.08)" }}>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: theme.inkSoft }}>{c.title}</div>
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 96, color: accent ? theme.accent : theme.ink, marginTop: 14 }}>{c.value}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 60 }}>
      {card(scene.left, l, false)}
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 64, color: theme.inkSoft }}>vs</div>
      {card(scene.right, r, true)}
    </AbsoluteFill>
  );
};

export const SceneView: React.FC<{ scene: Scene; sources?: Record<string, SourceEntry> }> = ({ scene, sources }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
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
  }
  return <AbsoluteFill style={{ backgroundColor: theme.bg, opacity: fade }}>{inner}</AbsoluteFill>;
};
