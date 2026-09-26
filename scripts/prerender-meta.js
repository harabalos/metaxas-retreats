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
 * Every page is written once per language (see src/lib/i18nRoutes.ts), and
 * dist/sitemap.xml lists them with their hreflang alternates.
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

const SITE = 'https://www.metaxasretreats.gr';

// Same as src/lib/i18nRoutes.ts: English at the root, the others under a prefix.
const LANGUAGES = ['en', 'el', 'it', 'de', 'ro'];
const localizePath = (language, path) =>
  language === 'en' ? path : path === '/' ? `/${language}` : `/${language}${path}`;

// Public pages. Titles, descriptions and canonicals come from each page's SEOHead.
// images: photos listed for the page in the sitemap. heroImage: first photo of
// the gallery (src/data/accommodations.ts), the largest thing on the page.
const routes = [
  { path: '/', home: true, images: ['/assets/glamping-tent/view.jpg', '/assets/glamping-tent/prosopsi.jpg'] },
  {
    path: '/accommodation/wooden-house',
    heroImage: '/assets/e9f9bd84-9f74-4189-bf30-d6640a566fd3.jpg',
    images: ['/assets/e9f9bd84-9f74-4189-bf30-d6640a566fd3.jpg', '/assets/f3dbfe79-a8c0-42d5-87d3-df85833746be.jpg', '/assets/avli.jpg'],
  },
  {
    path: '/accommodation/glamping-tent',
    heroImage: '/assets/glamping-tent/prosopsi.jpg',
    images: ['/assets/glamping-tent/prosopsi.jpg', '/assets/glamping-tent/krevati.jpg', '/assets/glamping-tent/view.jpg'],
  },
  { path: '/explore', images: ['/assets/porto katsiki.jpg', '/assets/kathisma.jpeg'] },
  { path: '/contact' },
  { path: '/privacy', noindex: true },
  { path: '/terms', noindex: true },
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
 * Preloads for the two self-hosted fonts (src/main.tsx) in the subset a page's
 * language needs, so text doesn't wait for the stylesheet before the fonts
 * start downloading.
 */
function fontPreloads(language) {
  const subset = language === 'el' ? 'greek' : 'latin';
  return ['commissioner', 'eb-garamond'].map((font) => {
    const name = `${font}-${subset}-wght-normal`;
    const file = appFiles.find((f) => f.startsWith(`${name}-`) && f.endsWith('.woff2'));
    if (!file) throw new Error(`${name}-*.woff2 not found in dist/_app`);
    return `<link rel="preload" as="font" type="font/woff2" href="/_app/${file}" crossorigin />`;
  });
}

// Read the base index.html built by Vite
const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

/** The template with this page's markup, head tags and language filled in. */
function page({ appHtml = '', headTags = [], lang = 'en' }) {
  let html = HELMET_TAGS.reduce((out, pattern) => out.replace(pattern, ''), template);
  html = html.replace(
    /(<meta name="viewport"[^>]*>)/,
    `$1\n  ${[...fontPreloads(lang), ...headTags].filter(Boolean).join('\n  ')}`
  );
  html = html.replace('<html lang="en">', `<html lang="${lang}">`);
  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

// Helmet writes React's prop name hrefLang; lowercase it for strict parsers.
const helmetTags = (helmet) =>
  [helmet.title, helmet.meta, helmet.link, helmet.script].map(String).filter(Boolean)
    .map((tags) => tags.replace(/ hrefLang=/g, ' hreflang='));

function write(file, html) {
  const outFile = join(distDir, file);
  if (!existsSync(dirname(outFile))) {
    mkdirSync(dirname(outFile), { recursive: true });
  }
  writeFileSync(outFile, html, 'utf-8');
}

for (const language of LANGUAGES) {
  for (const route of routes) {
    const url = localizePath(language, route.path);
    const { html: appHtml, helmet } = await render(url, language);
    const headTags = [];
    if (route.home) headTags.push(heroPosterPreload());
    if (route.heroImage) headTags.push(galleryPreload(route.heroImage));

    // For the English root this overwrites the index.html Vite built
    const file = url === '/' ? 'index.html' : `${url.slice(1)}/index.html`;
    write(file, page({ appHtml, headTags: [...headTags, ...helmetTags(helmet)], lang: language }));
  }
  console.log(`  ✓ ${language}: ${routes.map((r) => localizePath(language, r.path)).join(' ')}`);
}

// Sitemap: every indexable page in every language, each listing its
// alternates (hreflang) and photos.
const today = new Date().toISOString().slice(0, 10);
const absolute = (path) => `${SITE}${encodeURI(path)}`;
const entries = routes.filter((route) => !route.noindex).flatMap((route) =>
  LANGUAGES.map((language) => [
    '  <url>',
    `    <loc>${absolute(localizePath(language, route.path))}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    ...LANGUAGES.map((alt) =>
      `    <xhtml:link rel="alternate" hreflang="${alt}" href="${absolute(localizePath(alt, route.path))}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(route.path)}"/>`,
    ...(route.images ?? []).map((img) => `    <image:image><image:loc>${absolute(img)}</image:loc></image:image>`),
    '  </url>',
  ].join('\n')));
write('sitemap.xml', [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml"',
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ...entries,
  '</urlset>',
  '',
].join('\n'));
console.log(`  ✓ sitemap → dist/sitemap.xml (${entries.length} URLs)`);

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

console.log(`\n✅ Prerendered ${routes.length} pages in ${LANGUAGES.length} languages, the booking shell and the 404 page`);
