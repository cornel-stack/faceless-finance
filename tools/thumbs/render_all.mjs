// Render every clickbait thumbnail in thumbnails/manifest.json as a PNG still.
// Bundles the Remotion project ONCE, then renders each topic via renderStill with
// per-topic inputProps. Output: thumbnails/<N.Title>.png. Meant to run in CI
// (never render locally). Optional args: topic numbers to render a subset.
//   node tools/thumbs/render_all.mjs            # all 100
//   node tools/thumbs/render_all.mjs 86 87 88   # just these
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "thumbnails/manifest.json"), "utf8"));
const only = new Set(process.argv.slice(2));
const outDir = path.join(ROOT, "thumbnails");
fs.mkdirSync(outDir, { recursive: true });

console.log("Bundling Remotion project…");
const serveUrl = await bundle({
  entryPoint: path.join(ROOT, "render/src/index.ts"),
  // keep public dir (portraits live in render/public/img)
  publicDir: path.join(ROOT, "render/public"),
});
console.log("Bundle ready.");

let done = 0, failed = 0;
for (const m of manifest) {
  if (only.size && !only.has(String(m.num))) continue;
  const inputProps = {
    num: m.num, title: m.title, hookTop: m.hookTop, hookBot: m.hookBot,
    bigNumber: m.bigNumber, sub: m.sub, deco: m.deco, faces: m.faces || [],
  };
  const output = path.join(outDir, m.file);
  try {
    const composition = await selectComposition({ serveUrl, id: "ClickbaitThumb", inputProps });
    await renderStill({ composition, serveUrl, output, inputProps, overwrite: true });
    done++;
    console.log(`✓ [${m.num}] ${m.file}`);
  } catch (e) {
    failed++;
    console.error(`✗ [${m.num}] ${m.file} — ${e.message}`);
  }
}
console.log(`\nDone: ${done} rendered, ${failed} failed.`);
if (failed) process.exit(1);
