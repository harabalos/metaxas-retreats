import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { differenceInDays, format } from 'date-fns';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import { useAccommodations } from '@/hooks/useAccommodations';
import BookingSummary from '@/components/Booking/BookingSummary';
import ContactSection from '@/components/Booking/ContactSection';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { ExternalLink, CalendarDays, Users } from 'lucide-react';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data: accommodations, isLoading } = useAccommodations();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-forest/10 animate-pulse" />
        </div>
      </Layout>
    );
  }

  const accommodation = accommodations?.find(acc => acc.id === id);

  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const guestsParam = searchParams.get('guests');
  const tentParam = searchParams.get('tent');

  const startDate = startParam ? new Date(startParam) : undefined;
  const endDate = endParam ? new Date(endParam) : undefined;
  const guests = guestsParam ? parseInt(guestsParam) : 1;
  const selectedTent = tentParam || '1';
  const isGlampingTent = id === 'glamping-tent';

  if (!accommodation || !startDate || !endDate) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-forest-dark mb-4">{t('booking.missingInfo')}</h1>
            <p className="text-gray-500 mb-8">{t('booking.selectFirst')}</p>
            <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full bg-forest text-white font-sans font-semibold text-sm hover:bg-forest-dark transition-colors">
              {t('detail.returnHome')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const nights = differenceInDays(endDate, startDate);
  const accommodationName = accommodation.type === 'house' ? t('accommodation.woodenHouse') : t('accommodation.glampingTent');

  const bookingSchema = {
    "@context": "https://schema.org",
    "@type": "ReservationAction",
    "target": { "@type": "EntryPoint", "urlTemplate": `https://metaxasretreats.gr/booking/${id}`, "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] },
    "object": { "@type": "LodgingReservation", "reservationFor": { "@type": "LodgingBusiness", "name": accommodation.name, "address": { "@type": "PostalAddress", "addressLocality": "Mikros Gialos, Lefkada", "addressCountry": "GR" } } }
  };

  return (
    <Layout>
      <SEOHead
        title={`Book ${accommodation.name} - Metaxas Retreats`}
        titleEl={`Κράτηση ${language === 'el' ? t(`accommodation.${id === 'wooden-house' ? 'woodenHouse' : 'glampingTent'}`) : accommodation.name} - Metaxas Retreats`}
        description={`Book your stay at ${accommodation.name} in Mikros Gialos, Lefkada. Direct booking saves 15% compared to Airbnb/Booking.com.`}
        descriptionEl={`Κάντε κράτηση στο ${t(`accommodation.${id === 'wooden-house' ? 'woodenHouse' : 'glampingTent'}`)} στον Μικρό Γιαλό, Λευκάδα. Απευθείας κράτηση με 15% έκπτωση.`}
        canonicalUrl={`/booking/${id}`}
        schema={bookingSchema}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <p className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-2">
            {language === 'el' ? 'Βήμα 2 — Επικοινωνία' : 'Step 2 — Contact'}
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark mb-4">
            {t('booking.pageTitle')}
          </h1>

          {/* Trip pill summary */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-forest/5 rounded-full text-sm text-forest-dark">
              <CalendarDays className="h-4 w-4 text-forest/60" />
              <span>{format(startDate, 'dd MMM')} → {format(endDate, 'dd MMM yyyy')}</span>
              <span className="text-gray-400">·</span>
              <span>{nights} {language === 'el' ? 'νύχτες' : 'nights'}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-forest/5 rounded-full text-sm text-forest-dark">
              <Users className="h-4 w-4 text-forest/60" />
              <span>{guests} {language === 'el' ? 'επισκέπτες' : 'guests'}</span>
            </div>
            <div className="px-4 py-2 bg-wood/10 rounded-full text-sm text-wood font-semibold">
              {accommodationName}
              {isGlampingTent && ` · Tent ${selectedTent}`}
            </div>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left — contact (email + WhatsApp) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <ContactSection />
          </motion.div>

          {/* Right — summary + direct booking nudge */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="space-y-5"
          >
            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <BookingSummary
                accommodation={accommodation}
                startDate={startDate}
                endDate={endDate}
                guests={guests}
                nights={nights}
                selectedTent={isGlampingTent ? selectedTent : undefined}
              />
            </div>

            {/* Save banner */}
            <div className="rounded-2xl bg-gradient-to-br from-forest/8 to-wood/8 border border-wood/20 p-5">
              <p className="font-heading font-semibold text-forest-dark text-lg mb-1">
                {t('booking.saveDiscount')}
              </p>
              <p className="text-gray-600 text-sm">{t('booking.discountDescription')}</p>
            </div>

            {/* Also available on */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {t('booking.alsoAvailable')}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.airbnb.gr/rooms/936140564087838043"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-forest transition-colors"
                >
                  Airbnb <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://www.booking.com/hotel/gr/metaxaki.el.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-forest transition-colors"
                >
                  Booking.com <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
