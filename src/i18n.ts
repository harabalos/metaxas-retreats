import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import elTranslation from './locales/el.json';
import itTranslation from './locales/it.json';
import deTranslation from './locales/de.json';
import roTranslation from './locales/ro.json';

const resources = {
  en: { translation: enTranslation },
  el: { translation: elTranslation },
  it: { translation: itTranslation },
  de: { translation: deTranslation },
  ro: { translation: roTranslation },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || navigator.language.split('-')[0] || 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

// Optionally, handle cases where navigator.language is not matching our locales perfectly
const supportedLangs = ['en', 'el', 'it', 'de', 'ro'];
if (!supportedLangs.includes(i18n.language)) {
  i18n.changeLanguage('en');
}

export default i18n;
