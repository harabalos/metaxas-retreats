import { useRef, useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useLocation, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { m, useScroll, useTransform } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import AccommodationCard from '@/components/Accommodations/AccommodationCard';
import GuestReviews from '@/components/Reviews/GuestReviews';
import { useAccommodations } from '@/hooks/useAccommodations';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { responsiveImage } from '@/lib/images';
import { PLACES, formatMinutes } from '@/data/places';
import { reviewSummary } from '@/data/reviews';
import { business, graph, website } from '@/lib/schema';
import heroVideoDesktop from '@/assets/hero/hero-desktop.mp4';
import heroVideoMobile from '@/assets/hero/hero-mobile.mp4';
import heroPoster from '@/assets/hero/hero-poster.webp';
import FadeUp from '@/components/FadeUp';
import { EASE_OUT, prefersReducedMotion, scrollBehavior } from '@/lib/motion';

// Photo column next to "The Experience" text from lg up, full width below.
const CAROUSEL_SIZES = '(min-width: 1232px) 544px, (min-width: 1024px) calc(50vw - 72px), calc(100vw - 40px)';

const CAROUSEL_IMAGES = [
  { src: '/assets/glamping-tent/view.jpg', alt: 'Glamping tent with panoramic sea view over Mikros Gialos bay, Lefkada Greece' },
  { src: '/assets/glamping-tent/view2.jpg', alt: 'Stunning Ionian Sea view from Metaxas Retreats glamping accommodation, Lefkada' },
  { src: '/assets/glamping-tent/prosopsi.jpg', alt: 'Luxury glamping tent exterior at Metaxas Retreats, Lefkada Greece' },
  { src: '/assets/e9f9bd84-9f74-4189-bf30-d6640a566fd3.jpg', alt: 'Wooden house sea view accommodation at Mikros Gialos beach, Lefkada Greece' },
];

/**
 * Visitors who asked their device for less motion or less data get the still
 * frame instead of the looping hero video.
 */
const prefersStillHero = () => {
  if (typeof window === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return prefersReducedMotion() || connection?.saveData === true;
};


// The towns in home.where.drive.label, all a short drive away (src/data/places.ts).
const NEARBY_TOWNS = [PLACES.sivota, PLACES.nidri, PLACES.vasiliki];

// ─── Main Component ────────────────────────────────────────────────────────────
const HomePage = () => {
  const location = useLocation();
  const accommodationsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { t, language, localize } = useLanguage();
  const { data: accommodations, isLoading } = useAccommodations();
  const [showHeroVideo] = useState(() => !prefersStillHero());
  // The carousel's hidden slides are clipped, so lazy loading would only fetch
  // each one as it slides in. Once the first photo is in, fetch the rest.
  const [carouselStarted, setCarouselStarted] = useState(false);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    // No self-advancing slides for visitors who asked for less motion.
    Autoplay({ delay: 3500, stopOnInteraction: false, active: !prefersReducedMotion() })
  ]);

  // Parallax on hero content
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Facts only: the beach distance is the owner's, the rest come from src/data.
  const whereFacts = [
    { value: t('home.where.beach.value'), label: t('home.where.beach.label') },
    {
      value: formatMinutes(Math.max(...NEARBY_TOWNS.map((place) => place.minutes)), t),
      label: t('home.where.drive.label'),
    },
    {
      value: (
        <span className="inline-flex items-center gap-2">
          {reviewSummary.rating.toFixed(1)}
          <Star className="h-6 w-6 md:h-7 md:w-7 fill-wood text-wood" aria-hidden="true" />
        </span>
      ),
      label: t('home.where.rating.label', { count: reviewSummary.count }),
    },
  ];

  const scrollToAccommodations = () => {
    accommodationsRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
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

  // The business (with the Google rating shown below) and the site. The FAQ
  // has its own page (/faq).
  const schema = graph(
    business(t, { withRating: true }),
    website(language),
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
      <section ref={heroRef} className="relative min-h-[max(100svh,600px)] pt-28 pb-24 flex items-center overflow-hidden bg-forest-dark">
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

        {/* Hero content with parallax: the headline, one line, one button */}
        <m.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto"
        >
          <m.h1
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
            className="font-heading font-light text-white text-display-2xl leading-[1.05] mb-6 max-w-4xl text-balance"
          >
            {t('home.hero.title')}
          </m.h1>

          <m.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sand-light/80 text-lg md:text-xl font-sans font-light mb-10 max-w-xl leading-relaxed"
          >
            {t('home.hero.subtitle')}
          </m.p>

          {/* Motion on a wrapper: its transform would override the button's active:scale-95. */}
          <m.div
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={scrollToAccommodations}
              className="px-8 py-4 bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide rounded-full transition-all duration-300 hover:bg-wood-light hover:shadow-cta active:scale-95"
            >
              {t('home.hero.viewAccommodations')}
            </button>
          </m.div>
        </m.div>
      </section>

      {/* ─── WHERE WE ARE ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 px-5 sm:px-10">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="max-w-3xl mx-auto text-center">
            <p className="text-wood-deep text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-4">{t('home.where.eyebrow')}</p>
            <h2 className="font-heading font-light text-forest text-[clamp(1.5rem,2.4vw,2.125rem)] leading-snug text-balance">
              {t('home.where.title')}
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            {/* One row per fact on phones, three columns from sm */}
            <ul className="mt-12 md:mt-14 grid grid-cols-1 sm:grid-cols-3 border-y border-forest/10 divide-y divide-forest/10 sm:divide-y-0 sm:divide-x">
              {whereFacts.map(({ value, label }) => (
                <li key={label} className="flex items-center gap-5 py-5 sm:block sm:py-9 sm:px-6 sm:text-center">
                  <p className="w-28 flex-shrink-0 sm:w-auto font-heading text-forest-dark text-[2rem] md:text-[2.5rem] leading-none whitespace-nowrap">
                    {value}
                  </p>
                  <p className="text-sm text-muted-foreground font-sans text-balance sm:mt-3">{label}</p>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ─── ACCOMMODATIONS ────────────────────────────────────────────────── */}
      <section id="accommodations" ref={accommodationsRef} className="py-20 px-5 sm:px-10 bg-sand/40">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <p className="text-wood-deep text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-3">{t('home.accommodations.eyebrow')}</p>
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
                <m.div
                  key={accommodation.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AccommodationCard accommodation={accommodation} />
                </m.div>
              ))}
            </div>
          )}

          {/* Direct booking nudge */}
          <FadeUp delay={0.2}>
            <div className="mt-10 text-center">
              <p className="text-sm font-sans text-muted-foreground">
                {t('home.accommodations.directBook')}
                {' '}·{' '}
                <Link to={localize('/contact')} className="text-forest underline underline-offset-2 hover:text-wood transition-colors">
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
                <p className="text-wood-deep text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-5">{t('home.experience.eyebrow')}</p>
                <h2 className="font-heading font-light text-forest text-display-lg mb-7 text-balance">
                  {t('home.experience.title')}
                </h2>
                <div className="space-y-5 text-muted-foreground font-sans font-light leading-relaxed">
                  <p>
                    {t('home.experience.desc1')}
                  </p>
                  <p>
                    {t('home.experience.desc2')}
                  </p>
                </div>
                <div className="mt-10">
                  <Link
                    to={localize('/mikros-gialos')}
                    className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-forest border-b border-forest/30 pb-0.5 hover:border-forest transition-colors"
                  >
                    {t('home.experience.area')}
                    <span className="text-wood-deep">→</span>
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
                to={localize('/contact')}
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
