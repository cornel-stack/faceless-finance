import React from "react";
import { AbsoluteFill } from "remotion";
import { Napkin } from "./Napkin";
import { Mascot } from "../components/Mascot";
import { Doodle } from "../components/Doodle";
import { brand, hand } from "./brand";
import { display } from "../fonts";
import thumb from "../data/thumb.json";

// A branded thumbnail (1280×720): bold hook, reacting mascot, a napkin holding
// the shocking number, and the "NN" logo bug. Defaults come from thumb.json
// (written per-episode), so the SAME composition themes to each video.
export const BrandThumbnail: React.FC<{ hookTop?: string; hookBot?: string; napkinNumber?: string; napkinSub?: string }> = ({
  hookTop = (thumb as any).hookTop ?? "EVERY COUNTRY",
  hookBot = (thumb as any).hookBot ?? "IS BROKE",
  napkinNumber = (thumb as any).napkinNumber ?? "$100T",
  napkinSub = (thumb as any).napkinSub ?? "…owed to who?",
}) => (
  <AbsoluteFill style={{ backgroundColor: brand.creamBg }}>
    {/* faint dots */}
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
      <defs>
        <pattern id="tdots" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.8" fill={brand.creamDeep} />
        </pattern>
      </defs>
      <rect width="1280" height="720" fill="url(#tdots)" />
    </svg>

    {/* hook text (top band, clear of the mascot below) */}
    <div style={{ position: "absolute", top: 34, left: 44, width: 1140 }}>
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 104, lineHeight: 0.92, color: brand.ink, letterSpacing: -1 }}>
        {hookTop} <span style={{ color: brand.accent, WebkitTextStroke: "2px #17120f" }}>{hookBot}</span>
      </div>
    </div>

    {/* reacting mascot, bottom-left corner */}
    <div style={{ position: "absolute", left: -6, bottom: -10, width: 330, height: 460 }}>
      <Mascot pose="point" expression="surprised" width={330} height={460} />
    </div>

    {/* napkin holding the shocking number, with a scribbled circle */}
    <div style={{ position: "absolute", right: 60, top: 180 }}>
      <Napkin size={380} rotate={6} seed={14} pad={0.1}>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg viewBox="0 0 340 180" style={{ position: "absolute", top: -22, left: -34, width: 408, height: 216 }}>
            <ellipse cx={170} cy={82} rx={158} ry={66} fill="none" stroke={brand.accent} strokeWidth={6} transform="rotate(-5 170 82)" strokeDasharray="1000" strokeDashoffset="80" />
          </svg>
          <div style={{ fontFamily: display, fontWeight: 900, fontSize: 104, color: brand.ink, lineHeight: 0.9 }}>{napkinNumber}</div>
          <div style={{ fontFamily: hand, fontSize: 42, color: brand.pen, marginTop: 10 }}>{napkinSub}</div>
        </div>
      </Napkin>
    </div>

    {/* small doodle (per-episode) */}
    <div style={{ position: "absolute", right: 24, bottom: 20, transform: "rotate(-6deg)" }}><Doodle name={((thumb as any).deco ?? "globe")} size={120} /></div>

    {/* logo bug */}
    <div style={{ position: "absolute", left: 470, bottom: 26, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 54, height: 54, borderRadius: "50%", background: brand.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontWeight: 900, fontSize: 30, color: "#fff" }}>NN</div>
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 30, color: brand.ink }}>NAPKIN NUMBERS</div>
    </div>
  </AbsoluteFill>
);
