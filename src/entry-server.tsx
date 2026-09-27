import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import App from './App';
import i18n, { loadLanguage } from './i18n';
import type { Language } from './lib/i18nRoutes';
import { llmsTxt } from './lib/llmsTxt';

/**
 * Renders one URL to HTML at build time (scripts/prerender-meta.js), waiting
 * for the lazy-loaded page so the markup contains the real content.
 */
export async function render(url: string, language: Language = 'en') {
  await loadLanguage(language);
  await i18n.changeLanguage(language);
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = await new Promise<string>((resolve, reject) => {
    let markup = '';
    const sink = new Writable({
      write(chunk, _encoding, done) {
        markup += chunk;
        done();
      },
    });
    // React 18's stream writes out each full 2048-byte buffer whole, even when
    // the next character didn't fit and left its last byte or two empty, so
    // Greek (two bytes a letter) and German text came out with NUL bytes
    // inside words ("διακοπ\0ές"). Browsers skip them; crawlers may not.
    sink.on('finish', () => resolve(markup.replace(/\0/g, '')));

    const { pipe } = renderToPipeableStream(
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>,
      {
        onAllReady: () => pipe(sink),
        onShellError: reject,
        onError: reject,
      },
    );
  });

  return { html, helmet: helmetContext.helmet };
}

/** The English /llms.txt, from the same data as the pages. */
export async function renderLlmsTxt() {
  await i18n.changeLanguage('en');
  return llmsTxt(i18n.t.bind(i18n));
}
