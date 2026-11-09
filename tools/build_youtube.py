#!/usr/bin/env python3
"""Builds the YouTube package (title, description with real-timed chapters, tags)
for an episode that carries a `youtube` block. Writes to episodes/<EPID>/youtube/.
Run AFTER narration synth (needs timing.json).

Usage: python tools/build_youtube.py --episode episodes/examples/EP012-housing.json"""
import json, pathlib, re, argparse, sys

ap = argparse.ArgumentParser()
ap.add_argument("--episode", default="episodes/examples/EP012-housing.json")
ap.add_argument("--timing", default="render/src/data/timing.json")
ap.add_argument("--sources", default="render/src/data/sources.index.json")
args = ap.parse_args()

ep = json.loads(pathlib.Path(args.episode).read_text())
timing = json.loads(pathlib.Path(args.timing).read_text())
secs = timing["seconds"]
scenes = ep["scenes"]
yt = ep.get("youtube")
if not yt:
    sys.exit("episode has no `youtube` block")
assert len(secs) == len(scenes), f"timing {len(secs)} != scenes {len(scenes)}"

EPID = ep["id"]
OUT = pathlib.Path(f"episodes/{EPID}/youtube")
OUT.mkdir(parents=True, exist_ok=True)

starts, t = [], 0.0
for s in secs:
    starts.append(t); t += s
total = t

def mmss(x):
    x = int(round(x)); return f"{x // 60}:{x % 60:02d}"

# chapters: match each marker's needle against the first scene whose narration contains it
chapters = []
for needle, title in yt.get("chapters", []):
    for i, sc in enumerate(scenes):
        if needle.lower() in sc["narration"].lower():
            chapters.append((starts[i], title)); break
chapters.sort()
if chapters and chapters[0][0] > 0:
    chapters[0] = (0.0, chapters[0][1])
chapter_lines = [f"{mmss(s)} {t}" for s, t in chapters]

# sources: real citations from the episode + any captured
nice = {
    "en.wikipedia.org": "Wikipedia", "www.jchs.harvard.edu": "Harvard JCHS",
    "www.freddiemac.com": "Freddie Mac", "www.housingwire.com": "HousingWire",
    "www.pgpf.org": "Peter G. Peterson Foundation", "www.imf.org": "IMF",
    "www.ssa.gov": "Social Security Administration", "www.zillow.com": "Zillow Research",
    "fred.stlouisfed.org": "FRED (St. Louis Fed)",
}
seen, source_lines = set(), []
for s in ep.get("sources", []):
    u = s.get("url")
    if not u or u in seen: continue
    seen.add(u)
    host = re.sub(r"^https?://", "", u).split("/")[0]
    source_lines.append(f"• {nice.get(host, re.sub(r'^www.', '', host))} — {u}")

TITLE = yt["title"]
desc = f"""{TITLE}

{yt['hook']}

IN THIS VIDEO
{chr(10).join('• ' + b for b in yt['bullets'])}

CHAPTERS
{chr(10).join(chapter_lines)}

SOURCES & FURTHER READING
{chr(10).join(source_lines)}

If this made the numbers finally click, subscribe — and tell me which impossible number you want me to pull apart next.

#economics #finance #housing #realestate
"""

(OUT / "title.txt").write_text(TITLE + "\n\nAlternates:\n" + "\n".join("• " + a for a in yt.get("alts", [])) + "\n")
(OUT / "description.md").write_text(desc)
(OUT / "tags.txt").write_text(",".join(yt["tags"]) + "\n")
(OUT / "chapters.txt").write_text("\n".join(chapter_lines) + "\n")

print(f"YouTube package → {OUT}")
print(f"  length: {mmss(total)}  ({len(scenes)} scenes)  chapters: {len(chapter_lines)}")
for l in chapter_lines: print("   ", l)
