import React, { createContext, useCallback, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_LANGUAGE, isLanguage, localizePath, splitLanguage, type Language } from '@/lib/i18nRoutes';
import { loadLanguage } from '@/i18n';

export type { Language };

type LanguageContextType = {
  language: Language;
  /** Switches language by going to the same page's URL in that language. */
  setLanguage: (lang: Language) => void;
  /** i18next's t: pass { count } for plurals, other values for {{interpolation}}. */
  t: (key: string, options?: Record<string, unknown>) => string;
  /** A page's path in the current language, for links: localize('/explore'). */
  localize: (path: string) => string;
};

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const language = isLanguage(i18n.language) ? i18n.language : DEFAULT_LANGUAGE;

  // Update html lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    // Remembered so a later visit to an English URL comes back in this language (main.tsx).
    try {
      localStorage.setItem('language', lang);
    } catch {
      // Storage can be unavailable (private mode); the URL still carries the language.
    }
    const { path } = splitLanguage(location.pathname);
    // Fetch the texts first so the page switches in one step, without a loader.
    loadLanguage(lang).then(() => navigate(localizePath(lang, path) + location.search + location.hash));
  }, [location, navigate]);

  const localize = useCallback((path: string) => localizePath(language, path), [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, localize }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
