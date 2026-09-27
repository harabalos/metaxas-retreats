# Metaxas Retreats

Website for Metaxas Retreats (listed on Google, Airbnb and Booking.com as "Metaxaki"):
a wooden house and two glamping tents in Mikros Gialos, Lefkada. Live at
https://www.metaxasretreats.gr.

Vite + React + TypeScript + Tailwind, deployed on Vercel. Every page is prerendered
to HTML at build time in five languages and hydrated in the browser.

## Commands

```sh
npm install
npm run dev        # dev server on http://localhost:8080
npm run build      # client build + SSR build + prerender (see below)
npm run images     # after adding or replacing a photo in public/assets
npm run indexnow   # after a deploy: tell Bing & co. the pages changed
```

## How the build works

1. `vite build` bundles the app into `dist/` (hashed files in `dist/_app/`).
2. `vite build --ssr src/entry-server.tsx` builds a Node renderer into `dist-ssr/`.
3. `scripts/prerender-meta.js` renders every public page in every language into
   `dist/<lang>/<page>/index.html`, plus `sitemap.xml` (with hreflang), `llms.txt`,
   the noindex booking shell and `404.html`.

URLs: English at the root (`/explore`), other languages under a prefix
(`/el/explore`, `/it/…`, `/de/…`, `/ro/…`) — see `src/lib/i18nRoutes.ts`.

## Where things live

| What | File |
|---|---|
| Units, amenities, seasonal prices | `src/data/accommodations.ts` |
| Google reviews shown on the site | `src/data/reviews.ts` |
| Drive times to beaches and villages | `src/data/places.ts` |
| FAQ questions (the /faq page, its schema, llms.txt) | `src/data/faq.ts` |
| All visible text, per language | `src/locales/*.json` |
| schema.org data (one business entity) | `src/lib/schema.ts` |
| llms.txt | `src/lib/llmsTxt.ts` |
| Routes, redirects, cache headers | `vercel.json` |

Photos: originals stay in `public/assets/` (used by the sitemap, Open Graph and
schema). `npm run images` writes resized WebP copies to `public/assets/opt/` and
`src/data/imageManifest.json`; pages use them through `src/lib/images.ts`. Commit
both.

## Serverless functions (`api/`)

- `api/availability.ts` reads the Airbnb iCal feeds and returns the booked nights.
  Needs `ICAL_WOODEN_HOUSE`, `ICAL_TENT_1`, `ICAL_TENT_2` (see `.env.example`).
- `api/contact.ts` validates the contact and booking forms and forwards them to
  Formspree, which emails the owner.

## Deploying

The live domain is served by the Vercel project `harabalos-projects/metaxas-retreatss`;
set env vars there. Pushing to `main` deploys.
