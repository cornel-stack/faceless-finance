import React from "react";
import { AbsoluteFill } from "remotion";
import { StickFigure } from "./components/StickFigure";
import type { MocapClip } from "./types";

// Proves the mocap -> render path: plays a converted 2D clip as a stick figure.
export const StickFigureDemo: React.FC<{ clip: MocapClip }> = ({ clip }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#faf9f6", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 900, height: 900 }}>
        <StickFigure clip={clip} loop width={900} height={900} />
      </div>
    </AbsoluteFill>
  );
};
