import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
// Self-hosted variable fonts: EB Garamond for headings (Greek included) and
// DM Sans for body text. DM Sans has no Greek, so Greek body text falls back to
// the system sans-serif, as it always has on this site.
import '@fontsource-variable/eb-garamond';
import '@fontsource-variable/dm-sans';
// Literata sets the Greek headings (see index.css); the other languages never use it.
import '@fontsource-variable/literata';
import i18n, { loadLanguage } from './i18n';
import { DEFAULT_LANGUAGE, isLanguage, localizePath, splitLanguage } from './lib/i18nRoutes';
import './index.css';

function savedLanguage() {
  try {
    return localStorage.getItem('language');
  } catch {
    return null;
  }
}

/**
 * Where to send a visitor who arrived at an English URL: the language they
 * picked before, or, on the home page only, their browser's language if the
 * site has it. Crawlers have neither, so every version gets indexed as served.
 */
function preferredUrl(): string | null {
  const { language, path } = splitLanguage(window.location.pathname);
  if (language !== DEFAULT_LANGUAGE) return null;
  const preferred = savedLanguage() ?? (path === '/' ? navigator.language.split('-')[0] : null);
  if (!isLanguage(preferred) || preferred === DEFAULT_LANGUAGE) return null;
  return localizePath(preferred, path) + window.location.search + window.location.hash;
}

function mount() {
  const container = document.getElementById('root')!;
  const app = (
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  );

  // Pages are prerendered (scripts/prerender-meta.js) in the language of their
  // <html lang>, so the app takes over that markup. The booking shell has no
  // markup, and the English 404 page may be showing another language's URL, so
  // those render from scratch instead.
  if (container.hasChildNodes() && i18n.language === document.documentElement.lang) {
    hydrateRoot(container, app);
  } else {
    createRoot(container).render(app);
  }
}

const redirect = preferredUrl();
if (redirect) {
  window.location.replace(redirect);
} else {
  // Fetch the page's language before the first render, so hydration matches
  // the prerendered markup.
  const { language } = splitLanguage(window.location.pathname);
  loadLanguage(language)
    .then(() => i18n.changeLanguage(language))
    .then(mount);
}
