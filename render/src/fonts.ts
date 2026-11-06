import { loadFont as loadDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";

// Display: high-contrast serif for headlines and big numbers (editorial finance look).
// Sans: clean grotesque for labels, axes, data.
export const display = loadDisplay("normal", { weights: ["700", "900"] }).fontFamily;
export const sans = loadSans("normal", { weights: ["400", "600", "700"] }).fontFamily;
