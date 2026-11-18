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
import { ScreenshotSource } from "./components/ScreenshotSource";
import type { SourceEntry } from "./SourceCardDemo";
import {
  Globe,
  GlobeX,
  MoneyFlow,
  HomeMoney,
  FlagStack,
  BankPrint,
  CountUp,
  MoneyDust,
  CrashChart,
  PriceTag,
  Lock,
  Building,
  Vault,
  USMap,
  MiniIcon,
  MiniName,
} from "./shorts/Doodles";

// ---------------------------------------------------------------------------
// Vertical Short (1080x1920), long-video energy: a narrated sentence (scene)
// is CUT into several fast shots. Every shot is a busy tableau — a doodle,
// scattered animated mini-icons, moving text, and colour/background changes
// per cut. Reads the same scenes.json + timing.json + narration.mp3 the
// episode pipeline produces.
// ---------------------------------------------------------------------------

const CREAM = "#faf6ee";
const PAPER_LINE = "#e7e0d3";
const BGS: Record<string, string> = { cream: CREAM, ink: theme.ink, red: theme.accent, gold: "#e8a33d" };

export type ShortArt =
  | "globe" | "globeX" | "globeQ" | "moneyFlow" | "home" | "flagStack" | "bank"
  | "crashChart" | "priceTag" | "lock" | "building" | "vault" | "map";

export type ShortRow = { rank?: string; name: string; value: string; note?: string; color?: string; bar?: number };

// A single visual shot. A scene is itself a view; `shots` splits it into cuts.
export type ShortView = {
  block?: "hook" | "center" | "flash" | "stat" | "rows" | "thennow" | "question" | "evidence";
  bg?: "cream" | "ink" | "red" | "gold";
  art?: ShortArt;
  sourceId?: string;
  country?: "jp" | "cn" | "us";
  trend?: "up" | "down";
  props?: MiniName[];
  flash?: boolean;
  lines?: string[];
  kicker?: string;
  line?: string;
  sub?: string;
  strike?: boolean;
  big?: string;
  bigValue?: number;
  bigPrefix?: string;
  bigSuffix?: string;
  bigDecimals?: number;
  label?: string;
  rows?: ShortRow[];
  thenValue?: string;
  thenLabel?: string;
  nowValue?: string;
  nowLabel?: string;
};

export type ShortScene = ShortView & { id: string; narration?: string; shots?: ShortView[] };

const DEFAULT_SECONDS = 2.5;

export const shortDurationInFrames = (scenes: ShortScene[], fps: number, timing?: number[]) =>
  Math.max(
    fps,
    scenes.reduce((acc, _s, i) => acc + Math.round((timing?.[i] ?? DEFAULT_SECONDS) * fps), 0)
  );

const usePop = (delay: number, stiffness = 150) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness, mass: 0.6 } });
  return { opacity: interpolate(t, [0, 1], [0, 1]), transform: `translateY(${interpolate(t, [0, 1], [22, 0])}px) scale(${interpolate(t, [0, 1], [0.9, 1])})` };
};

const SketchUnderline: React.FC<{ delay: number; width: number; color?: string }> = ({ delay, width, color = theme.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 90, mass: 0.8 } });
  return (
    <svg width={width} height={26} viewBox="0 0 320 26" style={{ display: "block", margin: "6px auto 0" }}>
      <path d="M6 16 C 70 6, 150 24, 230 12 S 312 8, 314 14" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
    </svg>
  );
};

const RankChip: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div style={{ width: 86, height: 86, borderRadius: 22, background: color, color: "#fff", fontFamily: display, fontWeight: 900, fontSize: 42, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", boxShadow: "0 7px 0 rgba(0,0,0,0.14)" }}>{text}</div>
);

const Wordmark: React.FC<{ dark: boolean }> = ({ dark }) => (
  <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", zIndex: 5 }}>
    <span style={{ fontFamily: display, fontWeight: 900, fontSize: 34, letterSpacing: 4, color: dark ? CREAM : theme.ink, textTransform: "uppercase", opacity: 0.9 }}>Napkin Numbers</span>
  </div>
);

const ART_W = 460;
const Art: React.FC<{ view: ShortView }> = ({ view }) => {
  switch (view.art) {
    case "globe": return <Globe size={ART_W} />;
    case "globeQ": return <Globe size={ART_W} question />;
    case "globeX": return <GlobeX size={ART_W} />;
    case "moneyFlow": return <MoneyFlow size={640} />;
    case "home": return <HomeMoney size={470} />;
    case "flagStack": return <FlagStack country={view.country ?? "us"} trend={view.trend ?? "up"} size={430} />;
    case "bank": return <BankPrint size={470} />;
    case "crashChart": return <CrashChart size={640} />;
    case "priceTag": return <PriceTag size={360} />;
    case "lock": return <Lock size={320} />;
    case "building": return <Building size={430} />;
    case "vault": return <Vault size={440} />;
    case "map": return <USMap size={640} />;
    default: return null;
  }
};

const PROP_ANCHORS = [
  { x: 110, y: 360 }, { x: 880, y: 350 }, { x: 70, y: 980 }, { x: 930, y: 980 },
  { x: 150, y: 1430 }, { x: 860, y: 1430 }, { x: 520, y: 300 }, { x: 520, y: 1500 },
];
const Props: React.FC<{ names?: MiniName[] }> = ({ names }) => {
  if (!names || !names.length) return null;
  return (
    <>
      {names.slice(0, PROP_ANCHORS.length).map((n, i) => (
        <div key={i} style={{ position: "absolute", left: PROP_ANCHORS[i].x, top: PROP_ANCHORS[i].y, zIndex: 1 }}>
          <MiniIcon name={n} delay={4 + i * 3} size={116} />
        </div>
      ))}
    </>
  );
};

const RowsBlock: React.FC<{ view: ShortView }> = ({ view }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = view.rows ?? [];
  return (
    <div style={{ width: "100%", padding: "0 60px" }}>
      {view.kicker && <div style={{ ...usePop(2), textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 62, color: theme.ink, marginBottom: 32 }}>{view.kicker}</div>}
      {rows.map((r, i) => {
        const delay = 6 + i * 7;
        const pop = usePop(delay);
        const grow = spring({ frame: frame - delay - 3, fps, config: { damping: 200, stiffness: 60, mass: 1 } });
        const w = (r.bar ?? 0.5) * grow;
        return (
          <div key={i} style={{ ...pop, position: "relative", display: "flex", alignItems: "center", gap: 22, background: "#fff", border: `3px solid ${PAPER_LINE}`, borderRadius: 24, padding: "20px 26px", marginBottom: 24, overflow: "hidden", boxShadow: "0 9px 0 rgba(23,18,15,0.06)" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${w * 100}%`, background: r.color ?? theme.accent, opacity: 0.12 }} />
            {r.rank && <RankChip text={r.rank} color={r.color ?? theme.ink} />}
            <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
              <div style={{ fontFamily: display, fontWeight: 900, fontSize: 56, color: theme.ink, lineHeight: 1 }}>{r.name}</div>
              {r.note && <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 32, color: theme.inkSoft, marginTop: 5 }}>{r.note}</div>}
            </div>
            <div style={{ fontFamily: display, fontWeight: 900, fontSize: 64, color: r.color ?? theme.accent, flex: "0 0 auto", zIndex: 1 }}>{r.value}</div>
          </div>
        );
      })}
    </div>
  );
};

const Content: React.FC<{ view: ShortView; dark: boolean }> = ({ view: s, dark }) => {
  const main = dark ? CREAM : theme.ink;
  const soft = dark ? "rgba(250,246,238,0.8)" : theme.inkSoft;
  const hot = dark ? "#ffd9d2" : theme.accent;
  const block = s.block ?? "center";

  if (block === "rows") return <RowsBlock view={s} />;

  if (block === "flash") {
    return (
      <div style={{ textAlign: "center", padding: "0 60px" }}>
        {s.kicker && <div style={{ ...usePop(2), fontFamily: sans, fontWeight: 800, fontSize: 48, color: soft, marginBottom: 14 }}>{s.kicker}</div>}
        <div style={{ ...usePop(0, 220), fontFamily: display, fontWeight: 900, fontSize: 150, lineHeight: 1.0, color: dark ? "#fff" : theme.accent, textTransform: "uppercase", letterSpacing: -2 }}>{s.line}</div>
        {s.sub && <div style={{ ...usePop(12), fontFamily: sans, fontWeight: 700, fontSize: 46, color: soft, marginTop: 20 }}>{s.sub}</div>}
      </div>
    );
  }

  if (block === "stat") {
    return (
      <div style={{ textAlign: "center", padding: "0 44px" }}>
        {s.kicker && <div style={{ ...usePop(2), fontFamily: sans, fontWeight: 700, fontSize: 42, color: soft, marginBottom: 6 }}>{s.kicker}</div>}
        <div style={{ ...usePop(4, 200) }}>
          {typeof s.bigValue === "number" ? (
            <CountUp value={s.bigValue} prefix={s.bigPrefix} suffix={s.bigSuffix} decimals={s.bigDecimals} size={220} color={dark ? "#fff" : theme.accent} />
          ) : (
            <span style={{ fontFamily: display, fontWeight: 900, fontSize: 220, lineHeight: 0.9, color: dark ? "#fff" : theme.accent, letterSpacing: -4 }}>{s.big}</span>
          )}
        </div>
        {s.label && <div style={{ ...usePop(12), fontFamily: display, fontWeight: 700, fontSize: 56, color: main, marginTop: 8 }}>{s.label}</div>}
        {s.sub && <div style={{ ...usePop(18), fontFamily: sans, fontWeight: 600, fontSize: 40, color: soft, marginTop: 14 }}>{s.sub}</div>}
      </div>
    );
  }

  if (block === "thennow") {
    return (
      <div style={{ textAlign: "center", padding: "0 54px", width: "100%" }}>
        {s.kicker && <div style={{ ...usePop(2), fontFamily: sans, fontWeight: 700, fontSize: 40, color: soft, marginBottom: 20 }}>{s.kicker}</div>}
        <div style={{ ...usePop(6), background: "#fff", border: `3px solid ${PAPER_LINE}`, borderRadius: 22, padding: "20px" }}>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: theme.inkSoft }}>{s.thenLabel ?? "THEN"}</div>
          <div style={{ fontFamily: display, fontWeight: 900, fontSize: 112, lineHeight: 1, color: theme.ink }}>{s.thenValue}</div>
        </div>
        <div style={{ ...usePop(12), fontFamily: display, fontWeight: 900, fontSize: 64, color: hot }}>↓</div>
        <div style={{ ...usePop(16), background: theme.accent, borderRadius: 22, padding: "20px" }}>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: "#ffd9d2" }}>{s.nowLabel ?? "NOW"}</div>
          <div style={{ fontFamily: display, fontWeight: 900, fontSize: 112, lineHeight: 1, color: "#fff" }}>{s.nowValue}</div>
        </div>
        {s.sub && <div style={{ ...usePop(22), fontFamily: sans, fontWeight: 600, fontSize: 40, color: soft, marginTop: 20 }}>{s.sub}</div>}
      </div>
    );
  }

  if (block === "question") {
    return (
      <div style={{ textAlign: "center", padding: "0 60px" }}>
        <div style={{ ...usePop(4), fontFamily: display, fontWeight: 900, fontSize: 100, lineHeight: 1.06, color: main }}>{s.line}</div>
        <SketchUnderline delay={14} width={420} color={hot} />
        <div style={{ ...usePop(24), fontFamily: sans, fontWeight: 700, fontSize: 44, color: hot, marginTop: 36 }}>{s.sub ?? "Tell me in the comments"}</div>
      </div>
    );
  }

  if (block === "hook") {
    const lines = s.lines ?? [];
    return (
      <div style={{ textAlign: "center", padding: "0 56px" }}>
        {lines.map((ln, i) => {
          const last = i === lines.length - 1;
          return <div key={i} style={{ ...usePop(4 + i * 6, 180), fontFamily: display, fontWeight: 900, fontSize: last ? 104 : 82, lineHeight: 1.05, color: last ? hot : main, marginTop: i === 0 ? 0 : 14 }}>{ln}</div>;
        })}
      </div>
    );
  }

  // center: kicker + line + sub
  return (
    <div style={{ textAlign: "center", padding: "0 56px" }}>
      {s.kicker && <div style={{ ...usePop(2), fontFamily: sans, fontWeight: 700, fontSize: 42, color: soft, marginBottom: 16 }}>{s.kicker}</div>}
      {s.line && (
        <div style={{ ...usePop(6), position: "relative", display: "inline-block" }}>
          <div style={{ fontFamily: display, fontWeight: 900, fontSize: 96, lineHeight: 1.04, color: main }}>{s.line}</div>
          {s.strike && <div style={{ position: "absolute", left: -8, right: -8, top: "52%", height: 12, background: theme.accent, borderRadius: 8, transform: "rotate(-4deg)" }} />}
        </div>
      )}
      {s.sub && <div style={{ ...usePop(16), fontFamily: sans, fontWeight: 600, fontSize: 44, color: soft, marginTop: 22, lineHeight: 1.3 }}>{s.sub}</div>}
    </div>
  );
};

const EvidenceCard: React.FC<{ view: ShortView; entry?: SourceEntry }> = ({ view, entry }) => {
  const dark = view.bg === "ink" || view.bg === "red";
  return (
    <AbsoluteFill style={{ background: BGS[view.bg ?? "cream"] }}>
      <Wordmark dark={dark} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, padding: "0 50px", zIndex: 2 }}>
        {view.kicker && <div style={{ ...usePop(2), fontFamily: sans, fontWeight: 800, fontSize: 44, color: dark ? CREAM : theme.inkSoft, textTransform: "uppercase", letterSpacing: 1 }}>{view.kicker}</div>}
        {entry ? (
          <ScreenshotSource image={entry.image} naturalW={entry.width} naturalH={entry.height} url={entry.url} quoteRect={entry.quoteRect} words={entry.words} width={960} />
        ) : (
          <div style={{ fontFamily: sans, fontSize: 40, color: theme.inkSoft }}>[evidence: {view.sourceId}]</div>
        )}
        {view.line && <div style={{ ...usePop(10), fontFamily: display, fontWeight: 900, fontSize: 72, color: dark ? "#fff" : theme.ink, textAlign: "center", lineHeight: 1.05 }}>{view.line}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Card: React.FC<{ view: ShortView; sources?: Record<string, SourceEntry> }> = ({ view, sources }) => {
  const frame = useCurrentFrame();
  const dark = view.bg === "ink" || view.bg === "red";
  const bg = BGS[view.bg ?? "cream"];
  const punch = view.flash ? interpolate(frame, [0, 5], [1.18, 1], { extrapolateRight: "clamp" }) : 1;
  const hasArt = !!view.art;
  if (view.block === "evidence") return <EvidenceCard view={view} entry={view.sourceId ? sources?.[view.sourceId] : undefined} />;
  return (
    <AbsoluteFill style={{ background: bg }}>
      <Props names={view.props} />
      <Wordmark dark={dark} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 30, gap: 8, transform: `scale(${punch})`, zIndex: 2 }}>
        {hasArt && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 600 }}>
            <Art view={view} />
          </div>
        )}
        <Content view={view} dark={dark} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Progress: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const pct = total > 0 ? Math.min(1, frame / total) : 0;
  return (
    <div style={{ position: "absolute", bottom: 120, left: 70, right: 70, zIndex: 6 }}>
      <div style={{ height: 10, background: "rgba(23,18,15,0.12)", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: theme.accent }} />
      </div>
    </div>
  );
};

export const Short: React.FC<{ scenes: ShortScene[]; timing?: number[]; audioSrc?: string; sources?: Record<string, SourceEntry> }> = ({ scenes, timing, audioSrc, sources }) => {
  const { fps } = useVideoConfig();
  const total = shortDurationInFrames(scenes, fps, timing);
  const seqs: React.ReactNode[] = [];
  let cursor = 0;
  scenes.forEach((scene, i) => {
    const dur = Math.round((timing?.[i] ?? DEFAULT_SECONDS) * fps);
    const shots = scene.shots && scene.shots.length ? scene.shots : [scene];
    const n = shots.length;
    shots.forEach((shot, j) => {
      const from = cursor + Math.round((dur * j) / n);
      const to = cursor + Math.round((dur * (j + 1)) / n);
      seqs.push(
        <Sequence key={`${scene.id}-${j}`} from={from} durationInFrames={Math.max(1, to - from)}>
          <Card view={shot} sources={sources} />
        </Sequence>
      );
    });
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
