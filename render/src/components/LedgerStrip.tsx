import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// Persistent running-total strip at the bottom (net worth, debt, years).
// Counts up to the chapter's headline figure.
export const LedgerStrip: React.FC<{
  label: string;
  value: number;
  unit?: string;
  width: number;
}> = ({ label, value, unit = "USD", width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = interpolate(frame, [0, fps * 1.2], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fmt = new Intl.NumberFormat("en-US", {
    style: unit === "USD" ? "currency" : "decimal",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div
      style={{
        width,
        height: 96,
        background: "#1a1a1a",
        color: "#faf9f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        fontFamily: "Georgia, serif",
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontSize: 34, letterSpacing: 1, opacity: 0.8 }}>
        {label.toUpperCase()}
      </span>
      <span style={{ fontSize: 52, fontWeight: 700 }}>{fmt.format(shown)}</span>
    </div>
  );
};
