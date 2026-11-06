#!/usr/bin/env node
// Dev tool for choosing trim windows when building a new video's clip library.
// Converts one or more BVH sources at FULL length into render/src/data/_probe.json,
// which the "ClipSheet" Remotion composition renders as a contact sheet of frames.
//
// Usage:
//   node tools/mocap/probe.mjs walk=data/007/07_01.bvh point=https://host/13_28.bvh
//   # then eyeball:
//   pnpm --filter @ff/render exec remotion still ClipSheet out/sheet.png --props '{"clipName":"walk"}'
//
// CMU clips: https://raw.githubusercontent.com/una-dinosauria/cmu-mocap/master/data/<SUBJ3>/<SUBJ>_<TRIAL>.bvh
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { bvhToClip } from "./bvh2clip.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

async function resolveSrc(src) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${src}`);
    const tmp = resolve(tmpdir(), `ff-probe-${src.replace(/\W+/g, "_").slice(-40)}.bvh`);
    writeFileSync(tmp, await res.text());
    return tmp;
  }
  return resolve(repoRoot, src);
}

const specs = process.argv.slice(2);
if (!specs.length) {
  console.error("Usage: probe.mjs name=src [name2=src2 ...]");
  process.exit(1);
}

const out = {};
for (const spec of specs) {
  const eq = spec.indexOf("=");
  const name = spec.slice(0, eq);
  const src = spec.slice(eq + 1);
  const file = await resolveSrc(src);
  out[name] = bvhToClip({ file, name, fps: 30, lockRoot: true, view: "front" });
  console.log(`✓ ${name}: ${out[name].frameCount} frames (${out[name].durationSec}s)`);
}

const outPath = resolve(repoRoot, "render/src/data/_probe.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(out));
console.log(`\n→ ${outPath} — render ClipSheet with --props '{"clipName":"<name>"}'`);
