import React from "react";
import { AbsoluteFill } from "remotion";
import { Napkin } from "./Napkin";
import { Mascot } from "../components/Mascot";
import { Doodle } from "../components/Doodle";
import { brand, hand, NAME_TOP, NAME_BOT, TAGLINE } from "./brand";
import { display, sans } from "../fonts";

// YouTube channel banner — 2560×1440. Everything that MUST be seen lives in the
// centred 1546×423 "safe area" (visible on phones); doodles fill the outer area
// for desktop/TV. Centre band spans x[507,2053], y[509,931].
export const Banner: React.FC = () => {
  const cx = 1280, cy = 720;
  const scatter: { n: Parameters<typeof Doodle>[0]["name"]; x: number; y: number; s: number; r: number }[] = [
    { n: "globe", x: 150, y: 210, s: 170, r: -8 },
    { n: "coins", x: 360, y: 1140, s: 150, r: 6 },
    { n: "bond", x: 2050, y: 200, s: 160, r: 7 },
    { n: "printer", x: 2260, y: 980, s: 150, r: -6 },
    { n: "chartup", x: 120, y: 760, s: 150, r: 0 },
    { n: "flagJP", x: 2330, y: 560, s: 140, r: 8 },
    { n: "piggybank", x: 2120, y: 1250, s: 150, r: -5 },
    { n: "capitol", x: 300, y: 500, s: 140, r: 5 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: brand.creamBg }}>
      {/* faint dot grid */}
      <svg width={2560} height={1440} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <defs>
          <pattern id="dots" width="46" height="46" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill={brand.creamDeep} />
          </pattern>
        </defs>
        <rect width="2560" height="1440" fill="url(#dots)" />
      </svg>

      {/* decorative doodles in the outer (cropped-on-mobile) zone */}
      {scatter.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: d.x - d.s / 2, top: d.y - d.s / 2, width: d.s, transform: `rotate(${d.r}deg)`, opacity: 0.9 }}>
          <Doodle name={d.n} size={d.s} />
        </div>
      ))}

      {/* ---- safe-area content ---- */}
      {/* mascot, left of the wordmark */}
      <div style={{ position: "absolute", left: cx - 760, top: cy - 300, width: 330, height: 600 }}>
        <Mascot pose="present" expression="happy" width={330} height={600} />
      </div>

      {/* wordmark + tagline */}
      <div style={{ position: "absolute", left: cx - 360, top: cy - 205, width: 1120, display: "flex", flexDirection: "column", justifyContent: "center", height: 410 }}>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 150, lineHeight: 0.92, color: brand.ink, letterSpacing: -2 }}>
          {NAME_TOP}
          <br />
          <span style={{ color: brand.accent }}>{NAME_BOT}</span>
        </div>
        <div style={{ fontFamily: hand, fontSize: 68, color: brand.pen, marginTop: 14 }}>{TAGLINE}</div>
        <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 34, color: brand.inkSoft, marginTop: 18, letterSpacing: 1 }}>
          NEW DEEP-DIVE EVERY WEEK · FULLY CITED
        </div>
      </div>

      {/* a small napkin to the right of the wordmark as a brand cue (clear of text) */}
      <div style={{ position: "absolute", left: cx + 480, top: cy - 170 }}>
        <Napkin size={150} rotate={9} seed={21} pad={0.16}>
          <div style={{ fontFamily: hand, fontSize: 44, color: brand.ink, textAlign: "center", lineHeight: 1 }}>$40T<br />?</div>
        </Napkin>
      </div>
    </AbsoluteFill>
  );
};
