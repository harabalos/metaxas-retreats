/**
 * Generates web-sized WebP copies of every photo the site's code points at.
 *
 * The photos in public/assets are camera originals (up to 6000px, 1–2 MB each)
 * and pages used to download them as-is, even for 80px gallery thumbnails. The
 * originals stay where they are, because the sitemap, Open Graph tags and
 * schema.org point at them, but pages now load one of these copies instead.
 *
 * Output lands in public/assets/opt/ with a hash of the source file in the name,
 * so vercel.json can cache it forever and a replaced photo gets a new URL.
 * src/data/imageManifest.json records which widths exist; src/lib/images.ts
 * reads it to build srcset. A photo missing from the manifest still works, it
 * just falls back to the original file.
 *
 * Run after adding or replacing a photo: npm run images
 */

import sharp from 'sharp';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, rmdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const outDir = join(publicDir, 'assets', 'opt');
const manifestPath = join(root, 'src', 'data', 'imageManifest.json');

// 160 = gallery thumbnails and booking summary, 480/960 = cards at 1x/2x,
// 1600 = gallery and lightbox. Wider screens get the original (see images.ts).
const WIDTHS = [160, 480, 960, 1600];

const quality = (width) => (width <= 160 ? 60 : 70);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

function removeEmptyDirs(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) removeEmptyDirs(path);
  }
  if (readdirSync(dir).length === 0) rmdirSync(dir);
}

/** Every `/assets/….jpg|png` string literal in src/, e.g. '/assets/porto katsiki.jpg'. */
function referencedImages() {
  const refs = new Set();
  for (const file of walk(join(root, 'src'))) {
    if (!/\.(tsx?|jsx?)$/.test(file)) continue;
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/['"`](\/assets\/[^'"`]+?\.(?:jpe?g|png))['"`]/gi)) {
      if (!match[1].startsWith('/assets/opt/')) refs.add(match[1]);
    }
  }
  return [...refs].sort();
}

async function main() {
  const manifest = {};
  const expected = new Set();

  for (const ref of referencedImages()) {
    const sourcePath = join(publicDir, ref);
    if (!existsSync(sourcePath)) {
      console.warn(`  ! ${ref} is referenced in src/ but missing from public/, skipped`);
      continue;
    }

    const source = readFileSync(sourcePath);
    const hash = createHash('sha1').update(source).digest('hex').slice(0, 8);
    const meta = await sharp(source).metadata();
    // Phone photos can be stored sideways with an EXIF orientation flag.
    const rotated = (meta.orientation ?? 1) >= 5;
    const width = rotated ? meta.height : meta.width;
    const height = rotated ? meta.width : meta.height;

    const widths = WIDTHS.filter((w) => w < width);
    if (width < WIDTHS[WIDTHS.length - 1]) widths.push(width);

    // 'porto katsiki.jpg' -> 'porto-katsiki': no spaces, they would break srcset.
    const name = ref.slice('/assets/'.length).replace(/\.[^.]+$/, '').replace(/\s+/g, '-');
    const base = `/assets/opt/${name}.${hash}`;

    for (const w of widths) {
      const file = join(publicDir, `${base}-${w}w.webp`);
      expected.add(file);
      if (existsSync(file)) continue;
      mkdirSync(dirname(file), { recursive: true });
      await sharp(source)
        .rotate()
        .resize({ width: w })
        .webp({ quality: quality(w), effort: 5, smartSubsample: true })
        .toFile(file);
    }

    manifest[ref] = { w: width, h: height, base, widths };
    console.log(`  ✓ ${ref} (${width}×${height}) → ${widths.join(', ')}w`);
  }

  // Drop copies of photos that were replaced or are no longer used.
  if (existsSync(outDir)) {
    for (const file of walk(outDir)) {
      if (!expected.has(file)) {
        rmSync(file);
        console.log(`  – removed stale ${relative(publicDir, file)}`);
      }
    }
    removeEmptyDirs(outDir);
  }

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\n✅ ${Object.keys(manifest).length} photos → ${relative(root, manifestPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
