#!/usr/bin/env python3
"""Builds the YouTube package for an episode: title, description (with chapters
derived from real narration timing), tags, chapters. Writes to
episodes/<EPID>/youtube/. Run AFTER narration synth (needs timing.json)."""
import json, pathlib, re

EP = "episodes/examples/EP011-world-debt.json"
TIMING = "render/src/data/timing.json"
SRC = "render/src/data/sources.index.json"
OUT = pathlib.Path("episodes/EP011/youtube")
OUT.mkdir(parents=True, exist_ok=True)

ep = json.loads(pathlib.Path(EP).read_text())
timing = json.loads(pathlib.Path(TIMING).read_text())
secs = timing["seconds"]
scenes = ep["scenes"]
assert len(secs) == len(scenes), f"timing {len(secs)} != scenes {len(scenes)}"

# cumulative start time (s) for each scene
starts, t = [], 0.0
for s in secs:
    starts.append(t); t += s
total = t

def mmss(x):
    x = int(round(x)); return f"{x//60}:{x%60:02d}"

# chapter markers: (substring in the first scene's narration, chapter title)
MARKERS = [
    ("Every country on Earth is in debt", "The $40 trillion question"),
    ("what even is a government debt", "What a government bond really is"),
    ("Follow a single bond", "The life of one bond"),
    ("the single biggest lender is itself", "Mostly, they owe themselves"),
    ("the foreign piece", "Japan, China & the foreign slice"),
    ("why does the whole world keep lining up", "The dollar's exorbitant privilege"),
    ("here's where it gets genuinely strange", "The central bank buys its own debt"),
    ("look at the country that's taken it further", "Japan: the extreme case"),
    ("Problem one is the interest", "Problem 1 — the interest bomb"),
    ("Problem two is subtler", "Problem 2 — the currency trap"),
    ("line between a scary headline", "When countries actually go bust"),
    ("the real limit on a government's debt", "Who really sets the limit"),
    ("Does any of it ever actually get paid back", "Does it ever get paid back?"),
    ("if this all feels unprecedented", "We've done this before (WWII)"),
    ("the debt isn't a bill from some outside villain", "Who's left holding the bag"),
]

chapters = []
for needle, title in MARKERS:
    for i, sc in enumerate(scenes):
        if needle.lower() in sc["narration"].lower():
            chapters.append((starts[i], title)); break
chapters.sort()
# YouTube requires the first chapter at 0:00
if chapters and chapters[0][0] > 0:
    chapters[0] = (0.0, chapters[0][1])
chapter_lines = [f"{mmss(s)} {t}" for s, t in chapters]

# ---- sources (real citations captured) ----
src = json.loads(pathlib.Path(SRC).read_text())
seen, source_lines = set(), []
nice = {
    "en.wikipedia.org": "Wikipedia",
    "www.pgpf.org": "Peter G. Peterson Foundation",
    "www.imf.org": "International Monetary Fund (IMF)",
}
for s in ep.get("sources", []):
    u = s.get("url");
    if not u or u in seen: continue
    seen.add(u)
    host = re.sub(r"^www\.", "", re.sub(r"^https?://", "", u).split("/")[0])
    label = nice.get(re.sub(r"^https?://", "", u).split("/")[0], host)
    source_lines.append(f"• {label} — {u}")
# extra standing references
source_lines += [
    "• U.S. Treasury, Fiscal Data — https://fiscaldata.treasury.gov/americas-finance-guide/national-debt/",
    "• U.S. Treasury, Major Foreign Holders of Treasury Securities (TIC) — https://ticdata.treasury.gov/",
    "• Congressional Budget Office, interest costs — https://www.cbo.gov/",
    "• Federal Reserve (SOMA holdings) — https://www.federalreserve.gov/",
]

TITLE = "Who The World Actually Owes (It's Not Who You Think)"
ALTS = [
    "Every Country Is In Debt — So Who Do They Actually Owe?",
    "The $100 Trillion Question: Who Owns The World's Debt?",
]

desc = f"""{TITLE}

Every country on Earth is in debt — the US, China, Japan, all of them. Together governments owe around $100 TRILLION. But almost nobody asks the obvious question: if everyone's in debt, who is all that money actually owed to? Follow the money and the answer is stranger — and closer to home — than the scary number on the debt clock.

IN THIS VIDEO
• What a government bond really is (and why it's nothing like your credit card)
• Who actually owns the debt — and why it's mostly "ourselves"
• The central bank that prints money to buy its own government's debt
• Why Japan owes 234% of its economy and still hasn't collapsed
• The two problems that actually sink countries: interest, and what you owe it IN
• Greece, Argentina, Sri Lanka — when the lenders simply say no
• Why the debt never really gets paid back — and who's left holding the bonds

CHAPTERS
{chr(10).join(chapter_lines)}

SOURCES & FURTHER READING
{chr(10).join(source_lines)}

If you want more of the stuff hiding in plain sight inside the numbers, subscribe — and tell me which country's debt I should pull apart next.

#economics #finance #nationaldebt #bonds #macroeconomics
"""

tags = ",".join([
    "national debt", "government debt", "who owns the national debt", "world debt",
    "US national debt", "$40 trillion", "$100 trillion", "government bonds",
    "treasury bonds", "how government debt works", "who owns US debt", "Japan debt",
    "China US debt", "Federal Reserve", "money printing", "quantitative easing",
    "inflation", "exorbitant privilege", "reserve currency", "bond market",
    "debt ceiling", "Greece default", "Argentina default", "Sri Lanka default",
    "macroeconomics", "economics explained", "finance explainer", "faceless finance",
])

(OUT / "title.txt").write_text(TITLE + "\n\nAlternates:\n" + "\n".join("• " + a for a in ALTS) + "\n")
(OUT / "description.md").write_text(desc)
(OUT / "tags.txt").write_text(tags + "\n")
(OUT / "chapters.txt").write_text("\n".join(chapter_lines) + "\n")

print(f"YouTube package → {OUT}")
print(f"  video length: {mmss(total)}  ({len(scenes)} scenes)")
print(f"  chapters: {len(chapter_lines)}")
for l in chapter_lines: print("   ", l)
