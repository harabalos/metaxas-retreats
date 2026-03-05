import { useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowDown, Waves, Trees, Sun, Wind } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import AccommodationCard from '@/components/Accommodations/AccommodationCard';
import { useAccommodations } from '@/hooks/useAccommodations';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

// ─── Reusable scroll-reveal wrapper ───────────────────────────────────────────
const FadeUp = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);


const FEATURES = [
  { icon: Waves, label: '50m from the beach', desc: 'A short walk to Mikros Gialos bay' },
  { icon: Trees, label: 'Olive Grove Setting', desc: '3 acres of nature & silence' },
  { icon: Sun, label: 'Panoramic Sea Views', desc: 'Ionian sunrise to sunset' },
  { icon: Wind, label: 'Secluded & Private', desc: 'Away from crowds and noise' },
];

// ─── Main Component ────────────────────────────────────────────────────────────
const HomePage = () => {
  const location = useLocation();
  const accommodationsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const { data: accommodations, isLoading } = useAccommodations();

  // Parallax on hero content
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const scrollToAccommodations = () => {
    accommodationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (location.search.includes('scrollToAccommodations=true')) {
      setTimeout(() => scrollToAccommodations(), 100);
    }
  }, [location]);

  // Load Featurable reviews widget deferred
  useEffect(() => {
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.src = 'https://featurable.com/assets/bundle.js';
      script.defer = true;
      script.charset = 'UTF-8';
      document.body.appendChild(script);
    }, 2500);
    return () => {
      clearTimeout(timer);
      try {
        const s = document.querySelector('script[src="https://featurable.com/assets/bundle.js"]');
        if (s) document.body.removeChild(s);
      } catch { }
    };
  }, []);

  // iOS video autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = () => video.play().catch(() => { });
    play();
    video.addEventListener('canplaythrough', play);
    video.addEventListener('loadeddata', play);
    return () => {
      video.removeEventListener('canplaythrough', play);
      video.removeEventListener('loadeddata', play);
    };
  }, []);

  // Schema
  const campgroundSchema = {
    '@context': 'https://schema.org',
    '@type': ['Campground', 'LodgingBusiness'],
    name: 'Metaxas Retreats',
    description: language === 'el'
      ? 'Πολυτελές glamping στη Λευκάδα, Ελλάδα.'
      : 'Luxury glamping in Lefkada, Greece.',
    url: 'https://metaxasretreats.gr',
    telephone: '+306973219980',
    address: { '@type': 'PostalAddress', addressLocality: 'Lefkada', addressCountry: 'GR' },
    geo: { '@type': 'GeoCoordinates', latitude: '38.640048', longitude: '20.698988' },
    priceRange: '€50 - €160',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '47', bestRating: '5' },
  };

  return (
    <Layout>
      <SEOHead
        title={language === 'el' ? 'Πολυτελές Glamping στη Λευκάδα, Ελλάδα' : 'Luxury Glamping in Lefkada, Greece'}
        description={language === 'el'
          ? 'Ζήστε την πολυτελή εμπειρία glamping πάνω από τον κόλπο του Μικρού Γιαλού στη Λευκάδα.'
          : 'Experience luxury glamping above Mikros Gialos bay in Lefkada, Greece. Sea views, olive groves, private beach.'}
        canonicalUrl="/"
        schema={campgroundSchema}
      />

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-forest-dark">
        {/* Video background */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay muted loop playsInline preload="auto"
            poster="/assets/video-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          >
            <source src="/assets/video.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay — darker at bottom for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/40 via-forest-dark/20 to-forest-dark/70" />
        </div>

        {/* Hero content with parallax */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-wood text-sm font-sans font-medium tracking-[0.2em] uppercase mb-5"
          >
            Lefkada, Greece
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-light text-white text-display-2xl leading-[1.05] mb-6 max-w-3xl text-balance"
          >
            {t('home.hero.welcome')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-sand-light/80 text-lg md:text-xl font-sans font-light mb-10 max-w-xl leading-relaxed"
          >
            {t('home.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={scrollToAccommodations}
              className="px-8 py-4 bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide rounded-full transition-all duration-300 hover:bg-wood-light hover:shadow-cta active:scale-95"
            >
              {t('home.hero.viewAccommodations')}
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 border border-white/40 text-white font-sans font-medium text-sm tracking-wide rounded-full transition-all duration-300 hover:border-white hover:bg-white/10 active:scale-95"
            >
              {t('nav.contact')}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToAccommodations}
          aria-label="Scroll down"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ArrowDown className="h-6 w-6" />
          </motion.div>
        </motion.button>
      </section>

      {/* ─── BRAND STATEMENT ───────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-wood text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-6">Mikros Gialos Bay</p>
            <h2 className="font-heading font-light text-forest text-display-lg leading-snug text-balance">
              {language === 'el'
                ? 'Τρία στρέμματα ελαιώνων, ιώνιος αέρας και ηρεμία — σας περιμένουν στην ακτή της Λευκάδας.'
                : 'Three acres of olive groves, sea air, and stillness — waiting for you on the coast of Lefkada.'}
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-8 text-muted-foreground text-base md:text-lg font-sans font-light leading-relaxed max-w-2xl mx-auto">
              {t('home.section.description')}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── FEATURE PILLARS ───────────────────────────────────────────────── */}
      <section className="py-6 px-5 sm:px-10 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <FadeUp key={label} delay={i * 0.1}>
              <div className="text-center group">
                <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center mx-auto mb-4 group-hover:bg-forest/10 transition-colors duration-300">
                  <Icon className="h-5 w-5 text-forest" />
                </div>
                <p className="font-sans font-semibold text-sm text-forest-dark mb-1">{label}</p>
                <p className="text-xs text-muted-foreground font-sans">{desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ─── ACCOMMODATIONS ────────────────────────────────────────────────── */}
      <section id="accommodations" ref={accommodationsRef} className="py-20 px-5 sm:px-10 bg-sand/40">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <p className="text-wood text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-3">Where You'll Stay</p>
            <h2 className="font-heading font-light text-forest text-display-lg">
              {t('home.accommodations.title')}
            </h2>
          </FadeUp>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[1, 2].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-sand animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {accommodations?.map((accommodation, i) => (
                <motion.div
                  key={accommodation.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AccommodationCard accommodation={accommodation} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Direct booking nudge */}
          <FadeUp delay={0.2}>
            <div className="mt-10 text-center">
              <p className="text-sm font-sans text-muted-foreground">
                {language === 'el'
                  ? 'Κράτηση απευθείας = καλύτερη τιμή, χωρίς χρεώσεις πλατφόρμας'
                  : 'Book direct = best rate, no platform fees'}
                {' '}·{' '}
                <Link to="/contact" className="text-forest underline underline-offset-2 hover:text-wood transition-colors">
                  {language === 'el' ? 'Επικοινωνήστε μαζί μας' : 'Get in touch'}
                </Link>
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── EXPERIENCE SECTION ────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div>
                <p className="text-wood text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-5">The Experience</p>
                <h2 className="font-heading font-light text-forest text-display-lg mb-7 text-balance">
                  {language === 'el'
                    ? 'Ξυπνήστε με τον ήχο των κυμάτων'
                    : 'Wake up to the sound of the waves'}
                </h2>
                <div className="space-y-5 text-muted-foreground font-sans font-light leading-relaxed">
                  <p>
                    {language === 'el'
                      ? 'Το Metaxas Retreats βρίσκεται πάνω από τον μαγευτικό κόλπο του Μικρού Γιαλού — ένας κρυμμένος παράδεισος μεταξύ ελαιώνων και Ιόνιας θάλασσας.'
                      : 'Metaxas Retreats sits above the breathtaking bay of Mikros Gialos — a hidden paradise between olive groves and the Ionian Sea.'}
                  </p>
                  <p>
                    {language === 'el'
                      ? 'Στα 50 μόλις μέτρα, η παραλία σας προσκαλεί για πρωινό μπάνιο. Τα βράδια, τα αστέρια είναι το μόνο φως που χρειάζεστε.'
                      : 'Just 50 metres away, the beach invites you for a morning swim. In the evenings, the stars are the only light you need.'}
                  </p>
                </div>
                <div className="mt-10">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-forest border-b border-forest/30 pb-0.5 hover:border-forest transition-colors"
                  >
                    {language === 'el' ? 'Εξερευνήστε τη Λευκάδα' : 'Explore Lefkada'}
                    <span className="text-wood">→</span>
                  </Link>
                </div>
              </div>
            </FadeUp>

            {/* Photo collage */}
            <FadeUp delay={0.15}>
              <div className="grid grid-cols-2 gap-3 h-[500px]">
                <div className="space-y-3 h-full">
                  <div className="h-[60%] rounded-2xl overflow-hidden shadow-card">
                    <img src="/assets/glamping-tent/view.jpg" alt="Sea view" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="h-[36%] rounded-2xl overflow-hidden shadow-card">
                    <img src="/assets/glamping-tent/prosopsi.jpg" alt="Glamping tent" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                <div className="space-y-3 h-full pt-6">
                  <div className="h-[40%] rounded-2xl overflow-hidden shadow-card">
                    <img src="/assets/e9f9bd84-9f74-4189-bf30-d6640a566fd3.jpg" alt="Lefkada" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="h-[56%] rounded-2xl overflow-hidden shadow-card">
                    <img src="/assets/wooden-house/wooden-house-view.jpg" alt="Wooden house" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-5 sm:px-10 bg-forest-dark text-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <p className="text-wood text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-3">Guest Stories</p>
            <h2 className="font-heading font-light text-white text-display-lg">
              {t('home.reviews.title') || 'What Our Guests Say'}
            </h2>
          </FadeUp>

          {/* Featurable widget — real Google reviews */}
          <FadeUp delay={0.1}>
            <div className="featurable-reviews-wrapper">
              <div id="featurable-a9c57a0b-0fd9-435e-aab6-af85639915b3" data-featurable-async />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── CTA STRIP ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-10 bg-sand/50">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-heading font-light text-forest text-display-lg mb-5 text-balance">
              {t('home.cta.title')}
            </h2>
            <p className="text-muted-foreground font-sans font-light text-lg mb-10 max-w-xl mx-auto">
              {t('home.cta.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={scrollToAccommodations}
                className="px-8 py-4 bg-forest text-white font-sans font-semibold text-sm tracking-wide rounded-full transition-all duration-300 hover:bg-forest-dark hover:shadow-card-hover active:scale-95"
              >
                {t('home.cta.button')}
              </button>
              <Link
                to="/contact"
                className="px-8 py-4 border border-forest/30 text-forest font-sans font-medium text-sm tracking-wide rounded-full transition-all duration-300 hover:border-forest hover:bg-forest/5 active:scale-95"
              >
                {t('nav.contact')}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── WhatsApp FAB ──────────────────────────────────────────────────── */}
      <motion.a
        href="https://wa.me/306973219980"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg wa-fab"
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>
    </Layout>
  );
};

export default HomePage;
