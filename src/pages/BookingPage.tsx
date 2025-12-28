import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import Layout from '@/components/Layout/Layout';
import { accommodations } from '@/data/accommodations';
import { Button } from '@/components/ui/button';
import BookingSummary from '@/components/Booking/BookingSummary';
import ContactSection from '@/components/Booking/ContactSection';
import { format, eachDayOfInterval } from 'date-fns';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const accommodation = accommodations.find(acc => acc.id === id);
  
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const guestsParam = searchParams.get('guests');
  const tentParam = searchParams.get('tent');
  
  const startDate = startParam ? new Date(startParam) : undefined;
  const endDate = endParam ? new Date(endParam) : undefined;
  const guests = guestsParam ? parseInt(guestsParam) : 1;
  const selectedTent = tentParam || "1";
  
  const isGlampingTent = id === 'glamping-tent';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (!accommodation || !startDate || !endDate) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">{t('booking.missingInfo')}</h1>
          <p className="mb-8">{t('booking.selectFirst')}</p>
          <Button onClick={() => navigate('/')} className="bg-sea hover:bg-sea-dark">
            {t('detail.returnHome')}
          </Button>
        </div>
      </Layout>
    );
  }
  
  const nights = differenceInDays(endDate!, startDate!);
  const totalPrice = (startDate && endDate)
  ? eachDayOfInterval({ start: startDate, end: new Date(endDate.getTime() - 86400000) })
      .reduce((sum, date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dailyPrice = accommodation.dailyPricing?.[dateStr] ?? accommodation.price;
        return sum + dailyPrice;
      }, 0)
  : 0;
  
  const getAccommodationDisplayName = () => {
    if (isGlampingTent) {
      return `${accommodation.name} (${t('booking.tent')} ${selectedTent})`;
    }
    return accommodation.name;
  };

  const bookingSchema = {
    "@context": "https://schema.org",
    "@type": "ReservationAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `https://metaxasretreats.com/booking/${id}`,
      "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
    },
    "object": {
      "@type": "LodgingReservation",
      "reservationFor": {
        "@type": "LodgingBusiness",
        "name": accommodation.name,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Mikros Gialos, Lefkada",
          "addressCountry": "GR"
        }
      }
    }
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-sea-dark">
          {t('booking.pageTitle')}
        </h1>
        <p className="mb-8 text-gray-600">
          {t('booking.pageSubtitle')}
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContactSection />
          </div>
          
          <div>
            <BookingSummary
              accommodation={accommodation}
              startDate={startDate}
              endDate={endDate}
              guests={guests}
              nights={nights}
              totalPrice={totalPrice}
              selectedTent={isGlampingTent ? selectedTent : undefined}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
