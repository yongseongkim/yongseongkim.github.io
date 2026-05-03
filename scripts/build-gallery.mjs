#!/usr/bin/env node
// Generates thumbnails + full-size WebP for wedding gallery + writes manifest.
//
// Usage:
//   node scripts/build-gallery.mjs <source-dir>
//   yarn gallery <source-dir>
//
// If <source-dir> is omitted, falls back to GALLERY_SOURCE env var or
// static/img/wedding/originals (which is gitignored).
//
// Outputs:
//   static/img/wedding/thumbs/NNN.webp   (800px wide, ~80 quality — grid tiles)
//   static/img/wedding/full/NNN.webp     (1600px wide, ~82 quality — lightbox)
//   src/components/wedding/gallery.json  (manifest read by Gallery.tsx)

import {readdir, mkdir, stat, writeFile, unlink} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_SOURCE = path.join(ROOT, 'static/img/wedding/originals');
const SOURCE = process.argv[2] || process.env.GALLERY_SOURCE || DEFAULT_SOURCE;

const THUMBS_DIR = path.join(ROOT, 'static/img/wedding/thumbs');
const FULL_DIR = path.join(ROOT, 'static/img/wedding/full');
const MANIFEST_PATH = path.join(ROOT, 'src/components/wedding/gallery.json');

const THUMB_WIDTH = 500;
const THUMB_QUALITY = 75;
const FULL_WIDTH = 1600;
const FULL_QUALITY = 82;
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function pad(n, width = 3) {
  return String(n).padStart(width, '0');
}

async function processOne(src, outName) {
  const thumbPath = path.join(THUMBS_DIR, `${outName}.webp`);
  const fullPath = path.join(FULL_DIR, `${outName}.webp`);

  // Slot-based naming (001, 002, …) means the same slot can map to a different
  // source file across runs (e.g., when the source list is curated). Always
  // regenerate so the output is guaranteed to match the current source list.
  await Promise.all([
    sharp(src)
      .rotate()
      .resize({width: THUMB_WIDTH, withoutEnlargement: true})
      .webp({quality: THUMB_QUALITY})
      .toFile(thumbPath),
    sharp(src)
      .rotate()
      .resize({width: FULL_WIDTH, withoutEnlargement: true})
      .webp({quality: FULL_QUALITY})
      .toFile(fullPath),
  ]);
}

async function main() {
  if (!existsSync(SOURCE)) {
    console.error(`Source folder not found: ${SOURCE}`);
    console.error('Pass the path as an argument or set GALLERY_SOURCE env var.');
    process.exit(1);
  }

  await mkdir(THUMBS_DIR, {recursive: true});
  await mkdir(FULL_DIR, {recursive: true});

  const entries = (await readdir(SOURCE))
    .filter((name) => SUPPORTED.has(path.extname(name).toLowerCase()))
    .sort((a, b) =>
      a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}),
    );

  if (entries.length === 0) {
    console.log(`No supported images in ${SOURCE}. Manifest cleared.`);
    await writeFile(MANIFEST_PATH, '[]\n');
    return;
  }

  console.log(`Source: ${SOURCE}`);
  console.log(`Found ${entries.length} image(s). Generating thumb + full…`);

  const manifest = [];
  let i = 0;
  for (const name of entries) {
    i++;
    const outName = pad(i);
    const src = path.join(SOURCE, name);
    await processOne(src, outName);
    manifest.push({
      thumb: `/img/wedding/thumbs/${outName}.webp`,
      full: `/img/wedding/full/${outName}.webp`,
    });
    if (i % 10 === 0 || i === entries.length) {
      process.stdout.write(`  ${i}/${entries.length}\r`);
    }
  }
  process.stdout.write('\n');

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  // Clean up orphaned outputs (files left over from previous runs that are no
  // longer in the manifest — e.g., when source list shrinks).
  const wanted = new Set();
  for (let n = 1; n <= entries.length; n++) wanted.add(`${pad(n)}.webp`);

  let removed = 0;
  for (const dir of [THUMBS_DIR, FULL_DIR]) {
    const existing = await readdir(dir);
    for (const f of existing) {
      if (f.endsWith('.webp') && !wanted.has(f)) {
        await unlink(path.join(dir, f));
        removed++;
      }
    }
  }

  console.log(
    `Done. ${manifest.length} photos in manifest (removed ${removed} orphaned).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
