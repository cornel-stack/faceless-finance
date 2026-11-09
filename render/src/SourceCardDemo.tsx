import React from "react";
import { AbsoluteFill } from "remotion";
import { ScreenshotSource, QuoteRect } from "./components/ScreenshotSource";
import { theme } from "./theme";

export type SourceEntry = {
  image: string;
  width: number;
  height: number;
  url: string;
  quoteRect?: QuoteRect | null;
  words?: QuoteRect[] | null;
};

export const SourceCardDemo: React.FC<{ entry: SourceEntry }> = ({ entry }) => (
  <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: "center", alignItems: "center" }}>
    <ScreenshotSource
      image={entry.image}
      naturalW={entry.width}
      naturalH={entry.height}
      url={entry.url}
      quoteRect={entry.quoteRect}
      words={entry.words}
      width={1120}
    />
  </AbsoluteFill>
);
