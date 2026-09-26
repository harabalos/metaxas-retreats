import { accommodations, type Accommodation } from '@/data/accommodations';
import { NEARBY, PLACES, formatTrip, type PlaceId } from '@/data/places';
import { GOOGLE_REVIEWS_URL, reviewSummary } from '@/data/reviews';
import { GOOGLE_MAPS_URL, PROFILES, SITE } from '@/lib/schema';
import { LANGUAGES, localizePath } from '@/lib/i18nRoutes';

type T = (key: string, options?: Record<string, unknown>) => string;

const MONTHS = ['May', 'June', 'July', 'August', 'September', 'October', 'November'];

/** "May & November €50, October €70, …", cheapest first. */
function prices(accommodation: Accommodation) {
  return [...accommodation.priceRanges]
    .sort((a, b) => a.price - b.price)
    .map((range) => `${range.months.replace(', ', ' & ')} €${range.price}`)
    .join(', ');
}

const BEDS: Record<string, string> = {
  'wooden-house': '1 bedroom, sleeps up to 4',
  'glamping-tent': 'one double bed and three single beds, sleeps up to 5',
};

/**
 * /llms.txt (https://llmstxt.org): the facts an AI assistant needs to answer
 * questions about the place, in plain text, built from the same data as the
 * pages so prices and rules never drift. Written by scripts/prerender-meta.js.
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
      `- Price per night: ${prices(a)}`,
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
    `Seasonal prices cover ${MONTHS[0]} to ${MONTHS[MONTHS.length - 1]}.`,
    '',
    '## Accommodation',
    '',
    units.join('\n\n'),
    '',
    '## Booking',
    '',
    '- Direct: choose dates on an accommodation page and send a request, message on WhatsApp, or email. The host confirms availability and the final price.',
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
    '## Pages',
    '',
    `- [Home](${url('/')}): the two accommodations, the setting, guest reviews and FAQ`,
    ...accommodations.map((a) => `- [${a.name}](${url(`/accommodation/${a.id}`)}): photos, amenities, seasonal prices, availability`),
    `- [Explore Lefkada](${url('/explore')}): beaches, villages and activities around the island`,
    `- [Contact](${url('/contact')}): phone, WhatsApp, email and map`,
    `- The site in other languages: ${LANGUAGES.filter((l) => l !== 'en').map((l) => url(localizePath(l, '/'))).join(', ')}`,
    '',
    '## Profiles',
    '',
    ...PROFILES.map((profile) => `- [${profile.label}](${profile.url})`),
    '',
  ].join('\n');
}
