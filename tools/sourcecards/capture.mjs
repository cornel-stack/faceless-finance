#!/usr/bin/env node
// Capture real source screenshots for the "borrowed authority" layer.
//
// For each source in an episode (or a single --url/--quote), load the page in
// headless Chromium, locate the quoted sentence, crop a tight screenshot of the
// paragraph around it, and record the quote's bounding box (normalized) so the
// Remotion <ScreenshotSource> can animate a highlighter over it — highlight is
// NOT baked into the image. URL + access date are logged for the description.
//
// Usage:
//   node capture.mjs --episode episodes/examples/EP001-...json
//   node capture.mjs --url https://… --quote "exact sentence" --id test
//
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function parseArgs(argv) {
  const a = { outDir: "render/public/sources", index: "render/src/data/sources.index.json" };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--episode") a.episode = argv[++i];
    else if (k === "--url") a.url = argv[++i];
    else if (k === "--quote") a.quote = argv[++i];
    else if (k === "--id") a.id = argv[++i];
    else if (k === "--out-dir") a.outDir = argv[++i];
    else if (k === "--index") a.index = argv[++i];
    else throw new Error(`Unknown arg: ${k}`);
  }
  return a;
}

const VIEWPORT = { width: 1280, height: 900 };

async function dismissConsent(page) {
  for (const name of [/^accept all/i, /^accept/i, /^i agree/i, /^agree/i, /^got it/i, /^allow all/i]) {
    try {
      const b = page.getByRole("button", { name });
      if (await b.count()) { await b.first().click({ timeout: 1500 }); await page.waitForTimeout(300); break; }
    } catch {}
  }
}

// Runs in the page: find the quote across nodes (whitespace-normalized,
// case-insensitive), scroll it to center, return quote + context rects.
function locateQuote(quote) {
  const needle = quote.replace(/\s+/g, " ").trim().toLowerCase();
  if (!needle) return null;

  // Build a normalized flat string of all visible text, with a char→(node,offset) map.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let flat = "";
  const map = [];
  let prevSpace = true;
  let node;
  while ((node = walker.nextNode())) {
    const p = node.parentElement;
    if (!p) continue;
    const st = getComputedStyle(p);
    if (st.visibility === "hidden" || st.display === "none") continue;
    const raw = node.nodeValue;
    for (let i = 0; i < raw.length; i++) {
      if (/\s/.test(raw[i])) {
        if (prevSpace) continue;
        flat += " "; map.push({ node, offset: i }); prevSpace = true;
      } else {
        flat += raw[i]; map.push({ node, offset: i }); prevSpace = false;
      }
    }
    if (!prevSpace) { flat += " "; map.push({ node, offset: raw.length }); prevSpace = true; }
  }

  const idx = flat.toLowerCase().indexOf(needle);
  if (idx < 0) return null;
  const start = map[idx];
  const end = map[Math.min(idx + needle.length - 1, map.length - 1)];

  const range = document.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, Math.min(end.offset + 1, end.node.nodeValue.length));

  let el = range.commonAncestorContainer;
  if (el.nodeType === 3) el = el.parentElement;
  while (el && el.getBoundingClientRect().width < 240 && el.parentElement) el = el.parentElement;
  el.scrollIntoView({ block: "center", inline: "nearest" });

  const q = range.getBoundingClientRect();
  const c = el.getBoundingClientRect();
  return { quote: { x: q.x, y: q.y, w: q.width, h: q.height }, ctx: { x: c.x, y: c.y, w: c.width, h: c.height } };
}

async function capture(page, { id, url, quote }, outDir) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await dismissConsent(page);
  await page.waitForTimeout(600);

  let hit = null;
  if (quote) { try { hit = await page.evaluate(locateQuote, quote); } catch {} }

  const pad = 26;
  let clip, quoteRect = null;
  if (hit) {
    const { quote: q, ctx: c } = hit;
    const x = Math.max(0, Math.floor(c.x - pad));
    const y = Math.max(0, Math.floor(c.y - pad));
    const w = Math.min(VIEWPORT.width - x, Math.ceil(c.w + pad * 2));
    const h = Math.min(VIEWPORT.height - y, Math.ceil(c.h + pad * 2));
    clip = { x, y, width: w, height: h };
    quoteRect = { x: (q.x - x) / w, y: (q.y - y) / h, w: q.w / w, h: q.h / h };
  } else {
    clip = { x: 0, y: 0, width: VIEWPORT.width, height: Math.min(560, VIEWPORT.height) };
  }

  const file = `${outDir}/${id}.png`;
  await page.screenshot({ path: resolve(repoRoot, file), clip });
  return {
    id, image: `sources/${id}.png`,
    width: clip.width, height: clip.height,
    quoteRect, url, found: Boolean(hit),
  };
}

async function main() {
  const args = parseArgs(process.argv);
  let sources;
  if (args.episode) {
    const ep = JSON.parse(readFileSync(resolve(repoRoot, args.episode), "utf8"));
    sources = ep.sources
      .filter((s) => s.url && !/example\.com|PLACEHOLDER/i.test(s.name + s.url))
      .map((s) => ({ id: s.id, url: s.url, quote: s.quote }));
  } else if (args.url) {
    sources = [{ id: args.id || "test", url: args.url, quote: args.quote }];
  } else {
    throw new Error("Provide --episode or --url");
  }
  if (!sources.length) {
    // Write an empty index so a stale one from a prior episode can't show wrong cards.
    const indexPath = resolve(repoRoot, args.index);
    mkdirSync(dirname(indexPath), { recursive: true });
    writeFileSync(indexPath, JSON.stringify({}, null, 2));
    console.log("No capturable sources (all placeholders). Wrote empty index.");
    return;
  }

  mkdirSync(resolve(repoRoot, args.outDir), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const index = {};
  for (const s of sources) {
    try {
      const meta = await capture(page, s, args.outDir);
      index[s.id] = meta;
      console.log(`✓ ${s.id}: ${meta.width}×${meta.height}${meta.found ? " (quote highlighted)" : " (no quote match)"} ← ${s.url}`);
    } catch (e) {
      console.error(`✗ ${s.id}: ${e.message}`);
    }
  }
  await browser.close();

  const indexPath = resolve(repoRoot, args.index);
  mkdirSync(dirname(indexPath), { recursive: true });
  writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`\n→ ${Object.keys(index).length} source card(s) → ${args.index}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
