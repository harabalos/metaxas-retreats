import type { ReactNode } from 'react';
import { m } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Distance the content rises from, in px. */
  y?: number;
  /**
   * For content at the top of a page (headings, the gallery): shown as is,
   * without the fade. Faded content is invisible in the prerendered HTML until
   * the app has loaded, which delays the page's first meaningful paint (LCP).
   */
  eager?: boolean;
}

/** Fades and lifts its content in the first time it scrolls into view. */
const FadeUp = ({ children, delay = 0, className, y = 24, eager = false }: FadeUpProps) => {
  if (eager) return <div className={className}>{children}</div>;
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </m.div>
  );
};

export default FadeUp;
