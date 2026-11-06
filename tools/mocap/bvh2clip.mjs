// Core BVH -> 2D stick-figure clip conversion, reusable by the CLI and the
// per-video clip builder. See convert-bvh.mjs for the command-line wrapper.
import { readFileSync } from "node:fs";
import * as THREE from "three";
import { BVHLoader } from "three/examples/jsm/loaders/BVHLoader.js";
import { JOINTS, BONES, resolveJoints } from "./skeleton.mjs";

const round = (n) => Math.round(n * 1e4) / 1e4;

function loadRig(path) {
  if (!path.toLowerCase().endsWith(".bvh")) {
    throw new Error(`Unsupported rig format: ${path} (BVH only; export Mixamo FBX to BVH first).`);
  }
  const { skeleton, clip } = new BVHLoader().parse(readFileSync(path, "utf8"));
  const scene = new THREE.Object3D();
  scene.add(skeleton.bones[0]);
  return { scene, clip };
}

/**
 * Convert a BVH file into a flat 2D clip object.
 * @param {object} o
 * @param {string} o.file        path to .bvh
 * @param {string} o.name        clip name
 * @param {number} [o.fps=30]
 * @param {"front"|"side"} [o.view="front"]
 * @param {boolean} [o.lockRoot=false]  keep the figure centered horizontally
 * @param {number} [o.targetHeight=0.8] figure height as fraction of the box
 * @param {number} [o.startSec=0]       trim: first second to sample
 * @param {number} [o.endSec]           trim: last second to sample (default = clip end)
 */
export function bvhToClip({ file, name, fps = 30, view = "front", lockRoot = false, targetHeight = 0.8, startSec = 0, endSec }) {
  const { scene, clip } = loadRig(file);

  const boneByName = new Map();
  scene.traverse((obj) => { if (obj.isBone) boneByName.set(obj.name, obj); });
  const { resolved, missing } = resolveJoints(boneByName);
  if (missing.length) {
    throw new Error(
      `Could not map joints: ${missing.join(", ")}. Add aliases in skeleton.mjs. ` +
      `Rig exposes: ${[...boneByName.keys()].join(", ")}`
    );
  }

  const mixer = new THREE.AnimationMixer(scene);
  mixer.clipAction(clip).play();
  const start = Math.max(0, startSec);
  const end = Math.min(endSec ?? clip.duration, clip.duration);
  const frameCount = Math.max(1, Math.round((end - start) * fps));
  const dt = 1 / fps;
  const v = new THREE.Vector3();

  // sample raw projected points over the trim window
  const raw = [];
  for (let f = 0; f < frameCount; f++) {
    mixer.setTime(start + f * dt);
    scene.updateMatrixWorld(true);
    let hipX = 0, hipZ = 0;
    if (lockRoot) { resolved.hips.getWorldPosition(v); hipX = v.x; hipZ = v.z; }
    const frame = {};
    for (const joint of JOINTS) {
      resolved[joint].getWorldPosition(v);
      const px = view === "side" ? v.z - (lockRoot ? hipZ : 0) : v.x - (lockRoot ? hipX : 0);
      frame[joint] = [px, v.y];
    }
    raw.push(frame);
  }

  // global bbox
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const frame of raw) for (const j of JOINTS) {
    const [x, y] = frame[j];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const height = maxY - minY || 1;
  const scale = targetHeight / height;
  const centerX = (minX + maxX) / 2;
  const topMargin = (1 - targetHeight) / 2;

  const frames = raw.map((frame) => {
    const out = {};
    for (const j of JOINTS) {
      const [x, y] = frame[j];
      out[j] = [round(0.5 + (x - centerX) * scale), round(topMargin + (maxY - y) * scale)];
    }
    return out;
  });

  return { name, fps, frameCount, durationSec: round(frameCount / fps), view, joints: JOINTS, bones: BONES, frames };
}
