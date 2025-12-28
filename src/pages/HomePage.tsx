import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowDown, Tent, Home } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import AccommodationCard from '@/components/Accommodations/AccommodationCard';
import { accommodations } from '@/data/accommodations';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const HomePage = () => {
  const location = useLocation();
  const accommodationsRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const scrollToAccommodations = () => {
    accommodationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (location.search.includes('scrollToAccommodations=true')) {
      setTimeout(() => scrollToAccommodations(), 100);
    }
  }, [location]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch (e) {} };
  }, []);

  // Campground/LodgingBusiness schema for homepage
  const campgroundSchema = {
    "@context": "https://schema.org",
    "@type": ["Campground", "LodgingBusiness"],
    "name": "Metaxas Retreats",
    "alternateName": language === 'el' ? "Μεταξάς Ριτρίτς" : undefined,
    "description": language === 'el' 
      ? "Πολυτελές glamping και κάμπινγκ στη Λευκάδα, Ελλάδα. Ξύλινο σπίτι και σκηνές glamping με θέα στη θάλασσα στον κόλπο του Μικρού Γιαλού."
      : "Luxury glamping and camping in Lefkada, Greece. Wooden house and glamping tents with sea views in Mikros Gialos bay.",
    "url": "https://metaxasretreats.com",
    "telephone": "+306972073025",
    "email": "info@metaxasretreats.com",
    "image": [
      "https://metaxasretreats.com/assets/glamping-tent/view.jpg",
      "https://metaxasretreats.com/assets/glamping-tent/prosopsi.jpg",
      "https://metaxasretreats.com/assets/e9f9bd84-9f74-4189-bf30-d6640a566fd3.jpg"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mikros Gialos, Poros",
      "addressLocality": "Lefkada",
      "addressRegion": "Ionian Islands",
      "postalCode": "31082",
      "addressCountry": "GR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "38.640048",
      "longitude": "20.698988"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Sea View", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Beach Access", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Kitchen", "value": true }
    ],
    "priceRange": "€50 - €140",
    "checkinTime": "15:00",
    "checkoutTime": "11:00",
    "petsAllowed": false,
    "starRating": {
      "@type": "Rating",
      "ratingValue": "4"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "47",
      "bestRating": "5",
      "worstRating": "1"
    },
    "hasMap": "https://maps.google.com/?q=38.640048,20.698988",
    "containsPlace": [
      {
        "@type": "Accommodation",
        "name": "Wooden House",
        "description": "Charming wooden house with panoramic sea views"
      },
      {
        "@type": "Accommodation", 
        "name": "Glamping Tent",
        "description": "Luxury glamping tent among olive trees"
      }
    ]
  };

  // VideoObject schema for hero video
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": language === 'el' ? "Glamping Λευκάδα - Metaxas Retreats" : "Glamping Lefkada Greece - Metaxas Retreats",
    "description": language === 'el' 
      ? "Πολυτελής εμπειρία glamping στον Μικρό Γιαλό της Λευκάδας με θέα στη θάλασσα"
      : "Luxury glamping experience in Mikros Gialos, Lefkada with stunning sea views over the Ionian Sea",
    "thumbnailUrl": "https://metaxasretreats.com/assets/glamping-tent/view.jpg",
    "uploadDate": "2024-01-01",
    "contentUrl": "https://metaxasretreats.com/assets/video.mp4",
    "embedUrl": "https://metaxasretreats.com/assets/video.mp4",
    "duration": "PT30S",
    "inLanguage": language,
    "publisher": {
      "@type": "Organization",
      "name": "Metaxas Retreats",
      "logo": {
        "@type": "ImageObject",
        "url": "https://metaxasretreats.com/assets/glamping-tent/view.jpg"
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
        "name": language === 'el' ? "Αρχική" : "Home",
        "item": "https://metaxasretreats.com/"
      }
    ]
  };

  const combinedSchema = [campgroundSchema, videoSchema, breadcrumbSchema];

  return (
    <Layout>
      <SEOHead
        title={language === 'el' ? "Πολυτελές Glamping στη Λευκάδα, Ελλάδα" : "Luxury Glamping in Lefkada, Greece"}
        description={language === 'el' 
          ? "Ζήστε την πολυτελή εμπειρία glamping πάνω από τον κόλπο του Μικρού Γιαλού στη Λευκάδα. Ξύλινο σπίτι & σκηνές glamping με θέα στη θάλασσα, 50μ από την παραλία."
          : "Experience luxury glamping above Mikros Gialos bay in Lefkada, Greece. Wooden house & glamping tents with sea views, 50m from beach. Book direct for best rates."}
        canonicalUrl="/"
        schema={combinedSchema}
      />
      <section className="hero-section h-[90vh] flex items-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
            <source src="/assets/video.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 max-w-3xl">
            {t('home.hero.welcome')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">{t('home.hero.subtitle')}</p>
          <Button onClick={scrollToAccommodations} className="bg-forest hover:bg-forest-dark text-white text-lg py-6 px-8">
            {t('home.hero.viewAccommodations')}
          </Button>
        </div>
        <button onClick={scrollToAccommodations} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce" aria-label="Scroll down">
          <ArrowDown size={32} />
        </button>
      </section>

      <section className="py-16 bg-wood-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-forest-dark">{t('home.section.title')}</h2>
            <p className="text-lg mb-8 text-gray-700">{t('home.section.description')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-forest-light p-4 rounded-full mb-4"><Home className="h-8 w-8 text-forest" /></div>
              <h3 className="text-xl font-heading font-semibold mb-2 text-forest-dark">{t('home.wooden.title')}</h3>
              <p className="text-gray-600">{t('home.wooden.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-leaf-light p-4 rounded-full mb-4"><Tent className="h-8 w-8 text-leaf" /></div>
              <h3 className="text-xl font-heading font-semibold mb-2 text-forest-dark">{t('home.glamping.title')}</h3>
              <p className="text-gray-600">{t('home.glamping.description')}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="accommodations" ref={accommodationsRef} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-center text-forest-dark">{t('home.accommodations.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
            {accommodations?.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-wood-light/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center text-forest-dark">{t('home.reviews.title')}</h2>
          <div className="elfsight-app-08c2814a-39d2-4b24-af1d-0694c0b45eb6" data-elfsight-app-lazy></div>
        </div>
      </section>

      <section className="py-16 bg-forest text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">{t('home.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{t('home.cta.description')}</p>
          <Button onClick={scrollToAccommodations} className="bg-white text-forest hover:bg-wood hover:text-forest-dark text-lg py-6 px-8">
            {t('home.cta.button')}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
