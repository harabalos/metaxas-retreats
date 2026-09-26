import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { m, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const GA_MEASUREMENT_ID = 'G-ZDD9NS3KDN';

export default function CookieConsent() {
  const { t, localize } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  const loadGoogleAnalytics = () => {
    if (window.gtag) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'true') {
      loadGoogleAnalytics();
    } else if (consent !== 'false') {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    loadGoogleAnalytics();
    setIsVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'false');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          role="region"
          aria-label={t('cookie.title')}
          className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50"
        >
          {/* Compact on phones (text + two buttons); the full card from sm up. */}
          <div className="bg-forest-dark rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 p-3.5 sm:p-5 text-white">
            <div className="hidden sm:flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-wood/20 flex items-center justify-center flex-shrink-0">
                  <Cookie className="h-4 w-4 text-wood" />
                </div>
                <p className="font-heading font-semibold text-base text-white">{t('cookie.title')}</p>
              </div>
              <button onClick={decline} aria-label={t('cookie.decline')} className="text-white/60 hover:text-white transition-colors mt-0.5">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-white/75 text-xs leading-relaxed mb-3 sm:mb-4 font-sans">
              {t('cookie.text')}{' '}
              <Link to={localize('/privacy')} className="text-wood hover:text-wood-light underline underline-offset-2 transition-colors">
                {t('cookie.privacyLink')}
              </Link>
            </p>

            <div className="flex gap-2 sm:gap-2.5">
              <button
                onClick={decline}
                className="flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-xs font-sans font-semibold tracking-wide transition-all duration-200"
              >
                {t('cookie.decline')}
              </button>
              <button
                onClick={accept}
                className="flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-wood text-forest-dark text-xs font-sans font-semibold tracking-wide hover:bg-wood-light transition-all duration-200"
              >
                {t('cookie.accept')}
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

// Global Type Definitions
declare global {
  interface Window {
    dataLayer: unknown[];
    /** Set once Google Analytics has been loaded (after consent). */
    gtag?: (...args: unknown[]) => void;
  }
}
