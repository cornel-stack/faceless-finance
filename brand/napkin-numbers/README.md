# Napkin Numbers — launch brand kit

Everything to launch the channel. All images are rendered from reproducible
Remotion compositions (`render/src/brand/`) so they can be regenerated or
re-themed anytime:

```
cd render
pnpm exec remotion still Logo            out/brand/logo.png        # 800×800
pnpm exec remotion still Banner          out/brand/banner.png      # 2560×1440
pnpm exec remotion still BrandThumbnail  out/brand/thumbnail.png   # 1280×720
```

## Assets & where they go on YouTube

| File | Size | Upload to |
|------|------|-----------|
| `profile-picture.png` | 800×800 | Customise channel → Branding → **Picture** (shown as a circle) |
| `banner.png` | 2560×1440 | Customise channel → Branding → **Banner image** (safe area centred 1546×423) |
| `thumbnail-template.png` | 1280×720 | A **template** for video thumbnails — swap the hook text + napkin number per video |
| `channel-description.md` | — | Customise channel → Basic info → **Description**, Handle, tagline |

## Identity
- **Name:** Napkin Numbers · **Handle:** @napkinnumbers
- **Tagline:** "Big money, sketched simple."
- **Palette:** napkin cream `#f6eed7`, page cream `#fbf7ec`, ink `#17120f`,
  red marker `#c0392b`, blue pen `#2f5597`, green `#1f7a3d`
- **Type:** Playfair Display (wordmark / big numbers) + Caveat (handwritten
  napkin scribbles) + Inter (labels)
- **Motifs:** the hand-drawn paper napkin, the "NN" monogram with a rising-numbers
  arrow, and the channel mascot — all in the same Rough.js hand-drawn style as the videos.

The banner keeps the name, tagline and mascot inside YouTube's mobile-safe
centre band; the scattered doodles fill the wider desktop/TV crop.
