import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { theme } from "../theme";
import { sans } from "../fonts";

// A comic speech bubble the mascot "says" — pops in with a tail pointing at the
// character. Casual Finance uses these for punchy one-liners.
export const SpeechBubble: React.FC<{
  text: string;
  width?: number;
  tail?: "left" | "down";
  delay?: number;
}> = ({ text, width = 320, tail = "left", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, delay, config: { damping: 14, mass: 0.6 } });

  return (
    <div
      style={{
        position: "relative",
        width,
        transform: `scale(${s})`,
        transformOrigin: tail === "left" ? "left center" : "center bottom",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: `4px solid ${theme.ink}`,
          borderRadius: 26,
          padding: "20px 28px",
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 36,
          lineHeight: 1.15,
          color: theme.ink,
          textAlign: "center",
          boxShadow: "0 6px 0 rgba(23,18,15,0.12)",
        }}
      >
        {text}
      </div>
      {/* tail */}
      {tail === "left" ? (
        <svg width={34} height={40} style={{ position: "absolute", left: -26, bottom: 24 }} viewBox="0 0 34 40">
          <path d="M34 6 L4 20 L34 34 Z" fill="#fff" stroke={theme.ink} strokeWidth={4} strokeLinejoin="round" />
          <rect x={30} y={4} width={6} height={32} fill="#fff" stroke="none" />
        </svg>
      ) : (
        <svg width={40} height={34} style={{ position: "absolute", left: 40, bottom: -26 }} viewBox="0 0 40 34">
          <path d="M6 0 L20 30 L34 0 Z" fill="#fff" stroke={theme.ink} strokeWidth={4} strokeLinejoin="round" />
          <rect x={4} y={-4} width={32} height={6} fill="#fff" stroke="none" />
        </svg>
      )}
    </div>
  );
};
