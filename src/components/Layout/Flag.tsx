import type { Language } from '@/lib/i18nRoutes';

/**
 * Small flag for the language switcher. Emoji flags don't exist on Windows,
 * where 🇬🇧 shows up as the letters "GB", so these are drawn as SVG.
 */
const FLAGS: Record<Language, JSX.Element> = {
  // Union Jack, simplified: at this size the offset red diagonals aren't visible.
  en: (
    <svg viewBox="0 0 60 30">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  el: (
    <svg viewBox="0 0 27 18">
      <rect width="27" height="18" fill="#0D5EAF" />
      {[2, 6, 10, 14].map((y) => <rect key={y} y={y} width="27" height="2" fill="#fff" />)}
      <rect width="10" height="10" fill="#0D5EAF" />
      <path d="M0 5h10M5 0v10" stroke="#fff" strokeWidth="2" />
    </svg>
  ),
  it: (
    <svg viewBox="0 0 3 2">
      <rect width="1" height="2" fill="#009246" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#CE2B37" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 5 3">
      <rect width="5" height="1" fill="#000" />
      <rect y="1" width="5" height="1" fill="#DD0000" />
      <rect y="2" width="5" height="1" fill="#FFCE00" />
    </svg>
  ),
  ro: (
    <svg viewBox="0 0 3 2">
      <rect width="1" height="2" fill="#002B7F" />
      <rect x="1" width="1" height="2" fill="#FCD116" />
      <rect x="2" width="1" height="2" fill="#CE1126" />
    </svg>
  ),
};

const Flag = ({ language }: { language: Language }) => (
  <span
    aria-hidden="true"
    className="inline-block w-[18px] h-3 rounded-[2px] overflow-hidden ring-1 ring-white/20 shrink-0 [&>svg]:w-full [&>svg]:h-full"
  >
    {FLAGS[language]}
  </span>
);

export default Flag;
