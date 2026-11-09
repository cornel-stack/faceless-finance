import React from "react";
import { RRect, RLine } from "../motion/rough";
import { brand } from "./brand";

// A hand-drawn paper napkin: rough cream square, a dashed embossed border, a
// faint quarter-fold crease, and a dog-eared corner. Children sit on top (the
// scribbled numbers / wordmark). Rotate via the `rotate` prop.
export const Napkin: React.FC<{
  size: number;
  rotate?: number;
  seed?: number;
  children?: React.ReactNode;
  pad?: number;
}> = ({ size, rotate = -4, seed = 11, children, pad = 0.14 }) => {
  const V = 100;
  const b = 11; // border inset
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 22px 28px rgba(23,18,15,0.16))",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${V} ${V}`} style={{ position: "absolute", inset: 0 }}>
        {/* paper */}
        <RRect x={3} y={3} w={V - 6} h={V - 6} fill={brand.cream} strokeWidth={1.5} seed={seed} roughness={1.1} />
        {/* dashed embossed border */}
        <rect x={b} y={b} width={V - 2 * b} height={V - 2 * b} fill="none" stroke={brand.creamDeep} strokeWidth={0.7} strokeDasharray="2.4 2.2" rx={2} />
        {/* faint quarter-fold creases */}
        <RLine x1={V / 2} y1={b} x2={V / 2} y2={V - b} stroke={brand.creamDeep} strokeWidth={0.5} roughness={0.8} seed={seed + 2} />
        <RLine x1={b} y1={V / 2} x2={V - b} y2={V / 2} stroke={brand.creamDeep} strokeWidth={0.5} roughness={0.8} seed={seed + 3} />
        {/* dog-eared bottom-right corner */}
        <path d={`M${V - 3} ${V - 20} L${V - 3} ${V - 3} L${V - 20} ${V - 3} Z`} fill={brand.creamDeep} opacity={0.9} />
        <path d={`M${V - 20} ${V - 3} L${V - 3} ${V - 20}`} stroke={brand.inkSoft} strokeWidth={0.5} fill="none" opacity={0.5} />
      </svg>
      <div style={{ position: "absolute", inset: `${pad * 100}%`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
};
