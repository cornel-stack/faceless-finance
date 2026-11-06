// The 15-joint stick skeleton every mocap clip is retargeted onto.
// Order is stable; the StickFigure renderer relies on these names.

export const JOINTS = [
  "head",
  "neck",
  "hips",
  "lshoulder", "lelbow", "lwrist",
  "rshoulder", "relbow", "rwrist",
  "lhip", "lknee", "lankle",
  "rhip", "rknee", "rankle",
];

// Bones = pairs of joints we draw a thick line between.
export const BONES = [
  ["head", "neck"],
  ["neck", "hips"],
  ["neck", "lshoulder"], ["lshoulder", "lelbow"], ["lelbow", "lwrist"],
  ["neck", "rshoulder"], ["rshoulder", "relbow"], ["relbow", "rwrist"],
  ["hips", "lhip"], ["lhip", "lknee"], ["lknee", "lankle"],
  ["hips", "rhip"], ["rhip", "rknee"], ["rknee", "rankle"],
];

// For each stick joint, candidate bone names across common free-mocap rigs.
// First match found in the loaded skeleton wins. Covers:
//  - Mixamo (mixamorig:*)
//  - CMU "MotionBuilder-friendly" BVH (cgspeed) and three.js example BVH
//  - Daz / BioVision rigs (hip, lShldr, lThigh, ...)
//  - generic / our own synthetic rigs
export const RIG_ALIASES = {
  head:      ["Head", "mixamorig:Head", "head"],
  neck:      ["Neck", "Neck1", "mixamorig:Neck", "neck"],
  hips:      ["Hips", "Hip", "mixamorig:Hips", "hips", "hip", "pelvis"],
  lshoulder: ["LeftArm", "LeftShoulder", "mixamorig:LeftArm", "lshoulder", "lShldr"],
  lelbow:    ["LeftForeArm", "mixamorig:LeftForeArm", "lelbow", "lForeArm"],
  lwrist:    ["LeftHand", "mixamorig:LeftHand", "lwrist", "lHand"],
  rshoulder: ["RightArm", "RightShoulder", "mixamorig:RightArm", "rshoulder", "rShldr"],
  relbow:    ["RightForeArm", "mixamorig:RightForeArm", "relbow", "rForeArm"],
  rwrist:    ["RightHand", "mixamorig:RightHand", "rwrist", "rHand"],
  lhip:      ["LeftUpLeg", "LHipJoint", "mixamorig:LeftUpLeg", "lhip", "lThigh"],
  lknee:     ["LeftLeg", "mixamorig:LeftLeg", "lknee", "lShin"],
  lankle:    ["LeftFoot", "mixamorig:LeftFoot", "lankle", "lFoot"],
  rhip:      ["RightUpLeg", "RHipJoint", "mixamorig:RightUpLeg", "rhip", "rThigh"],
  rknee:     ["RightLeg", "mixamorig:RightLeg", "rknee", "rShin"],
  rankle:    ["RightFoot", "mixamorig:RightFoot", "rankle", "rFoot"],
};

// Resolve stick joint -> actual bone object, given a name->bone map from the loaded rig.
export function resolveJoints(boneByName) {
  const resolved = {};
  const missing = [];
  for (const joint of JOINTS) {
    const candidate = RIG_ALIASES[joint].find((n) => boneByName.has(n));
    if (candidate) resolved[joint] = boneByName.get(candidate);
    else missing.push(joint);
  }
  return { resolved, missing };
}
