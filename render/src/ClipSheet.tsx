import React from "react";
import { AbsoluteFill } from "remotion";
import { StickFigure } from "./components/StickFigure";
import { theme } from "./theme";
import { sans } from "./fonts";
import type { MocapClip } from "./types";

// Dev tool: a contact sheet of evenly-spaced frames of one clip, with the clip
// frame index + time under each, so trim windows can be chosen by eye.
export const ClipSheet: React.FC<{
  data: Record<string, MocapClip>;
  clipName: string;
  cols?: number;
  count?: number;
}> = ({ data, clipName, cols = 8, count = 32 }) => {
  const clip = data[clipName];
  const rows = Math.ceil(count / cols);
  const cellW = 1920 / cols;
  const cellH = 1080 / rows;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {Array.from({ length: count }, (_, i) => {
        const cf = Math.round((i / (count - 1)) * (clip.frameCount - 1));
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <div key={i} style={{ position: "absolute", left: col * cellW, top: row * cellH, width: cellW, height: cellH }}>
            <div style={{ position: "absolute", inset: 0, border: `1px solid ${theme.grid}` }} />
            <StickFigure clip={clip} atClipFrame={cf} width={cellW} height={cellH - 26} strokeWidth={5} jointRadius={4} />
            <div style={{ position: "absolute", bottom: 2, left: 6, fontFamily: sans, fontSize: 18, color: theme.inkSoft }}>
              f{cf} · {(cf / clip.fps).toFixed(1)}s
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
