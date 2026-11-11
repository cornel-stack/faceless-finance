# Napkin Numbers — Production Playbook

How one episode is produced. EP016–EP030 were all made this way. Follow in order.
(Also mirrored in Claude memory so a fresh session resumes identically.)

## Topic order
Next topic = next row of `YouTube-Topic-Bank-4-Channels.xlsx` → **Finance** sheet → **By the Numbers** series.
Dump it: `python3` + `zipfile` reading `xl/worksheets/sheet2.xml` + `sharedStrings.xml`.

**Done:** rows 1–5 (EP011–015, pre-run), rows 6–19 (EP016–024, EP026–030), row 25 (EP025 private-equity, made early).
**RESUME AT:** row 20 **Theranos** as EP031 → 21 Madoff → 22 rich-pretend-poor → 23 fastest-way-to-get-poor → 24 markets-panic-central-banks → 26 scammers-rig-market → 27…40.

## Hard rules
- **Never render locally — always GitHub CI.** Local use is limited to `tsc`, JSON validation, `synth.py` (length), `capture.mjs` (citations), meme fetch.
- Length **12–15 min** (≈ 78–85 scenes; ~0.15 min/scene). Verify with `synth.py` → `timing.json` total.
- Every citation highlights a **meaningful verbatim phrase**, verified via `capture.mjs`.
- Lots of variety: ~11 scene types, **4–5 brand-new motifs + 1–2 new doodles per episode**, free memes, real photos where relevant.

## Start from the latest code branch
All cumulative motifs/doodles + tooling live on the newest episode branch (currently **`ep030-crypto-math`**), not `main`. `git checkout` it and branch the new episode from there, or CI renders without the motifs. Episodes stay on their own branches (`epNNN-slug`), not merged to main.

## Steps
1. Pick topic (next By-the-Numbers row).
2. Research ~7–9 sources: `curl .../api/rest_v1/page/summary/<Page>`; pick a meaningful verbatim clause for each `quote` (avoid parentheticals/citation markers — they break the match). For misses later, use `.../w/api.php?action=query&prop=extracts&exintro&explaintext&titles=<Page>&format=json` and pick a contiguous phrase.
3. Add 4–5 new motifs: name → `StageScene.motif` union in `render/src/scenes/types.ts`; implement as `else if (m==="x")` in `render/src/scenes/SceneView.tsx` before the final `} else {` (VW=980×VH=520; colors `ink gold red green blue parch tan`).
4. Add 1–2 new doodles: `DoodleName` union + `case` in `shape()` in `render/src/components/Doodle.tsx`.
5. `cd render && ./node_modules/.bin/tsc --noEmit` → must be 0.
6. Write `episodes/examples/EPNNN-slug.json` (id, series "Napkin Numbers", title, slug, market US, language en, voice edge/en-US-BrianNeural, note, scenes[], sources[], youtube{title,alts,hook,bullets,tags,hashtags,thumbnail{hookTop,hookBot,napkinNumber,napkinSub,deco},chapters:[[needle,title]]}). Memes = `image` scenes with `meme:"<Imgflip name>", memeTop, memeBottom`. Chapter needle = lowercase substring of some narration.
7. Reach length: insert depth scenes with a python splice keyed on anchor ids.
8. Validate (python): unique ids; chapter needles in narration; screenshot sourceIds exist; every icon/prop/item name is a real doodle `case` (NOT a motif — `seesaw/iceberg/crash/magnet` are motifs). Extract `scenes.json` + `thumb.json`.
9. `node tools/memes/fetch.mjs --episode <ep.json>` (free Imgflip, no key).
10. `.voicevenv/bin/python tools/narration/synth.py --episode <ep.json> --intro 0` → check `timing.json` total/60 ∈ [12,15]. **Run ONE synth, foreground** (orphaned synths corrupt timing.json).
11. `node tools/sourcecards/capture.mjs --episode <ep.json>` → every source "(quote highlighted)"; fix misses + re-capture.
12. `git checkout -b epNNN-slug`; add episode JSON + `render/src/scenes/{types.ts,SceneView.tsx}` + `render/src/components/Doodle.tsx` + `render/src/data/{scenes.json,thumb.json,sources.index.json}` + `render/public/sources/*.png` + `render/public/img/memes/`; commit; `git push -u origin epNNN-slug`.
13. `gh workflow run "Render episode" --ref epNNN-slug -f episode=episodes/examples/EPNNN-slug.json -f codec=h264`.
14. `gh run watch <id> --exit-status`; on success `python tools/downloads.py` (updates `renders/DOWNLOADS.md`).

## Gotchas
- Motif name ≠ doodle name (don't use a motif as an icon/prop).
- `callout.text` count-up only for pure numerics (`$8 billion`); else shown as-is.
- `money()` rounds to whole dollars → chart bar values should be whole numbers.
- EPID is now a sequential counter (stopped equaling row+10 at EP025); coverage follows ROW order.
- GIFs (`tools/gifs/fetch.mjs`) need a key in `tools/gifs/.giphy_key` (gitignored, not yet provided); memes work with no key.
