/**
 * Post-build script: generates route-specific HTML files with unique meta tags.
 * Crawlers that don't execute JavaScript (Ahrefs, Bing, etc.) will see
 * the correct title, description, canonical, H1, and nav links for each page.
 *
 * It also writes the two pages that are not in the sitemap: the shell that
 * /booking/* is rewritten to (see vercel.json) and 404.html, which Vercel serves
 * with a 404 status for unknown paths. Both load the app, so visitors get the
 * normal header, footer and page, and both are noindex.
 *
 * Run after `vite build`: node scripts/prerender-meta.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const SITE = 'https://www.metaxasretreats.gr';

const en = JSON.parse(readFileSync(join(rootDir, 'src', 'locales', 'en.json'), 'utf-8'));
const imageManifest = JSON.parse(readFileSync(join(rootDir, 'src', 'data', 'imageManifest.json'), 'utf-8'));

// Must match MAIN_IMAGE_SIZES in src/components/Accommodations/AccommodationGallery.tsx,
// otherwise the browser ignores the preload and downloads a second copy.
const GALLERY_SIZES = '(min-width: 1280px) 748px, (min-width: 1024px) calc(100vw - 532px), calc(100vw - 40px)';

// Route definitions with unique SEO per page
const routes = [
  {
    path: '/',
    title: 'Glamping & Beach Accommodation in Lefkada | Metaxas Retreats',
    description: 'Glamping tents & wooden house 50m from Mikros Gialos beach, Lefkada. Sea views, olive groves, private setting. Book direct & save.',
    h1: 'Glamping & Beach Accommodation in Lefkada, Greece',
    content: 'Luxury glamping tents and a charming wooden house nestled among olive trees, just 50 meters from the crystal-clear waters of Mikros Gialos beach. Experience authentic Greek island living with modern comforts including sea views, air conditioning, fully equipped kitchens, and free WiFi. Our family-run retreat offers the perfect escape on Lefkada island.',
    home: true,
  },
  {
    path: '/accommodation/wooden-house',
    title: 'Wooden House with Sea View in Lefkada | Metaxas Retreats',
    description: 'Charming wooden house above Mikros Gialos bay, Lefkada. Sleeps 4, sea views, private terrace, 50m from beach. Book direct.',
    h1: 'Wooden House — Sea View Accommodation in Lefkada',
    content: 'A charming wooden house perched above Mikros Gialos bay with panoramic sea views. Sleeps up to 4 guests with a private terrace, fully equipped kitchen, air conditioning, and direct beach access just 50 meters away. The ideal choice for couples or small families seeking comfort and tranquility on Lefkada island.',
    // First photo of the gallery (src/data/accommodations.ts), the largest thing on the page.
    heroImage: '/assets/e9f9bd84-9f74-4189-bf30-d6640a566fd3.jpg',
  },
  {
    path: '/accommodation/glamping-tent',
    title: 'Glamping Tent Lefkada — Luxury Camping | Metaxas Retreats',
    description: 'Luxury glamping tent among olive trees, Lefkada. Sleeps 5, sea views, full kitchen, A/C, 50m from Mikros Gialos beach.',
    h1: 'Glamping Tent — Luxury Camping in Lefkada',
    content: 'Spacious luxury glamping tent set among ancient olive trees with stunning views of Mikros Gialos bay. Sleeps up to 5 guests with one double bed and three single beds, fully equipped kitchen, air conditioning, private bathroom, and outdoor dining area. Just 50 meters from the beach.',
    heroImage: '/assets/glamping-tent/prosopsi.jpg',
  },
  {
    path: '/explore',
    title: 'Explore Lefkada — Beaches & Activities | Metaxas Retreats',
    description: 'Discover Lefkada: Porto Katsiki, Kathisma beach, Nidri waterfalls, boat trips & local tavernas. Your guide to the island.',
    h1: 'Explore Lefkada Island',
    content: 'Discover the best of Lefkada island. Visit world-famous Porto Katsiki beach, swim at Kathisma, explore the Nidri waterfalls, and enjoy boat trips around the Ionian Sea. From charming villages to stunning beaches, Lefkada offers endless adventures just minutes from Metaxas Retreats.',
  },
  {
    path: '/contact',
    title: 'Contact Metaxas Retreats — Book Direct in Lefkada',
    description: 'Get in touch with Metaxas Retreats. Book your glamping tent or wooden house in Lefkada directly. Email, phone & contact form.',
    h1: 'Contact Us',
    content: 'Book directly with Metaxas Retreats for the best rates and personal service. Reach us by email at metaxasretreats@gmail.com or by phone. We are happy to help you plan your perfect Lefkada getaway.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Metaxas Retreats',
    description: 'Privacy policy for Metaxas Retreats website. How we handle your personal data and booking information.',
    h1: 'Privacy Policy',
    content: '',
    robots: 'noindex, follow',
  },
  {
    path: '/terms',
    title: 'Terms of Service | Metaxas Retreats',
    description: 'Terms and conditions for booking at Metaxas Retreats, Lefkada, Greece.',
    h1: 'Terms of Service',
    content: '',
    robots: 'noindex, follow',
  },
];

// Served for URLs that are not pages of their own; the app renders the rest.
const utilityPages = [
  {
    file: 'booking/index.html',
    title: 'Booking Request | Metaxas Retreats',
    description: 'Send a booking request for Metaxas Retreats in Mikros Gialos, Lefkada.',
    h1: 'Booking Request',
  },
  {
    file: '404.html',
    title: 'Page Not Found | Metaxas Retreats',
    description: "The page you're looking for doesn't exist.",
    h1: 'Page Not Found',
  },
];

// Rendered into the served HTML outside #root, so it survives without JS.
// The React footer carries the same two links for the styled version once the
// app has mounted, but that is client-side only and Googlebot reads the served
// HTML first. Background matches the app footer above so the two read as one
// band.
const CREDIT_FOOTER =
  '<footer style="text-align:center;padding:0 16px 22px;font-size:.75rem;' +
  'font-family:system-ui,sans-serif;background:#122418;color:rgba(253,252,247,.3)">' +
  'Sister property: <a href="https://www.thebluehourvillas.com/" rel="noopener" ' +
  'style="color:inherit">The Blue Hour Villas, Lefkada</a>' +
  '<span style="padding:0 8px">·</span>' +
  'Powered by <a href="https://www.amox.gr" rel="noopener" ' +
  'style="color:inherit">Amox</a></footer>';

// Navigation links for crawlers (all indexable pages)
const navLinks = routes
  .filter(r => !r.robots)
  .map(r => {
    const href = r.path === '/' ? '/' : r.path;
    const label = r.path === '/' ? 'Home'
      : r.path === '/accommodation/wooden-house' ? 'Wooden House'
      : r.path === '/accommodation/glamping-tent' ? 'Glamping Tent'
      : r.path === '/explore' ? 'Explore Lefkada'
      : r.path === '/contact' ? 'Contact'
      : r.h1;
    return `<a href="${href}">${label}</a>`;
  })
  .join(' | ');

// Tags that SEOHead (react-helmet-async) renders as well. Marking the static
// copies with data-rh lets Helmet replace them when the app mounts, instead of
// leaving a second canonical, description, robots… next to its own. Crawlers
// that don't run JavaScript still read these.
const HELMET_MANAGED = [
  /<meta name="(?:title|description|keywords|robots)"/g,
  /<meta property="og:(?:type|url|title|description|image|site_name|locale)"/g,
  /<meta name="twitter:(?:card|url|title|description|image)"/g,
  /<link rel="canonical"/g,
];

const markHelmetManaged = (html) =>
  HELMET_MANAGED.reduce(
    (out, pattern) => out.replace(pattern, (tag) => tag.replace(/^<(meta|link)/, '<$1 data-rh="true"')),
    html,
  );

/** JSON for inside a <script> tag: no way to close the tag early. */
const scriptJson = (value) => JSON.stringify(value, null, 2).replace(/</g, '\\u003c');

/** FAQPage schema from the questions the home page shows (faq.q1/faq.a1, …). */
function faqSchema() {
  const mainEntity = [];
  for (let i = 1; en[`faq.q${i}`] && en[`faq.a${i}`]; i++) {
    mainEntity.push({
      '@type': 'Question',
      name: en[`faq.q${i}`],
      acceptedAnswer: { '@type': 'Answer', text: en[`faq.a${i}`] },
    });
  }
  return `<script type="application/ld+json">\n${scriptJson({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  })}\n</script>`;
}

/** Preload for a gallery photo, matching the srcset the page renders (src/lib/images.ts). */
function galleryPreload(src) {
  const entry = imageManifest[src];
  if (!entry) return '';
  const srcset = entry.widths.map((w) => `${entry.base}-${w}w.webp ${w}w`).join(', ');
  return `<link rel="preload" as="image" imagesrcset="${srcset}" imagesizes="${GALLERY_SIZES}" fetchpriority="high" />`;
}

/** Preload for the hero video's poster, which Vite emits with a hashed name. */
function heroPosterPreload() {
  const poster = readdirSync(join(distDir, '_app')).find((f) => /^hero-poster-.+\.webp$/.test(f));
  if (!poster) throw new Error('hero-poster-*.webp not found in dist/_app');
  return `<link rel="preload" as="image" href="/_app/${poster}" type="image/webp" />`;
}

function renderPage({ title, description, canonicalUrl, robots, h1, content, head = [] }) {
  let html = baseHtml;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${title}</title>`
  );

  // Replace meta name="title"
  html = html.replace(
    /<meta name="title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="title" content="${title}" />`
  );

  // Replace meta name="description"
  html = html.replace(
    /<meta name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description"\n    content="${description}" />`
  );

  // Replace canonical URL, or drop it for pages that have none
  html = canonicalUrl
    ? html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    : html.replace(/\s*<link rel="canonical" href="[^"]*"\s*\/?>/, '');

  // Remove all hreflang tags (single-URL multilingual site doesn't need them)
  html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*"\s*\/?>\s*/g, '\n');

  // Replace OG URL
  if (canonicalUrl) {
    html = html.replace(
      /<meta property="og:url" content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );
  }

  // Replace OG title
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`
  );

  // Replace OG description
  html = html.replace(
    /<meta property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description"\n    content="${description}" />`
  );

  // Replace Twitter URL
  if (canonicalUrl) {
    html = html.replace(
      /<meta name="twitter:url" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:url" content="${canonicalUrl}" />`
    );
  }

  // Replace Twitter title
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${title}" />`
  );

  // Replace Twitter description
  html = html.replace(
    /<meta name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description"\n    content="${description}" />`
  );

  // Replace robots if specified (for privacy/terms and the utility pages)
  if (robots) {
    html = html.replace(
      /<meta name="robots" content="[^"]*"\s*\/?>/,
      `<meta name="robots" content="${robots}" />`
    );
  }

  // Page-specific additions (preloads, schema): early in <head> so the
  // browser finds them before the app's script and stylesheet.
  if (head.length) {
    html = html.replace(
      /(<meta name="viewport"[^>]*>)/,
      `$1\n  ${head.join('\n  ')}`
    );
  }

  // Build the crawler-visible content block with H1, description, and nav
  const contentBlock = [
    `<h1>${h1}</h1>`,
    content ? `<p>${content}</p>` : '',
    `<nav>${navLinks}</nav>`,
  ].filter(Boolean).join('');

  // Inject content inside <div id="root"> — visually hidden but accessible to crawlers
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${contentBlock}</div></div>`
  );

  // Sister-property link, outside #root so React never replaces it.
  // The React footer renders the same link once the app mounts, but that is
  // client-side only — Googlebot reads the served HTML on its first pass and
  // executes JavaScript on a later, less reliable one. This is deliberately
  // visible rather than hidden: a link only crawlers can see is the wrong
  // pattern, and this one is true and useful to a reader.
  html = html.replace(
    '</body>',
    `  ${CREDIT_FOOTER}\n</body>`
  );

  return markHelmetManaged(html);
}

function write(file, html) {
  const outFile = join(distDir, file);
  if (!existsSync(dirname(outFile))) {
    mkdirSync(dirname(outFile), { recursive: true });
  }
  writeFileSync(outFile, html, 'utf-8');
}

// Read the base index.html built by Vite
const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

for (const route of routes) {
  const head = [];
  if (route.home) head.push(heroPosterPreload(), faqSchema());
  if (route.heroImage) head.push(galleryPreload(route.heroImage));

  const html = renderPage({
    ...route,
    canonicalUrl: route.path === '/' ? `${SITE}/` : `${SITE}${route.path}`,
    head: head.filter(Boolean),
  });

  // For the root this overwrites the index.html Vite built
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`;
  write(file, html);
  console.log(`  ✓ ${route.path} → dist/${file}`);
}

for (const page of utilityPages) {
  const html = renderPage({ ...page, canonicalUrl: null, robots: 'noindex, nofollow' })
    // The business schema describes the site's real pages, not these.
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  write(page.file, html);
  console.log(`  ✓ ${page.title.split(' |')[0]} → dist/${page.file}`);
}

console.log(`\n✅ Pre-rendered meta tags for ${routes.length} routes and ${utilityPages.length} utility pages`);
