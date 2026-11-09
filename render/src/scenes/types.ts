import type { Pose, Expression } from "../components/Mascot";
import type { DoodleName } from "../components/Doodle";

// A video is an ordered list of scenes. Each scene is one spoken line + a visual
// composition. Narration sets each scene's duration; the film hard-cuts between
// them (Casual Finance style), with per-scene entrance animations.

interface Base {
  id: string;
  narration: string;
}

export interface TitleScene extends Base {
  type: "title";
  kicker?: string;
  heading: string;
  sub?: string;
}
export interface CharacterScene extends Base {
  type: "character";
  pose?: Pose;
  expression?: Expression;
  variant?: "normal" | "villain" | "king";
  bubble?: string;
  /** illustrations clustered beside the character (so no scene is bare) */
  props?: { name: DoodleName; label?: string }[];
  /** show only the first N props (props accumulate across a scene) */
  reveal?: number;
  caption?: string;
}
export interface CalloutScene extends Base {
  type: "callout";
  text: string;
  sub?: string;
  break?: boolean; // crack the number
  icon?: DoodleName;
}
export interface ScreenshotScene extends Base {
  type: "screenshot";
  sourceId: string;
  caption?: string;
  reaction?: Expression; // small mascot in the corner
}
export interface ChartScene extends Base {
  type: "chart";
  chartType: "bar" | "line";
  title?: string;
  unit?: string;
  data: { label: string; value: number }[];
  highlight?: number;
  /** explanatory annotation: a label + arrow pointing at a data point */
  note?: string;
  noteAt?: number; // which data index to point at (defaults to `highlight`)
  notes?: { at: number; text: string }[]; // several annotations at once
  /** optional second line overlaid on the same axes ("then vs now") */
  series2?: { label: string; value: number }[];
  seriesLabels?: [string, string]; // legend for line 1 / line 2
}

export interface TimelineScene extends Base {
  type: "timeline";
  title?: string;
  events: { year: string; label: string; icon?: DoodleName }[];
  highlight?: number; // which event to emphasise (red)
}

// A real downloaded photo (celebrity / building / logo) filling the frame.
export interface ImageScene extends Base {
  type: "image";
  src: string;          // path under public/, e.g. "img/skilling.jpg"
  caption?: string;     // big caption under the photo
  label?: string;       // small tag on the photo (e.g. a name)
  circle?: boolean;     // red hand-drawn emphasis ring
  mug?: boolean;        // tint/stamp style for a mugshot
}

// A full-frame METAPHOR stage — one big animated motif (collapse, drain, vanish,
// dominoes, crash, stamp…) or one/two large doodles, with a bold caption. No
// arrows. This is the default "picture of the idea" device.
export interface StageScene extends Base {
  type: "stage";
  motif?: "housecollapse" | "vaultdrain" | "vanish" | "dominoes" | "crash" | "stamp" | "spotlight" | "shell" | "mask" | "inflate" | "bankrun" | "rocketcrash" | "towerfall";
  icons?: DoodleName[];   // big centered doodle(s) when no motif
  caption?: string;
  kicker?: string;        // small line above
  stampText?: string;     // for motif "stamp"
  accent?: boolean;       // tint the caption red
}

// A box-and-arrow diagram built step by step (the Casual Finance staple):
// labelled nodes appear in order, arrows wire them up, some get crossed out.
export interface DiagramScene extends Base {
  type: "diagram";
  title?: string;
  nodes: { id: string; label: string; icon?: DoodleName; x: number; y: number; cross?: boolean }[]; // x,y in 0..1
  edges: { from: string; to: string; label?: string }[];
}
export interface DoodleScene extends Base {
  type: "doodle";
  items: DoodleName[];
  labels?: string[];
  caption?: string;
  flow?: boolean; // draw money-flow arrows between items in sequence
  reveal?: number; // show only the first N items (cut-driven diagram build-up)
}
export interface ChalkboardScene extends Base {
  type: "chalkboard";
  lines: string[];
}
export interface CompareScene extends Base {
  type: "compare";
  left: { title: string; value: string; icon?: DoodleName };
  right: { title: string; value: string; icon?: DoodleName };
  only?: "left"; // reveal left first, then cut to both (cut-driven contrast)
}

export type Scene =
  | TitleScene | CharacterScene | CalloutScene | ScreenshotScene
  | ChartScene | DoodleScene | ChalkboardScene | CompareScene | TimelineScene
  | ImageScene | DiagramScene | StageScene;
