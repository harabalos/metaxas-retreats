import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage, Language } from '@/context/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, m } from 'framer-motion';
import { localizePath, splitLanguage } from '@/lib/i18nRoutes';
import Flag from './Flag';

// Each language named in itself, so a visitor can find theirs in any version.
const languages: { code: Language; short: string; name: string }[] = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'el', short: 'ΕΛ', name: 'Ελληνικά' },
  { code: 'it', short: 'IT', name: 'Italiano' },
  { code: 'de', short: 'DE', name: 'Deutsch' },
  { code: 'ro', short: 'RO', name: 'Română' },
];

interface LanguageSwitcherProps {
  /** When true the navbar is transparent over a dark hero — use white text */
  isLight?: boolean;
}

const LanguageSwitcher = ({ isLight = false }: LanguageSwitcherProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { pathname, search, hash } = useLocation();
  const { path } = splitLanguage(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === language) || languages[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const triggerClass = isLight
    ? 'text-white/80 hover:text-white border-white/20 hover:border-white/40 hover:bg-white/10'
    : 'text-sand-light/80 hover:text-sand-light border-white/10 hover:border-white/25 hover:bg-white/8';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200 text-xs font-sans font-semibold tracking-wide ${triggerClass}`}
        aria-label={t('nav.language')}
        aria-expanded={open}
      >
        <Flag language={current.code} />
        <span className="hidden sm:inline">{current.short}</span>
        <m.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="opacity-60"
        >
          <ChevronDown className="h-3 w-3" />
        </m.span>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            key="lang-dropdown"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 bg-forest-dark border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 min-w-[150px]"
          >
            {languages.map((lang) => (
              // A real link, so the translated page has an address crawlers can follow;
              // a plain click is still handled in place (setLanguage fetches the texts first).
              <a
                key={lang.code}
                href={localizePath(lang.code, path) + search + hash}
                hrefLang={lang.code}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-sans font-medium transition-colors duration-150 ${
                  language === lang.code
                    ? 'bg-wood/15 text-wood'
                    : 'text-sand-dark/70 hover:bg-white/6 hover:text-sand-light'
                }`}
              >
                <Flag language={lang.code} />
                <span lang={lang.code}>{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-wood" />
                )}
              </a>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
