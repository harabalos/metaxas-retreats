import { useParams, Link, Navigate } from 'react-router-dom';
import { Users, BedDouble, Bath, Wifi, Wind, Car, Waves, Sun, Coffee, TreePine, UtensilsCrossed, ChevronLeft, CalendarDays } from 'lucide-react';
import { m } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import { useAccommodations } from '@/hooks/useAccommodations';
import AccommodationGallery from '@/components/Accommodations/AccommodationGallery';
import BookingForm from '@/components/Booking/BookingForm';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import NotFound from '@/pages/NotFound';
import { accommodationNode, breadcrumbs, business, graph } from '@/lib/schema';
import FadeUp from '@/components/FadeUp';

// Map amenity string → icon
const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Sea view': Waves,
  'Parking': Car,
  '50m from the beach': Waves,
  'Air conditioning': Wind,
  'Air Conditioning': Wind,
  'Fully equipped kitchen': UtensilsCrossed,
  'High-speed Wi-Fi': Wifi,
  'Private terrace': Sun,
  'Outdoor dining area': UtensilsCrossed,
  'Washing machine': Coffee,
  'Ramp access': ChevronLeft,
  'Private outdoor seating': TreePine,
  'Eco-friendly amenities': TreePine,
};

const AMENITY_KEY_MAP: Record<string, string> = {
  'Sea view': 'amenity.seaView',
  'Parking': 'amenity.parking',
  '50m from the beach': 'amenity.beachDistance',
  'Air conditioning': 'amenity.airConditioning',
  'Air Conditioning': 'amenity.airConditioning',
  'Fully equipped kitchen': 'amenity.kitchen',
  'High-speed Wi-Fi': 'amenity.wifi',
  'Private terrace': 'amenity.terrace',
  'Outdoor dining area': 'amenity.outdoorDining',
  'Washing machine': 'amenity.washingMachine',
  'Ramp access': 'amenity.rampAccess',
  'Private outdoor seating': 'amenity.outdoorSeating',
  'Eco-friendly amenities': 'amenity.ecoFriendly',
};

const AccommodationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, localize } = useLanguage();
  const { data: accommodations, isLoading } = useAccommodations();

  // The two identical tents are now one merged listing — redirect old URLs.
  if (id === 'glamping-tent-1' || id === 'glamping-tent-2') {
    return <Navigate to={localize('/accommodation/glamping-tent')} replace />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="space-y-4 text-center">
            {/* Skeleton pulse */}
            <div className="w-16 h-16 rounded-full bg-forest/10 animate-pulse mx-auto" />
            <div className="h-4 w-32 bg-forest/10 rounded animate-pulse mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  const accommodation = accommodations?.find(acc => acc.id === id);

  // Same page as any unknown URL, which Vercel serves as the prerendered 404.
  if (!accommodation) {
    return <NotFound />;
  }

  // ─── SEO ─────────────────────────────────────────────────────────────────
  const unitKey = accommodation.type === 'house' ? 'woodenHouse' : 'glampingTent';
  const seoTitle = t(`seo.${unitKey}.title`);
  const seoDescription = t(`seo.${unitKey}.description`);

  const accommodationName = accommodation.type === 'house' ? t('accommodation.woodenHouse') : t('accommodation.glampingTent');
  const accommodationDescription = accommodation.type === 'house' ? t('accommodation.woodenHouse.description') : t('accommodation.glampingTent.description');
  const schema = graph(
    business(t),
    accommodationNode(accommodation, accommodationName, accommodationDescription),
    breadcrumbs(t, [[accommodationName, `/accommodation/${accommodation.id}`]]),
  );
  const nickname = accommodation.id === 'wooden-house' ? 'Metaxaki' : 'Metaxoula';

  const stats = [
    { icon: Users, label: t('common.guests', { count: accommodation.guests }) },
    { icon: BedDouble, label: t('common.bedrooms', { count: accommodation.bedrooms }) },
    { icon: BedDouble, label: t('common.beds', { count: accommodation.beds }) },
    { icon: Bath, label: t('common.bathrooms', { count: accommodation.bathrooms }) },
  ];

  return (
    <Layout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={`/accommodation/${accommodation.id}`}
        image={`https://www.metaxasretreats.gr${accommodation.images[0]}`}
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">

        {/* Breadcrumb */}
        <FadeUp eager>
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to={localize('/')} onClick={() => window.scrollTo(0,0)} className="hover:text-forest transition-colors">
              {t('nav.home')}
            </Link>
            <span>/</span>
            <span className="text-forest-dark font-medium">{accommodationName}</span>
          </nav>
        </FadeUp>

        {/* Header */}
        <FadeUp eager>
          <div className="mb-8">
            <p className="text-wood-deep text-sm font-sans font-semibold uppercase tracking-widest mb-2">{nickname}</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark leading-tight mb-4">
              {t(`detail.h1.${unitKey}`)}
            </h1>
            {/* Quick stat pills */}
            <div className="flex flex-wrap gap-3">
              {stats.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-forest/5 rounded-full text-sm text-forest-dark">
                  <Icon className="h-3.5 w-3.5 text-forest/60" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Main layout: gallery + sidebar */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* Left: gallery + details */}
          <div className="flex-1 min-w-0">
            <FadeUp eager>
              <AccommodationGallery images={accommodation.images} name={accommodationName} />
            </FadeUp>

            {/* About */}
            <FadeUp delay={0.15}>
              <div className="mt-12 pt-10 border-t border-gray-100">
                <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">
                  {t('detail.about')}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {accommodationDescription}
                </p>
              </div>
            </FadeUp>

            {/* Amenities */}
            <FadeUp delay={0.2}>
              <div className="mt-10 pt-10 border-t border-gray-100">
                <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-6">
                  {t('detail.amenities')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accommodation.amenities.map((amenity, i) => {
                    const Icon = AMENITY_ICONS[amenity] || Coffee;
                    const key = AMENITY_KEY_MAP[amenity];
                    const label = key ? t(key) : amenity;
                    return (
                      <m.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-forest/4 hover:bg-forest/8 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 text-forest" />
                        </div>
                        <span className="text-sm text-gray-700">{label}</span>
                      </m.div>
                    );
                  })}
                </div>
              </div>
            </FadeUp>

            {/* Location note */}
            <FadeUp delay={0.25}>
              <div className="mt-10 pt-10 border-t border-gray-100">
                <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">
                  {t('detail.location')}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('detail.locationText')}
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Right: sticky booking widget */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-24">
              <FadeUp delay={0.2}>
                <BookingForm accommodation={accommodation} isDetail={true} />
              </FadeUp>

              {/* Direct booking note */}
              <FadeUp delay={0.3}>
                <div className="mt-4 p-4 rounded-xl bg-wood/8 border border-wood/20 text-center">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t('detail.bookDirectNote')}
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile sticky "Book Direct" ribbon ───────────────────────────── */}
      {/* Visible only on mobile (lg hides the sidebar widget anyway) */}
      <m.div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-5 py-3 flex items-center justify-between gap-4"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 22 }}
      >
        <div>
          <p className="text-xs text-wood-deep font-sans font-semibold uppercase tracking-widest">
            {t('detail.ribbon.title')}
          </p>
          <p className="text-xs text-gray-500">
            {t('detail.ribbon.subtitle')}
          </p>
        </div>
        <Link
          to={localize('/contact')}
          onClick={() => window.scrollTo(0, 0)}
          className="btn-shimmer flex-shrink-0 px-6 py-2.5 rounded-full bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide hover:bg-wood-light transition-colors"
        >
          <CalendarDays className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
          {t('nav.bookNow')}
        </Link>
      </m.div>
    </Layout>
  );
};

export default AccommodationDetail;
