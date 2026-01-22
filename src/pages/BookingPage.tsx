import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import Layout from '@/components/Layout/Layout';
import { accommodations } from '@/data/accommodations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BookingSummary from '@/components/Booking/BookingSummary';
import ContactSection from '@/components/Booking/ContactSection';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

  const bookingSchema = {
    "@context": "https://schema.org",
    "@type": "ReservationAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `https://metaxasretreats.gr/booking/${id}`,
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
        <p className="mb-8 text-muted-foreground">
          {t('booking.pageSubtitle')}
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Contact Card */}
          <ContactSection />
          
          {/* Right: Summary Card */}
          <Card className="h-full flex flex-col">
            <CardContent className="p-6 flex flex-col h-full">
              {/* Booking Summary */}
              <BookingSummary
                accommodation={accommodation}
                startDate={startDate}
                endDate={endDate}
                guests={guests}
                nights={nights}
                selectedTent={isGlampingTent ? selectedTent : undefined}
              />
              
              <Separator className="my-6" />
              
              {/* Save ~15% Banner */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-800 text-lg">{t('booking.saveDiscount')}</p>
                <p className="text-green-700 text-sm">{t('booking.discountDescription')}</p>
              </div>
              
              <Separator className="my-6" />
              
              {/* Also available on */}
              <div className="text-sm text-muted-foreground mt-auto">
                <p className="mb-2">{t('booking.alsoAvailable')}</p>
                <div className="flex gap-4">
                  <a 
                    href="https://www.airbnb.gr/rooms/936140564087838043?source_impression_id=p3_1745246045_P32OFwyiKEHNkXyt" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-foreground hover:text-sea transition-colors"
                  >
                    <span>Airbnb</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                  <a 
                    href="https://www.booking.com/hotel/gr/metaxaki.el.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-foreground hover:text-sea transition-colors"
                  >
                    <span>Booking.com</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
