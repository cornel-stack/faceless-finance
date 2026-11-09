import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

// Napkin Numbers — brand tokens. Warm napkin cream + editorial ink + the red
// accent, with a handwriting font for the "scribbled on a napkin" bits.
export const hand = loadHand("normal", { weights: ["700"] }).fontFamily;

export const brand = {
  cream: "#f6eed7",      // the napkin paper
  creamBg: "#fbf7ec",    // page background
  creamDeep: "#ece0bd",  // fold / shadow on the napkin
  ink: "#17120f",
  inkSoft: "#5c544c",
  accent: "#c0392b",     // the red marker
  pen: "#2f5597",        // blue ballpoint
  gold: "#e8b73a",
  green: "#1f7a3d",
};

export const NAME_TOP = "NAPKIN";
export const NAME_BOT = "NUMBERS";
export const TAGLINE = "Big money, sketched simple.";
export const SUBLINE = "The world's biggest numbers — explained like it's the back of a napkin.";
