import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const GA_MEASUREMENT_ID = 'G-ZDD9NS3KDN';

export default function CookieConsent() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  const loadGoogleAnalytics = () => {
    if (window.gtag) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
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

  const text = {
    title: { en: 'We use cookies', el: 'Χρησιμοποιούμε cookies', de: 'Wir nutzen Cookies', it: 'Utilizziamo i cookie', ro: 'Folosim cookie-uri' },
    body: {
      en: 'We use Google Analytics to understand how visitors use our site — only after your consent. No tracking without permission.',
      el: 'Χρησιμοποιούμε Google Analytics για να καταλάβουμε πώς χρησιμοποιείτε την ιστοσελίδα μας — μόνο μετά τη συγκατάθεσή σας.',
      de: 'Wir nutzen Google Analytics nur nach Ihrer Zustimmung, um zu verstehen, wie Besucher unsere Website nutzen.',
      it: 'Utilizziamo Google Analytics per capire come i visitatori usano il sito — solo dopo il tuo consenso.',
      ro: 'Folosim Google Analytics pentru a înțelege cum vizitatorii utilizează site-ul nostru — numai după consimțământul dvs.',
    },
    privacy: { en: 'Privacy Policy', el: 'Πολιτική Απορρήτου', de: 'Datenschutzerklärung', it: 'Privacy Policy', ro: 'Politică de confidențialitate' },
    accept: { en: 'Accept', el: 'Αποδοχή', de: 'Akzeptieren', it: 'Accetta', ro: 'Acceptă' },
    decline: { en: 'Decline', el: 'Απόρριψη', de: 'Ablehnen', it: 'Rifiuta', ro: 'Refuză' },
  };

  const lang = (language as keyof typeof text.title) in text.title ? language as keyof typeof text.title : 'en';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50"
        >
          <div className="bg-forest-dark rounded-2xl shadow-2xl border border-white/10 p-5 text-white">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-wood/20 flex items-center justify-center flex-shrink-0">
                  <Cookie className="h-4 w-4 text-wood" />
                </div>
                <p className="font-heading font-semibold text-base text-white">{text.title[lang]}</p>
              </div>
              <button onClick={decline} aria-label="Close" className="text-white/40 hover:text-white/70 transition-colors mt-0.5">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <p className="text-white/65 text-xs leading-relaxed mb-4 font-sans">
              {text.body[lang]}{' '}
              <Link to="/privacy" onClick={decline} className="text-wood hover:text-wood-light underline underline-offset-2 transition-colors">
                {text.privacy[lang]}
              </Link>
            </p>

            {/* Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={decline}
                className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-xs font-sans font-semibold tracking-wide transition-all duration-200"
              >
                {text.decline[lang]}
              </button>
              <button
                onClick={accept}
                className="flex-1 py-2.5 rounded-xl bg-wood text-forest-dark text-xs font-sans font-semibold tracking-wide hover:bg-wood-light transition-all duration-200"
              >
                {text.accept[lang]}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Global Type Definitions
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
