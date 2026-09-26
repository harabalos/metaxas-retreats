/** The site's ease-out curve for entrance animations. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** True when the visitor asked their device for less motion. False when prerendering. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 'smooth' scrolling, unless the visitor asked for less motion. */
export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth');
