import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE, type Language } from './lib/i18nRoutes';

// English is the default and the fallback, so it ships with the app. The other
// languages are separate chunks, fetched only by visitors who need them.
import enTranslation from './locales/en.json';

const LOADERS: Record<Exclude<Language, 'en'>, () => Promise<{ default: Record<string, string> }>> = {
  el: () => import('./locales/el.json'),
  it: () => import('./locales/it.json'),
  de: () => import('./locales/de.json'),
  ro: () => import('./locales/ro.json'),
};

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: enTranslation } },
    // main.tsx and the prerender switch to the URL's language once it's loaded.
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    partialBundledLanguages: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export const isLanguageLoaded = (language: Language) =>
  i18n.hasResourceBundle(language, 'translation');

/** Fetches a language's texts (once); resolves when t() can use them. */
export async function loadLanguage(language: Language) {
  if (language === DEFAULT_LANGUAGE || isLanguageLoaded(language)) return;
  const { default: texts } = await LOADERS[language]();
  i18n.addResourceBundle(language, 'translation', texts, true, true);
}

export default i18n;
