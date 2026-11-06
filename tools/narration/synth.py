#!/usr/bin/env python3
"""Narrate an episode with Microsoft Edge TTS and emit timing for the renderer.

For each chapter: synthesize its script to MP3 (Edge TTS, free, no key), measure
its duration, then concatenate into one narration track that begins with an
intro-length silence so it lines up with the Remotion intro card. Writes a
timing.json the render uses to size each chapter to its real narration length.

Runs in CI — nothing heavy runs on the author's machine.

Usage:
  python synth.py --episode episodes/examples/EP001-every-level-net-worth.json \
     --out-audio render/public/narration.mp3 \
     --out-timing render/src/data/timing.json \
     [--voice en-US-ChristopherNeural] [--rate +0%] [--intro 3] [--pad 0.5]
"""
import argparse
import asyncio
import json
import subprocess
import tempfile
from pathlib import Path

import edge_tts

DEFAULT_VOICE = "en-US-ChristopherNeural"


def ffprobe_seconds(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nk=1:nw=1", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def silence(path: Path, seconds: float):
    subprocess.run(
        ["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
         "-t", f"{seconds:.3f}", "-c:a", "libmp3lame", "-q:a", "9", str(path)],
        check=True, capture_output=True,
    )


def chapter_text(episode_path: Path, chapter: dict) -> str:
    if chapter.get("scriptFile"):
        episodes_dir = episode_path.parent.parent  # episodes/examples/x.json -> episodes/
        return (episodes_dir / chapter["scriptFile"]).read_text(encoding="utf-8").strip()
    return (chapter.get("script") or "").strip()


async def synth(text: str, voice: str, rate: str, out: Path):
    await edge_tts.Communicate(text, voice, rate=rate).save(str(out))


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--episode", required=True)
    ap.add_argument("--out-audio", default="render/public/narration.mp3")
    ap.add_argument("--out-timing", default="render/src/data/timing.json")
    ap.add_argument("--voice", default=None)
    ap.add_argument("--rate", default="+0%")
    ap.add_argument("--intro", type=float, default=3.0)
    ap.add_argument("--pad", type=float, default=0.5)
    args = ap.parse_args()

    episode_path = Path(args.episode)
    episode = json.loads(episode_path.read_text(encoding="utf-8"))
    voice = args.voice or (episode.get("voice") or {}).get("voiceId") or DEFAULT_VOICE

    out_audio = Path(args.out_audio)
    out_timing = Path(args.out_timing)
    out_audio.parent.mkdir(parents=True, exist_ok=True)
    out_timing.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        intro_sil = tmp / "intro.mp3"
        pad_sil = tmp / "pad.mp3"
        silence(intro_sil, args.intro)
        silence(pad_sil, args.pad)

        concat_parts = [intro_sil]
        seconds = []
        chapters_meta = []
        for i, ch in enumerate(episode["chapters"]):
            text = chapter_text(episode_path, ch)
            if not text:
                # no script yet: reserve a short placeholder beat
                seconds.append(args.pad)
                concat_parts.append(pad_sil)
                chapters_meta.append({"id": ch["id"], "seconds": round(args.pad, 3)})
                continue
            mp3 = tmp / f"ch{i}.mp3"
            await synth(text, voice, args.rate, mp3)
            dur = ffprobe_seconds(mp3)
            block = round(dur + args.pad, 3)
            seconds.append(block)
            concat_parts.append(mp3)
            concat_parts.append(pad_sil)
            chapters_meta.append({"id": ch["id"], "seconds": block})
            print(f"  ch{i} {ch['id']}: {dur:.2f}s + {args.pad}s pad = {block}s")

        # concat everything into one track, re-encoded to a uniform mp3
        listfile = tmp / "list.txt"
        listfile.write_text("".join(f"file '{p}'\n" for p in concat_parts), encoding="utf-8")
        subprocess.run(
            ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listfile),
             "-c:a", "libmp3lame", "-q:a", "4", str(out_audio)],
            check=True, capture_output=True,
        )

    timing = {
        "voice": voice,
        "rate": args.rate,
        "intro": args.intro,
        "pad": args.pad,
        "seconds": seconds,
        "chapters": chapters_meta,
        "hasAudio": True,
        "total": round(args.intro + sum(seconds), 3),
    }
    out_timing.write_text(json.dumps(timing, indent=2), encoding="utf-8")
    print(f"\n→ narration: {out_audio} ({timing['total']}s)\n→ timing:    {out_timing}")


if __name__ == "__main__":
    asyncio.run(main())
