#!/usr/bin/env bash
# Build one episode end to end locally — the same steps CI runs.
#   tools/build-episode.sh <episode.json> <manifest.clips.json> [codec]
set -euo pipefail

EPISODE="${1:?usage: build-episode.sh <episode.json> <manifest.clips.json> [codec]}"
MANIFEST="${2:?usage: build-episode.sh <episode.json> <manifest.clips.json> [codec]}"
CODEC="${3:-h264}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Use the narration venv if it exists, else system python.
PY="python3"
[ -x "tools/narration/.venv/bin/python" ] && PY="tools/narration/.venv/bin/python"

echo "▶ prepare episode"
cp "$EPISODE" render/src/data/current.json

echo "▶ build per-video clips"
node tools/mocap/build-clips.mjs --manifest "$MANIFEST" --out render/src/data/clips.json

echo "▶ narrate (Edge TTS)"
"$PY" tools/narration/synth.py --episode "$EPISODE"

echo "▶ capture source screenshots"
node tools/sourcecards/capture.mjs --episode "$EPISODE" || echo "(source capture skipped)"

echo "▶ render"
mkdir -p render/out
pnpm --filter @ff/render exec remotion render Episode out/episode.mp4 --codec="$CODEC"

echo "✓ render/out/episode.mp4"
