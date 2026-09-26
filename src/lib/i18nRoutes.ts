/**
 * The language lives in the URL: English at the root (/explore), the other four
 * under a prefix (/el/explore, /it/explore, …). Every page exists in all five,
 * so search engines can index the translated text and show each visitor the
 * version in their language (see the hreflang links in SEOHead).
 */

export const LANGUAGES = ['en', 'el', 'it', 'de', 'ro'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE = 'en' satisfies Language;

export const isLanguage = (value: unknown): value is Language =>
  LANGUAGES.includes(value as Language);

/** '/el/explore' → { language: 'el', path: '/explore' }; unprefixed paths are English. */
export function splitLanguage(pathname: string): { language: Language; path: string } {
  const [, first, ...rest] = pathname.split('/');
  if (isLanguage(first) && first !== DEFAULT_LANGUAGE) {
    return { language: first, path: `/${rest.join('/')}` };
  }
  return { language: DEFAULT_LANGUAGE, path: pathname };
}

/** A page's path in a language: ('el', '/explore') → '/el/explore', ('el', '/') → '/el'. */
export function localizePath(language: Language, path: string): string {
  if (language === DEFAULT_LANGUAGE) return path;
  return path === '/' ? `/${language}` : `/${language}${path}`;
}
