import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { MocapClip, Vec2 } from "../types";
import { theme } from "../theme";

export const StickFigure: React.FC<{
  clip: MocapClip;
  loop?: boolean;
  mood?: "neutral" | "up" | "down" | "shock";
  color?: string;
  strokeWidth?: number;
  jointRadius?: number;
  /** Box the figure is drawn into, in px. Defaults to the full composition. */
  width?: number;
  height?: number;
  /** Composition-frame offset at which this clip starts playing. */
  startAtFrame?: number;
  /** Draw this exact clip frame, ignoring the timeline (for contact sheets). */
  atClipFrame?: number;
}> = ({
  clip,
  loop = false,
  mood = "neutral",
  color,
  strokeWidth = 12,
  jointRadius = 10,
  width,
  height,
  startAtFrame = 0,
  atClipFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps, width: compW, height: compH } = useVideoConfig();
  const W = width ?? compW;
  const H = height ?? compH;
  // The character is always one ink color — brand consistency. `mood` is kept
  // for future gesture selection, not body tint.
  const stroke = color ?? theme.ink;

  // Map composition frame -> clip frame (clips may run at a different fps).
  let cf = (frame - startAtFrame) * (clip.fps / fps);
  if (atClipFrame !== undefined) {
    cf = atClipFrame;
  } else if (loop) {
    cf = ((cf % clip.frameCount) + clip.frameCount) % clip.frameCount;
  } else {
    cf = Math.max(0, Math.min(clip.frameCount - 1, cf));
  }
  const f0 = Math.floor(cf) % clip.frameCount;
  const f1 = (f0 + 1) % clip.frameCount;
  const a = cf - Math.floor(cf); // interpolation weight for smoothness

  const at = (joint: string): Vec2 => {
    const p0 = clip.frames[f0][joint];
    const p1 = clip.frames[f1][joint];
    return [
      (p0[0] + (p1[0] - p0[0]) * a) * W,
      (p0[1] + (p1[1] - p0[1]) * a) * H,
    ];
  };

  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      {clip.bones.map(([j0, j1], i) => {
        const [x0, y0] = at(j0);
        const [x1, y1] = at(j1);
        return (
          <line
            key={i}
            x1={x0}
            y1={y0}
            x2={x1}
            y2={y1}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      })}
      {clip.joints.map((j) => {
        const [x, y] = at(j);
        const r = j === "head" ? jointRadius * 2.6 : jointRadius;
        return <circle key={j} cx={x} cy={y} r={r} fill={stroke} />;
      })}
    </svg>
  );
};
