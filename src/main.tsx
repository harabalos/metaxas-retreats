import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
// Self-hosted variable fonts; both cover Greek (DM Sans, the old body font, didn't).
import '@fontsource-variable/eb-garamond';
import '@fontsource-variable/commissioner';
import i18n from './i18n';
import './index.css';

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
// markup, and a visitor whose saved language differs would not match it, so
// those render from scratch instead.
if (container.hasChildNodes() && i18n.language === document.documentElement.lang) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
