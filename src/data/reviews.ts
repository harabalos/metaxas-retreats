/**
 * Guest reviews shown on the home page: a hand-picked selection from the
 * property's Google Business Profile (listed on Google as "Metaxaki").
 *
 * These used to be loaded by the Elfsight widget, which added 550 KB of script,
 * a "Free widget" badge and its own (wrong) schema.org markup to every home page
 * view. Keeping them here renders instantly and puts the text in the page.
 *
 * Quote reviews verbatim. Long ones may be cut at the end of a sentence, marked
 * with "…"; the card links to the full review on Google. Update `reviewSummary`
 * when new reviews come in, since it also feeds the home page schema.org data.
 */

export const GOOGLE_PLACE_ID = 'ChIJU6rq9Dq3XRMRVSgXTsUAgYc';

export const GOOGLE_REVIEWS_URL =
  `https://www.google.com/maps/search/?api=1&query=Metaxaki%20Lefkada&query_place_id=${GOOGLE_PLACE_ID}`;

/** As shown on Google, September 2026. */
export const reviewSummary = { rating: 5, count: 18 };

export type Review = {
  author: string;
  /** Month of the review, yyyy-mm. */
  date: string;
  rating: number;
  text: string;
  url: string;
};

export const reviews: Review[] = [
  {
    author: 'Peter S.',
    date: '2026-01',
    rating: 5,
    text: "A magical gem above the bay – luxury meets pure nature! If you're looking for the perfect symbiosis of freedom, nature, and modern comfort, Metaxaki Glamping in Mikros Gialos is the place for you. We had an unforgettable time here and are still completely enchanted by the atmosphere. …",
    url: 'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tRNWJVVktSWGw0VG1ONlUyTllTemh2YVZWSVRHYxAB!2m1!1s0x0:0x878100c54e172855!3m1!1s2@1:CAIQACodChtycF9oOkQ5bUVKRXl4TmN6U2NYSzhvaVVITGc%7C%7C',
  },
  {
    author: 'Liridona G.',
    date: '2026-07',
    rating: 5,
    text: 'We had a lovely stay and truly wished we could have extended it! The house has a beautiful view, a wonderfully calm and relaxing atmosphere, and it’s just steps away from the beach. Anastasia was an excellent host — super responsive and helpful with everything we needed. We’ll definitely be coming back!',
    url: 'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT21OV2RHMTBiMnRRVlVsbFExRXhRMncyT0dNeGFXYxAB!2m1!1s0x0:0x878100c54e172855!3m1!1s2@1:CAIQACodChtycF9oOmNWdG10b2tQVUllQ1ExQ2w2OGMxaWc%7C%7C',
  },
  {
    author: 'Παναγιωτης Γ.',
    date: '2025-05',
    rating: 5,
    text: 'Το σπιτάκι ήταν καθαρό και πλήρως εξοπλισμένο. Ήσυχο περιβάλλον, εξαιρετική τοποθεσία και υπέροχοι οικοδεσπότες. Μόλις 50 μέτρα από τη θάλασσα Το συνιστώ ανεπιφύλακτα!',
    url: 'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VKQ0FqSXk3aHJQVUFnEAE!2m1!1s0x0:0x878100c54e172855!3m1!1s2@1:CIHM0ogKEJCAjIy7hrPUAg%7C%7C',
  },
  {
    author: 'Boros I.',
    date: '2025-08',
    rating: 5,
    text: 'Everything was perfect! The cottage has everything you need for a successful vacation, the terrace is perfect for relaxing in the evening and for your morning coffee, and to enjoy the absolutely wonderful view. Just a few minutes walk to the beach and with a supermarket and taverna not 2 minutes away it was the perfect choice for us. …',
    url: 'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tSMWIyRTNhMEZpTW1kdlpHdHdObFJYTXpoaWRYYxAB!2m1!1s0x0:0x878100c54e172855!3m1!1s2@1:CAIQACodChtycF9oOkR1b2E3a0FiMmdvZGtwNlRXMzhidXc%7C%7C',
  },
  {
    author: 'Georgios A.',
    date: '2026-07',
    rating: 5,
    text: 'Great glamping experience. Thank you Anastasia for everything. Hope to come again!!!',
    url: 'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2taT1ZFdEtiVFEwVnpWM2RuTm9TRVJyWTIxcFpHYxAB!2m1!1s0x0:0x878100c54e172855!3m1!1s2@1:CAIQACodChtycF9oOkZOVEtKbTQ0VzV3dnNoSERrY21pZGc%7C%7C',
  },
  {
    author: 'Eri S.',
    date: '2024-05',
    rating: 5,
    text: 'The best choice in Mikros Gialos. Very clean and comfy, five steps away from a beach, coffee bar and taverns. Had the best time and Anastasia and her family are very kind',
    url: 'https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChZDSUhNMG9nS0VJQ0FnSURqN2VxbEZ3EAE!2m1!1s0x0:0x878100c54e172855!3m1!1s2@1:CIHM0ogKEICAgIDj7eqlFw%7CCgwIndvisQYQ4MX7pAM%7C',
  },
];
