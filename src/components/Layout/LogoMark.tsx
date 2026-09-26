/**
 * The Metaxas Retreats mark: an "M" drawn as two tent peaks over the sea.
 * Strokes use currentColor; public/favicon.svg is the same drawing on green.
 */
const LogoMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 43 L23.5 18.5 L32 35 L40.5 18.5 L51 43" strokeWidth="4.6" />
      <path d="M12.5 50.5 q4.9 -3.6 9.8 0 t9.8 0 t9.8 0 t9.8 0" strokeWidth="2.8" />
    </g>
  </svg>
);

export default LogoMark;
