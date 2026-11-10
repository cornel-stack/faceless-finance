#!/usr/bin/env node
// Fetch classic MEME TEMPLATES for free — NO API key, NO account — from Imgflip's
// public get_memes endpoint, and commit them under render/public/img/memes/.
// We add our own Impact-style captions in the renderer (image scene memeTop/
// memeBottom), so these are real memes, free, and fully in our control.
// CI only renders the committed files.
//
// Usage:
//   node tools/memes/fetch.mjs --name "This Is Fine" --id this-is-fine
//   node tools/memes/fetch.mjs --list                      # print available templates
//   node tools/memes/fetch.mjs --episode episodes/examples/EP019-*.json
//     (fetches every scene {"type":"image","meme":"<template name>","src":"img/memes/x.jpg"})
//
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT_DIR = "render/public/img/memes";

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--name") a.name = argv[++i];
    else if (k === "--id") a.id = argv[++i];
    else if (k === "--episode") a.episode = argv[++i];
    else if (k === "--list") a.list = true;
    else throw new Error(`Unknown arg: ${k}`);
  }
  return a;
}

async function templates() {
  const r = await fetch("https://api.imgflip.com/get_memes");
  if (!r.ok) throw new Error(`imgflip ${r.status}`);
  const j = await r.json();
  if (!j.success) throw new Error("imgflip get_memes failed");
  return j.data.memes;
}

function findTemplate(memes, name) {
  const n = name.toLowerCase();
  return memes.find((m) => m.name.toLowerCase() === n)
    || memes.find((m) => m.name.toLowerCase().includes(n))
    || memes.find((m) => n.includes(m.name.toLowerCase()));
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

async function main() {
  const args = parseArgs(process.argv);
  const memes = await templates();

  if (args.list) {
    memes.forEach((m) => console.log(`${m.name}  (box=${m.box_count})`));
    return;
  }

  let jobs = [];
  if (args.episode) {
    const ep = JSON.parse(readFileSync(resolve(repoRoot, args.episode), "utf8"));
    jobs = (ep.scenes || []).filter((s) => s.type === "image" && s.meme && s.src).map((s) => ({ name: s.meme, src: s.src, id: basename(s.src, extname(s.src)) }));
    if (!jobs.length) { console.log("No image scenes with a `meme` field found."); return; }
  } else if (args.name) {
    jobs = [{ name: args.name, id: args.id || args.name.replace(/\s+/g, "-").toLowerCase() }];
  } else {
    throw new Error("Provide --name (+--id), --episode, or --list");
  }

  const credits = [];
  for (const j of jobs) {
    const t = findTemplate(memes, j.name);
    if (!t) { console.error(`✗ ${j.id}: no template matching "${j.name}"`); continue; }
    const ext = extname(t.url) || ".jpg";
    const outRel = j.src ? `render/public/${j.src}` : `${OUT_DIR}/${j.id}${ext}`;
    try {
      const bytes = await download(t.url, outRel);
      credits.push({ id: j.id, template: t.name, src: outRel.replace("render/public/", ""), source: t.url, credit: "meme template via Imgflip" });
      console.log(`✓ ${j.id}: "${t.name}" ${Math.round(bytes / 1024)}KB → ${outRel.replace("render/public/", "")}`);
    } catch (e) { console.error(`✗ ${j.id}: ${e.message}`); }
  }
  const idxAbs = resolve(repoRoot, `${OUT_DIR}/credits.json`);
  mkdirSync(dirname(idxAbs), { recursive: true });
  writeFileSync(idxAbs, JSON.stringify(credits, null, 2));
  console.log(`\n→ ${credits.length}/${jobs.length} meme(s) · credits → ${OUT_DIR}/credits.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
