import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, Sailboat, Waves, Mountain, Star } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { responsiveImage } from '@/lib/images';

// Beach cards: three columns from lg, two from md, one below.
const BEACH_IMAGE_SIZES =
  '(min-width: 1280px) 380px, (min-width: 1024px) calc(33vw - 48px), (min-width: 768px) calc(50vw - 44px), calc(100vw - 40px)';

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

// Text for each entry lives in the locale files under explore.beach.<id>.* etc.
const BEACHES = [
  { id: 'mikrosGialos', image: '/assets/2f6bd2b9-02d2-44a7-ade9-2051f8e6b39a.png' },
  { id: 'portoKatsiki', image: '/assets/porto katsiki.jpg' },
  { id: 'egremni', image: '/assets/b333b19c-eb5a-4f1d-a8bb-9ba39fd8482d.jpg' },
  { id: 'kathisma', image: '/assets/kathisma.jpeg' },
  { id: 'milos', image: '/assets/Milos.jpeg' },
  { id: 'agiofili', image: '/assets/0cbd94cc-fdef-4176-82c1-389e8194aeb3.jpg' },
];
const VILLAGES = ['mikrosGialos', 'sivota', 'lefkadaTown', 'agiosNikitas', 'nidri', 'vasiliki'];
const ACTIVITIES = ['boatTrips', 'windsurfing', 'sailing', 'hiking', 'beachHopping', 'diving'];

const ExploreIsland = () => {
  const { t } = useLanguage();

  const exploreSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": t('explore.schema.name'),
    "description": t('explore.schema.description'),
    "url": "https://metaxasretreats.gr/explore",
    "includesAttraction": [
      { "@type": "Beach", "name": "Porto Katsiki" },
      { "@type": "Beach", "name": "Mikros Gialos" },
      { "@type": "Beach", "name": "Egremni" }
    ]
  };

  const beaches = BEACHES.map(({ id, image }) => ({
    name: t(`explore.beach.${id}.name`),
    description: t(`explore.beach.${id}.desc`),
    image,
  }));

  const villages = VILLAGES.map((id) => ({
    name: t(`explore.village.${id}.name`),
    description: t(`explore.village.${id}.desc`),
  }));

  const activityIcons = [Sailboat, Waves, Sailboat, Mountain, Waves, Mountain];
  const activities = ACTIVITIES.map((id) => ({
    title: t(`explore.activity.${id}.title`),
    description: t(`explore.activity.${id}.desc`),
  }));

  const planItems = [
    { key: 'beach', icon: Waves },
    { key: 'village', icon: MapPin },
    { key: 'water', icon: Sailboat },
  ];

  return (
    <Layout>
      <SEOHead
        title="Explore Lefkada - Best Beaches, Villages & Activities"
        titleEl="Εξερευνήστε τη Λευκάδα - Καλύτερες Παραλίες, Χωριά & Δραστηριότητες"
        description="Discover Lefkada's stunning beaches like Porto Katsiki, charming villages, water sports, and local cuisine. Your complete Greek island travel guide from Metaxas Retreats."
        descriptionEl="Ανακαλύψτε τις εκπληκτικές παραλίες της Λευκάδας, τα γραφικά χωριά, τα θαλάσσια σπορ και την τοπική κουζίνα. Ο πλήρης οδηγός σας."
        canonicalUrl="/explore"
        schema={exploreSchema}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">

        {/* Header */}
        <FadeUp>
          <div className="mb-12">
            <p className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-3">{t('explore.eyebrow')}</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-forest-dark mb-4">{t('explore.title')}</h1>
            <p className="text-gray-500 max-w-xl leading-relaxed">{t('explore.intro')}</p>
          </div>
        </FadeUp>

        {/* Tabs */}
        <FadeUp delay={0.1}>
          <Tabs defaultValue="beaches" className="mb-16">
            <TabsList className="mb-10 bg-transparent p-0 gap-1 h-auto border-b border-gray-200 w-full justify-start rounded-none">
              {[
                { value: 'beaches', icon: Waves, label: t('explore.beaches') },
                { value: 'villages', icon: MapPin, label: t('explore.villages') },
                { value: 'activities', icon: Sailboat, label: t('explore.activities') },
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center gap-2 px-5 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-wood data-[state=active]:text-forest-dark data-[state=active]:bg-transparent text-gray-400 hover:text-gray-600 font-sans font-medium text-sm transition-all"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Beaches */}
            {/* forceMount keeps inactive tabs in the page (hidden), so search engines index them. */}
            <TabsContent value="beaches" forceMount className="data-[state=inactive]:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beaches.map((beach, i) => (
                  <motion.div
                    key={beach.name}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-400"
                  >
                    <div className="h-48 overflow-hidden">
                      {beach.image ? (
                        <img {...responsiveImage(beach.image, BEACH_IMAGE_SIZES)} alt={t('explore.beachAlt', { name: beach.name })} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                      ) : (
                        <div className="h-full bg-aegean/10 flex items-center justify-center">
                          <Waves className="h-12 w-12 text-aegean/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-heading font-semibold text-forest-dark">{beach.name}</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-wood text-wood" />)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{beach.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Villages */}
            <TabsContent value="villages" forceMount className="data-[state=inactive]:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {villages.map((village, i) => (
                  <motion.div
                    key={village.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-start gap-4 hover:shadow-card-hover transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-wood/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-wood" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-forest-dark mb-1.5">{village.name}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{village.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Activities */}
            <TabsContent value="activities" forceMount className="data-[state=inactive]:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activities.map((act, i) => {
                  const Icon = activityIcons[i] || Sailboat;
                  return (
                    <motion.div
                      key={act.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-forest/8 flex items-center justify-center mb-4">
                        <Icon className="h-4.5 w-4.5 text-forest" />
                      </div>
                      <h3 className="font-heading font-semibold text-forest-dark mb-2">{act.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{act.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </FadeUp>

        {/* Day plan section */}
        <FadeUp delay={0.15}>
          <div className="rounded-2xl bg-forest-dark text-sand-light overflow-hidden">
            <div className="p-8 md:p-12">
              <p className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-3">{t('explore.plan.eyebrow')}</p>
              <h2 className="text-3xl font-heading font-semibold mb-8">{t('explore.plan.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {planItems.map(({ key, icon: Icon }, i) => (
                  <div key={key} className="bg-white/8 rounded-xl p-5">
                    <div className="w-9 h-9 rounded-full bg-wood/20 flex items-center justify-center mb-4">
                      <Icon className="h-4 w-4 text-wood" />
                    </div>
                    <h3 className="font-sans font-semibold text-sand-light mb-2">{t(`explore.plan.${key}.title`)}</h3>
                    <p className="text-sand-dark/60 text-sm leading-relaxed">{t(`explore.plan.${key}.description`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp delay={0.2}>
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-4">{t('explore.cta.question')}</p>
            <Link
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide hover:bg-wood-light hover:shadow-cta transition-all duration-300"
            >
              {t('home.cta.button')}
            </Link>
          </div>
        </FadeUp>

      </div>
    </Layout>
  );
};

export default ExploreIsland;
