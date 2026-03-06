import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, Sailboat, Waves, Mountain, Star } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

const ExploreIsland = () => {
  const { t, language } = useLanguage();

  const exploreSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": language === 'el' ? "Νησί Λευκάδα, Ελλάδα" : "Lefkada Island, Greece",
    "description": language === 'el' ? "Ανακαλύψτε τις εκπληκτικές παραλίες της Λευκάδας, τα γραφικά χωριά, τα θαλάσσια σπορ και την τοπική κουζίνα." : "Discover Lefkada's stunning beaches, charming villages, water sports, and local cuisine.",
    "url": "https://metaxasretreats.gr/explore",
    "includesAttraction": [
      { "@type": "Beach", "name": "Porto Katsiki" },
      { "@type": "Beach", "name": "Mikros Gialos" },
      { "@type": "Beach", "name": "Egremni" }
    ]
  };

  const beaches = [
    { name: language === 'el' ? 'Μικρός Γιαλός' : 'Mikros Gialos', description: language === 'el' ? 'Ένας γαλήνιος κόλπος με ήρεμα κρυστάλλινα νερά, ιδανικός για κολύμπι, κατάδυση με αναπνευστήρα και απόλυτη χαλάρωση. Εξαιρετικές τοπικές ταβέρνες.' : 'A serene bay with calm turquoise waters, ideal for swimming, snorkeling, and total relaxation. Great local tavernas and your perfect base to explore the island.', image: '/assets/2f6bd2b9-02d2-44a7-ade9-2051f8e6b39a.png' },
    { name: language === 'el' ? 'Πόρτο Κατσίκι' : 'Porto Katsiki', description: language === 'el' ? 'Μία από τις πιο εμβληματικές παραλίες της Ελλάδας, με εντυπωσιακούς λευκούς βράχους και κρυστάλλινα νερά.' : 'One of the most iconic beaches in Greece, featuring dramatic white cliffs and crystal clear turquoise waters. Accessible via stairs descending the cliff.', image: '/assets/porto katsiki.jpg' },
    { name: language === 'el' ? 'Εγκρεμνοί' : 'Egremni', description: language === 'el' ? 'Μια μεγάλη έκταση παρθένας λευκής άμμου και εκπληκτικά γαλάζια νερά. Διάσημη για τα 350 σκαλοπάτια.' : 'A long stretch of pristine white sand and stunning blue waters. Famous for its 350 steps leading down to paradise.', image: '/assets/b333b19c-eb5a-4f1d-a8bb-9ba39fd8482d.jpg' },
    { name: language === 'el' ? 'Κάθισμα' : 'Kathisma', description: language === 'el' ? 'Μια δημοφιλής οργανωμένη παραλία με χρυσή άμμο και κρυστάλλινα νερά. Τέλεια για θαλάσσια σπορ.' : 'A popular organized beach with golden sand and crystal waters. Perfect for water sports and beach bars.', image: '/assets/kathisma.jpeg' },
    { name: language === 'el' ? 'Μύλος' : 'Milos Beach', description: language === 'el' ? 'Μια όμορφη ανέγγιχτη παραλία κοντά στον Άγιο Νικήτα, προσβάσιμη μόνο με σκάφος ή πεζοπορία.' : 'A beautiful unspoiled beach near Agios Nikitas, accessible only by boat or by hiking through a scenic trail.', image: '/assets/Milos.jpeg' },
    { name: language === 'el' ? 'Αγιοφύλι' : 'Agiofili', description: language === 'el' ? 'Ένα μικρό κρυφό διαμάντι με κρυστάλλινα νερά, περιτριγυρισμένο από ελαιόδεντρα.' : 'A small hidden gem with crystal clear turquoise waters, surrounded by olive trees and accessible by boat from Vasiliki.', image: '/assets/0cbd94cc-fdef-4176-82c1-389e8194aeb3.jpg' },
  ];

  const villages = [
    { name: language === 'el' ? 'Μικρός Γιαλός' : 'Mikros Gialos', description: language === 'el' ? 'Ένα όμορφο παραθαλάσσιο χωριό με εκπληκτικό τιρκουάζ κόλπο, ήσυχες παραλίες και γοητευτικές ταβέρνες.' : 'A beautiful coastal village with a stunning turquoise bay. Peaceful beaches, charming tavernas serving fresh seafood, and a laid-back atmosphere.' },
    { name: language === 'el' ? 'Σύβοτα' : 'Sivota', description: language === 'el' ? 'Ένα ειδυλλιακό λιμάνι με σμαραγδένια νερά και εξαιρετικές ψαροταβέρνες γύρω από τον κόλπο.' : 'An idyllic yacht harbor with emerald waters and excellent fish tavernas around the bay, just a short drive from Mikros Gialos.' },
    { name: language === 'el' ? 'Πόλη Λευκάδας' : 'Lefkada Town', description: language === 'el' ? 'Η γοητευτική πρωτεύουσα με πολύχρωμα κτίρια, μια μαρίνα γεμάτη γιοτ και πεζόδρομους.' : 'The charming capital with colorful buildings, a marina full of yachts, pedestrian streets, and numerous shops and restaurants.' },
    { name: language === 'el' ? 'Άγιος Νικήτας' : 'Agios Nikitas', description: language === 'el' ? 'Ένα γραφικό ψαροχώρι με παραδοσιακή αρχιτεκτονική, στενά δρομάκια και πρόσβαση σε όμορφες παραλίες.' : 'A picturesque fishing village with traditional architecture, narrow streets, and direct access to beautiful beaches.' },
    { name: language === 'el' ? 'Νυδρί' : 'Nidri', description: language === 'el' ? 'Μια ζωντανή τουριστική πόλη με εκπληκτική θέα στα γειτονικά νησιά.' : 'A lively resort town with stunning views of the neighboring islands and a vibrant waterfront promenade.' },
    { name: language === 'el' ? 'Βασιλική' : 'Vasiliki', description: language === 'el' ? 'Ένας παράδεισος για windsurfing σε έναν προφυλαγμένο κόλπο, με χαλαρή ατμόσφαιρα.' : 'A windsurfing paradise in a sheltered bay, with a relaxed atmosphere and seafront tavernas.' },
  ];

  const activityIcons = [Sailboat, Waves, Sailboat, Mountain, Waves, Mountain];
  const activities = [
    { title: language === 'el' ? 'Εκδρομές με Σκάφος' : 'Boat Trips', description: language === 'el' ? 'Νοικιάστε ένα σκάφος από τον Μικρό Γιαλό και εξερευνήστε τα κοντινά νησιά Μεγανήσι, Κάλαμο και Καστό.' : 'Rent a boat from Mikros Gialos and explore the nearby islands of Meganisi, Kalamos, and Kastos. Discover secluded beaches.' },
    { title: language === 'el' ? 'Windsurfing & Kitesurfing' : 'Windsurfing & Kitesurfing', description: language === 'el' ? 'Ο κόλπος της Βασιλικής είναι ένας από τους κορυφαίους προορισμούς windsurfing στην Ευρώπη.' : "Vasiliki Bay is one of Europe's top windsurfing destinations, with perfect afternoon thermal winds." },
    { title: language === 'el' ? 'Ιστιοπλοΐα' : 'Sailing', description: language === 'el' ? 'Νοικιάστε ένα ιστιοπλοϊκό ή συμμετέχετε σε μια εκδρομή για να εξερευνήσετε τα κοντινά νησιά.' : 'Rent a sailboat or join a sailing tour to explore the nearby islands of Meganisi, Kalamos, and Kastos.' },
    { title: language === 'el' ? 'Πεζοπορία' : 'Hiking', description: language === 'el' ? 'Ακολουθήστε καλά σημαδεμένα μονοπάτια μέσα από ελαιώνες και βουνά. Ο καταρράκτης Δημοσάρη είναι όμορφος.' : 'Follow well-marked trails through olive groves and mountains. The hike to the Dimosari Waterfall is particularly beautiful.' },
    { title: language === 'el' ? 'Εξερεύνηση Παραλιών' : 'Beach Hopping', description: language === 'el' ? 'Κάντε μια εκδρομή με σκάφος για να επισκεφθείτε τις πιο εντυπωσιακές παραλίες, πολλές προσβάσιμες μόνο από τη θάλασσα.' : "Take a boat tour to visit the island's most spectacular beaches, many accessible only by water." },
    { title: language === 'el' ? 'Καταδύσεις' : 'Scuba Diving', description: language === 'el' ? 'Εξερευνήστε υποθαλάσσιες σπηλιές, ναυάγια και πλούσια θαλάσσια ζωή.' : "Explore underwater caves, shipwrecks, and vibrant marine life with one of the island's diving schools." },
  ];

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
            <p className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-3">{language === 'el' ? 'Ο Οδηγός μας' : 'Our Guide'}</p>
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
            <TabsContent value="beaches">
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
                        <img src={beach.image} alt={`${beach.name} beach in Lefkada`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
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
            <TabsContent value="villages">
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
            <TabsContent value="activities">
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
              <p className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-3">{language === 'el' ? 'Πρότεινόμενο Πρόγραμμα' : 'Suggested Itinerary'}</p>
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
            <p className="text-gray-400 text-sm mb-4">{language === 'el' ? 'Έτοιμοι να εξερευνήσετε τη Λευκάδα;' : 'Ready to explore Lefkada?'}</p>
            <Link
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide hover:bg-wood-light hover:shadow-cta transition-all duration-300"
            >
              {language === 'el' ? 'Κάντε Κράτηση' : 'Book Your Stay'}
            </Link>
          </div>
        </FadeUp>

      </div>
    </Layout>
  );
};

export default ExploreIsland;
