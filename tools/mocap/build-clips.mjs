#!/usr/bin/env node
// Build a per-video clip library from a manifest.
//
// A manifest (e.g. episodes/examples/EP001.clips.json) lists the clips ONE video
// needs, each pointing at a BVH source (local path or URL). This converts them
// all and writes a single map -> render/src/data/clips.json that the renderer
// imports. Run per video, in CI.
//
// Usage:
//   node build-clips.mjs --manifest <path> [--out render/src/data/clips.json]
//
// Manifest shape:
//   {
//     "source": "tools/mocap/bvh/pirouette.bvh",   // default src for every clip
//     "clips": {
//       "stand": { "lockRoot": true, "view": "front" },
//       "walk":  { "src": "https://host/walk.bvh", "lockRoot": true }
//     }
//   }
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { bvhToClip } from "./bvh2clip.mjs";

function parseArgs(argv) {
  const args = { out: "render/src/data/clips.json" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--manifest") args.manifest = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!args.manifest) throw new Error("Required: --manifest <path>");
  return args;
}

async function resolveSource(src, repoRoot) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${src}`);
    const text = await res.text();
    const tmp = resolve(tmpdir(), `ff-${Date.now()}-${Math.round(performance.now())}.bvh`);
    writeFileSync(tmp, text);
    return tmp;
  }
  return resolve(repoRoot, src);
}

async function main() {
  const args = parseArgs(process.argv);
  // repo root = two levels up from tools/mocap
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
  const manifest = JSON.parse(readFileSync(args.manifest, "utf8"));
  const entries = Object.entries(manifest.clips ?? {});
  if (!entries.length) throw new Error("Manifest has no clips.");

  const out = {};
  for (const [name, spec] of entries) {
    const src = spec.src ?? manifest.source;
    if (!src) throw new Error(`Clip "${name}" has no src and manifest has no default source.`);
    const file = await resolveSource(src, repoRoot);
    out[name] = bvhToClip({
      file,
      name,
      fps: spec.fps ?? 30,
      view: spec.view ?? "front",
      lockRoot: spec.lockRoot ?? false,
      targetHeight: spec.targetHeight ?? 0.8,
      startSec: spec.startSec ?? 0,
      endSec: spec.endSec,
    });
    console.log(`✓ ${name}: ${out[name].frameCount} frames (${out[name].durationSec}s) ← ${src}`);
  }

  const outPath = resolve(repoRoot, args.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(out));
  console.log(`\n→ ${Object.keys(out).length} clips written to ${args.out}`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
