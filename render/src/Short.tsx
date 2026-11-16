import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "./theme";
import { display, sans } from "./fonts";

// ---------------------------------------------------------------------------
// Vertical YouTube Short (1080x1920). Self-contained, phone-first layout:
// big readable text, one giant number, hard cuts per beat. Reads the SAME
// scenes.json + timing.json + narration.mp3 the episode pipeline produces, so
// CI synth/render is identical — only the composition and scene schema differ.
// ---------------------------------------------------------------------------

const CREAM = "#faf6ee";
const PAPER_LINE = "#e7e0d3";

export type ShortRow = { rank?: string; name: string; value: string; note?: string; color?: string };

export type ShortScene = {
  id: string;
  narration?: string;
  block: "hook" | "label" | "truth" | "stat" | "rows" | "question";
  // text content (by block)
  lines?: string[]; // hook: stacked lines, last one red
  kicker?: string; // small label above the main content
  line?: string; // single emphasised line (label / truth / question)
  sub?: string; // supporting line under the main content
  big?: string; // stat: the giant number/word
  label?: string; // stat: label under the number
  rows?: ShortRow[]; // rows: ranked list
  strike?: boolean; // label: draw a red strike through `line` (the busted myth)
};

const DEFAULT_SECONDS = 4;

export const shortDurationInFrames = (scenes: ShortScene[], fps: number, timing?: number[]) =>
  Math.max(
    fps,
    scenes.reduce((acc, _s, i) => acc + Math.round((timing?.[i] ?? DEFAULT_SECONDS) * fps), 0)
  );

// spring pop-in (scale + rise + fade), delayed per element for a stagger
const usePop = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 130, mass: 0.7 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [26, 0])}px) scale(${interpolate(t, [0, 1], [0.92, 1])})`,
  };
};

// hand-drawn red underline that sketches in
const SketchUnderline: React.FC<{ delay: number; width: number }> = ({ delay, width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 90, mass: 0.8 } });
  const len = 320;
  return (
    <svg width={width} height={26} viewBox="0 0 320 26" style={{ display: "block", margin: "6px auto 0" }}>
      <path
        d="M6 16 C 70 6, 150 24, 230 12 S 312 8, 314 14"
        fill="none"
        stroke={theme.accent}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - t)}
      />
    </svg>
  );
};

const RankChip: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div
    style={{
      width: 96,
      height: 96,
      borderRadius: 24,
      background: color,
      color: "#fff",
      fontFamily: display,
      fontWeight: 900,
      fontSize: 46,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "0 0 auto",
      boxShadow: "0 8px 0 rgba(0,0,0,0.12)",
    }}
  >
    {text}
  </div>
);

const Wordmark: React.FC = () => (
  <div style={{ position: "absolute", top: 64, left: 0, right: 0, textAlign: "center" }}>
    <span
      style={{
        fontFamily: display,
        fontWeight: 900,
        fontSize: 40,
        letterSpacing: 4,
        color: theme.ink,
        textTransform: "uppercase",
      }}
    >
      Napkin Numbers
    </span>
    <div style={{ width: 150, height: 5, background: theme.accent, borderRadius: 4, margin: "10px auto 0" }} />
  </div>
);

const Card: React.FC<{ scene: ShortScene }> = ({ scene }) => {
  const s = scene;

  let body: React.ReactNode = null;

  if (s.block === "hook") {
    const lines = s.lines ?? [];
    body = (
      <div style={{ textAlign: "center", padding: "0 70px" }}>
        {lines.map((ln, i) => {
          const last = i === lines.length - 1;
          return (
            <div
              key={i}
              style={{
                ...usePop(6 + i * 7),
                fontFamily: display,
                fontWeight: last ? 900 : 700,
                fontSize: last ? 108 : 86,
                lineHeight: 1.04,
                color: last ? theme.accent : theme.ink,
                marginTop: i === 0 ? 0 : 26,
              }}
            >
              {ln}
            </div>
          );
        })}
      </div>
    );
  } else if (s.block === "label") {
    body = (
      <div style={{ textAlign: "center", padding: "0 70px" }}>
        {s.kicker && (
          <div style={{ ...usePop(4), fontFamily: sans, fontWeight: 700, fontSize: 44, color: theme.inkSoft, marginBottom: 28 }}>
            {s.kicker}
          </div>
        )}
        <div style={{ ...usePop(10), position: "relative", display: "inline-block" }}>
          <div style={{ fontFamily: display, fontWeight: 900, fontSize: 132, lineHeight: 1.02, color: theme.ink }}>{s.line}</div>
          {s.strike && (
            <div
              style={{
                position: "absolute",
                left: -10,
                right: -10,
                top: "52%",
                height: 12,
                background: theme.accent,
                borderRadius: 8,
                transform: "rotate(-4deg)",
              }}
            />
          )}
        </div>
        {s.sub && (
          <div style={{ ...usePop(20), fontFamily: sans, fontWeight: 600, fontSize: 46, color: theme.inkSoft, marginTop: 34 }}>
            {s.sub}
          </div>
        )}
      </div>
    );
  } else if (s.block === "truth") {
    body = (
      <div style={{ textAlign: "center", padding: "0 64px" }}>
        {s.kicker && (
          <div style={{ ...usePop(4), fontFamily: sans, fontWeight: 700, fontSize: 42, color: theme.accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 26 }}>
            {s.kicker}
          </div>
        )}
        <div style={{ ...usePop(10), fontFamily: display, fontWeight: 900, fontSize: 104, lineHeight: 1.06, color: theme.ink }}>
          {s.line}
        </div>
        <SketchUnderline delay={22} width={360} />
        {s.sub && (
          <div style={{ ...usePop(26), fontFamily: sans, fontWeight: 600, fontSize: 48, color: theme.inkSoft, marginTop: 34, lineHeight: 1.3 }}>
            {s.sub}
          </div>
        )}
      </div>
    );
  } else if (s.block === "stat") {
    body = (
      <div style={{ textAlign: "center", padding: "0 56px" }}>
        {s.kicker && (
          <div style={{ ...usePop(4), fontFamily: sans, fontWeight: 700, fontSize: 46, color: theme.inkSoft, marginBottom: 20 }}>
            {s.kicker}
          </div>
        )}
        <div style={{ ...usePop(8), fontFamily: display, fontWeight: 900, fontSize: 300, lineHeight: 0.92, color: theme.accent, letterSpacing: -4 }}>
          {s.big}
        </div>
        {s.label && (
          <div style={{ ...usePop(18), fontFamily: display, fontWeight: 700, fontSize: 64, color: theme.ink, marginTop: 18 }}>
            {s.label}
          </div>
        )}
        {s.sub && (
          <div style={{ ...usePop(26), fontFamily: sans, fontWeight: 600, fontSize: 44, color: theme.inkSoft, marginTop: 22, lineHeight: 1.3 }}>
            {s.sub}
          </div>
        )}
      </div>
    );
  } else if (s.block === "rows") {
    const rows = s.rows ?? [];
    body = (
      <div style={{ width: "100%", padding: "0 70px" }}>
        {s.kicker && (
          <div style={{ ...usePop(2), textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 72, color: theme.ink, marginBottom: 56 }}>
            {s.kicker}
          </div>
        )}
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              ...usePop(10 + i * 10),
              display: "flex",
              alignItems: "center",
              gap: 28,
              background: "#fff",
              border: `3px solid ${PAPER_LINE}`,
              borderRadius: 28,
              padding: "26px 30px",
              marginBottom: 28,
              boxShadow: "0 10px 0 rgba(23,18,15,0.06)",
            }}
          >
            {r.rank && <RankChip text={r.rank} color={r.color ?? theme.ink} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: display, fontWeight: 900, fontSize: 60, color: theme.ink, lineHeight: 1 }}>{r.name}</div>
              {r.note && <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 36, color: theme.inkSoft, marginTop: 8 }}>{r.note}</div>}
            </div>
            <div style={{ fontFamily: display, fontWeight: 900, fontSize: 72, color: r.color ?? theme.accent, flex: "0 0 auto" }}>{r.value}</div>
          </div>
        ))}
      </div>
    );
  } else if (s.block === "question") {
    body = (
      <div style={{ textAlign: "center", padding: "0 70px" }}>
        <div style={{ ...usePop(6), fontFamily: display, fontWeight: 900, fontSize: 116, lineHeight: 1.06, color: theme.ink }}>{s.line}</div>
        <SketchUnderline delay={18} width={400} />
        <div style={{ ...usePop(30), fontFamily: sans, fontWeight: 700, fontSize: 48, color: theme.accent, marginTop: 48 }}>
          {s.sub ?? "Tell me in the comments"}
        </div>
      </div>
    );
  }

  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <Wordmark />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{body}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Progress: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const pct = total > 0 ? Math.min(1, frame / total) : 0;
  return (
    <div style={{ position: "absolute", bottom: 150, left: 70, right: 70 }}>
      <div style={{ height: 10, background: PAPER_LINE, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: theme.accent }} />
      </div>
      <div style={{ textAlign: "center", marginTop: 20, fontFamily: sans, fontWeight: 700, fontSize: 34, color: theme.inkSoft, letterSpacing: 1 }}>
        @NapkinNumbers
      </div>
    </div>
  );
};

export const Short: React.FC<{
  scenes: ShortScene[];
  timing?: number[];
  audioSrc?: string;
}> = ({ scenes, timing, audioSrc }) => {
  const { fps } = useVideoConfig();
  const total = shortDurationInFrames(scenes, fps, timing);
  const seqs: React.ReactNode[] = [];
  let cursor = 0;
  scenes.forEach((scene, i) => {
    const dur = Math.round((timing?.[i] ?? DEFAULT_SECONDS) * fps);
    seqs.push(
      <Sequence key={scene.id ?? i} from={cursor} durationInFrames={dur}>
        <Card scene={scene} />
      </Sequence>
    );
    cursor += dur;
  });
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      {audioSrc && <Audio src={staticFile(audioSrc)} />}
      {seqs}
      <Progress total={total} />
    </AbsoluteFill>
  );
};
