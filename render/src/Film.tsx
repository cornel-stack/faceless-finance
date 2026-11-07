import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { SceneView } from "./scenes/SceneView";
import type { Scene } from "./scenes/types";
import type { SourceEntry } from "./SourceCardDemo";
import { theme } from "./theme";

export const DEFAULT_SCENE_SECONDS = 5;

export const filmDurationInFrames = (scenes: Scene[], fps: number, timing?: number[]) =>
  Math.max(
    fps,
    scenes.reduce((acc, _s, i) => acc + Math.round((timing?.[i] ?? DEFAULT_SCENE_SECONDS) * fps), 0)
  );

// The film is an ordered list of scenes, each sized to its narration line, hard-cut
// together (Casual Finance style). One narration track plays underneath.
export const Film: React.FC<{
  scenes: Scene[];
  timing?: number[];
  audioSrc?: string;
  sources?: Record<string, SourceEntry>;
}> = ({ scenes, timing, audioSrc, sources }) => {
  const { fps } = useVideoConfig();
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {audioSrc && <Audio src={staticFile(audioSrc)} />}
      {scenes.map((scene, i) => {
        const dur = Math.round((timing?.[i] ?? DEFAULT_SCENE_SECONDS) * fps);
        const from = cursor;
        cursor += dur;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={dur}>
            <SceneView scene={scene} sources={sources} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
