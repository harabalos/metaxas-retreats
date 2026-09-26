/**
 * Post-build step: prerenders every public page to real HTML.
 *
 * `vite build` produces the client bundle and dist/index.html, used here as the
 * template; `vite build --ssr src/entry-server.tsx` produces
 * dist-ssr/entry-server.js, which renders the app for a URL. For each route this
 * writes dist/<route>/index.html with the rendered page inside #root and that
 * page's own title, description, canonical and schema from Helmet. Crawlers and
 * AI bots that don't run JavaScript get the whole page, and the browser
 * hydrates the markup instead of building the page from scratch.
 *
 * It also writes the two pages that are not in the sitemap: the shell that
 * /booking/* is rewritten to (see vercel.json), which has no markup because the
 * page depends on query parameters, and 404.html, which Vercel serves with a 404
 * status for unknown paths. Both are noindex.
 *
 * Run after both builds: node scripts/prerender-meta.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

const { render } = await import(pathToFileURL(join(rootDir, 'dist-ssr', 'entry-server.js')).href);

const imageManifest = JSON.parse(readFileSync(join(rootDir, 'src', 'data', 'imageManifest.json'), 'utf-8'));

// Must match MAIN_IMAGE_SIZES in src/components/Accommodations/AccommodationGallery.tsx,
// otherwise the browser ignores the preload and downloads a second copy.
const GALLERY_SIZES = '(min-width: 1280px) 748px, (min-width: 1024px) calc(100vw - 532px), calc(100vw - 40px)';

// Public pages. Titles, descriptions and canonicals come from each page's SEOHead.
const routes = [
  { path: '/', home: true },
  // heroImage: first photo of the gallery (src/data/accommodations.ts), the largest thing on the page.
  { path: '/accommodation/wooden-house', heroImage: '/assets/e9f9bd84-9f74-4189-bf30-d6640a566fd3.jpg' },
  { path: '/accommodation/glamping-tent', heroImage: '/assets/glamping-tent/prosopsi.jpg' },
  { path: '/explore' },
  { path: '/contact' },
  { path: '/privacy' },
  { path: '/terms' },
];

// The template's default head tags that SEOHead also renders. They are removed
// so each page carries only its own (Helmet marks them data-rh, and replaces
// them on the client when the visitor navigates). og:image:width/height go
// too: the image differs per page.
const HELMET_TAGS = [
  /\s*<title>[^<]*<\/title>/,
  /\s*<meta name="(?:title|description|keywords|robots)"[^>]*>/g,
  /\s*<meta property="og:[a-z_:]+"[^>]*>/g,
  /\s*<meta name="twitter:[a-z]+"[^>]*>/g,
  /\s*<link rel="canonical"[^>]*>/g,
];

/** Preload for a gallery photo, matching the srcset the page renders (src/lib/images.ts). */
function galleryPreload(src) {
  const entry = imageManifest[src];
  if (!entry) return '';
  const srcset = entry.widths.map((w) => `${entry.base}-${w}w.webp ${w}w`).join(', ');
  return `<link rel="preload" as="image" imagesrcset="${srcset}" imagesizes="${GALLERY_SIZES}" fetchpriority="high" />`;
}

const appFiles = readdirSync(join(distDir, '_app'));

/** Preload for the hero video's poster, which Vite emits with a hashed name. */
function heroPosterPreload() {
  const poster = appFiles.find((f) => /^hero-poster-.+\.webp$/.test(f));
  if (!poster) throw new Error('hero-poster-*.webp not found in dist/_app');
  return `<link rel="preload" as="image" href="/_app/${poster}" type="image/webp" />`;
}

/**
 * Preloads for the Latin subsets of the two self-hosted fonts (src/main.tsx),
 * so text doesn't wait for the stylesheet before the fonts start downloading.
 */
const FONT_PRELOADS = ['commissioner-latin-wght-normal', 'eb-garamond-latin-wght-normal'].map((name) => {
  const file = appFiles.find((f) => f.startsWith(`${name}-`) && f.endsWith('.woff2'));
  if (!file) throw new Error(`${name}-*.woff2 not found in dist/_app`);
  return `<link rel="preload" as="font" type="font/woff2" href="/_app/${file}" crossorigin />`;
});

// Read the base index.html built by Vite
const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

/** The template with this page's markup, head tags and language filled in. */
function page({ appHtml = '', headTags = [], lang = 'en' }) {
  let html = HELMET_TAGS.reduce((out, pattern) => out.replace(pattern, ''), template);
  html = html.replace(
    /(<meta name="viewport"[^>]*>)/,
    `$1\n  ${[...FONT_PRELOADS, ...headTags].filter(Boolean).join('\n  ')}`
  );
  html = html.replace('<html lang="en">', `<html lang="${lang}">`);
  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

const helmetTags = (helmet) =>
  [helmet.title, helmet.meta, helmet.link, helmet.script].map(String).filter(Boolean);

function write(file, html) {
  const outFile = join(distDir, file);
  if (!existsSync(dirname(outFile))) {
    mkdirSync(dirname(outFile), { recursive: true });
  }
  writeFileSync(outFile, html, 'utf-8');
}

for (const route of routes) {
  const { html: appHtml, helmet } = await render(route.path);
  const headTags = [];
  if (route.home) headTags.push(heroPosterPreload());
  if (route.heroImage) headTags.push(galleryPreload(route.heroImage));

  // For the root this overwrites the index.html Vite built
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`;
  write(file, page({ appHtml, headTags: [...headTags, ...helmetTags(helmet)] }));
  console.log(`  ✓ ${route.path} → dist/${file}`);
}

// Booking shell: rendered in the browser from the URL's dates and guests.
write('booking/index.html', page({
  headTags: [
    '<title data-rh="true">Booking Request | Metaxas Retreats</title>',
    '<meta data-rh="true" name="description" content="Send a booking request for Metaxas Retreats in Mikros Gialos, Lefkada." />',
    '<meta data-rh="true" name="robots" content="noindex, nofollow" />',
  ],
}));
console.log('  ✓ booking shell → dist/booking/index.html');

// Unknown paths: the app's own "page not found" page, noindex via its SEOHead.
const notFound = await render('/__not-found__');
write('404.html', page({ appHtml: notFound.html, headTags: helmetTags(notFound.helmet) }));
console.log('  ✓ not found → dist/404.html');

console.log(`\n✅ Prerendered ${routes.length} pages, the booking shell and the 404 page`);
