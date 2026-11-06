#!/usr/bin/env node
// BVH -> single 2D stick-figure clip JSON (thin CLI around bvh2clip).
//
// Usage:
//   node convert-bvh.mjs --in bvh/walk.bvh --out clips/walk.json --name walk \
//        [--fps 30] [--view front|side] [--lock-root] [--target-height 0.8]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { bvhToClip } from "./bvh2clip.mjs";

function parseArgs(argv) {
  const args = { fps: 30, view: "front", lockRoot: false, targetHeight: 0.8 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") args.in = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--name") args.name = argv[++i];
    else if (a === "--fps") args.fps = Number(argv[++i]);
    else if (a === "--view") args.view = argv[++i];
    else if (a === "--lock-root") args.lockRoot = true;
    else if (a === "--target-height") args.targetHeight = Number(argv[++i]);
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!args.in || !args.out) throw new Error("Required: --in <file> --out <file>");
  if (!args.name) args.name = args.out.replace(/.*\//, "").replace(/\.json$/, "");
  return args;
}

const a = parseArgs(process.argv);
const clip = bvhToClip({
  file: a.in, name: a.name, fps: a.fps, view: a.view, lockRoot: a.lockRoot, targetHeight: a.targetHeight,
});
mkdirSync(dirname(a.out), { recursive: true });
writeFileSync(a.out, JSON.stringify(clip));
console.log(`✓ ${clip.name}: ${clip.frameCount} frames @ ${clip.fps}fps (${clip.durationSec}s) → ${a.out}`);
