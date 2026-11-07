import React from "react";
import { Composition } from "remotion";
import { StickFigureDemo } from "./StickFigureDemo";
import { Episode, episodeDurationInFrames } from "./Episode";
import { ClipSheet } from "./ClipSheet";
import { SourceCardDemo, SourceEntry } from "./SourceCardDemo";
import type { MocapClip, Episode as EpisodeType } from "./types";
import probeData from "./data/_probe.json";
import sourcesIndex from "./data/sources.index.json";

// These three are produced by the pipeline (prepare/build-clips/narration) and
// imported statically so the bundle is deterministic:
import episodeData from "./data/current.json";
import clipsData from "./data/clips.json";
import timingData from "./data/timing.json";

const episode = episodeData as unknown as EpisodeType;
const clips = clipsData as unknown as Record<string, MocapClip>;

const timingSeconds = (timingData as { seconds?: number[] }).seconds ?? [];
const timing = timingSeconds.length ? timingSeconds : undefined;
const audioSrc = (timingData as { hasAudio?: boolean }).hasAudio ? "narration.mp3" : undefined;

const demoClip = Object.values(clips)[0];
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StickFigureDemo"
        component={StickFigureDemo}
        durationInFrames={Math.round((demoClip.frameCount * FPS) / demoClip.fps)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ clip: demoClip }}
      />
      <Composition
        id="Episode"
        component={Episode}
        durationInFrames={episodeDurationInFrames(episode, FPS, timing)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ episode, clips, timing, audioSrc }}
      />
      <Composition
        id="ClipSheet"
        component={ClipSheet}
        durationInFrames={1}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ data: probeData as unknown as Record<string, MocapClip>, clipName: "walk", cols: 8, count: 32 }}
      />
      {Object.values(sourcesIndex as Record<string, SourceEntry>)[0] && (
        <Composition
          id="SourceCardDemo"
          component={SourceCardDemo}
          durationInFrames={60}
          fps={FPS}
          width={1920}
          height={1080}
          defaultProps={{ entry: Object.values(sourcesIndex as Record<string, SourceEntry>)[0] }}
        />
      )}
    </>
  );
};
