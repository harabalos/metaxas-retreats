/**
 * Post-build script: generates route-specific HTML files with unique meta tags.
 * Crawlers that don't execute JavaScript (Ahrefs, Bing, etc.) will see
 * the correct title, description, canonical, and H1 for each page.
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
  },
  {
    path: '/accommodation/wooden-house',
    title: 'Wooden House with Sea View in Lefkada | Metaxas Retreats',
    description: 'Charming wooden house above Mikros Gialos bay, Lefkada. Sleeps 4, sea views, private terrace, 50m from beach. Book direct.',
    h1: 'Wooden House — Sea View Accommodation in Lefkada',
  },
  {
    path: '/accommodation/glamping-tent-1',
    title: 'Glamping Tent 1 in Lefkada — Luxury Camping | Metaxas Retreats',
    description: 'Luxury glamping tent among olive trees, Lefkada. Sleeps 5, sea views, full kitchen, A/C, 50m from Mikros Gialos beach.',
    h1: 'Glamping Tent 1 — Luxury Camping in Lefkada',
  },
  {
    path: '/accommodation/glamping-tent-2',
    title: 'Glamping Tent 2 in Lefkada — Luxury Camping | Metaxas Retreats',
    description: 'Second glamping tent in olive grove, Lefkada. Sleeps 5, sea views, full kitchen, A/C, 50m from Mikros Gialos beach.',
    h1: 'Glamping Tent 2 — Luxury Camping in Lefkada',
  },
  {
    path: '/explore',
    title: 'Explore Lefkada Island — Beaches, Activities & More | Metaxas Retreats',
    description: 'Discover Lefkada: Porto Katsiki, Kathisma beach, Nidri waterfalls, boat trips & local tavernas. Your guide to the island.',
    h1: 'Explore Lefkada Island',
  },
  {
    path: '/contact',
    title: 'Contact Metaxas Retreats — Book Direct in Lefkada',
    description: 'Get in touch with Metaxas Retreats. Book your glamping tent or wooden house in Lefkada directly. Email, phone & contact form.',
    h1: 'Contact Us',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Metaxas Retreats',
    description: 'Privacy policy for Metaxas Retreats website. How we handle your personal data and booking information.',
    h1: 'Privacy Policy',
    robots: 'noindex, follow',
  },
  {
    path: '/terms',
    title: 'Terms of Service | Metaxas Retreats',
    description: 'Terms and conditions for booking at Metaxas Retreats, Lefkada, Greece.',
    h1: 'Terms of Service',
    robots: 'noindex, follow',
  },
];

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

  // Replace hreflang URLs
  const hreflangs = ['en', 'el', 'it', 'de', 'ro', 'x-default'];
  for (const lang of hreflangs) {
    html = html.replace(
      new RegExp(`<link rel="alternate" hreflang="${lang}" href="[^"]*"\\s*\\/?>`),
      `<link rel="alternate" hreflang="${lang}" href="${canonicalUrl}" />`
    );
  }

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

  // Inject an H1 tag right after <div id="root"> so crawlers see it
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${route.h1}</h1></div>`
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
