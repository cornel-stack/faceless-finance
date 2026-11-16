import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Mascot } from "./components/Mascot";
import { Doodle, DoodleName } from "./components/Doodle";
import { theme } from "./theme";
import { display } from "./fonts";

// Parametrized YouTube clickbait thumbnail, 1280×720. Driven entirely by props so
// every one of the 100 topics can be rendered as a still with --props. Channel look:
// cream bg, ONE huge shocking number in a hand-drawn red circle, a bold 2-line hook,
// and — where the topic genuinely features real people — their actual photos as
// circular cut-outs with red emphasis rings + name tags. No real face? The reacting
// mascot + a big doodle carry it. Designed to punch at tiny sizes. No GenAI imagery.

export type ThumbFace = { slug: string; label?: string };
export type ClickbaitThumbProps = {
  num: number;
  title: string;
  hookTop: string;
  hookBot: string;
  bigNumber: string;
  sub: string;
  deco: DoodleName;
  faces: ThumbFace[];
  accent?: string;
};

const INK = "#17120f";
const CREAM = "#fdfcf8";

const FaceCircle: React.FC<{ face: ThumbFace; size: number; ring: string; x: number; y: number; rot?: number }> = ({
  face, size, ring, x, y, rot = 0,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: size, height: size, transform: `rotate(${rot}deg)` }}>
    <div
      style={{
        width: size, height: size, borderRadius: "50%", overflow: "hidden",
        border: `${Math.max(7, size * 0.035)}px solid ${ring}`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.28)", background: "#ddd",
      }}
    >
      <Img src={staticFile(`img/${face.slug}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    {face.label ? (
      <div
        style={{
          position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%) rotate(" + (-rot) + "deg)",
          background: ring, color: "#fff", fontFamily: display, fontWeight: 900,
          fontSize: Math.max(18, size * 0.11), padding: "2px 14px", borderRadius: 7,
          whiteSpace: "nowrap", border: `3px solid ${INK}`,
        }}
      >
        {face.label.toUpperCase()}
      </div>
    ) : null}
  </div>
);

export const ClickbaitThumb: React.FC<ClickbaitThumbProps> = ({
  hookTop, hookBot, bigNumber, sub, deco, faces, accent,
}) => {
  const RED = accent || theme.accent;
  const hasFaces = faces && faces.length > 0;

  const strokeW = (px: number): React.CSSProperties => ({
    WebkitTextStroke: `${px}px ${INK}`,
    paintOrder: "stroke fill",
  });

  // Big-number font scales to length so long values still fit.
  const bn = bigNumber || "";
  const bnSize = bn.length <= 6 ? 150 : bn.length <= 10 ? 112 : bn.length <= 15 ? 84 : 66;

  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      {/* faint grid/napkin feel */}
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(#00000008 1.5px, transparent 1.5px)", backgroundSize: "26px 26px" }} />

      {/* top hook banner — two bold lines, key line in accent */}
      <div style={{ position: "absolute", top: 26, left: 40, width: 1200 }}>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 70, color: INK, lineHeight: 0.98, letterSpacing: -1, ...strokeW(0) }}>
          {hookTop}
        </div>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 78, color: RED, lineHeight: 0.98, letterSpacing: -1, ...strokeW(3) }}>
          {hookBot}
        </div>
      </div>

      {/* the shocking number in a hand-drawn red circle, lower-left */}
      <div style={{ position: "absolute", left: 70, top: 410 }}>
        <svg width={620} height={260} style={{ position: "absolute", left: -46, top: -46, overflow: "visible" }}>
          <ellipse cx={270} cy={120} rx={285} ry={118} fill="none" stroke={RED} strokeWidth={12} strokeLinecap="round" transform="rotate(-6 270 120)" strokeDasharray="1900" strokeDashoffset="70" />
        </svg>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: bnSize, color: INK, lineHeight: 0.88 }}>{bigNumber}</div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: theme.inkSoft, marginTop: 6, maxWidth: 560 }}>{sub}</div>
      </div>

      {hasFaces ? (
        <FacesCluster faces={faces} red={RED} />
      ) : (
        <>
          {/* reacting mascot bottom-left + big doodle right */}
          <div style={{ position: "absolute", right: 60, top: 250, width: 330, height: 330 }}>
            <Doodle name={deco} size={330} />
          </div>
          <div style={{ position: "absolute", right: 360, bottom: -12, width: 360, height: 500 }}>
            <Mascot pose="point" expression="surprised" width={360} height={500} />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

const FacesCluster: React.FC<{ faces: ThumbFace[]; red: string }> = ({ faces, red }) => {
  const n = Math.min(faces.length, 3);
  if (n === 1) {
    return <FaceCircle face={faces[0]} size={400} ring={red} x={810} y={180} rot={3} />;
  }
  if (n === 2) {
    return (
      <>
        <FaceCircle face={faces[0]} size={300} ring={red} x={740} y={130} rot={-4} />
        <FaceCircle face={faces[1]} size={300} ring={INK} x={940} y={330} rot={4} />
      </>
    );
  }
  return (
    <>
      <FaceCircle face={faces[0]} size={250} ring={red} x={720} y={90} rot={-5} />
      <FaceCircle face={faces[1]} size={250} ring={INK} x={960} y={210} rot={4} />
      <FaceCircle face={faces[2]} size={250} ring={red} x={800} y={410} rot={2} />
    </>
  );
};
