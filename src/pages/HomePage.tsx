import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowDown, Tent, Home } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import AccommodationCard from '@/components/Accommodations/AccommodationCard';
import { accommodations } from '@/data/accommodations';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEO/SEOHead';

const HomePage = () => {
  const location = useLocation();
  const accommodationsRef = useRef<HTMLDivElement>(null);

  const scrollToAccommodations = () => {
    accommodationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (location.search.includes('scrollToAccommodations=true')) {
      setTimeout(() => {
        scrollToAccommodations();
      }, 100);
    }
  }, [location]);

  // Load Elfsight Script for Reviews Widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        // Script already removed
      }
    };
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Luxury Glamping in Lefkada, Greece"
        description="Experience luxury glamping above Mikros Gialos bay in Lefkada, Greece. Wooden house & glamping tents with sea views, 50m from beach. Book direct for best rates."
        canonicalUrl="/"
      />
      <section className="hero-section h-[70vh] flex items-center text-white relative overflow-hidden">
        {/* Video Background with Fallback */}
        <div className="absolute inset-0 bg-black">
           <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          >
            <source src="/assets/video.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 max-w-3xl">
            Welcome to Metaxas Retreats
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Luxury glamping experience above the perfect turquoise waters of Mikros Gialos bay in Lefkada
          </p>
          <div>
            <Button 
              onClick={scrollToAccommodations}
              className="bg-forest hover:bg-forest-dark text-white text-lg py-6 px-8"
            >
              View Accommodations
            </Button>
          </div>
        </div>
        <button 
          onClick={scrollToAccommodations}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown size={32} />
        </button>
      </section>

      <section className="py-16 bg-wood-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-forest-dark">
              Glamping in Lefkada
            </h2>
            <p className="text-lg mb-8 text-gray-700">
              Nestled among olive trees and overlooking the crystal-clear waters of Mikros Gialos bay, our accommodations offer an unparalleled blend of luxury camping and authentic Greek island living, just steps away from one of Lefkada's most beautiful beaches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-forest-light p-4 rounded-full mb-4">
                <Home className="h-8 w-8 text-forest" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2 text-forest-dark">Wooden House</h3>
              <p className="text-gray-600">
                Our spacious wooden house offers panoramic sea views of Mikros Gialos bay, for an authentic island experience.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-leaf-light p-4 rounded-full mb-4">
                <Tent className="h-8 w-8 text-leaf" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2 text-forest-dark">Glamping Tent</h3>
              <p className="text-gray-600">
                Experience luxury camping in our elegant tent with premium bedding and amenities, surrounded by nature yet just a short walk to the turquoise waters of Mikros Gialos beach.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="accommodations" ref={accommodationsRef} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-center text-forest-dark">
            Our Accommodations
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {accommodations?.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </div>
        </div>
      </section>

      {/* Guest Reviews Section - Elfsight Widget */}
      <section className="py-16 bg-wood-light/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center text-forest-dark">
            Guest Reviews
          </h2>
          <div className="elfsight-app-08c2814a-39d2-4b24-af1d-0694c0b45eb6" data-elfsight-app-lazy></div>
        </div>
      </section>

      <section className="py-16 bg-forest text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Experience Lefkada in Style
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your glamping getaway now and wake up to stunning views of the turquoise waters of one of Lefkada's most beautiful bays.
          </p>
          <Button 
            onClick={() => scrollToAccommodations()}
            className="bg-white text-forest hover:bg-wood hover:text-forest-dark text-lg py-6 px-8"
          >
            Book Your Stay
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;