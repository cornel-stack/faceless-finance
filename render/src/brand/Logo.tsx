import React from "react";
import { AbsoluteFill } from "remotion";
import { Napkin } from "./Napkin";
import { brand, hand } from "./brand";
import { display } from "../fonts";

// Channel avatar / profile picture — 800×800, reads as a circle. A napkin on a
// red roundel with the "NN" monogram and a rising-numbers arrow scribbled on it.
export const Logo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.accent, justifyContent: "center", alignItems: "center" }}>
    {/* faint inner ring */}
    <div style={{ position: "absolute", width: 724, height: 724, borderRadius: "50%", border: `6px solid rgba(255,255,255,0.18)` }} />
    <Napkin size={560} rotate={-5} seed={7} pad={0.1}>
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* rising-numbers arrow behind the monogram */}
        <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d="M14 78 L34 60 L50 68 L86 26" fill="none" stroke={brand.accent} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M86 26 L72 30 M86 26 L83 40" fill="none" stroke={brand.accent} strokeWidth={4.5} strokeLinecap="round" />
        </svg>
        {/* monogram */}
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 250, color: brand.ink, lineHeight: 0.8, letterSpacing: -8, position: "relative" }}>NN</div>
        {/* scribbled accents */}
        <div style={{ position: "absolute", left: "7%", top: "10%", fontFamily: hand, fontSize: 70, color: brand.pen, transform: "rotate(-10deg)" }}>$</div>
        <div style={{ position: "absolute", right: "8%", bottom: "12%", fontFamily: hand, fontSize: 52, color: brand.green, transform: "rotate(7deg)" }}>+88%</div>
      </div>
    </Napkin>
  </AbsoluteFill>
);
