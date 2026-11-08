import React from "react";
import { AbsoluteFill } from "remotion";
import { Mascot, Pose, Expression, Variant } from "./components/Mascot";
import { theme } from "./theme";
import { sans } from "./fonts";

const CELLS: { label: string; pose: Pose; expr?: Expression; variant?: Variant }[] = [
  { label: "stand · neutral", pose: "stand" },
  { label: "point · happy", pose: "point", expr: "happy" },
  { label: "think · worried", pose: "think", expr: "worried" },
  { label: "surprised", pose: "surprised", expr: "surprised" },
  { label: "celebrate", pose: "celebrate", expr: "happy" },
  { label: "villain", pose: "point", expr: "neutral", variant: "villain" },
  { label: "king", pose: "stand", expr: "happy", variant: "king" },
  { label: "walk", pose: "walk" },
];

export const MascotSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: theme.bg, flexDirection: "row", flexWrap: "wrap", alignContent: "center", justifyContent: "center", padding: 30, gap: 10 }}>
    {CELLS.map((c) => (
      <div key={c.label} style={{ width: 300, height: 480, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", border: `1px solid ${theme.grid}` }}>
        <Mascot pose={c.pose} expression={c.expr} variant={c.variant} width={260} height={420} />
        <div style={{ fontFamily: sans, fontSize: 24, color: theme.inkSoft, marginBottom: 10 }}>{c.label}</div>
      </div>
    ))}
  </AbsoluteFill>
);
