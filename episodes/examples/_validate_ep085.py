import json, re, os, sys

EP = "episodes/examples/EP085-degree-cost-price-tag.json"
ep = json.load(open(EP))
scenes = ep["scenes"]
errors = []

# doodles
dd = open("render/src/components/Doodle.tsx").read()
doodles = set(re.findall(r'case "([a-zA-Z0-9]+)"', dd))
flags = set(re.findall(r'(flag[A-Z][A-Za-z]*)', dd))
valid_props = doodles | flags
# motifs
tt = open("render/src/scenes/types.ts").read()
mblock = tt[tt.index("motif?:"):tt.index("icons?:")]
motifs = set(re.findall(r'"([a-zA-Z0-9]+)"', mblock))

# unique ids
ids = [s["id"] for s in scenes]
if len(ids) != len(set(ids)): errors.append("DUP scene ids: %s" % [i for i in ids if ids.count(i)>1])

src_ids = {s["id"] for s in ep["sources"]}
for s in scenes:
    t = s["type"]
    if t == "screenshot" and s["sourceId"] not in src_ids:
        errors.append("%s bad sourceId %s" % (s["id"], s["sourceId"]))
    if t == "stage" and s.get("motif") not in motifs:
        errors.append("%s bad motif %s" % (s["id"], s.get("motif")))
    if t == "character":
        for p in s.get("props", []):
            if p["name"] not in valid_props:
                errors.append("%s bad prop %s" % (s["id"], p["name"]))
    if t == "callout" and s.get("icon") and s["icon"] not in valid_props:
        errors.append("%s bad icon %s" % (s["id"], s["icon"]))
    if t == "compare":
        for side in ("left","right"):
            ic = s[side].get("icon")
            if ic and ic not in valid_props: errors.append("%s bad compare icon %s" % (s["id"], ic))
    if t == "chart":
        for d in s["data"]:
            if not isinstance(d["value"], int): errors.append("%s non-int chart value %s" % (s["id"], d))
    if t == "image":
        p = "render/public/" + s["src"]
        if not os.path.exists(p): errors.append("%s missing image %s" % (s["id"], p))

# deco doodle
deco = ep["youtube"]["thumbnail"]["deco"]
if deco not in valid_props: errors.append("bad thumbnail deco %s" % deco)

# chapter needles
narr = " ".join(s["narration"] for s in scenes)
for needle, title in ep["youtube"]["chapters"]:
    if needle not in narr: errors.append("chapter needle NOT in narration: %s" % needle)

print("errors:", len(errors))
for e in errors: print("  -", e)

if not errors:
    json.dump(scenes, open("render/src/data/scenes.json","w"), indent=2, ensure_ascii=False)
    json.dump(ep["youtube"]["thumbnail"], open("render/src/data/thumb.json","w"), indent=2, ensure_ascii=False)
    print("extracted scenes.json + thumb.json")
