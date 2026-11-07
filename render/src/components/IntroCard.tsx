import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../theme";
import { display, sans } from "../fonts";
import { Mascot } from "./Mascot";

export const IntroCard: React.FC<{
  title: string;
  series: string;
  year: string;
}> = ({ title, series, year }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const kicker = spring({ frame, fps, config: { damping: 200 }, delay: 4 });
  const titleIn = spring({ frame, fps, config: { damping: 200 }, delay: 10 });
  const lineDraw = interpolate(frame, [16, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yearIn = spring({ frame, fps, config: { damping: 200 }, delay: 28 });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* red spiking line across the card */}
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <polyline
          points={`0,${height * 0.74} ${width * 0.2},${height * 0.7} ${width * 0.35},${height * 0.76} ${width * 0.5},${height * 0.5} ${width * 0.65},${height * 0.58} ${width * 0.8},${height * 0.2} ${width},${height * 0.28}`}
          fill="none"
          stroke={theme.accent}
          strokeWidth={6}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={4000}
          strokeDashoffset={4000 * (1 - lineDraw)}
          opacity={0.9}
        />
      </svg>

      <div style={{ position: "absolute", right: 150, bottom: 40, width: 380, height: 560 }}>
        <Mascot pose="point" expression="happy" width={380} height={560} />
      </div>

      <div style={{ position: "absolute", left: 120, top: 260, width: 1300 }}>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 8,
            color: theme.accent,
            textTransform: "uppercase",
            opacity: kicker,
            transform: `translateY(${interpolate(kicker, [0, 1], [20, 0])}px)`,
          }}
        >
          {series.replace(/-/g, " ")}
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 110,
            lineHeight: 1.02,
            color: theme.ink,
            marginTop: 24,
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [40, 0])}px)`,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 40,
            color: theme.inkSoft,
            marginTop: 40,
            opacity: yearIn,
          }}
        >
          {year}
        </div>
      </div>
    </AbsoluteFill>
  );
};
