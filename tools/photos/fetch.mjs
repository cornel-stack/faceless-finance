// Fetch REAL PORTRAIT PHOTOS of public figures — for free, NO API key — from
// Wikipedia / Wikimedia Commons. Living-person lead images on Wikipedia are
// free-licensed by policy, so these are safe to commit and render.
//
// Usage:
//   node tools/photos/fetch.mjs "Elizabeth Holmes=holmes" "Steve Jobs=jobs"
//   node tools/photos/fetch.mjs --episode episodes/examples/EP031-theranos.json
//       (reads ep.media.people = [{ "query": "Elizabeth Holmes", "slug": "holmes" }])
//   node tools/photos/fetch.mjs "Theranos=theranoshq" --width 1000
//
// Each job downloads a ~800px image to render/public/img/<slug>.jpg and records
// its Commons source + license to render/public/img/credits.photos.json so the
// attribution can be added to the video description.
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const IMG_DIR = "render/public/img";
const UA = "NapkinNumbers/1.0 (educational finance explainer; contact via GitHub)";

function parseArgs(argv) {
  const a = { jobs: [], width: 800 };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--episode") a.episode = argv[++i];
    else if (k === "--width") a.width = parseInt(argv[++i], 10);
    else if (k.includes("=")) {
      const idx = k.indexOf("=");
      a.jobs.push({ query: k.slice(0, idx), slug: k.slice(idx + 1) });
    }
  }
  return a;
}

// Ask the MediaWiki API for the page's lead image at a given width + its file title.
async function pageImage(query, width) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1`
    + `&titles=${encodeURIComponent(query)}&prop=pageimages&piprop=original|thumbnail|name&pithumbsize=${width}`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`wiki ${r.status}`);
  const j = await r.json();
  const pages = j?.query?.pages || {};
  const page = Object.values(pages)[0];
  if (!page || (!page.thumbnail && !page.original)) throw new Error("no lead image on page");
  return {
    src: (page.thumbnail?.source) || page.original?.source,
    file: page.pageimage ? `File:${page.pageimage}` : null,
    title: page.title,
  };
}

// Fetch the license + attribution metadata for a Commons file.
async function license(fileTitle) {
  if (!fileTitle) return {};
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json`
      + `&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=extmetadata|url`;
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    const j = await r.json();
    const page = Object.values(j?.query?.pages || {})[0];
    const ii = page?.imageinfo?.[0];
    const em = ii?.extmetadata || {};
    const clean = (s) => (s ? String(s).replace(/<[^>]+>/g, "").trim() : undefined);
    return {
      licenseName: clean(em.LicenseShortName?.value),
      artist: clean(em.Artist?.value),
      descUrl: ii?.descriptionurl,
    };
  } catch { return {}; }
}

async function download(url, outRel) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`download ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const abs = resolve(repoRoot, outRel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, buf);
  return buf.length;
}

async function main() {
  const args = parseArgs(process.argv);
  let jobs = args.jobs;
  if (args.episode) {
    const ep = JSON.parse(readFileSync(resolve(repoRoot, args.episode), "utf8"));
    const people = ep?.media?.people || [];
    jobs = jobs.concat(people.map((p) => ({ query: p.query, slug: p.slug })));
  }
  if (!jobs.length) throw new Error('Provide "Query=slug" pairs or --episode with ep.media.people');

  const credits = [];
  for (const j of jobs) {
    try {
      const img = await pageImage(j.query, args.width);
      const outRel = `${IMG_DIR}/${j.slug}.jpg`;
      const bytes = await download(img.src, outRel);
      const lic = await license(img.file);
      credits.push({
        slug: j.slug, query: j.query, page: img.title,
        src: outRel.replace("render/public/", ""), source: img.src,
        license: lic.licenseName, artist: lic.artist, descUrl: lic.descUrl,
      });
      const warn = lic.licenseName && /non-free|fair use|copyright/i.test(lic.licenseName) ? "  ⚠ CHECK LICENSE" : "";
      console.log(`✓ ${j.slug}: "${img.title}" ${Math.round(bytes / 1024)}KB [${lic.licenseName || "license?"}]${warn} → img/${j.slug}.jpg`);
    } catch (e) {
      console.error(`✗ ${j.slug} ("${j.query}"): ${e.message}`);
    }
  }
  const idxAbs = resolve(repoRoot, `${IMG_DIR}/credits.photos.json`);
  let existing = [];
  try { existing = JSON.parse(readFileSync(idxAbs, "utf8")); } catch {}
  const bySlug = new Map(existing.map((c) => [c.slug, c]));
  for (const c of credits) bySlug.set(c.slug, c);
  writeFileSync(idxAbs, JSON.stringify([...bySlug.values()], null, 2));
  console.log(`\n→ ${credits.length}/${jobs.length} photo(s) · credits → ${IMG_DIR}/credits.photos.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
