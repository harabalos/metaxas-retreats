import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import Layout from '@/components/Layout/Layout';
import { accommodations } from '@/data/accommodations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import BookingSummary from '@/components/Booking/BookingSummary';
import ContactSection from '@/components/Booking/ContactSection';
import { format, eachDayOfInterval } from 'date-fns';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { ExternalLink, Phone, MessageCircle } from 'lucide-react';

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
  const formatDateDisplay = (date: Date) => format(date, 'dd/MM/yyyy');
  
  const getAccommodationDisplayName = () => {
    if (isGlampingTent) {
      return `${accommodation.name} (${t('booking.tent')} ${selectedTent})`;
    }
    return accommodation.name;
  };

  const getWhatsAppMessage = () => {
    const checkIn = startDate ? formatDateDisplay(startDate) : '';
    const checkOut = endDate ? formatDateDisplay(endDate) : '';
    const accName = getAccommodationDisplayName();
    const message = language === 'el'
      ? `Γεια σας! Ενδιαφέρομαι για κράτηση στο ${accName}.\n\nΆφιξη: ${checkIn}\nΑναχώρηση: ${checkOut}\nΕπισκέπτες: ${guests}`
      : `Hello! I'm interested in booking ${accName}.\n\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}`;
    return encodeURIComponent(message);
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Email Form + WhatsApp */}
          <ContactSection />
          
          {/* Right: WhatsApp + Booking Summary + Save 15% */}
          <div className="space-y-6">
            {/* WhatsApp Contact */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="flex items-center gap-2 font-semibold">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  {t('booking.callWhatsapp')}
                </h3>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <a 
                  href={`https://wa.me/306973219980?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                >
                  <div className="bg-green-500 p-2 rounded-full">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">+30 6973219980</p>
                    <p className="text-sm text-green-600">{language === 'el' ? 'Πατήστε για WhatsApp' : 'Tap for WhatsApp'}</p>
                  </div>
                </a>
                
                <a 
                  href={`https://wa.me/306980429891?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                >
                  <div className="bg-green-500 p-2 rounded-full">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">+30 6980429891</p>
                    <p className="text-sm text-green-600">{language === 'el' ? 'Πατήστε για WhatsApp' : 'Tap for WhatsApp'}</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <BookingSummary
              accommodation={accommodation}
              startDate={startDate}
              endDate={endDate}
              guests={guests}
              nights={nights}
              totalPrice={totalPrice}
              selectedTent={isGlampingTent ? selectedTent : undefined}
            />
            
            {/* Save ~15% Banner */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <p className="font-semibold text-green-800 text-lg">{t('booking.saveDiscount')}</p>
                <p className="text-green-700">{t('booking.discountDescription')}</p>
              </CardContent>
            </Card>
            
            {/* Also available on */}
            <div className="text-sm text-muted-foreground">
              <p>{t('booking.alsoAvailable')}</p>
              <div className="flex space-x-4 mt-2">
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
