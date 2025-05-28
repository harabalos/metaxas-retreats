import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Sailboat, Waves, Mountain, Coffee, UtensilsCrossed, Star } from 'lucide-react';

const ExploreIsland = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-heading font-bold text-forest-dark mb-4">Explore Lefkada Island</h1>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl">
          Discover the emerald jewel of the Ionian Sea. Lefkada offers breathtaking beaches, charming mountain villages, 
          delicious local cuisine, and exciting activities for every type of traveler.
        </p>
        
        <Tabs defaultValue="beaches" className="mb-12">
          <TabsList className="mb-8 w-full md:w-auto flex flex-wrap justify-center">
            <TabsTrigger value="beaches" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              <span>Beaches</span>
            </TabsTrigger>
            <TabsTrigger value="villages" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Villages</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Sailboat className="h-4 w-4" />
              <span>Activities</span>
            </TabsTrigger>
            <TabsTrigger value="cuisine" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              <span>Local Cuisine</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="beaches">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BeachCard 
                name="Mikros Gialos"
                description="A serene bay with calm turquoise waters, ideal for swimming, snorkeling, and total relaxation. Great local tavernas and your perfect base to explore the island."
                rating={5}
                image="/lovable-uploads/2f6bd2b9-02d2-44a7-ade9-2051f8e6b39a.png"
              />
              <BeachCard 
                name="Porto Katsiki"
                description="One of the most iconic beaches in Greece, featuring dramatic white cliffs and crystal clear turquoise waters. Accessible via stairs descending the cliff."
                rating={5}
                image="/lovable-uploads/porto katsiki.jpg"
              />
              <BeachCard 
                name="Egremni"
                description="A long stretch of pristine white sand and stunning blue waters. Famous for its 350 steps leading down to paradise."
                rating={5}
                image="/lovable-uploads/b333b19c-eb5a-4f1d-a8bb-9ba39fd8482d.png"
              />
              <BeachCard 
                name="Kathisma"
                description="A popular organized beach with golden sand and crystal waters. Perfect for water sports and beach bars."
                image="/lovable-uploads/kathisma.jpeg"
                rating={5}
              />
              <BeachCard 
                name="Milos Beach"
                description="A beautiful unspoiled beach near Agios Nikitas, accessible only by boat or by hiking through a scenic trail."
                image="/lovable-uploads/Milos.jpeg"
                rating={5}
              />
              <BeachCard 
                name="Agiofili"
                description="A small hidden gem with crystal clear turquoise waters, surrounded by olive trees and accessible by boat from Vasiliki."
                rating={5}
                image="/lovable-uploads/0cbd94cc-fdef-4176-82c1-389e8194aeb3.png"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="villages">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlaceCard 
                name="Mikros Gialos"
                description="A beautiful coastal village with a stunning turquoise bay, surrounded by lush greenery. The village offers peaceful beaches, charming tavernas serving fresh seafood, and a laid-back atmosphere perfect for relaxation."
                icon={<MapPin className="h-5 w-5 text-forest" />}
              />
              <PlaceCard 
                name="Sivota"
                description="An idyllic yacht harbor with emerald waters and excellent fish tavernas around the bay, just a short drive from Mikros Gialos."
                icon={<MapPin className="h-5 w-5 text-forest" />}
              />
              <PlaceCard 
                name="Lefkada Town"
                description="The charming capital with colorful buildings, a marina full of yachts, pedestrian streets, and numerous shops and restaurants."
                icon={<MapPin className="h-5 w-5 text-forest" />}
              />
              <PlaceCard 
                name="Agios Nikitas"
                description="A picturesque fishing village with traditional architecture, narrow streets, and direct access to beautiful beaches."
                icon={<MapPin className="h-5 w-5 text-forest" />}
              />
              <PlaceCard 
                name="Nidri"
                description="A lively resort town with stunning views of the neighboring islands and a vibrant waterfront promenade."
                icon={<MapPin className="h-5 w-5 text-forest" />}
              />
              <PlaceCard 
                name="Vasiliki"
                description="A windsurfing paradise in a sheltered bay, with a relaxed atmosphere and seafront tavernas."
                icon={<MapPin className="h-5 w-5 text-forest" />}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="activities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActivityCard 
                title="Boat Trips"
                description="Rent a boat from Mikros Gialos and explore the nearby islands of Meganisi, Kalamos, and Kastos. Discover secluded beaches accessible only by water."
                icon={<Sailboat />}
              />
              <ActivityCard 
                title="Windsurfing & Kitesurfing"
                description="Vasiliki Bay is one of Europe's top windsurfing destinations, with perfect afternoon thermal winds. Milos Beach is excellent for kitesurfing."
                icon={<Sailboat />}
              />
              <ActivityCard 
                title="Sailing"
                description="Rent a sailboat or join a sailing tour to explore the nearby islands of Meganisi, Kalamos, and Kastos."
                icon={<Sailboat />}
              />
              <ActivityCard 
                title="Hiking"
                description="Follow well-marked trails through olive groves, mountains, and coastal paths. The hike to the Dimosari Waterfall is particularly beautiful."
                icon={<Mountain />}
              />
              <ActivityCard 
                title="Beach Hopping"
                description="Take a boat tour to visit the island's most spectacular beaches, many accessible only by water."
                icon={<Waves />}
              />
              <ActivityCard 
                title="Scuba Diving"
                description="Explore underwater caves, shipwrecks, and vibrant marine life with one of the island's diving schools."
                icon={<Sailboat />}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="cuisine">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest-dark">Local Specialties</CardTitle>
                  <CardDescription>Traditional dishes you must try</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b pb-2">
                    <h4 className="font-medium text-forest">Savoro</h4>
                    <p className="text-gray-600">Fish cooked in a garlic, rosemary, and vinegar sauce.</p>
                  </div>
                  <div className="border-b pb-2">
                    <h4 className="font-medium text-forest">Lathopita</h4>
                    <p className="text-gray-600">A sweet olive oil pie with sugar, cinnamon, and orange.</p>
                  </div>
                  <div className="border-b pb-2">
                    <h4 className="font-medium text-forest">Bourdeto</h4>
                    <p className="text-gray-600">Spicy fish stew with peppers and tomatoes.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-forest">Lentils Eglouvi</h4>
                    <p className="text-gray-600">Famous lentils from the village of Eglouvi, known for their exceptional taste.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest-dark">Where to Eat</CardTitle>
                  <CardDescription>Recommended restaurants and tavernas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b pb-2">
                    <h4 className="font-medium text-forest">Rachi Restaurant</h4>
                    <p className="text-gray-600">In Exanthia village, offers stunning sunset views and excellent food.</p>
                  </div>
                  <div className="border-b pb-2">
                    <h4 className="font-medium text-forest">Zolithros</h4>
                    <p className="text-gray-600">Seafront taverna in Mikros Gialos with fresh seafood and local dishes.</p>
                  </div>
                  <div className="border-b pb-2">
                    <h4 className="font-medium text-forest">Basilico</h4>
                    <p className="text-gray-600">Italian-Greek fusion in Nidri with magnificent harbor views.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-forest">Elena</h4>
                    <p className="text-gray-600">Traditional taverna in Geni serving authentic local cuisine.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-forest-dark">Local Products</CardTitle>
                <CardDescription>Take a taste of Lefkada home with you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b pb-2 md:border-b-0 md:border-r md:pr-4">
                    <h4 className="font-medium text-forest">Olive Oil</h4>
                    <p className="text-gray-600">Exceptional quality olive oil from centuries-old trees.</p>
                  </div>
                  <div className="border-b pb-2 md:border-b-0 md:pl-4">
                    <h4 className="font-medium text-forest">Honey</h4>
                    <p className="text-gray-600">Local thyme honey with distinctive flavor and aroma.</p>
                  </div>
                  <div className="border-b pb-2 md:border-r md:pr-4">
                    <h4 className="font-medium text-forest">Wine</h4>
                    <p className="text-gray-600">Try the local Vertzami red wine, unique to the region.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-forest">Lentils</h4>
                    <p className="text-gray-600">The famous Eglouvi lentils, considered among the best in Greece.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <section className="bg-wood-light/20 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">Plan Your Perfect Day</h2>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium text-forest text-lg mb-2">Beach Day</h3>
              <p className="text-gray-700">Wake up in your glamping tent in Mikros Gialos, head to the beach for a morning swim, enjoy lunch at a local taverna in Mikros Gialos or Sivota, and finish with sunset drinks at Eksantheia village.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium text-forest text-lg mb-2">Village Exploration</h3>
              <p className="text-gray-700">Start your day in Mikros Gialos or Sivota, drive to mountain village Karya for lunch, and end your day in Agios Nikitas for dinner by the sea.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium text-forest text-lg mb-2">Water Activities</h3>
              <p className="text-gray-700">Take a morning sailing trip from Nidri around nearby islands, enjoy lunch at Meganisi, and spend the afternoon windsurfing in Vasiliki.</p>
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
            alt={name} 
            className="w-full h-full object-cover"
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
