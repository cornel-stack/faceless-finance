import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { SceneView } from "./scenes/SceneView";
import type { Scene, CharacterScene, DoodleScene, CompareScene } from "./scenes/types";
import type { SourceEntry } from "./SourceCardDemo";
import { theme } from "./theme";

export const DEFAULT_SCENE_SECONDS = 5;

export const filmDurationInFrames = (scenes: Scene[], fps: number, timing?: number[]) =>
  Math.max(
    fps,
    scenes.reduce((acc, _s, i) => acc + Math.round((timing?.[i] ?? DEFAULT_SCENE_SECONDS) * fps), 0)
  );

// Casual Finance cuts often: a narration line is shown as SEVERAL static shots,
// but EVERY shot is illustrated (no bare filler). Break a character scene into
// a bubble "talking" lead (if it has one) + one shot per prop — the host
// presenting one thing at a time. Cut rate = prop count, so rich scenes cut
// faster. Non-character scenes stay a single held shot.
function shotsFor(scene: Scene): Scene[] {
  // Character: a bubble "talking" lead (if any) + one shot per prop.
  if (scene.type === "character") {
    const cs: CharacterScene = scene;
    const props = cs.props ?? [];
    if (props.length === 0) return [scene];
    const shots: CharacterScene[] = [];
    if (cs.bubble) shots.push({ ...cs, id: `${cs.id}_t`, props: undefined });
    props.forEach((p, k) =>
      shots.push({ ...cs, id: `${cs.id}_p${k}`, props: [p], bubble: undefined, caption: k === props.length - 1 ? cs.caption : undefined })
    );
    return shots;
  }
  // Doodle diagram: build it one item at a time (cut per item added).
  if (scene.type === "doodle") {
    const d: DoodleScene = scene;
    if (d.items.length <= 1) return [scene];
    return d.items.map((_, k) => ({
      ...d,
      id: `${d.id}_d${k}`,
      reveal: k + 1,
      caption: k === d.items.length - 1 ? d.caption : undefined,
    }));
  }
  // Compare: reveal the left side, then cut to both.
  if (scene.type === "compare") {
    const c: CompareScene = scene;
    return [{ ...c, id: `${c.id}_L`, only: "left" }, { ...c, id: `${c.id}_B` }];
  }
  // Callout: hold the big number, then cut to the host reacting to it (so a
  // long stat beat isn't one frozen frame). Only when it has an icon to present.
  if (scene.type === "callout" && scene.icon) {
    const react: CharacterScene = {
      type: "character",
      id: `${scene.id}_r`,
      narration: scene.narration,
      pose: "explain",
      expression: "worried",
      bubble: scene.text,
      props: [{ name: scene.icon, label: scene.sub }],
    };
    return [{ ...scene, id: `${scene.id}_n`, narration: scene.narration }, react];
  }
  return [scene];
}

export const Film: React.FC<{
  scenes: Scene[];
  timing?: number[];
  audioSrc?: string;
  sources?: Record<string, SourceEntry>;
}> = ({ scenes, timing, audioSrc, sources }) => {
  const { fps } = useVideoConfig();
  const seqs: React.ReactNode[] = [];
  let cursor = 0;
  scenes.forEach((scene, i) => {
    const dur = Math.round((timing?.[i] ?? DEFAULT_SCENE_SECONDS) * fps);
    const shots = shotsFor(scene);
    const n = shots.length;
    shots.forEach((shot, j) => {
      const from = cursor + Math.round((dur * j) / n);
      const to = cursor + Math.round((dur * (j + 1)) / n);
      seqs.push(
        <Sequence key={`${i}-${j}`} from={from} durationInFrames={to - from}>
          <SceneView scene={shot} sources={sources} />
        </Sequence>
      );
    });
    cursor += dur;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {audioSrc && <Audio src={staticFile(audioSrc)} />}
      {seqs}
    </AbsoluteFill>
  );
};
