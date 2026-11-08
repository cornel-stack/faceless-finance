import React from "react";
import { useCurrentFrame } from "remotion";

// Real country flags (correct colours + key design), on a pole, gently waving.
// Drawn crisp so they're recognisable; returns a <g> for use inside a Doodle svg.
export type Country = "jp" | "us" | "cn" | "gb" | "gr" | "ar" | "lk" | "eu";

const INK = "#17120f";
const FX = 24, FY = 14, FW = 58, FH = 37; // flag rect

function star(cx: number, cy: number, r: number): string {
  let p = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.42 : r;
    p += `${i ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)} `;
  }
  return p + "Z";
}

function design(c: Country): React.ReactNode {
  const cx = FX + FW / 2, cy = FY + FH / 2;
  switch (c) {
    case "jp":
      return (<>
        <rect x={FX} y={FY} width={FW} height={FH} fill="#fff" />
        <circle cx={cx} cy={cy} r={10} fill="#bc002d" />
      </>);
    case "us":
      return (<>
        {Array.from({ length: 7 }, (_, i) => <rect key={i} x={FX} y={FY + (FH / 7) * i} width={FW} height={FH / 7} fill={i % 2 ? "#fff" : "#b22234"} />)}
        <rect x={FX} y={FY} width={FW * 0.42} height={(FH / 7) * 4} fill="#3c3b6e" />
        {[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((col) => <circle key={`${r}-${col}`} cx={FX + 4 + col * 5} cy={FY + 4 + r * 5} r={1} fill="#fff" />))}
      </>);
    case "cn":
      return (<>
        <rect x={FX} y={FY} width={FW} height={FH} fill="#de2910" />
        <path d={star(FX + 11, FY + 11, 7)} fill="#ffde00" />
        {[[22, 5], [26, 10], [26, 16], [22, 21]].map(([x, y], i) => <path key={i} d={star(FX + x, FY + y, 2.4)} fill="#ffde00" />)}
      </>);
    case "gb":
      return (<>
        <rect x={FX} y={FY} width={FW} height={FH} fill="#012169" />
        <path d={`M${FX} ${FY} L${FX + FW} ${FY + FH} M${FX + FW} ${FY} L${FX} ${FY + FH}`} stroke="#fff" strokeWidth={6} />
        <path d={`M${FX} ${FY} L${FX + FW} ${FY + FH} M${FX + FW} ${FY} L${FX} ${FY + FH}`} stroke="#c8102e" strokeWidth={3} />
        <rect x={FX} y={cy - 4} width={FW} height={8} fill="#fff" />
        <rect x={cx - 4} y={FY} width={8} height={FH} fill="#fff" />
        <rect x={FX} y={cy - 2} width={FW} height={4} fill="#c8102e" />
        <rect x={cx - 2} y={FY} width={4} height={FH} fill="#c8102e" />
      </>);
    case "gr":
      return (<>
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={FX} y={FY + (FH / 9) * i} width={FW} height={FH / 9} fill={i % 2 ? "#fff" : "#0d5eaf"} />)}
        <rect x={FX} y={FY} width={(FH / 9) * 5} height={(FH / 9) * 5} fill="#0d5eaf" />
        <rect x={FX + (FH / 9) * 2 - 1.5} y={FY} width={3} height={(FH / 9) * 5} fill="#fff" />
        <rect x={FX} y={FY + (FH / 9) * 2 - 1.5} width={(FH / 9) * 5} height={3} fill="#fff" />
      </>);
    case "ar":
      return (<>
        <rect x={FX} y={FY} width={FW} height={FH / 3} fill="#74acdf" />
        <rect x={FX} y={FY + FH / 3} width={FW} height={FH / 3} fill="#fff" />
        <rect x={FX} y={FY + (2 * FH) / 3} width={FW} height={FH / 3} fill="#74acdf" />
        <circle cx={cx} cy={cy} r={5} fill="#f6b40e" stroke="#e08a00" strokeWidth={0.8} />
      </>);
    case "lk":
      return (<>
        <rect x={FX} y={FY} width={FW} height={FH} fill="#ffb700" />
        <rect x={FX + 3} y={FY + 3} width={11} height={FH - 6} fill="#00534e" />
        <rect x={FX + 14} y={FY + 3} width={9} height={FH - 6} fill="#eb7400" />
        <rect x={FX + 25} y={FY + 3} width={FW - 28} height={FH - 6} fill="#8d2029" />
        <ellipse cx={FX + 40} cy={cy} rx={7} ry={11} fill="#ffb700" />
        {[[30, 7], [51, 7], [30, FH + 7], [51, FH + 7]].map(([x, y], i) => <path key={i} d={star(FX + x, FY + y, 2)} fill="#ffb700" />)}
      </>);
    case "eu":
      return (<>
        <rect x={FX} y={FY} width={FW} height={FH} fill="#003399" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * 2 * Math.PI;
          return <path key={i} d={star(cx + Math.cos(a) * 11, cy + Math.sin(a) * 11, 1.8)} fill="#ffcc00" />;
        })}
      </>);
  }
}

export const Flag: React.FC<{ country: Country }> = ({ country }) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame / 9) * 1.6;
  const skew = Math.sin(frame / 7 + 1) * 2.2;
  return (
    <g>
      <line x1={FX} y1={10} x2={FX} y2={94} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <g transform={`rotate(${wave} ${FX} ${FY}) skewY(${skew})`}>
        {design(country)}
        <rect x={FX} y={FY} width={FW} height={FH} fill="none" stroke={INK} strokeWidth={2.2} />
      </g>
    </g>
  );
};
