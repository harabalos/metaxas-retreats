import { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const languages: { code: Language; flag: string; short: string }[] = [
  { code: 'en', flag: '🇬🇧', short: 'EN' },
  { code: 'el', flag: '🇬🇷', short: 'ΕΛ' },
  { code: 'it', flag: '🇮🇹', short: 'IT' },
  { code: 'de', flag: '🇩🇪', short: 'DE' },
  { code: 'ro', flag: '🇷🇴', short: 'RO' },
];

interface LanguageSwitcherProps {
  /** When true the navbar is transparent over a dark hero — use white text */
  isLight?: boolean;
}

const LanguageSwitcher = ({ isLight = false }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();
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
        aria-label="Switch language"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.short}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="opacity-60"
        >
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="lang-dropdown"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 bg-forest-dark border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 min-w-[110px]"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-sans font-medium transition-colors duration-150 ${
                  language === lang.code
                    ? 'bg-wood/15 text-wood'
                    : 'text-sand-dark/70 hover:bg-white/6 hover:text-sand-light'
                }`}
              >
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.short}</span>
                {language === lang.code && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-wood" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
