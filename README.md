# Faceless Finance

A faceless finance video channel built as a **code pipeline**: one episode is one JSON file
that flows through scripted, narrated, animated and muxed stages into a finished MP4 that
GitHub CI renders and hands back as a download link.

See `Faceless-Finance-Channel-Strategy.pdf` for the business strategy. This repo is the
production pipeline for it.

## The three hard rules

1. **Scripts are hand-written and exceptional.** No auto-generation. Example scripts from
   other channels are references only — we author our own. Scripts live in
   `episodes/scripts/*.md` and are referenced from the episode JSON.
2. **Stick-figure animation is motion-capture driven**, not keyframed. Free mocap (CMU BVH /
   Mixamo FBX) is converted once into 2D skeleton clips (`tools/mocap`), which the Remotion
   `StickFigure` component plays back. The motion is a real human's, so weight, balance and
   timing are correct.
3. **No YouTube Data API.** GitHub CI renders the video and publishes it as a downloadable
   artifact/release. You download the link and upload to YouTube yourself.

## Pipeline

Everything below the "script" box runs in **GitHub CI** — your machine only
downloads the finished MP4.

```
episode.json ──▶ script ──▶ clips ────────▶ narration ───▶ render ──────────▶ CI artifact
 (the spine)   (Claude     (per-video BVH   (Edge TTS,     (Remotion: ladder   (download link,
                writes)     → 2D clips)      timing+audio)   chart + mocap        you upload to
                                                             mascot + audio)      YouTube)
```

The **episode JSON is the single source of truth**. `tools/build-episode.sh`
runs the whole chain locally; `.github/workflows/render.yml` runs it in CI.

## Layout

```
episodes/
  schema/episode.schema.json      JSON Schema (draft 2020-12) for an episode
  examples/EP001-*.json           worked example episode
  examples/EP001.clips.json       that episode's clip manifest (name → BVH source)
  scripts/                        hand-written narration scripts (.md), referenced by JSON
tools/
  mocap/                          BVH → 2D stick-figure clip JSON
    skeleton.mjs                  the 15-joint skeleton + rig-name aliases
    bvh2clip.mjs / convert-bvh    core conversion + single-clip CLI
    build-clips.mjs               build one video's clip library from a manifest
  narration/synth.py              Edge TTS → narration.mp3 + timing.json
  build-episode.sh                run the full chain locally (mirrors CI)
render/                           Remotion project: episode JSON → MP4
  src/components/                 StickFigure, LadderChart, IntroCard, SourceCard
  src/data/                       generated inputs: current.json, clips.json, timing.json
  public/narration.mp3            generated narration track (gitignored)
.github/workflows/render.yml      CI: clips + audio + render, then a download link
```

## Build an episode

```bash
pnpm install                                        # once
pip install -r tools/narration/requirements.txt     # once (Edge TTS)

# whole chain → render/out/episode.mp4
tools/build-episode.sh episodes/examples/EP001-every-level-net-worth.json \
                       episodes/examples/EP001.clips.json

pnpm preview                                         # Remotion Studio (live edit)
```

In CI: run the **Render episode** workflow (Actions tab) → download the artifact.

## Building a clip library for a video

Clips come from the **CMU Motion Capture Database** (`una-dinosauria/cmu-mocap`,
BVH by raw URL — CI needs nothing committed). Each episode's `*.clips.json`
maps a gesture name → a BVH `src` + trim window:

1. Grep `cmu-mocap-index-text.txt` for a gesture (walk, point, surprise, ...).
2. Probe candidates and pick a trim window by eye:
   ```bash
   node tools/mocap/probe.mjs point=https://raw.githubusercontent.com/una-dinosauria/cmu-mocap/master/data/013/13_28.bvh
   pnpm --filter @ff/render exec remotion still ClipSheet out/sheet.png --props '{"clipName":"point"}'
   ```
   The sheet labels each frame with its index/time; read off `startSec`/`endSec`.
   (Frame 0 is a T-pose calibration — always start after it.)
3. Add the clip to the episode manifest with `src`, `startSec`, `endSec`,
   `lockRoot`, `view`, then rebuild with `build-clips.mjs`.

EP001's library: idle+shock from `120_15` ("Mickey Surprised"), walk `07_01`,
point `13_28` ("direct traffic, wave, point").

## Status

Pipeline proven end to end: Episode JSON → per-video mocap clips → Edge TTS
narration → Remotion render with embedded audio → MP4. Placeholders remaining:
real essay scripts (Claude writes), a larger per-video clip library, and real
cited sources in place of `demo-placeholder`.
