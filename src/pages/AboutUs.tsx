import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, ThumbsUp } from 'lucide-react';
import SEOHead from '@/components/SEO/SEOHead';

const AboutUs = () => {
  return (
    <Layout>
      <SEOHead
        title="About Us - The Metaxas Family Story"
        description="Learn about Metaxas Retreats, a family-run glamping retreat in Mikros Gialos, Lefkada. Three generations of Greek hospitality welcoming guests to our beautiful island."
        canonicalUrl="/about"
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-heading font-bold text-forest-dark mb-4">About Us</h1>
        
        <div className="max-w-3xl mb-10">
          <p className="text-lg text-gray-700 mb-4">
            Welcome to Metaxas Retreats, your gateway to authentic Greek island living in the stunning Mikros Gialos bay of Lefkada.
          </p>
          <p className="text-gray-700 mb-4">
            Founded by the Metaxas family with a deep love for this beautiful corner of Lefkada, we offer charming accommodations 
            that blend traditional Greek elements with modern comfort.
          </p>
          <p className="text-gray-700 mb-6">
            Our properties are nestled in the tranquil area of Poros in Mikros Gialos, surrounded by olive trees and just steps 
            away from one of the most beautiful beaches on the island. We take pride in providing our guests with a peaceful retreat 
            where they can experience the authentic beauty and rhythm of Greek island life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-forest-light/10 border-forest/20">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="bg-wood-light p-3 rounded-full">
                  <Users className="h-6 w-6 text-forest" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-semibold text-center text-forest-dark mb-3">Our Family</h3>
              <p className="text-gray-700 text-center">
                For three generations, the Metaxas family has been welcoming visitors to Mikros Gialos, 
                sharing our love for Lefkada's natural beauty and traditional hospitality.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-forest-light/10 border-forest/20">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="bg-wood-light p-3 rounded-full">
                  <Heart className="h-6 w-6 text-forest" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-semibold text-center text-forest-dark mb-3">Our Passion</h3>
              <p className="text-gray-700 text-center">
                We're passionate about creating memorable experiences for our guests, 
                offering authentic accommodations that reflect the true spirit of Greek island living.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-forest-light/10 border-forest/20">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="bg-wood-light p-3 rounded-full">
                  <ThumbsUp className="h-6 w-6 text-forest" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-semibold text-center text-forest-dark mb-3">Our Promise</h3>
              <p className="text-gray-700 text-center">
                We promise personal attention, clean and comfortable accommodations, 
                and insider knowledge to help you discover the very best of Lefkada.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-12">
          <div className="p-6">
            <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The story of Metaxas Retreats began in the 1980s when Georgios Metaxas, enchanted by the pristine beauty of Mikros Gialos, 
                built a summer home for his family in this peaceful corner of Lefkada. As friends began asking to stay in this idyllic location, 
                the idea for Metaxas Retreats was born.
              </p>
              <p>
                Over the years, what started as a simple guesthouse has evolved into our current collection of charming accommodations, 
                each designed to provide comfort while preserving the authentic character of traditional Greek island living.
              </p>
              <p>
                Today, the second and third generations of the Metaxas family continue this tradition of hospitality, 
                welcoming guests from around the world to experience the magic of Mikros Gialos.
              </p>
              <p>
                While we've added modern amenities and comforts, our philosophy remains the same: to share the authentic beauty, 
                flavors, and rhythms of life in this special corner of Lefkada island.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-wood-light/20 rounded-lg p-6">
          <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">Why Choose Mikros Gialos?</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Mikros Gialos is one of Lefkada's most beautiful bays, offering a perfect balance of natural beauty, tranquility, 
              and convenience. Our location in the Poros area provides:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>A stunning pebble beach with crystal-clear turquoise waters, ideal for swimming and snorkeling</li>
              <li>Peaceful surroundings away from the island's more crowded areas</li>
              <li>Walking distance to excellent local tavernas serving fresh seafood and traditional Greek cuisine</li>
              <li>Easy access to boat trips exploring the beautiful east coast of Lefkada</li>
              <li>A perfect base for exploring the entire island, with Lefkada Town just 25km away</li>
              <li>Close proximity to other beautiful beaches including Agiofili and Vassiliki</li>
            </ul>
            <p className="text-forest-dark font-medium mt-4">
              Experience the authentic charm of Greek island living at Metaxas Retreats in Mikros Gialos!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
