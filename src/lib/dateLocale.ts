import type { Locale } from 'date-fns';
import { de, el, enGB, it, ro } from 'date-fns/locale';

const LOCALES: Record<string, Locale> = { en: enGB, el, it, de, ro };

/** date-fns locale for the site language (month names, week starting Monday). */
export const dateLocale = (language: string): Locale => LOCALES[language] ?? enGB;
