import React from "react";
import { AbsoluteFill } from "remotion";
import { Doodle, DoodleName } from "./components/Doodle";
import { theme } from "./theme";
import { sans } from "./fonts";

const NAMES: DoodleName[] = ["forsale","sold","keys","mortgage","apartment","crane","hardhat","padlock","lockhouse","calculator","blueprint","paystub","couple","movingbox","house","pricetag"];

export const DoodleSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: theme.bg, flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", padding: 60, gap: 24 }}>
    {NAMES.map((n) => (
      <div key={n} style={{ width: 280, height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px solid ${theme.grid}` }}>
        <Doodle name={n} size={200} />
        <div style={{ fontFamily: sans, fontSize: 26, color: theme.inkSoft, marginTop: 10 }}>{n}</div>
      </div>
    ))}
  </AbsoluteFill>
);
