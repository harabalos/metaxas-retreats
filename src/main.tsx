import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
// Self-hosted variable fonts; both cover Greek (DM Sans, the old body font, didn't).
import '@fontsource-variable/eb-garamond';
import '@fontsource-variable/commissioner';
import './i18n';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
