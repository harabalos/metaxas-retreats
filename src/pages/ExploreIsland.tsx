import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Sailboat, Waves, Mountain, Coffee, Star } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';
import { useLanguage } from '@/context/LanguageContext';

const ExploreIsland = () => {
  const { t, language } = useLanguage();

  const exploreSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": language === 'el' ? "Νησί Λευκάδα, Ελλάδα" : "Lefkada Island, Greece",
    "description": language === 'el' 
      ? "Ανακαλύψτε τις εκπληκτικές παραλίες της Λευκάδας, τα γραφικά χωριά, τα θαλάσσια σπορ και την τοπική κουζίνα. Ο πλήρης οδηγός σας για τα ελληνικά νησιά."
      : "Discover Lefkada's stunning beaches, charming villages, water sports, and local cuisine. Your complete Greek island travel guide.",
    "url": "https://metaxasretreats.com/explore",
    "touristType": ["Beach lovers", "Nature enthusiasts", "Adventure seekers", "Food lovers"],
    "includesAttraction": [
      {
        "@type": "Beach",
        "name": "Porto Katsiki",
        "description": language === 'el' 
          ? "Μία από τις πιο εμβληματικές παραλίες της Ελλάδας με εντυπωσιακούς λευκούς βράχους και τιρκουάζ νερά"
          : "One of the most iconic beaches in Greece with dramatic white cliffs and turquoise waters"
      },
      {
        "@type": "Beach", 
        "name": "Mikros Gialos",
        "description": language === 'el'
          ? "Γαλήνιος κόλπος με ήρεμα τιρκουάζ νερά, ιδανικός για κολύμπι και κατάδυση με αναπνευστήρα"
          : "Serene bay with calm turquoise waters, ideal for swimming and snorkeling"
      },
      {
        "@type": "Beach",
        "name": "Egremni",
        "description": language === 'el'
          ? "Παρθένα λευκή αμμουδιά με εκπληκτικά γαλάζια νερά"
          : "Pristine white sand beach with stunning blue waters"
      }
    ]
  };

  // Beach data with translations
  const beaches = [
    {
      name: language === 'el' ? 'Μικρός Γιαλός' : 'Mikros Gialos',
      description: language === 'el' 
        ? 'Ένας γαλήνιος κόλπος με ήρεμα τιρκουάζ νερά, ιδανικός για κολύμπι, κατάδυση με αναπνευστήρα και απόλυτη χαλάρωση. Εξαιρετικές τοπικές ταβέρνες και η τέλεια βάση για εξερεύνηση του νησιού.'
        : 'A serene bay with calm turquoise waters, ideal for swimming, snorkeling, and total relaxation. Great local tavernas and your perfect base to explore the island.',
      rating: 5,
      image: '/assets/2f6bd2b9-02d2-44a7-ade9-2051f8e6b39a.png'
    },
    {
      name: language === 'el' ? 'Πόρτο Κατσίκι' : 'Porto Katsiki',
      description: language === 'el'
        ? 'Μία από τις πιο εμβληματικές παραλίες της Ελλάδας, με εντυπωσιακούς λευκούς βράχους και κρυστάλλινα τιρκουάζ νερά. Προσβάσιμη μέσω σκαλοπατιών που κατεβαίνουν τον βράχο.'
        : 'One of the most iconic beaches in Greece, featuring dramatic white cliffs and crystal clear turquoise waters. Accessible via stairs descending the cliff.',
      rating: 5,
      image: '/assets/porto katsiki.jpg'
    },
    {
      name: language === 'el' ? 'Εγκρεμνοί' : 'Egremni',
      description: language === 'el'
        ? 'Μια μεγάλη έκταση παρθένας λευκής άμμου και εκπληκτικά γαλάζια νερά. Διάσημη για τα 350 σκαλοπάτια που οδηγούν στον παράδεισο.'
        : 'A long stretch of pristine white sand and stunning blue waters. Famous for its 350 steps leading down to paradise.',
      rating: 5,
      image: '/assets/b333b19c-eb5a-4f1d-a8bb-9ba39fd8482d.jpg'
    },
    {
      name: language === 'el' ? 'Κάθισμα' : 'Kathisma',
      description: language === 'el'
        ? 'Μια δημοφιλής οργανωμένη παραλία με χρυσή άμμο και κρυστάλλινα νερά. Τέλεια για θαλάσσια σπορ και beach bars.'
        : 'A popular organized beach with golden sand and crystal waters. Perfect for water sports and beach bars.',
      rating: 5,
      image: '/assets/kathisma.jpeg'
    },
    {
      name: language === 'el' ? 'Μύλος' : 'Milos Beach',
      description: language === 'el'
        ? 'Μια όμορφη ανέγγιχτη παραλία κοντά στον Άγιο Νικήτα, προσβάσιμη μόνο με σκάφος ή πεζοπορία μέσα από ένα γραφικό μονοπάτι.'
        : 'A beautiful unspoiled beach near Agios Nikitas, accessible only by boat or by hiking through a scenic trail.',
      rating: 5,
      image: '/assets/Milos.jpeg'
    },
    {
      name: language === 'el' ? 'Αγιοφύλι' : 'Agiofili',
      description: language === 'el'
        ? 'Ένα μικρό κρυφό διαμάντι με κρυστάλλινα τιρκουάζ νερά, περιτριγυρισμένο από ελαιόδεντρα και προσβάσιμο με σκάφος από τη Βασιλική.'
        : 'A small hidden gem with crystal clear turquoise waters, surrounded by olive trees and accessible by boat from Vasiliki.',
      rating: 5,
      image: '/assets/0cbd94cc-fdef-4176-82c1-389e8194aeb3.jpg'
    }
  ];

  // Villages data with translations
  const villages = [
    {
      name: language === 'el' ? 'Μικρός Γιαλός' : 'Mikros Gialos',
      description: language === 'el'
        ? 'Ένα όμορφο παραθαλάσσιο χωριό με έναν εκπληκτικό τιρκουάζ κόλπο, περιτριγυρισμένο από πλούσια βλάστηση. Το χωριό προσφέρει ήσυχες παραλίες, γοητευτικές ταβέρνες με φρέσκα θαλασσινά και μια χαλαρή ατμόσφαιρα ιδανική για ξεκούραση.'
        : 'A beautiful coastal village with a stunning turquoise bay, surrounded by lush greenery. The village offers peaceful beaches, charming tavernas serving fresh seafood, and a laid-back atmosphere perfect for relaxation.'
    },
    {
      name: language === 'el' ? 'Σύβοτα' : 'Sivota',
      description: language === 'el'
        ? 'Ένα ειδυλλιακό λιμάνι για σκάφη αναψυχής με σμαραγδένια νερά και εξαιρετικές ψαροταβέρνες γύρω από τον κόλπο, σε μικρή απόσταση με αυτοκίνητο από τον Μικρό Γιαλό.'
        : 'An idyllic yacht harbor with emerald waters and excellent fish tavernas around the bay, just a short drive from Mikros Gialos.'
    },
    {
      name: language === 'el' ? 'Πόλη Λευκάδας' : 'Lefkada Town',
      description: language === 'el'
        ? 'Η γοητευτική πρωτεύουσα με πολύχρωμα κτίρια, μια μαρίνα γεμάτη γιοτ, πεζόδρομους και πολυάριθμα καταστήματα και εστιατόρια.'
        : 'The charming capital with colorful buildings, a marina full of yachts, pedestrian streets, and numerous shops and restaurants.'
    },
    {
      name: language === 'el' ? 'Άγιος Νικήτας' : 'Agios Nikitas',
      description: language === 'el'
        ? 'Ένα γραφικό ψαροχώρι με παραδοσιακή αρχιτεκτονική, στενά δρομάκια και άμεση πρόσβαση σε όμορφες παραλίες.'
        : 'A picturesque fishing village with traditional architecture, narrow streets, and direct access to beautiful beaches.'
    },
    {
      name: language === 'el' ? 'Νυδρί' : 'Nidri',
      description: language === 'el'
        ? 'Μια ζωντανή τουριστική πόλη με εκπληκτική θέα στα γειτονικά νησιά και μια ζωηρή παραλιακή πεζοδρομένα.'
        : 'A lively resort town with stunning views of the neighboring islands and a vibrant waterfront promenade.'
    },
    {
      name: language === 'el' ? 'Βασιλική' : 'Vasiliki',
      description: language === 'el'
        ? 'Ένας παράδεισος για windsurfing σε έναν προφυλαγμένο κόλπο, με χαλαρή ατμόσφαιρα και παραθαλάσσιες ταβέρνες.'
        : 'A windsurfing paradise in a sheltered bay, with a relaxed atmosphere and seafront tavernas.'
    }
  ];

  // Activities data with translations
  const activities = [
    {
      title: language === 'el' ? 'Εκδρομές με Σκάφος' : 'Boat Trips',
      description: language === 'el'
        ? 'Νοικιάστε ένα σκάφος από τον Μικρό Γιαλό και εξερευνήστε τα κοντινά νησιά Μεγανήσι, Κάλαμο και Καστό. Ανακαλύψτε απομονωμένες παραλίες προσβάσιμες μόνο από τη θάλασσα.'
        : 'Rent a boat from Mikros Gialos and explore the nearby islands of Meganisi, Kalamos, and Kastos. Discover secluded beaches accessible only by water.'
    },
    {
      title: language === 'el' ? 'Windsurfing & Kitesurfing' : 'Windsurfing & Kitesurfing',
      description: language === 'el'
        ? 'Ο κόλπος της Βασιλικής είναι ένας από τους κορυφαίους προορισμούς windsurfing στην Ευρώπη, με τέλειους θερμικούς απογευματινούς ανέμους. Η παραλία του Μύλου είναι εξαιρετική για kitesurfing.'
        : "Vasiliki Bay is one of Europe's top windsurfing destinations, with perfect afternoon thermal winds. Milos Beach is excellent for kitesurfing."
    },
    {
      title: language === 'el' ? 'Ιστιοπλοΐα' : 'Sailing',
      description: language === 'el'
        ? 'Νοικιάστε ένα ιστιοπλοϊκό ή συμμετέχετε σε μια ιστιοπλοϊκή εκδρομή για να εξερευνήσετε τα κοντινά νησιά Μεγανήσι, Κάλαμο και Καστό.'
        : 'Rent a sailboat or join a sailing tour to explore the nearby islands of Meganisi, Kalamos, and Kastos.'
    },
    {
      title: language === 'el' ? 'Πεζοπορία' : 'Hiking',
      description: language === 'el'
        ? 'Ακολουθήστε καλά σημαδεμένα μονοπάτια μέσα από ελαιώνες, βουνά και παράκτια μονοπάτια. Η πεζοπορία στον καταρράκτη Δημοσάρη είναι ιδιαίτερα όμορφη.'
        : 'Follow well-marked trails through olive groves, mountains, and coastal paths. The hike to the Dimosari Waterfall is particularly beautiful.'
    },
    {
      title: language === 'el' ? 'Εξερεύνηση Παραλιών' : 'Beach Hopping',
      description: language === 'el'
        ? 'Κάντε μια εκδρομή με σκάφος για να επισκεφθείτε τις πιο εντυπωσιακές παραλίες του νησιού, πολλές προσβάσιμες μόνο από τη θάλασσα.'
        : "Take a boat tour to visit the island's most spectacular beaches, many accessible only by water."
    },
    {
      title: language === 'el' ? 'Καταδύσεις' : 'Scuba Diving',
      description: language === 'el'
        ? 'Εξερευνήστε υποθαλάσσιες σπηλιές, ναυάγια και πλούσια θαλάσσια ζωή με μία από τις σχολές καταδύσεων του νησιού.'
        : "Explore underwater caves, shipwrecks, and vibrant marine life with one of the island's diving schools."
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="Explore Lefkada - Best Beaches, Villages & Activities"
        titleEl="Εξερευνήστε τη Λευκάδα - Καλύτερες Παραλίες, Χωριά & Δραστηριότητες"
        description="Discover Lefkada's stunning beaches like Porto Katsiki, charming villages, water sports, and local cuisine. Your complete Greek island travel guide from Metaxas Retreats."
        descriptionEl="Ανακαλύψτε τις εκπληκτικές παραλίες της Λευκάδας όπως το Πόρτο Κατσίκι, τα γραφικά χωριά, τα θαλάσσια σπορ και την τοπική κουζίνα. Ο πλήρης οδηγός σας από το Metaxas Retreats."
        canonicalUrl="/explore"
        schema={exploreSchema}
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-heading font-bold text-forest-dark mb-4">{t('explore.title')}</h1>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl">
          {t('explore.intro')}
        </p>
        
        <Tabs defaultValue="beaches" className="mb-12">
          <TabsList className="mb-8 w-full md:w-auto flex flex-wrap justify-center">
            <TabsTrigger value="beaches" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              <span>{t('explore.beaches')}</span>
            </TabsTrigger>
            <TabsTrigger value="villages" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{t('explore.villages')}</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Sailboat className="h-4 w-4" />
              <span>{t('explore.activities')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="beaches">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beaches.map((beach) => (
                <BeachCard 
                  key={beach.name}
                  name={beach.name}
                  description={beach.description}
                  rating={beach.rating}
                  image={beach.image}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="villages">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {villages.map((village) => (
                <PlaceCard 
                  key={village.name}
                  name={village.name}
                  description={village.description}
                  icon={<MapPin className="h-5 w-5 text-forest" />}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="activities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <ActivityCard 
                  key={activity.title}
                  title={activity.title}
                  description={activity.description}
                  icon={<Sailboat />}
                />
              ))}
            </div>
          </TabsContent>
          
        </Tabs>
        
        <section className="bg-wood-light/20 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">{t('explore.plan.title')}</h2>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium text-forest text-lg mb-2">{t('explore.plan.beach.title')}</h3>
              <p className="text-gray-700">{t('explore.plan.beach.description')}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium text-forest text-lg mb-2">{t('explore.plan.village.title')}</h3>
              <p className="text-gray-700">{t('explore.plan.village.description')}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium text-forest text-lg mb-2">{t('explore.plan.water.title')}</h3>
              <p className="text-gray-700">{t('explore.plan.water.description')}</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const BeachCard = ({ 
  name, 
  description, 
  rating, 
  image 
}: { 
  name: string; 
  description: string; 
  rating?: number;
  image?: string;
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 relative">
        {image ? (
          <img 
            src={image} 
            alt={`${name} beach in Lefkada, Greece - ${description.substring(0, 60)}...`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full bg-forest-light/30 flex items-center justify-center">
            <Waves className="h-16 w-16 text-forest-light" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-forest-dark">{name}</CardTitle>
          {rating && (
            <div className="flex">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const PlaceCard = ({ name, description, icon }: { name: string; description: string; icon: React.ReactNode }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="bg-wood-light/50 p-2 rounded-full">
          {icon}
        </div>
        <CardTitle className="text-forest-dark">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const ActivityCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="bg-forest-light/30 p-2 rounded-full">
          {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-forest" })}
        </div>
        <CardTitle className="text-lg text-forest-dark">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ExploreIsland;