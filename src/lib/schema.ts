import { accommodations, type Accommodation } from '@/data/accommodations';
import { reviewSummary } from '@/data/reviews';

/**
 * schema.org data for the site, in one place.
 *
 * Every page describes the same business under one @id, so search engines and
 * AI assistants see a single entity: the name used on the site plus the name
 * guests know from Google, Airbnb and Booking.com ("Metaxaki"), one address
 * (postcode 31084 covers Mikros Gialos and Poros) and links to the real
 * profiles. Pages add their own nodes (accommodation, FAQ, breadcrumbs) to a
 * @graph that SEOHead writes into the prerendered HTML.
 */

export const SITE = 'https://www.metaxasretreats.gr';
const BUSINESS_ID = `${SITE}/#business`;
const WEBSITE_ID = `${SITE}/#website`;

type T = (key: string, options?: Record<string, unknown>) => string;
type Node = Record<string, unknown>;

/** Google Business Profile, by the place's customer id (cid). */
export const GOOGLE_MAPS_URL = 'https://maps.google.com/?cid=9764086314534643797';

const PROFILES = [
  GOOGLE_MAPS_URL,
  'https://www.tripadvisor.com/Hotel_Review-g3581185-d34322391-Reviews-Metaxas_Retreats-Mikros_Gialos_Lefkada_Ionian_Islands.html',
  'https://www.airbnb.com/rooms/936140564087838043',
  'https://www.airbnb.com/rooms/1420445588586676264',
  'https://www.airbnb.com/rooms/1424551364666564643',
  'https://www.booking.com/hotel/gr/metaxaki.html',
  'https://www.booking.com/hotel/gr/metaxaki-glamping.html',
];

const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Mikros Gialos, Poros',
  addressLocality: 'Lefkada',
  addressRegion: 'Ionian Islands',
  postalCode: '31084',
  addressCountry: 'GR',
};

const GEO = { '@type': 'GeoCoordinates', latitude: 38.640048, longitude: 20.698988 };

const amenity = (name: string) => ({ '@type': 'LocationFeatureSpecification', name, value: true });

const absolute = (path: string) => `${SITE}${encodeURI(path)}`;

export const accommodationId = (id: string) => `${SITE}/accommodation/${id}#accommodation`;

/** Reference to the business from another node. */
export const businessRef = () => ({ '@id': BUSINESS_ID });

/**
 * The business. `withRating` adds the Google rating, which belongs only on pages
 * that show the reviews (the home page).
 */
export function business(t: T, { withRating = false } = {}): Node {
  return {
    '@type': ['LodgingBusiness', 'Campground'],
    '@id': BUSINESS_ID,
    name: 'Metaxas Retreats',
    alternateName: ['Metaxaki', 'Metaxaki Glamping'],
    description: t('seo.homeDescription'),
    url: `${SITE}/`,
    telephone: '+30 697 321 9980',
    email: 'metaxasretreats@gmail.com',
    address: ADDRESS,
    geo: GEO,
    hasMap: GOOGLE_MAPS_URL,
    image: [
      absolute('/assets/glamping-tent/view.jpg'),
      absolute('/assets/glamping-tent/prosopsi.jpg'),
      absolute('/assets/e9f9bd84-9f74-4189-bf30-d6640a566fd3.jpg'),
    ],
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    checkinTime: '15:00',
    checkoutTime: '11:00',
    amenityFeature: ['Sea View', 'Free WiFi', 'Air Conditioning', 'Free Parking', 'Beach Access'].map(amenity),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'reservations',
      telephone: '+30 697 321 9980',
      email: 'metaxasretreats@gmail.com',
      availableLanguage: ['English', 'Greek', 'Italian', 'German', 'Romanian'],
    },
    containsPlace: accommodations.map((a) => ({ '@id': accommodationId(a.id) })),
    sameAs: PROFILES,
    ...(withRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviewSummary.rating,
        reviewCount: reviewSummary.count,
        bestRating: 5,
      },
    }),
  };
}

export function website(language: string): Node {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Metaxas Retreats',
    url: `${SITE}/`,
    inLanguage: language,
    publisher: businessRef(),
  };
}

/** One of the two units, as its own place inside the business. */
export function accommodationNode(accommodation: Accommodation, name: string, description: string): Node {
  return {
    '@type': accommodation.type === 'house' ? 'House' : 'Accommodation',
    '@id': accommodationId(accommodation.id),
    name,
    description,
    url: `${SITE}/accommodation/${accommodation.id}`,
    image: accommodation.images.slice(0, 8).map(absolute),
    occupancy: { '@type': 'QuantitativeValue', maxValue: accommodation.guests },
    numberOfRooms: accommodation.bedrooms,
    numberOfBedrooms: accommodation.bedrooms,
    numberOfBathroomsTotal: accommodation.bathrooms,
    amenityFeature: accommodation.amenities.map(amenity),
    address: ADDRESS,
    geo: GEO,
    containedInPlace: businessRef(),
  };
}

/** Breadcrumbs from the home page down; `trail` is [name, path] pairs after Home. */
export function breadcrumbs(t: T, trail: [string, string][]): Node {
  const items: [string, string][] = [[t('nav.home'), '/'], ...trail];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE}${path}`,
    })),
  };
}

/** FAQPage from the questions the home page shows (faq.q1/faq.a1, …). */
export function faqPage(t: T, count: number): Node {
  return {
    '@type': 'FAQPage',
    mainEntity: Array.from({ length: count }, (_, i) => ({
      '@type': 'Question',
      name: t(`faq.q${i + 1}`),
      acceptedAnswer: { '@type': 'Answer', text: t(`faq.a${i + 1}`) },
    })),
  };
}

/** Wraps page nodes for SEOHead's schema prop. */
export const graph = (...nodes: Node[]) => ({ '@context': 'https://schema.org', '@graph': nodes });

