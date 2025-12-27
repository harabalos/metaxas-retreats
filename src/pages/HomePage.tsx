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

  return (
    <Layout>
      <SEOHead
        title={language === 'el' ? "Πολυτελές Glamping στη Λευκάδα, Ελλάδα" : "Luxury Glamping in Lefkada, Greece"}
        description={language === 'el' 
          ? "Ζήστε την πολυτελή εμπειρία glamping πάνω από τον κόλπο του Μικρού Γιαλού στη Λευκάδα. Ξύλινο σπίτι & σκηνές glamping με θέα στη θάλασσα, 50μ από την παραλία."
          : "Experience luxury glamping above Mikros Gialos bay in Lefkada, Greece. Wooden house & glamping tents with sea views, 50m from beach. Book direct for best rates."}
        canonicalUrl="/"
      />
      <section className="hero-section h-[70vh] flex items-center text-white relative overflow-hidden">
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
