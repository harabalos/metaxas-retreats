import { Link } from 'react-router-dom';
import { Car, MapPin, Plane, Sailboat, UtensilsCrossed, Waves } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import FadeUp from '@/components/FadeUp';
import MapEmbed from '@/components/MapEmbed';
import { useLanguage } from '@/context/LanguageContext';
import { PLACES, formatMinutes, formatTrip, type PlaceId } from '@/data/places';
import { responsiveImage } from '@/lib/images';
import { breadcrumbs, business, GEO, GOOGLE_MAPS_URL, graph, SITE } from '@/lib/schema';

// The owner's photos from the tent's gallery. The hero video's frames carry a
// third party's watermark, so they aren't used here.
const BAY_IMAGE = '/assets/glamping-tent/view2.jpg';
const DUSK_IMAGE = '/assets/glamping-tent/view.jpg';

// The content column (max-w-6xl less its padding), and half of it from lg.
// scripts/prerender-meta.js preloads the bay photo with a copy of BAY_IMAGE_SIZES.
const BAY_IMAGE_SIZES =
  '(min-width: 1152px) 1056px, (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)';
const DUSK_IMAGE_SIZES =
  '(min-width: 1152px) 504px, (min-width: 1024px) calc(50vw - 72px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)';

// Text for each entry lives in the locale files under area.*; distances in src/data/places.ts.
const ON_FOOT = [
  { key: 'beach', icon: Waves },
  { key: 'food', icon: UtensilsCrossed },
  { key: 'sea', icon: Sailboat },
];
const BY_CAR: PlaceId[] = ['sivota', 'nidri', 'vasiliki', 'agiofili', 'lefkadaTown', 'portoKatsiki'];

/**
 * The bay the accommodations stand on, for guests deciding where to stay:
 * what's on foot, what's a drive away, and how to get here. It replaced a
 * general guide to the island (/explore, redirected here in vercel.json).
 */
const MikrosGialos = () => {
  const { t, localize } = useLanguage();

  // "53 km", "1 h 10 min": non-breaking spaces keep a number on the same line as its unit.
  const unbroken = (text: string) => text.replace(/ /g, ' ');
  const trip = (id: PlaceId) => ({
    distance: unbroken(t('distance.km', { km: PLACES[id].km })),
    time: unbroken(formatMinutes(PLACES[id].minutes, t)),
  });
  const gettingHere = [
    { key: 'airport', icon: Plane, values: trip('airport') },
    { key: 'town', icon: Car, values: trip('lefkadaTown') },
    { key: 'island', icon: MapPin },
  ];

  const schema = graph(
    business(t),
    {
      '@type': 'TouristDestination',
      name: t('area.title'),
      description: t('seo.area.description'),
      url: `${SITE}/mikros-gialos`,
      geo: GEO,
    },
    breadcrumbs(t, [[t('nav.area'), '/mikros-gialos']]),
  );

  return (
    <Layout>
      <SEOHead
        title={t('seo.area.title')}
        description={t('seo.area.description')}
        canonicalUrl="/mikros-gialos"
        image={`${SITE}${BAY_IMAGE}`}
        schema={schema}
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">

        {/* Header and the bay: shown as is, they're the top of the page */}
        <div className="max-w-2xl mb-10 md:mb-12">
          <p className="text-wood-deep text-xs font-sans font-semibold uppercase tracking-widest mb-3">{t('area.eyebrow')}</p>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark mb-5">{t('area.title')}</h1>
          <p className="text-gray-600 text-lg leading-relaxed">{t('area.intro')}</p>
        </div>

        <img
          {...responsiveImage(BAY_IMAGE, BAY_IMAGE_SIZES)}
          alt={t('area.bayAlt')}
          className="w-full aspect-[3/2] sm:aspect-[16/9] lg:aspect-[21/9] object-cover object-[70%_50%] rounded-2xl"
          decoding="async"
        />

        {/* On foot */}
        <section className="mt-20 md:mt-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-forest-dark mb-8">{t('area.walk.title')}</h2>
            <ul className="space-y-7">
              {ON_FOOT.map(({ key, icon: Icon }) => (
                <li key={key} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-forest" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-forest-dark">{t(`area.walk.${key}.title`)}</h3>
                    {key === 'beach' && (
                      <p className="text-xs font-sans font-semibold uppercase tracking-wider text-wood-deep mt-1">{formatTrip(PLACES.beach, t)}</p>
                    )}
                    <p className="text-gray-600 leading-relaxed mt-1.5">{t(`area.walk.${key}.desc`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp delay={0.1}>
            <figure>
              <img
                {...responsiveImage(DUSK_IMAGE, DUSK_IMAGE_SIZES)}
                alt={t('area.duskAlt')}
                className="w-full aspect-[4/3] object-cover rounded-2xl"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mt-3 text-sm text-gray-500">{t('area.duskCaption')}</figcaption>
            </figure>
          </FadeUp>
        </section>

        {/* By car */}
        <FadeUp>
          <section className="mt-20 md:mt-28">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-6">
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-forest-dark">{t('area.drive.title')}</h2>
              <p className="text-sm text-gray-500">{t('area.drive.note')}</p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              {BY_CAR.map((id) => (
                <li key={id} className="border-t border-gray-200 py-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-heading text-xl font-semibold text-forest-dark">{t(`place.${id}`)}</h3>
                    <span className="text-sm font-sans font-semibold text-wood-deep whitespace-nowrap">
                      {formatMinutes(PLACES[id].minutes, t)}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-1.5">{t(`area.drive.${id}`)}</p>
                </li>
              ))}
            </ul>
          </section>
        </FadeUp>

        {/* Getting here */}
        <section className="mt-20 md:mt-28 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-forest-dark mb-8">{t('area.getting.title')}</h2>
            <ul className="space-y-7">
              {gettingHere.map(({ key, icon: Icon, values }) => (
                <li key={key} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-forest" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-forest-dark">{t(`area.getting.${key}.title`)}</h3>
                    <p className="text-gray-600 leading-relaxed mt-1.5">{t(`area.getting.${key}.desc`, values)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center gap-2 text-sm font-sans font-semibold text-forest border-b border-forest/30 pb-0.5 hover:border-forest transition-colors"
            >
              {t('area.getting.directions')}
              <span className="text-wood-deep" aria-hidden="true">→</span>
            </a>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-card h-[320px] lg:h-full lg:min-h-[420px]">
              <MapEmbed span={30000} title={t('area.mapTitle')} />
            </div>
          </FadeUp>
        </section>

        {/* CTA */}
        <FadeUp>
          <section className="mt-20 md:mt-28 rounded-2xl bg-forest-dark text-center px-6 py-12 md:p-16">
            <h2 className="font-heading font-light text-sand-light text-display-md mb-8 text-balance">{t('area.cta.title')}</h2>
            <Link
              to={`${localize('/')}#accommodations`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide hover:bg-wood-light hover:shadow-cta transition-all duration-300"
            >
              {t('home.hero.viewAccommodations')}
            </Link>
          </section>
        </FadeUp>

      </div>
    </Layout>
  );
};

export default MikrosGialos;
