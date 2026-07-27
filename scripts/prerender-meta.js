/**
 * Post-build script: generates route-specific HTML files with unique meta tags.
 * Crawlers that don't execute JavaScript (Ahrefs, Bing, etc.) will see
 * the correct title, description, canonical, H1, and nav links for each page.
 *
 * Run after `vite build`: node scripts/prerender-meta.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const SITE = 'https://www.metaxasretreats.gr';

// Route definitions with unique SEO per page
const routes = [
  {
    path: '/',
    title: 'Glamping & Beach Accommodation in Lefkada | Metaxas Retreats',
    description: 'Glamping tents & wooden house 50m from Mikros Gialos beach, Lefkada. Sea views, olive groves, private setting. Book direct & save.',
    h1: 'Glamping & Beach Accommodation in Lefkada, Greece',
    content: 'Luxury glamping tents and a charming wooden house nestled among olive trees, just 50 meters from the crystal-clear waters of Mikros Gialos beach. Experience authentic Greek island living with modern comforts including sea views, air conditioning, fully equipped kitchens, and free WiFi. Our family-run retreat offers the perfect escape on Lefkada island.',
  },
  {
    path: '/accommodation/wooden-house',
    title: 'Wooden House with Sea View in Lefkada | Metaxas Retreats',
    description: 'Charming wooden house above Mikros Gialos bay, Lefkada. Sleeps 4, sea views, private terrace, 50m from beach. Book direct.',
    h1: 'Wooden House — Sea View Accommodation in Lefkada',
    content: 'A charming wooden house perched above Mikros Gialos bay with panoramic sea views. Sleeps up to 4 guests with a private terrace, fully equipped kitchen, air conditioning, and direct beach access just 50 meters away. The ideal choice for couples or small families seeking comfort and tranquility on Lefkada island.',
  },
  {
    path: '/accommodation/glamping-tent',
    title: 'Glamping Tent Lefkada — Luxury Camping | Metaxas Retreats',
    description: 'Luxury glamping tent among olive trees, Lefkada. Sleeps 5, sea views, full kitchen, A/C, 50m from Mikros Gialos beach.',
    h1: 'Glamping Tent — Luxury Camping in Lefkada',
    content: 'Spacious luxury glamping tent set among ancient olive trees with stunning views of Mikros Gialos bay. Sleeps up to 5 guests with a comfortable double bed, sofa bed, fully equipped kitchen, air conditioning, private bathroom, and outdoor dining area. Just 50 meters from the beach.',
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

// Read the base index.html built by Vite
const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

for (const route of routes) {
  let html = baseHtml;
  const url = `${SITE}${route.path === '/' ? '/' : route.path}`;
  const canonicalUrl = route.path === '/' ? `${SITE}/` : url;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${route.title}</title>`
  );

  // Replace meta name="title"
  html = html.replace(
    /<meta name="title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="title" content="${route.title}" />`
  );

  // Replace meta name="description"
  html = html.replace(
    /<meta name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description"\n    content="${route.description}" />`
  );

  // Replace canonical URL
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Remove all hreflang tags (single-URL multilingual site doesn't need them)
  html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*"\s*\/?>\s*/g, '\n');

  // Replace OG URL
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // Replace OG title
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${route.title}" />`
  );

  // Replace OG description
  html = html.replace(
    /<meta property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description"\n    content="${route.description}" />`
  );

  // Replace Twitter URL
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:url" content="${canonicalUrl}" />`
  );

  // Replace Twitter title
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${route.title}" />`
  );

  // Replace Twitter description
  html = html.replace(
    /<meta name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description"\n    content="${route.description}" />`
  );

  // Replace robots if specified (for privacy/terms)
  if (route.robots) {
    html = html.replace(
      /<meta name="robots" content="[^"]*"\s*\/?>/,
      `<meta name="robots" content="${route.robots}" />`
    );
  }

  // Build the crawler-visible content block with H1, description, and nav
  const contentBlock = [
    `<h1>${route.h1}</h1>`,
    route.content ? `<p>${route.content}</p>` : '',
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

  // Determine output path
  const routePath = route.path === '/' ? '' : route.path;
  const outDir = join(distDir, routePath);
  const outFile = join(outDir, 'index.html');

  // Create directory if needed
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Write the file (for root, overwrite the existing index.html)
  writeFileSync(outFile, html, 'utf-8');
  console.log(`  ✓ ${route.path} → ${outFile.replace(distDir, 'dist')}`);
}

console.log(`\n✅ Pre-rendered meta tags for ${routes.length} routes`);
