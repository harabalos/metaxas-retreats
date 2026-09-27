/**
 * The questions on the FAQ page (/faq), as locale keys: faq.q1 / faq.a1, …
 * The same list feeds the page's FAQPage schema and llms.txt.
 */
export const FAQ_ITEMS = [1, 2, 3, 4, 5, 6, 7].map((n) => ({ q: `faq.q${n}`, a: `faq.a${n}` }));
