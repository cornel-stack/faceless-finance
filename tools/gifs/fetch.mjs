#!/usr/bin/env node
// Fetch real animated GIFs (memes / reactions / data animations) at AUTHORING
// time and commit them under render/public/img/gifs/. CI only renders the
// committed .gif files — the API key is never needed in CI.
//
// Key resolution (first found wins):
//   env GIPHY_API_KEY   or  tools/gifs/.giphy_key   → Giphy
//   env TENOR_API_KEY   or  tools/gifs/.tenor_key   → Tenor
// (both gitignored). Pass --provider to force one.
//
// Usage:
//   node tools/gifs/fetch.mjs --query "this is fine fire" --id this-is-fine
//   node tools/gifs/fetch.mjs --episode episodes/examples/EP019-*.json
//     (fetches every scene with {"type":"gif","query":"…","src":"img/gifs/x.gif"})
//
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT_DIR = "render/public/img/gifs";

function readKeyFile(p) { try { return readFileSync(resolve(repoRoot, p), "utf8").trim(); } catch { return ""; } }

function resolveProvider(forced) {
  const giphy = process.env.GIPHY_API_KEY || readKeyFile("tools/gifs/.giphy_key");
  const tenor = process.env.TENOR_API_KEY || readKeyFile("tools/gifs/.tenor_key");
  if (forced === "giphy") return giphy ? { provider: "giphy", key: giphy } : null;
  if (forced === "tenor") return tenor ? { provider: "tenor", key: tenor } : null;
  if (giphy) return { provider: "giphy", key: giphy };
  if (tenor) return { provider: "tenor", key: tenor };
  return null;
}

function parseArgs(argv) {
  const a = { rating: "pg", limit: 12 };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--query") a.query = argv[++i];
    else if (k === "--id") a.id = argv[++i];
    else if (k === "--episode") a.episode = argv[++i];
    else if (k === "--provider") a.provider = argv[++i];
    else if (k === "--rating") a.rating = argv[++i];
    else if (k === "--index") a.index = argv[++i];
    else throw new Error(`Unknown arg: ${k}`);
  }
  return a;
}

async function searchGiphy(key, query, rating, limit) {
  const u = `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${encodeURIComponent(query)}&limit=${limit}&rating=${rating}&bundle=messaging_non_clips`;
  const r = await fetch(u);
  if (!r.ok) throw new Error(`Giphy ${r.status}`);
  const j = await r.json();
  const g = (j.data || [])[0];
  if (!g) return null;
  const img = g.images.downsized_medium || g.images.original;
  return { url: img.url, source: g.url, title: g.title || query, credit: "via GIPHY" };
}

async function searchTenor(key, query, rating, limit) {
  const cf = rating === "g" ? "high" : "medium";
  const u = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${key}&limit=${limit}&media_filter=gif&contentfilter=${cf}`;
  const r = await fetch(u);
  if (!r.ok) throw new Error(`Tenor ${r.status}`);
  const j = await r.json();
  const g = (j.results || [])[0];
  if (!g) return null;
  const gif = g.media_formats?.gif || g.media_formats?.mediumgif;
  return { url: gif?.url, source: g.itemurl, title: g.content_description || query, credit: "via Tenor" };
}

async function download(url, outRel) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const abs = resolve(repoRoot, outRel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, buf);
  return buf.length;
}

async function fetchOne({ provider, key }, { query, id, src, rating, limit }) {
  const outRel = src ? `render/public/${src}` : `${OUT_DIR}/${id}.gif`;
  const hit = provider === "giphy"
    ? await searchGiphy(key, query, rating, limit)
    : await searchTenor(key, query, rating, limit);
  if (!hit || !hit.url) return { id: id || basename(outRel, ".gif"), query, ok: false };
  const bytes = await download(hit.url, outRel);
  return { id: id || basename(outRel, ".gif"), query, ok: true, bytes, src: outRel.replace("render/public/", ""), credit: hit.credit, source: hit.source, title: hit.title };
}

async function main() {
  const args = parseArgs(process.argv);
  const prov = resolveProvider(args.provider);
  if (!prov) {
    console.error("✗ No API key. Set GIPHY_API_KEY or TENOR_API_KEY (env), or put the key in tools/gifs/.giphy_key or tools/gifs/.tenor_key (both gitignored).");
    process.exit(2);
  }
  console.log(`→ provider: ${prov.provider}`);

  let jobs = [];
  if (args.episode) {
    const ep = JSON.parse(readFileSync(resolve(repoRoot, args.episode), "utf8"));
    jobs = (ep.scenes || []).filter((s) => s.type === "gif" && s.query).map((s) => ({ query: s.query, src: s.src, id: basename(s.src, ".gif") }));
    if (!jobs.length) { console.log("No gif scenes with a `query` field found."); return; }
  } else if (args.query) {
    jobs = [{ query: args.query, id: args.id || args.query.replace(/\s+/g, "-").toLowerCase().slice(0, 40) }];
  } else {
    throw new Error("Provide --query (+--id) or --episode");
  }

  const results = [];
  for (const j of jobs) {
    try {
      const res = await fetchOne(prov, { ...j, rating: args.rating, limit: args.limit });
      results.push(res);
      console.log(res.ok ? `✓ ${res.id}: ${Math.round(res.bytes / 1024)}KB  (${res.credit})  ← "${res.query}"  ${res.source}` : `✗ ${res.id}: no result for "${res.query}"`);
    } catch (e) { console.error(`✗ ${j.id}: ${e.message}`); }
  }
  // Attribution log for the video description.
  const idxRel = args.index || `${OUT_DIR}/credits.json`;
  const abs = resolve(repoRoot, idxRel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, JSON.stringify(results.filter((r) => r.ok), null, 2));
  console.log(`\n→ ${results.filter((r) => r.ok).length}/${jobs.length} gif(s) · credits → ${idxRel}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
