import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type { Episode as EpisodeType, Chapter, MocapClip, Figure } from "./types";
import { StickFigure } from "./components/StickFigure";
import { LadderChart, LadderItem } from "./components/LadderChart";
import { SourceCard } from "./components/SourceCard";
import { IntroCard } from "./components/IntroCard";
import { theme, money } from "./theme";
import { display, sans } from "./fonts";

export const INTRO_SECONDS = 3;
export const CHAPTER_SECONDS = 6; // fallback; real length comes from narration duration

const primaryFigure = (episode: EpisodeType, ch: Chapter): Figure | undefined =>
  (ch.figures ?? []).map((id) => episode.figures.find((f) => f.id === id)).find(Boolean) as Figure | undefined;

const shortLabel = (f?: Figure) => {
  if (!f) return "";
  const parts = f.label.split(",");
  return (parts.length > 1 ? parts.slice(1).join(",") : parts[0]).trim();
};

const ChapterScene: React.FC<{
  episode: EpisodeType;
  chapter: Chapter;
  index: number;
  ladder: LadderItem[];
  clips: Record<string, MocapClip>;
}> = ({ episode, chapter, index, ladder, clips }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const fig = primaryFigure(episode, chapter);
  const source = fig && episode.sources.find((s) => s.id === fig.source);
  const sf = chapter.animation?.stickFigure;
  const clip = clips[sf?.clip ?? ""] ?? Object.values(clips)[0];

  const headIn = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* header */}
      <div style={{ position: "absolute", left: 100, top: 64, width: 1720 }}>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: theme.accent, textTransform: "uppercase" }}>
          {episode.series.replace(/-/g, " ")} · $0 → $100M
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 72,
            lineHeight: 1.03,
            color: theme.ink,
            marginTop: 10,
            opacity: headIn,
            transform: `translateY(${interpolate(headIn, [0, 1], [26, 0])}px)`,
          }}
        >
          {chapter.title}
        </div>
      </div>

      {/* mascot */}
      <div style={{ position: "absolute", left: 90, top: 380, width: 460, height: 560 }}>
        {clip && <StickFigure clip={clip} loop={sf?.loop ?? false} mood={sf?.mood ?? "neutral"} width={460} height={560} />}
      </div>

      {/* hero chart */}
      <div style={{ position: "absolute", left: 600, top: 250, width: 1260, height: 620 }}>
        <LadderChart items={ladder} upto={index} width={1260} height={620} />
      </div>

      {/* source card */}
      <div style={{ position: "absolute", left: 0, bottom: 128 }}>
        {source && <SourceCard source={source} width={width} />}
      </div>

      {/* ledger */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width,
          height: 104,
          background: theme.ledgerBg,
          color: theme.ledgerInk,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 64px",
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 30, letterSpacing: 3, opacity: 0.75 }}>
          {(episode.ledger?.label ?? "NET WORTH").toUpperCase()}
        </span>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 56 }}>{fig ? money(fig.value) : ""}</span>
      </div>
    </AbsoluteFill>
  );
};

export const Episode: React.FC<{
  episode: EpisodeType;
  clips: Record<string, MocapClip>;
  /** per-chapter seconds (from narration); falls back to CHAPTER_SECONDS */
  timing?: number[];
  /** staticFile name of the narration track, if narration has been generated */
  audioSrc?: string;
}> = ({ episode, clips, timing, audioSrc }) => {
  const { fps } = useVideoConfig();

  const ladder: LadderItem[] = episode.chapters.map((ch) => {
    const f = primaryFigure(episode, ch);
    return { label: shortLabel(f), value: f?.value ?? 0 };
  });

  let cursor = INTRO_SECONDS * fps;
  const introClip = Object.values(clips)[0];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {audioSrc && <Audio src={staticFile(audioSrc)} />}
      <Sequence from={0} durationInFrames={INTRO_SECONDS * fps}>
        <IntroCard title={episode.title} series={episode.series} year="2026" clip={introClip} />
      </Sequence>
      {episode.chapters.map((chapter, i) => {
        const dur = Math.round((timing?.[i] ?? CHAPTER_SECONDS) * fps);
        const from = cursor;
        cursor += dur;
        return (
          <Sequence key={chapter.id} from={from} durationInFrames={dur}>
            <ChapterScene episode={episode} chapter={chapter} index={i} ladder={ladder} clips={clips} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Total frames for a given episode + timing, used by Root to size the composition.
export const episodeDurationInFrames = (episode: EpisodeType, fps: number, timing?: number[]) =>
  INTRO_SECONDS * fps +
  episode.chapters.reduce((acc, _ch, i) => acc + Math.round((timing?.[i] ?? CHAPTER_SECONDS) * fps), 0);
