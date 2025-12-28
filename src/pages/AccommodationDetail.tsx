import { useParams, useNavigate } from 'react-router-dom';
import { Home, Tent, Users, BedDouble, Bath, Coffee } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { accommodations } from '@/data/accommodations';
import AccommodationGallery from '@/components/Accommodations/AccommodationGallery';
import BookingForm from '@/components/Booking/BookingForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const AccommodationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const accommodation = accommodations.find(acc => acc.id === id);
  
  if (!accommodation) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">{t('detail.notFound')}</h1>
          <p className="mb-8">{t('detail.notFoundText')}</p>
          <Button onClick={() => navigate('/')} className="bg-sea hover:bg-sea-dark">
            {t('detail.returnHome')}
          </Button>
        </div>
      </Layout>
    );
  }

  // Schema for VacationRental with AggregateRating, Reviews, Offer, and BookAction
  const accommodationSchema = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "name": `${accommodation.name} - Metaxas Retreats Lefkada`,
    "description": accommodation.description,
    "url": `https://metaxasretreats.com/accommodation/${accommodation.id}`,
    "image": accommodation.images.map(img => `https://metaxasretreats.com${img}`),
    "numberOfRooms": accommodation.bedrooms,
    "occupancy": {
      "@type": "QuantitativeValue",
      "maxValue": accommodation.guests
    },
    "numberOfBedrooms": accommodation.bedrooms,
    "numberOfBathroomsTotal": accommodation.bathrooms,
    "petsAllowed": false,
    "amenityFeature": accommodation.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    })),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mikros Gialos, Poros",
      "addressLocality": "Lefkada",
      "addressRegion": "Ionian Islands",
      "addressCountry": "GR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "38.640048",
      "longitude": "20.698988"
    },
    // AggregateRating for reviews
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "47",
      "bestRating": "5",
      "worstRating": "1"
    },
    // Sample reviews for rich snippets
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Maria S."
        },
        "datePublished": "2024-08-15",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Absolutely stunning location! The views of Mikros Gialos bay are breathtaking. Perfect for a relaxing Greek island getaway."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Thomas K."
        },
        "datePublished": "2024-07-22",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Best glamping experience in Greece! Clean, comfortable, and the beach is just a short walk away. Highly recommend!"
      }
    ],
    // Offer schema with pricing
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "50",
      "highPrice": accommodation.type === 'house' ? "140" : "120",
      "offerCount": "1",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "url": `https://metaxasretreats.com/accommodation/${accommodation.id}`
    },
    // BookAction for direct booking in search results
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://metaxasretreats.com/booking/${accommodation.id}?startDate={checkInDate}&endDate={checkOutDate}&guests={guests}`,
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "LodgingReservation",
        "name": `Book ${accommodation.name}`
      }
    }
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://metaxasretreats.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Accommodations",
        "item": "https://metaxasretreats.com/#accommodations"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": accommodation.name,
        "item": `https://metaxasretreats.com/accommodation/${accommodation.id}`
      }
    ]
  };

  // Combined schemas
  const combinedSchema = [accommodationSchema, breadcrumbSchema];

  // Enhanced SEO with camping/glamping keywords - bilingual
  const seoTitle = language === 'el'
    ? (accommodation.type === 'house' 
      ? "Ξύλινο Σπίτι με Θέα Θάλασσα | Camping & Glamping Λευκάδα"
      : "Πολυτελής Σκηνή Glamping | Camping Λευκάδα Ελλάδα")
    : (accommodation.type === 'house' 
      ? "Wooden House Sea View | Lefkada Camping & Glamping Greece"
      : "Luxury Glamping Tent | Camping Lefkada Greece - Best Accommodation");
  
  const seoDescription = language === 'el'
    ? (accommodation.type === 'house'
      ? `Κάντε κράτηση στο γοητευτικό ξύλινο σπίτι μας στη Λευκάδα. Θέα στον κόλπο του Μικρού Γιαλού, χωρητικότητα ${accommodation.guests} ατόμων, 50μ από την παραλία. Από €${accommodation.price}/βράδυ.`
      : `Premium σκηνή glamping στη Λευκάδα - πολυτελής κατασκήνωση ανάμεσα σε ελαιόδεντρα. Χωρητικότητα ${accommodation.guests} ατόμων, θέα θάλασσα, κλιματισμός. Από €${accommodation.price}/βράδυ.`)
    : (accommodation.type === 'house'
      ? `Book our charming wooden house in Lefkada, Greece. Sea views over Mikros Gialos bay, sleeps ${accommodation.guests}, 50m from beach. Best camping & glamping accommodation from €${accommodation.price}/night.`
      : `Premium glamping tent in Lefkada, Greece - luxury camping among olive trees. Sleeps ${accommodation.guests}, sea views, A/C. Best glamping Greece from €${accommodation.price}/night. Book direct!`);

  // Get translated accommodation name and description
  const accommodationName = accommodation.type === 'house' 
    ? t('accommodation.woodenHouse')
    : t('accommodation.glampingTent');
  
  const accommodationDescription = accommodation.type === 'house'
    ? t('accommodation.woodenHouse.description')
    : t('accommodation.glampingTent.description');

  return (
    <Layout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={`/accommodation/${accommodation.id}`}
        image={`https://metaxasretreats.com${accommodation.images[0]}`}
        schema={combinedSchema}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Accommodation name and type */}
        <div className="flex items-center mb-6">
          <div className="mr-3">
            {accommodation?.type === 'house' ? (
              <Home className="h-6 w-6 text-forest" />
            ) : (
              <Tent className="h-6 w-6 text-olive" />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-forest-dark">
            {accommodationName}
          </h1>
        </div>
        
        {/* Main content with optimized loading */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow lg:max-w-4xl">
            {/* Gallery with lazy loading */}
            <div className="mb-8">
              <AccommodationGallery 
                images={accommodation?.images || []} 
                name={accommodationName} 
              />
            </div>
            
            <div className="mt-4">
              {/* Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-semibold mb-4 text-forest-dark">
                  {t('detail.about')}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {accommodationDescription}
                </p>
              </div>
              
              {/* Features */}
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-semibold mb-4 text-forest-dark">
                  {t('detail.features')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-forest mr-2" />
                    <span>{accommodation?.guests} {t('detail.guests')}</span>
                  </div>
                  <div className="flex items-center">
                    <BedDouble className="h-5 w-5 text-forest mr-2" />
                    <span>{accommodation?.bedrooms} {t('detail.bedrooms')}</span>
                  </div>
                  <div className="flex items-center">
                    <BedDouble className="h-5 w-5 text-forest mr-2" />
                    <span>{accommodation?.beds} {t('detail.beds')}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 text-forest mr-2" />
                    <span>{accommodation?.bathrooms} {t('detail.bathrooms')}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-semibold mb-4 text-forest-dark">
                  {t('detail.amenities')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accommodation?.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Coffee className="h-5 w-5 text-forest mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking form */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <BookingForm accommodation={accommodation} isDetail={true} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccommodationDetail;
