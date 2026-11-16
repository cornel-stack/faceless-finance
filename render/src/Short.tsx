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
import { Globe, MoneyFlow, HomeMoney, FlagStack, BankPrint, CountUp, MoneyDust, CrashChart, PriceTag, Lock, Building, Vault, USMap } from "./shorts/Doodles";

// ---------------------------------------------------------------------------
// Vertical YouTube Short (1080x1920). Animation-first: every beat is a bespoke
// moving doodle (globe of IOUs, money over the ocean, a house with money
// circulating, flag + growing stacks, the Fed printing bills) with big readable
// text under it. Reads the same scenes.json + timing.json + narration.mp3 the
// episode pipeline produces, so CI synth/render is identical.
// ---------------------------------------------------------------------------

const CREAM = "#faf6ee";
const PAPER_LINE = "#e7e0d3";

export type ShortRow = { rank?: string; name: string; value: string; note?: string; color?: string; bar?: number };

export type ShortArt =
  | "globe"
  | "globeQ"
  | "moneyFlow"
  | "home"
  | "flagStack"
  | "bank"
  | "crashChart"
  | "priceTag"
  | "lock"
  | "building"
  | "vault"
  | "map";

export type ShortScene = {
  id: string;
  narration?: string;
  block: "hook" | "label" | "truth" | "stat" | "rows" | "question" | "thennow";
  art?: ShortArt;
  country?: "jp" | "cn" | "us";
  trend?: "up" | "down";
  // then-vs-now
  thenValue?: string;
  thenLabel?: string;
  nowValue?: string;
  nowLabel?: string;
  // text content (by block)
  lines?: string[]; // hook: stacked lines, last one red
  kicker?: string; // small label above the main content
  line?: string; // single emphasised line (label / truth / question)
  sub?: string; // supporting line under the main content
  big?: string; // stat: static giant number/word (when no count-up)
  bigValue?: number; // stat: count-up target
  bigPrefix?: string;
  bigSuffix?: string;
  bigDecimals?: number;
  label?: string; // stat: label under the number
  rows?: ShortRow[]; // rows: ranked list with growing bars
};

const DEFAULT_SECONDS = 4;

export const shortDurationInFrames = (scenes: ShortScene[], fps: number, timing?: number[]) =>
  Math.max(
    fps,
    scenes.reduce((acc, _s, i) => acc + Math.round((timing?.[i] ?? DEFAULT_SECONDS) * fps), 0)
  );

const usePop = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 130, mass: 0.7 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [26, 0])}px) scale(${interpolate(t, [0, 1], [0.92, 1])})`,
  };
};

const SketchUnderline: React.FC<{ delay: number; width: number }> = ({ delay, width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 90, mass: 0.8 } });
  return (
    <svg width={width} height={26} viewBox="0 0 320 26" style={{ display: "block", margin: "6px auto 0" }}>
      <path d="M6 16 C 70 6, 150 24, 230 12 S 312 8, 314 14" fill="none" stroke={theme.accent} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
    </svg>
  );
};

const RankChip: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div style={{ width: 88, height: 88, borderRadius: 22, background: color, color: "#fff", fontFamily: display, fontWeight: 900, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", boxShadow: "0 8px 0 rgba(0,0,0,0.12)" }}>
    {text}
  </div>
);

const Wordmark: React.FC = () => (
  <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center" }}>
    <span style={{ fontFamily: display, fontWeight: 900, fontSize: 38, letterSpacing: 4, color: theme.ink, textTransform: "uppercase" }}>Napkin Numbers</span>
    <div style={{ width: 140, height: 5, background: theme.accent, borderRadius: 4, margin: "8px auto 0" }} />
  </div>
);

// the animated illustration for a scene
const Art: React.FC<{ scene: ShortScene }> = ({ scene }) => {
  switch (scene.art) {
    case "globe":
      return <Globe size={460} />;
    case "globeQ":
      return <Globe size={460} question />;
    case "moneyFlow":
      return <MoneyFlow size={640} />;
    case "home":
      return <HomeMoney size={470} />;
    case "flagStack":
      return <FlagStack country={scene.country ?? "us"} trend={scene.trend ?? "up"} size={430} />;
    case "bank":
      return <BankPrint size={470} />;
    case "crashChart":
      return <CrashChart size={640} />;
    case "priceTag":
      return <PriceTag size={360} />;
    case "lock":
      return <Lock size={320} />;
    case "building":
      return <Building size={430} />;
    case "vault":
      return <Vault size={440} />;
    case "map":
      return <USMap size={640} />;
    default:
      return null;
  }
};

const RowsBlock: React.FC<{ scene: ShortScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = scene.rows ?? [];
  return (
    <div style={{ width: "100%", padding: "0 64px" }}>
      {scene.kicker && (
        <div style={{ ...usePop(2), textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 66, color: theme.ink, marginBottom: 40 }}>{scene.kicker}</div>
      )}
      {rows.map((r, i) => {
        const delay = 8 + i * 9;
        const pop = usePop(delay);
        const grow = spring({ frame: frame - delay - 4, fps, config: { damping: 200, stiffness: 60, mass: 1 } });
        const w = (r.bar ?? 0.5) * grow;
        return (
          <div key={i} style={{ ...pop, position: "relative", display: "flex", alignItems: "center", gap: 24, background: "#fff", border: `3px solid ${PAPER_LINE}`, borderRadius: 26, padding: "22px 28px", marginBottom: 26, overflow: "hidden", boxShadow: "0 10px 0 rgba(23,18,15,0.06)" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${w * 100}%`, background: r.color ?? theme.accent, opacity: 0.1 }} />
            {r.rank && <RankChip text={r.rank} color={r.color ?? theme.ink} />}
            <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
              <div style={{ fontFamily: display, fontWeight: 900, fontSize: 58, color: theme.ink, lineHeight: 1 }}>{r.name}</div>
              {r.note && <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 33, color: theme.inkSoft, marginTop: 6 }}>{r.note}</div>}
            </div>
            <div style={{ fontFamily: display, fontWeight: 900, fontSize: 68, color: r.color ?? theme.accent, flex: "0 0 auto", zIndex: 1 }}>{r.value}</div>
          </div>
        );
      })}
    </div>
  );
};

const Card: React.FC<{ scene: ShortScene }> = ({ scene }) => {
  const s = scene;
  const hasArt = !!s.art;

  let text: React.ReactNode = null;

  if (s.block === "hook") {
    const lines = s.lines ?? [];
    text = (
      <div style={{ textAlign: "center", padding: "0 64px" }}>
        {lines.map((ln, i) => {
          const last = i === lines.length - 1;
          return (
            <div key={i} style={{ ...usePop(6 + i * 7), fontFamily: display, fontWeight: last ? 900 : 700, fontSize: last ? 96 : 76, lineHeight: 1.05, color: last ? theme.accent : theme.ink, marginTop: i === 0 ? 0 : 18 }}>
              {ln}
            </div>
          );
        })}
      </div>
    );
  } else if (s.block === "label") {
    text = (
      <div style={{ textAlign: "center", padding: "0 64px" }}>
        {s.kicker && <div style={{ ...usePop(4), fontFamily: sans, fontWeight: 700, fontSize: 44, color: theme.inkSoft, marginBottom: 18 }}>{s.kicker}</div>}
        {s.line && <div style={{ ...usePop(10), fontFamily: display, fontWeight: 900, fontSize: 104, lineHeight: 1.02, color: theme.ink }}>{s.line}</div>}
        {s.sub && <div style={{ ...usePop(20), fontFamily: sans, fontWeight: 600, fontSize: 44, color: theme.inkSoft, marginTop: 20 }}>{s.sub}</div>}
      </div>
    );
  } else if (s.block === "truth") {
    text = (
      <div style={{ textAlign: "center", padding: "0 56px" }}>
        {s.kicker && <div style={{ ...usePop(4), fontFamily: sans, fontWeight: 700, fontSize: 40, color: theme.accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 18 }}>{s.kicker}</div>}
        <div style={{ ...usePop(10), fontFamily: display, fontWeight: 900, fontSize: 96, lineHeight: 1.06, color: theme.ink }}>{s.line}</div>
        <SketchUnderline delay={22} width={360} />
        {s.sub && <div style={{ ...usePop(26), fontFamily: sans, fontWeight: 600, fontSize: 44, color: theme.inkSoft, marginTop: 24, lineHeight: 1.3 }}>{s.sub}</div>}
      </div>
    );
  } else if (s.block === "stat") {
    text = (
      <div style={{ textAlign: "center", padding: "0 48px" }}>
        {s.kicker && <div style={{ ...usePop(4), fontFamily: sans, fontWeight: 700, fontSize: 42, color: theme.inkSoft, marginBottom: 8 }}>{s.kicker}</div>}
        <div style={{ ...usePop(6) }}>
          {typeof s.bigValue === "number" ? (
            <CountUp value={s.bigValue} prefix={s.bigPrefix} suffix={s.bigSuffix} decimals={s.bigDecimals} size={230} />
          ) : (
            <span style={{ fontFamily: display, fontWeight: 900, fontSize: 230, lineHeight: 0.92, color: theme.accent, letterSpacing: -4 }}>{s.big}</span>
          )}
        </div>
        {s.label && <div style={{ ...usePop(16), fontFamily: display, fontWeight: 700, fontSize: 60, color: theme.ink, marginTop: 10 }}>{s.label}</div>}
        {s.sub && <div style={{ ...usePop(24), fontFamily: sans, fontWeight: 600, fontSize: 42, color: theme.inkSoft, marginTop: 16 }}>{s.sub}</div>}
      </div>
    );
  } else if (s.block === "rows") {
    return (
      <AbsoluteFill style={{ background: "transparent" }}>
        <Wordmark />
        <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
          {s.art && <div style={{ marginBottom: 10 }}><Art scene={s} /></div>}
          <RowsBlock scene={s} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  } else if (s.block === "thennow") {
    text = (
      <div style={{ textAlign: "center", padding: "0 56px", width: "100%" }}>
        {s.kicker && <div style={{ ...usePop(2), fontFamily: sans, fontWeight: 700, fontSize: 42, color: theme.inkSoft, marginBottom: 24 }}>{s.kicker}</div>}
        <div style={{ ...usePop(8), background: "#fff", border: `3px solid ${PAPER_LINE}`, borderRadius: 24, padding: "22px 20px", marginBottom: 10 }}>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: theme.inkSoft }}>{s.thenLabel ?? "THEN"}</div>
          <div style={{ fontFamily: display, fontWeight: 900, fontSize: 120, lineHeight: 1, color: theme.ink }}>{s.thenValue}</div>
        </div>
        <div style={{ ...usePop(16), fontFamily: display, fontWeight: 900, fontSize: 70, color: theme.accent }}>↓</div>
        <div style={{ ...usePop(22), background: theme.accent, borderRadius: 24, padding: "22px 20px", marginTop: 10 }}>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: "#ffd9d2" }}>{s.nowLabel ?? "NOW"}</div>
          <div style={{ fontFamily: display, fontWeight: 900, fontSize: 120, lineHeight: 1, color: "#fff" }}>{s.nowValue}</div>
        </div>
        {s.sub && <div style={{ ...usePop(28), fontFamily: sans, fontWeight: 600, fontSize: 42, color: theme.inkSoft, marginTop: 26 }}>{s.sub}</div>}
      </div>
    );
  } else if (s.block === "question") {
    text = (
      <div style={{ textAlign: "center", padding: "0 64px" }}>
        <div style={{ ...usePop(6), fontFamily: display, fontWeight: 900, fontSize: 104, lineHeight: 1.06, color: theme.ink }}>{s.line}</div>
        <SketchUnderline delay={18} width={400} />
        <div style={{ ...usePop(30), fontFamily: sans, fontWeight: 700, fontSize: 46, color: theme.accent, marginTop: 40 }}>{s.sub ?? "Tell me in the comments"}</div>
      </div>
    );
  }

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <Wordmark />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 40, gap: 10 }}>
        {hasArt && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 620 }}>
            <Art scene={s} />
          </div>
        )}
        {text}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Progress: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const pct = total > 0 ? Math.min(1, frame / total) : 0;
  return (
    <div style={{ position: "absolute", bottom: 130, left: 70, right: 70 }}>
      <div style={{ height: 10, background: PAPER_LINE, borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: theme.accent }} />
      </div>
      <div style={{ textAlign: "center", marginTop: 18, fontFamily: sans, fontWeight: 700, fontSize: 32, color: theme.inkSoft, letterSpacing: 1 }}>@NapkinNumbers</div>
    </div>
  );
};

export const Short: React.FC<{ scenes: ShortScene[]; timing?: number[]; audioSrc?: string }> = ({ scenes, timing, audioSrc }) => {
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
      <MoneyDust />
      {audioSrc && <Audio src={staticFile(audioSrc)} />}
      {seqs}
      <Progress total={total} />
    </AbsoluteFill>
  );
};
