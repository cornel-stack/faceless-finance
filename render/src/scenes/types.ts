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
}
export interface DoodleScene extends Base {
  type: "doodle";
  items: DoodleName[];
  labels?: string[];
  caption?: string;
  flow?: boolean; // draw money-flow arrows between items in sequence
}
export interface ChalkboardScene extends Base {
  type: "chalkboard";
  lines: string[];
}
export interface CompareScene extends Base {
  type: "compare";
  left: { title: string; value: string };
  right: { title: string; value: string };
}

export type Scene =
  | TitleScene | CharacterScene | CalloutScene | ScreenshotScene
  | ChartScene | DoodleScene | ChalkboardScene | CompareScene;
