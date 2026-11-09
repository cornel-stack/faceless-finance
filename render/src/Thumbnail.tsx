import React from "react";
import { AbsoluteFill } from "remotion";
import { Mascot } from "./components/Mascot";
import { Doodle } from "./components/Doodle";
import { theme } from "./theme";
import { display } from "./fonts";

// YouTube thumbnail, 1280×720. Channel look: white bg, cartoon mascot reacting,
// one shocking number, a hand-drawn circle, big bold hook text. Rendered as a
// still so it's reproducible. Designed to read at tiny sizes.
export const Thumbnail: React.FC = () => {
  const stroke: React.CSSProperties = {
    WebkitTextStroke: "3px #17120f",
    paintOrder: "stroke fill",
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#fdfcf8" }}>
      {/* top hook banner */}
      <div style={{ position: "absolute", top: 34, width: 1280, textAlign: "center" }}>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 82, color: "#17120f", letterSpacing: -1 }}>
          EVERY COUNTRY IS </span>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 82, color: theme.accent, ...stroke, WebkitTextStroke: "3px #17120f" as string }}>
          BROKE</span>
      </div>

      {/* surprised mascot, left, pointing at the number */}
      <div style={{ position: "absolute", left: 20, bottom: -10, width: 440, height: 600 }}>
        <Mascot pose="point" expression="surprised" width={440} height={600} />
      </div>

      {/* globe wrapped in a chain, right */}
      <div style={{ position: "absolute", right: 70, top: 215, width: 300, height: 300 }}>
        <Doodle name="globe" size={300} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 300, width: 220, height: 220, transform: "rotate(-12deg)" }}>
        <Doodle name="chain" size={220} />
      </div>

      {/* the shocking number with a hand-drawn red circle */}
      <div style={{ position: "absolute", left: 430, top: 210 }}>
        <svg width={520} height={260} style={{ position: "absolute", left: -40, top: -20, overflow: "visible" }}>
          <ellipse cx={240} cy={120} rx={250} ry={115} fill="none" stroke={theme.accent} strokeWidth={11} strokeLinecap="round" transform="rotate(-6 240 120)" strokeDasharray="1600" strokeDashoffset="90" />
        </svg>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 150, color: "#17120f", lineHeight: 0.9 }}>$100T</div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: theme.inkSoft, marginTop: 4 }}>in government debt</div>
      </div>

      {/* bottom curiosity-gap line on a yellow highlight */}
      <div style={{ position: "absolute", bottom: 40, width: 1280, textAlign: "center" }}>
        <span style={{ fontFamily: display, fontWeight: 900, fontSize: 70, color: "#17120f", background: "#ffe14d", padding: "6px 22px", borderRadius: 8, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
          …but who do they <span style={{ color: theme.accent }}>OWE?</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
