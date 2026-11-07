// Shape of a 2D stick-figure clip produced by tools/mocap.
export type Vec2 = [number, number];

export type MocapClip = {
  name: string;
  fps: number;
  frameCount: number;
  durationSec: number;
  view: "front" | "side";
  joints: string[];
  bones: [string, string][];
  /** max ankle y in the 0..1 box — the figure's foot level, for ground alignment */
  footY?: number;
  frames: Record<string, Vec2>[];
};

// Subset of the episode schema the renderer actually reads.
export type Figure = {
  id: string;
  label: string;
  value: number;
  unit?: string;
  year?: string;
  source: string;
};

export type Source = {
  id: string;
  name: string;
  url: string;
  accessed: string;
  quote?: string;
};

export type Chapter = {
  id: string;
  title: string;
  script?: string;
  scriptFile?: string;
  figures?: string[];
  /** short punchy line the mascot "says" in a speech bubble */
  bubble?: string;
  animation?: {
    stickFigure?: {
      clip?: string;
      loop?: boolean;
      mood?: "neutral" | "up" | "down" | "shock";
      anchor?: "left" | "center" | "right";
    };
    chart?: {
      type?: "line" | "bar" | "bar-race" | "map" | "compound" | "none";
      figures?: string[];
      drawSeconds?: number;
    };
    /** doodle prop names placed around the scene (see Doodle.tsx) */
    props?: string[];
  };
};

export type Episode = {
  id: string;
  series: "by-the-numbers" | "every-level" | "the-price-tag";
  title: string;
  market: "US" | "UK" | "CA" | "AU";
  language: "en-US" | "en-GB";
  durationTargetMin?: number;
  ledger?: { label?: string; unit?: string; track?: string };
  calculator?: { url?: string; cta?: string };
  chapters: Chapter[];
  figures: Figure[];
  sources: Source[];
};
