import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../theme";
import { sans } from "../fonts";

export type QuoteRect = { x: number; y: number; w: number; h: number };

// A real source screenshot in a browser-card frame, with a highlighter marker
// that wipes across the quoted line (drawn here, never baked into the capture).
export const ScreenshotSource: React.FC<{
  image: string;        // path under public/, e.g. "sources/scf.png"
  naturalW: number;
  naturalH: number;
  url: string;
  width: number;
  quoteRect?: QuoteRect | null;
}> = ({ image, naturalW, naturalH, url, width, quoteRect }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barH = 40;
  const imgW = width;
  const imgH = (naturalH / naturalW) * imgW;

  const enter = spring({ frame, fps, config: { damping: 200 } });
  const wipe = interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let domain = url;
  try { domain = new URL(url).hostname.replace(/^www\./, ""); } catch {}

  return (
    <div
      style={{
        width,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 14px 40px rgba(0,0,0,0.16)",
        border: `1px solid ${theme.grid}`,
        background: "#fff",
      }}
    >
      {/* browser chrome */}
      <div style={{ height: barH, background: "#ebe7e0", display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
        ))}
        <div
          style={{
            marginLeft: 12, flex: 1, height: 24, background: "#fff", borderRadius: 6,
            display: "flex", alignItems: "center", padding: "0 12px",
            fontFamily: sans, fontSize: 18, color: theme.inkSoft, whiteSpace: "nowrap", overflow: "hidden",
          }}
        >
          {domain}
        </div>
      </div>

      {/* screenshot + highlight overlay */}
      <div style={{ position: "relative", width: imgW, height: imgH }}>
        <Img src={staticFile(image)} style={{ width: imgW, height: imgH, display: "block" }} />
        {quoteRect && (
          <>
            {/* highlighter marker */}
            <div
              style={{
                position: "absolute",
                left: `${quoteRect.x * 100}%`,
                top: `${(quoteRect.y - 0.01) * 100}%`,
                width: `${quoteRect.w * 100}%`,
                height: `${(quoteRect.h + 0.02) * 100}%`,
                background: "#ffe92e",
                mixBlendMode: "multiply",
                opacity: 0.55,
                transform: `scaleX(${wipe})`,
                transformOrigin: "left center",
                borderRadius: 3,
              }}
            />
            {/* red underline */}
            <div
              style={{
                position: "absolute",
                left: `${quoteRect.x * 100}%`,
                top: `${(quoteRect.y + quoteRect.h + 0.01) * 100}%`,
                width: `${quoteRect.w * wipe * 100}%`,
                height: 4,
                background: theme.accent,
                borderRadius: 2,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
