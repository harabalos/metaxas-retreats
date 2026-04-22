import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, BedDouble, Bath, Wifi, Wind, Car, Waves, Sun, Coffee, TreePine, UtensilsCrossed, ChevronLeft, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import { useAccommodations } from '@/hooks/useAccommodations';
import AccommodationGallery from '@/components/Accommodations/AccommodationGallery';
import BookingForm from '@/components/Booking/BookingForm';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

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

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

const AccommodationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data: accommodations, isLoading } = useAccommodations();

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

  if (!accommodation) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-heading font-semibold text-forest-dark mb-4">{t('detail.notFound')}</h1>
            <p className="text-gray-500 mb-8">{t('detail.notFoundText')}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-full bg-forest text-white font-sans font-semibold text-sm hover:bg-forest-dark transition-colors"
            >
              {t('detail.returnHome')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ─── Schema ──────────────────────────────────────────────────────────────
  const accommodationSchema = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "name": `${accommodation.name} - Metaxas Retreats Lefkada`,
    "description": accommodation.description,
    "url": `https://metaxasretreats.gr/accommodation/${accommodation.id}`,
    "image": accommodation.images.map(img => `https://metaxasretreats.gr${img}`),
    "numberOfRooms": accommodation.bedrooms,
    "occupancy": { "@type": "QuantitativeValue", "maxValue": accommodation.guests },
    "numberOfBedrooms": accommodation.bedrooms,
    "numberOfBathroomsTotal": accommodation.bathrooms,
    "petsAllowed": false,
    "amenityFeature": accommodation.amenities.map(a => ({ "@type": "LocationFeatureSpecification", "name": a, "value": true })),
    "address": { "@type": "PostalAddress", "streetAddress": "Mikros Gialos, Poros", "addressLocality": "Lefkada", "addressRegion": "Ionian Islands", "addressCountry": "GR" },
    "geo": { "@type": "GeoCoordinates", "latitude": "38.640048", "longitude": "20.698988" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "bestRating": "5", "worstRating": "1" },
    "offers": { "@type": "Offer", "availability": "https://schema.org/InStock", "url": `https://metaxasretreats.gr/accommodation/${accommodation.id}` },
    "potentialAction": { "@type": "ReserveAction", "target": { "@type": "EntryPoint", "urlTemplate": `https://metaxasretreats.gr/booking/${accommodation.id}?startDate={checkInDate}&endDate={checkOutDate}&guests={guests}`, "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] }, "result": { "@type": "LodgingReservation", "name": `Book ${accommodation.name}` } }
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://metaxasretreats.gr/" },
      { "@type": "ListItem", "position": 2, "name": "Accommodations", "item": "https://metaxasretreats.gr/#accommodations" },
      { "@type": "ListItem", "position": 3, "name": accommodation.name, "item": `https://metaxasretreats.gr/accommodation/${accommodation.id}` }
    ]
  };

  // ─── SEO ─────────────────────────────────────────────────────────────────
  const seoTitle = language === 'el'
    ? (accommodation.type === 'house' ? "Ξύλινο Σπίτι με Θέα Θάλασσα | Camping & Glamping Λευκάδα" : "Πολυτελής Σκηνή Glamping | Camping Λευκάδα Ελλάδα")
    : (accommodation.type === 'house' ? "Wooden House Sea View | Lefkada Camping & Glamping Greece" : "Luxury Glamping Tent | Camping Lefkada Greece - Best Accommodation");

  const seoDescription = language === 'el'
    ? (accommodation.type === 'house'
      ? `Κάντε κράτηση στο γοητευτικό ξύλινο σπίτι μας στη Λευκάδα. Θέα στον κόλπο του Μικρού Γιαλού, χωρητικότητα ${accommodation.guests} ατόμων, 50μ από την παραλία.`
      : `Premium σκηνή glamping στη Λευκάδα - πολυτελής κατασκήνωση ανάμεσα σε ελαιόδεντρα. Χωρητικότητα ${accommodation.guests} ατόμων, θέα θάλασσα, κλιματισμός.`)
    : (accommodation.type === 'house'
      ? `Book our charming wooden house in Lefkada, Greece. Sea views over Mikros Gialos bay, sleeps ${accommodation.guests}, 50m from beach. Best camping & glamping accommodation.`
      : `Premium glamping tent in Lefkada, Greece - luxury camping among olive trees. Sleeps ${accommodation.guests}, sea views, A/C. Best glamping in Greece. Book direct!`);

  const accommodationName = accommodation.type === 'house' ? t('accommodation.woodenHouse') : t('accommodation.glampingTent');
  const accommodationDescription = accommodation.type === 'house' ? t('accommodation.woodenHouse.description') : t('accommodation.glampingTent.description');
  const nickname = accommodation.id === 'wooden-house' ? 'Metaxaki' : 'Metaxoula';

  const stats = [
    { icon: Users, label: `${accommodation.guests} ${t('detail.guests')}` },
    { icon: BedDouble, label: `${accommodation.bedrooms} ${t('detail.bedrooms')}` },
    { icon: BedDouble, label: `${accommodation.beds} ${t('detail.beds')}` },
    { icon: Bath, label: `${accommodation.bathrooms} ${t('detail.bathrooms')}` },
  ];

  return (
    <Layout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={`/accommodation/${accommodation.id}`}
        image={`https://metaxasretreats.gr${accommodation.images[0]}`}
        schema={[accommodationSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">

        {/* Breadcrumb */}
        <FadeUp>
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" onClick={() => window.scrollTo(0,0)} className="hover:text-forest transition-colors">
              {t('nav.home')}
            </Link>
            <span>/</span>
            <span className="text-forest-dark font-medium">{accommodationName}</span>
          </nav>
        </FadeUp>

        {/* Header */}
        <FadeUp delay={0.05}>
          <div className="mb-8">
            <p className="text-wood text-sm font-sans font-semibold uppercase tracking-widest mb-2">{nickname}</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark leading-tight mb-4">
              {accommodationName}
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
            <FadeUp delay={0.1}>
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
                      <motion.div
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
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </FadeUp>

            {/* Location note */}
            <FadeUp delay={0.25}>
              <div className="mt-10 pt-10 border-t border-gray-100">
                <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">
                  {language === 'el' ? 'Τοποθεσία' : 'Location'}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {language === 'el'
                    ? 'Μικρός Γιαλός, Πόρος, Λευκάδα, Ελλάδα — 50μ από την παραλία, ανάμεσα σε ελαιόδεντρα με θέα στον κόλπο.'
                    : 'Mikros Gialos, Poros, Lefkada, Greece — 50m from the beach, nestled among olive trees with bay views.'}
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
                    {language === 'el'
                      ? '🏷️ Κάντε κράτηση απευθείας και εξοικονομήστε — χωρίς προμήθεια πλατφόρμας.'
                      : '🏷️ Book direct & save — no platform fees.'}
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile sticky "Book Direct" ribbon ───────────────────────────── */}
      {/* Visible only on mobile (lg hides the sidebar widget anyway) */}
      <motion.div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-5 py-3 flex items-center justify-between gap-4"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 22 }}
      >
        <div>
          <p className="text-xs text-wood font-sans font-semibold uppercase tracking-widest">
            {language === 'el' ? 'Απευθείας Κράτηση' : 'Book Direct'}
          </p>
          <p className="text-xs text-gray-400">
            {language === 'el' ? 'Εξοικονομήστε χωρίς προμήθεια' : 'Save — no platform fees'}
          </p>
        </div>
        <Link
          to="/contact"
          onClick={() => window.scrollTo(0, 0)}
          className="btn-shimmer flex-shrink-0 px-6 py-2.5 rounded-full bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide hover:bg-wood-light transition-colors"
        >
          <CalendarDays className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
          {language === 'el' ? 'Κράτηση' : 'Book Now'}
        </Link>
      </motion.div>
    </Layout>
  );
};

export default AccommodationDetail;
