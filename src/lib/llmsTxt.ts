import { accommodations } from '@/data/accommodations';
import { FAQ_ITEMS } from '@/data/faq';
import { NEARBY, PLACES, formatTrip, type PlaceId } from '@/data/places';
import { GOOGLE_REVIEWS_URL, reviewSummary } from '@/data/reviews';
import { GOOGLE_MAPS_URL, PROFILES, SITE } from '@/lib/schema';
import { LANGUAGES, localizePath } from '@/lib/i18nRoutes';

type T = (key: string, options?: Record<string, unknown>) => string;

const BEDS: Record<string, string> = {
  'wooden-house': '1 bedroom, sleeps up to 4',
  'glamping-tent': 'one double bed and three single beds, sleeps up to 5',
};

/**
 * /llms.txt (https://llmstxt.org): the facts an AI assistant needs to answer
 * questions about the place, in plain text, built from the same data as the
 * pages so facts and rules never drift. Prices are quoted on request, so
 * they're left out, as on the site. Written by scripts/prerender-meta.js.
 */
export function llmsTxt(t: T): string {
  const url = (path: string) => `${SITE}${path}`;
  const trip = (id: PlaceId) => `${t(`place.${id}`)}: ${formatTrip(PLACES[id], t)}`;

  const units = accommodations.map((a) => {
    const key = a.type === 'house' ? 'woodenHouse' : 'glampingTent';
    return [
      `### ${t(`accommodation.${key}`)}${a.type === 'tent' ? ' (two identical tents)' : ''}`,
      '',
      t(`accommodation.${key}.description`),
      '',
      `- ${BEDS[a.id]}, ${a.bathrooms} bathroom`,
      `- ${a.amenities.join(', ')}`,
      `- Page: ${url(`/accommodation/${a.id}`)}`,
    ].join('\n');
  });

  const more: PlaceId[] = ['ammousa', 'agiofili', 'egremni', 'agiosNikitas', 'kathisma'];

  return [
    '# Metaxas Retreats',
    '',
    '> Glamping tents and a wooden house among olive trees in Mikros Gialos (Poros), south-east Lefkada, Greece, 50 m from Mikros Gialos beach. Family-run; listed on Google, Airbnb and Booking.com as "Metaxaki".',
    '',
    `Address: Mikros Gialos, Poros, 31084 Lefkada, Greece (38.640048, 20.698988). Map: ${GOOGLE_MAPS_URL}`,
    `Phone and WhatsApp: +30 697 321 9980, +30 698 042 9891. Email: metaxasretreats@gmail.com.`,
    `Google rating: ${reviewSummary.rating.toFixed(1)} from ${reviewSummary.count} reviews (${GOOGLE_REVIEWS_URL}).`,
    '',
    '## Accommodation',
    '',
    units.join('\n\n'),
    '',
    '## Booking',
    '',
    '- Direct: choose dates on an accommodation page and send a request, message on WhatsApp, or email. The host confirms availability and sends a quote.',
    `- ${t('booking.discountDescription')}`,
    '- Also bookable on Airbnb and Booking.com (links under Profiles).',
    `- ${t('terms.section2.checkin')} ${t('terms.section2.checkout')}`,
    '',
    '## House rules',
    '',
    ...[1, 2, 3, 4].map((i) => `- ${t(`terms.section3.rule${i}`)}`),
    '',
    '## Distances from the property',
    '',
    ...NEARBY.map((id) => `- ${trip(id)}`),
    '',
    '## Other beaches and villages',
    '',
    ...more.map((id) => `- ${trip(id)}`),
    '',
    '## Frequently asked questions',
    '',
    ...FAQ_ITEMS.flatMap(({ q, a }) => [`### ${t(q)}`, '', t(a), '']),
    '## Pages',
    '',
    `- [Home](${url('/')}): the two accommodations, the setting and guest reviews`,
    ...accommodations.map((a) => `- [${a.name}](${url(`/accommodation/${a.id}`)}): photos, amenities, availability`),
    `- [Mikros Gialos](${url('/mikros-gialos')}): the bay, what's on foot and by car from it, and how to get here`,
    `- [Contact](${url('/contact')}): phone, WhatsApp, email and map`,
    `- [FAQ](${url('/faq')}): the questions above, on a page of their own`,
    `- The site in other languages: ${LANGUAGES.filter((l) => l !== 'en').map((l) => url(localizePath(l, '/'))).join(', ')}`,
    '',
    '## Profiles',
    '',
    ...PROFILES.map((profile) => `- [${profile.label}](${profile.url})`),
    '',
  ].join('\n');
}
