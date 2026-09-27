import { useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { differenceInDays, format, isAfter, isBefore, startOfToday } from 'date-fns';
import { m } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import { useAccommodations } from '@/hooks/useAccommodations';
import BookingSummary from '@/components/Booking/BookingSummary';
import ContactSection from '@/components/Booking/ContactSection';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { dateLocale } from '@/lib/dateLocale';
import { ExternalLink, CalendarDays, CalendarX, Users } from 'lucide-react';
import { fromDateParam } from '@/lib/dateParams';
import { useBlockedDates } from '@/hooks/useBlockedDates';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language, localize } = useLanguage();
  const { data: accommodations, isLoading } = useAccommodations();
  // Check the dates again against live availability: the link may be old, or
  // the nights may have been booked since they were picked.
  const knownId = accommodations?.some(acc => acc.id === id) ? id : '';
  const { isStayBlocked, loading: checkingAvailability } = useBlockedDates(knownId ?? '');

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

  const startDate = fromDateParam(startParam);
  const endDate = fromDateParam(endParam);
  const guests = guestsParam ? parseInt(guestsParam) : 1;

  // A stay needs at least one night and can't start in the past.
  if (!accommodation || !startDate || !endDate || !isAfter(endDate, startDate) || isBefore(startDate, startOfToday())) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-forest-dark mb-4">{t('booking.missingInfo')}</h1>
            <p className="text-gray-500 mb-8">{t('booking.selectFirst')}</p>
            <button onClick={() => navigate(localize('/'))} className="px-6 py-3 rounded-full bg-forest text-white font-sans font-semibold text-sm hover:bg-forest-dark transition-colors">
              {t('detail.returnHome')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const nights = differenceInDays(endDate, startDate);
  const datesTaken = !checkingAvailability && isStayBlocked(startDate, endDate);
  const accommodationName = accommodation.type === 'house' ? t('accommodation.woodenHouse') : t('accommodation.glampingTent');

  return (
    <Layout>
      <SEOHead
        title={t('seo.booking.title')}
        description={t('seo.booking.description')}
        robots="noindex, nofollow"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">

        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <p className="text-wood-deep text-xs font-sans font-semibold uppercase tracking-widest mb-2">
            {t('booking.step2')}
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark mb-4">
            {t('booking.pageTitle')}
          </h1>

          {/* Trip pill summary */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-forest/5 rounded-full text-sm text-forest-dark">
              <CalendarDays className="h-4 w-4 text-forest/60" />
              <span>{format(startDate, 'dd MMM', { locale: dateLocale(language) })} → {format(endDate, 'dd MMM yyyy', { locale: dateLocale(language) })}</span>
              <span className="text-gray-500">·</span>
              <span>{t('common.nights', { count: nights })}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-forest/5 rounded-full text-sm text-forest-dark">
              <Users className="h-4 w-4 text-forest/60" />
              <span>{t('common.guests', { count: guests })}</span>
            </div>
            <div className="px-4 py-2 bg-wood/10 rounded-full text-sm text-wood-deep font-semibold">
              {accommodationName}
            </div>
          </div>

          {datesTaken && (
            <div role="alert" className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <CalendarX className="h-4 w-4 shrink-0" />
              <span className="flex-1 min-w-[12rem]">{t('booking.datesTaken')}</span>
              <Link
                to={localize(`/accommodation/${accommodation.id}`)}
                className="font-semibold underline underline-offset-2 hover:text-red-900"
              >
                {t('booking.chooseOtherDates')}
              </Link>
            </div>
          )}
        </m.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left — contact (email + WhatsApp) */}
          <m.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <ContactSection />
          </m.div>

          {/* Right — summary + direct booking nudge */}
          <m.div
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
              <p className="text-xs font-sans font-semibold uppercase tracking-widest text-gray-500 mb-3">
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
          </m.div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
