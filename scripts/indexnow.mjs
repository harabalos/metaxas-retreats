/**
 * Tells IndexNow search engines (Bing, which ChatGPT search relies on, plus
 * Yandex, Seznam and Naver) that the site's pages changed, so they recrawl them
 * instead of waiting for their next visit.
 *
 * Run it after a deploy, once the new pages are live:  npm run indexnow
 *
 * It reads the live sitemap and submits every URL in it. The key proves the
 * site is ours: IndexNow fetches it from https://www.metaxasretreats.gr/<key>.txt
 * (public/<key>.txt).
 */

import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HOST = 'www.metaxasretreats.gr';
const KEY = '0c7c28955b93bdf14e36854fe14b7495';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
if (!existsSync(join(publicDir, `${KEY}.txt`))) {
  throw new Error(`public/${KEY}.txt is missing; IndexNow would reject the key`);
}

const keyLive = await fetch(`https://${HOST}/${KEY}.txt`).then((r) => (r.ok ? r.text() : ''));
if (keyLive.trim() !== KEY) {
  throw new Error(`https://${HOST}/${KEY}.txt doesn't serve the key yet; deploy first`);
}

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text());
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error('No URLs found in the live sitemap');

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

// 200: accepted. 202: accepted, key check pending. Anything else is an error.
console.log(`IndexNow: ${response.status} ${response.statusText} for ${urlList.length} URLs`);
if (response.status >= 300) {
  console.error(await response.text());
  process.exit(1);
}
