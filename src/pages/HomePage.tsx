import { useRef, useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useLocation, Link } from 'react-router-dom';
import { ArrowDown, Waves, Trees, Sun, Wind, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import AccommodationCard from '@/components/Accommodations/AccommodationCard';
import GuestReviews from '@/components/Reviews/GuestReviews';
import { useAccommodations } from '@/hooks/useAccommodations';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { responsiveImage } from '@/lib/images';
import { business, faqPage, graph, website } from '@/lib/schema';
import heroVideoDesktop from '@/assets/hero/hero-desktop.mp4';
import heroVideoMobile from '@/assets/hero/hero-mobile.mp4';
import heroPoster from '@/assets/hero/hero-poster.webp';

// Photo column next to "The Experience" text from lg up, full width below.
const CAROUSEL_SIZES = '(min-width: 1232px) 544px, (min-width: 1024px) calc(50vw - 72px), calc(100vw - 40px)';

const CAROUSEL_IMAGES = [
  { src: '/assets/glamping-tent/view.jpg', alt: 'Glamping tent with panoramic sea view over Mikros Gialos bay, Lefkada Greece' },
  { src: '/assets/glamping-tent/view2.jpg', alt: 'Stunning Ionian Sea view from Metaxas Retreats glamping accommodation, Lefkada' },
  { src: '/assets/glamping-tent/prosopsi.jpg', alt: 'Luxury glamping tent exterior among olive trees at Metaxas Retreats, Lefkada Greece' },
  { src: '/assets/e9f9bd84-9f74-4189-bf30-d6640a566fd3.jpg', alt: 'Wooden house sea view accommodation at Mikros Gialos beach, Lefkada Greece' },
];

/**
 * Visitors who asked their device for less motion or less data get the still
 * frame instead of the looping hero video.
 */
const prefersStillHero = () => {
  if (typeof window === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || connection?.saveData === true;
};

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


const FEATURE_ICONS = [Waves, Trees, Sun, Wind];
const FEATURE_KEYS = [
  { label: 'home.features.beach.label', desc: 'home.features.beach.desc' },
  { label: 'home.features.olive.label', desc: 'home.features.olive.desc' },
  { label: 'home.features.views.label', desc: 'home.features.views.desc' },
  { label: 'home.features.secluded.label', desc: 'home.features.secluded.desc' },
];

// ─── FAQ Accordion ─────────────────────────────────────────────────────────────
const faqItems = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  { q: 'faq.q6', a: 'faq.a6' },
  { q: 'faq.q7', a: 'faq.a7' },
];

const FAQAccordion = ({ t }: { t: (key: string) => string }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="divide-y divide-forest/10 border-t border-b border-forest/10">
      {faqItems.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between py-5 text-left gap-4 group cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="font-sans font-medium text-forest text-[15px] sm:text-base leading-snug group-hover:text-forest-dark transition-colors">
                {t(item.q)}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-forest/40 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-80 pb-5' : 'max-h-0'}`}
            >
              <p className="text-muted-foreground font-sans text-[15px] leading-relaxed pr-10">
                {t(item.a)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const HomePage = () => {
  const location = useLocation();
  const accommodationsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const { data: accommodations, isLoading } = useAccommodations();
  const [showHeroVideo] = useState(() => !prefersStillHero());
  // The carousel's hidden slides are clipped, so lazy loading would only fetch
  // each one as it slides in. Once the first photo is in, fetch the rest.
  const [carouselStarted, setCarouselStarted] = useState(false);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3500, stopOnInteraction: false })
  ]);

  // Parallax on hero content
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const scrollToAccommodations = () => {
    accommodationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (location.hash === '#accommodations' || location.search.includes('scrollToAccommodations=true')) {
      setTimeout(() => scrollToAccommodations(), 100);
    }
  }, [location]);

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

  // The business (with the Google rating shown below), the site, and the FAQ.
  const schema = graph(
    business(t, { withRating: true }),
    website(language),
    faqPage(t, faqItems.length),
  );

  return (
    <Layout>
      <SEOHead
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        canonicalUrl="/"
        schema={schema}
      />

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-forest-dark">
        {/* Video background */}
        <div className="absolute inset-0">
          {showHeroVideo ? (
            <video
              ref={videoRef}
              autoPlay muted loop playsInline preload="metadata"
              poster={heroPoster}
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-55"
            >
              {/* Phones get a portrait crop of the same footage: the part
                  object-cover shows anyway, at under half the file size. */}
              <source src={heroVideoDesktop} type="video/mp4" media="(min-width: 768px)" />
              <source src={heroVideoMobile} type="video/mp4" />
            </video>
          ) : (
            <img
              src={heroPoster}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-55"
            />
          )}
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
            {t('home.hero.eyebrow')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-light text-white text-display-2xl leading-[1.05] mb-6 max-w-3xl text-balance"
          >
            {t('home.hero.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-sand-light/80 text-lg md:text-xl font-sans mb-10 max-w-xl leading-relaxed"
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
          aria-label={t('home.hero.scrollDown')}
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
            <p className="text-wood text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-6">{t('home.brand.eyebrow')}</p>
            <h2 className="font-heading font-light text-forest text-display-lg leading-snug text-balance">
              {t('home.brandStatement')}
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-8 text-muted-foreground text-base md:text-lg font-sans leading-relaxed max-w-2xl mx-auto">
              {t('home.section.description')}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── FEATURE PILLARS ───────────────────────────────────────────────── */}
      <section className="py-6 px-5 sm:px-10 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURE_KEYS.map(({ label, desc }, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
            <FadeUp key={label} delay={i * 0.1}>
              <div className="text-center group">
                <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center mx-auto mb-4 group-hover:bg-forest/10 transition-colors duration-300">
                  <Icon className="h-5 w-5 text-forest" />
                </div>
                <p className="font-sans font-semibold text-sm text-forest-dark mb-1">{t(label)}</p>
                <p className="text-xs text-muted-foreground font-sans">{t(desc)}</p>
              </div>
            </FadeUp>
            );
          })}
        </div>
      </section>

      {/* ─── ACCOMMODATIONS ────────────────────────────────────────────────── */}
      <section id="accommodations" ref={accommodationsRef} className="py-20 px-5 sm:px-10 bg-sand/40">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <p className="text-wood text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-3">{t('home.accommodations.eyebrow')}</p>
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
                {t('home.accommodations.directBook')}
                {' '}·{' '}
                <Link to="/contact" className="text-forest underline underline-offset-2 hover:text-wood transition-colors">
                  {t('home.accommodations.getInTouch')}
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
                <p className="text-wood text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-5">{t('home.experience.eyebrow')}</p>
                <h2 className="font-heading font-light text-forest text-display-lg mb-7 text-balance">
                  {t('home.experience.title')}
                </h2>
                <div className="space-y-5 text-muted-foreground font-sans leading-relaxed">
                  <p>
                    {t('home.experience.desc1')}
                  </p>
                  <p>
                    {t('home.experience.desc2')}
                  </p>
                </div>
                <div className="mt-10">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-forest border-b border-forest/30 pb-0.5 hover:border-forest transition-colors"
                  >
                    {t('home.experience.explore')}
                    <span className="text-wood">→</span>
                  </Link>
                </div>
              </div>
            </FadeUp>

            {/* Photo carousel */}
            <FadeUp delay={0.15}>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-card group">
                <div className="overflow-hidden h-full" ref={emblaRef}>
                  <div className="flex h-full">
                    {CAROUSEL_IMAGES.map((img, idx) => (
                      <div key={img.src} className="flex-[0_0_100%] min-w-0 h-full relative">
                        <img
                          {...responsiveImage(img.src, CAROUSEL_SIZES)}
                          alt={img.alt}
                          loading={idx === 0 || !carouselStarted ? 'lazy' : 'eager'}
                          decoding="async"
                          onLoad={idx === 0 ? () => setCarouselStarted(true) : undefined}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
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
            <p className="text-wood text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-3">{t('home.reviews.eyebrow')}</p>
            <h2 className="font-heading font-light text-white text-display-lg">
              {t('home.reviews.title') || 'What Our Guests Say'}
            </h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <GuestReviews />
          </FadeUp>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-5 sm:px-10 bg-cream">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-12">
            <p className="text-wood text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-3">{t('faq.eyebrow')}</p>
            <h2 className="font-heading font-light text-forest text-display-lg">
              {t('faq.title')}
            </h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <FAQAccordion t={t} />
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
            <p className="text-muted-foreground font-sans text-lg mb-10 max-w-xl mx-auto">
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


    </Layout>
  );
};

export default HomePage;
