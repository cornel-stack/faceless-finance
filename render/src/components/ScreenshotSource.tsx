import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
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
  words?: QuoteRect[] | null;   // per-word rects → highlight word-by-word in sync
}> = ({ image, naturalW, naturalH, url, width, quoteRect, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barH = 40;
  const imgW = width;
  const imgH = (naturalH / naturalW) * imgW;

  const enter = spring({ frame, fps, config: { damping: 200 } });
  // Word-by-word highlighter: each word's marker swipes in at a reading pace,
  // so the quote lights up in sync with the narration reading it aloud.
  const hasWords = Array.isArray(words) && words.length > 0;
  const START = 8, PER = 10; // frames before the first word, then per word (~0.33s)
  const wipe = interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Ken-Burns scroll + zoom: start showing the top of the page, then pan down to
  // the quoted region and zoom in as it's read — the evidence feels alive, not static.
  const vpH = Math.min(imgH, Math.round(imgW * 0.60));
  const q = quoteRect ?? { x: 0.5, y: 0.5, w: 0.2, h: 0.03 };
  const qcx = q.x + q.w / 2, qcy = q.y + q.h / 2;
  // Purposeful zoom: fit the whole highlighted PHRASE comfortably in the viewport
  // (with surrounding context), instead of a fixed crash-zoom onto one word. A
  // short quote zooms in more; a long / multi-line quote zooms in less so it all
  // stays readable. Clamped so we never zoom out past the page or crash in too far.
  const zByW = 0.62 / Math.max(q.w, 0.03);
  const zByH = (0.5 * vpH) / Math.max(q.h * imgH, 1);
  const Zend = quoteRect ? Math.max(1.2, Math.min(1.8, Math.min(zByW, zByH))) : 1.14;
  const clampN = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const txEnd = clampN(imgW / 2 - qcx * imgW * Zend, imgW - imgW * Zend, 0);
  const tyEnd = clampN(vpH / 2 - qcy * imgH * Zend, vpH - imgH * Zend, 0);
  const fp = interpolate(frame, [12, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const kbZ = interpolate(fp, [0, 1], [1, Zend]);
  const kbX = interpolate(fp, [0, 1], [0, txEnd]);
  const kbY = interpolate(fp, [0, 1], [0, tyEnd]);

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

      {/* screenshot viewport — pans + zooms to the quote */}
      <div style={{ position: "relative", width: imgW, height: vpH, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: imgW, height: imgH, transform: `translate(${kbX}px, ${kbY}px) scale(${kbZ})`, transformOrigin: "0 0" }}>
        <Img src={staticFile(image)} style={{ width: imgW, height: imgH, display: "block" }} />
        {hasWords
          ? words!.map((w, i) => {
              const t = interpolate(frame, [START + i * PER, START + i * PER + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (t <= 0) return null;
              return (
                <React.Fragment key={i}>
                  {/* per-word highlighter swipe */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${w.x * 100}%`,
                      top: `${(w.y - 0.006) * 100}%`,
                      width: `${w.w * 100}%`,
                      height: `${(w.h + 0.012) * 100}%`,
                      background: "#ffe92e",
                      mixBlendMode: "multiply",
                      opacity: 0.6,
                      transform: `scaleX(${t})`,
                      transformOrigin: "left center",
                      borderRadius: 2,
                    }}
                  />
                  {/* per-word red underline */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${w.x * 100}%`,
                      top: `${(w.y + w.h + 0.008) * 100}%`,
                      width: `${w.w * t * 100}%`,
                      height: 3,
                      background: theme.accent,
                      borderRadius: 2,
                    }}
                  />
                </React.Fragment>
              );
            })
          : quoteRect && (
            <>
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
    </div>
  );
};
