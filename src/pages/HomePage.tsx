
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowDown, Tent, Home, MessageSquare, Star } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import AccommodationCard from '@/components/Accommodations/AccommodationCard';
import { Button } from '@/components/ui/button';
import { accommodations } from '@/data/accommodations';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  return (
    <Layout>
      <section className="hero-section h-[70vh] flex items-center text-white relative overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 z-10">
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
            {accommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-wood-light/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-center text-forest-dark">
            Guest Reviews
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Read what our guests have to say about their stay at Metaxas Retreats
          </p>
          
          <div className="max-w-6xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="pb-8">
                {/* Review 1 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="h-5 w-5 text-forest mr-2" />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      "Amazing location with breathtaking views! The wooden house was perfect for our family, and the proximity to the beach made our stay unforgettable. We'll definitely return!"
                    </p>
                    <div className="text-forest-dark font-semibold">Maria K.</div>
                    <div className="text-sm text-gray-500">July 2024</div>
                  </div>
                </CarouselItem>

                {/* Review 2 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="h-5 w-5 text-forest mr-2" />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      "The glamping experience exceeded our expectations. The tent was luxurious and comfortable, and waking up to the sound of the sea was magical. Perfect blend of nature and comfort!"
                    </p>
                    <div className="text-forest-dark font-semibold">John D.</div>
                    <div className="text-sm text-gray-500">August 2024</div>
                  </div>
                </CarouselItem>

                {/* Review 3 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="h-5 w-5 text-forest mr-2" />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      "We loved every moment of our stay! The hosts were incredibly welcoming, and the accommodation was spotlessly clean. The views of Mikros Gialos bay are simply stunning."
                    </p>
                    <div className="text-forest-dark font-semibold">Sophie M.</div>
                    <div className="text-sm text-gray-500">September 2024</div>
                  </div>
                </CarouselItem>

                {/* Review 4 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="h-5 w-5 text-forest mr-2" />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      "What a gem in Lefkada! The wooden house offered privacy and comfort with the most amazing sea view. My morning coffee on the deck watching the sunrise was my favorite part of the day."
                    </p>
                    <div className="text-forest-dark font-semibold">Andreas P.</div>
                    <div className="text-sm text-gray-500">June 2024</div>
                  </div>
                </CarouselItem>

                {/* Review 5 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="h-5 w-5 text-forest mr-2" />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      "Our honeymoon in the luxury tent was exactly what we needed. Romantic, peaceful, and with all the amenities we could ask for. The short walk to the beach was lovely, and the hosts went above and beyond to make us feel special."
                    </p>
                    <div className="text-forest-dark font-semibold">Elena and Nikolas T.</div>
                    <div className="text-sm text-gray-500">May 2024</div>
                  </div>
                </CarouselItem>

                {/* Review 6 */}
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="h-5 w-5 text-forest mr-2" />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      "As a family of four, we found the wooden house perfect for our needs. The kids loved exploring the olive groves, and we loved the relaxing atmosphere. Mikros Gialos beach is truly one of the most beautiful in Greece!"
                    </p>
                    <div className="text-forest-dark font-semibold">Thomas and Laura B.</div>
                    <div className="text-sm text-gray-500">August 2024</div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              
              <div className="flex justify-center mt-4">
                <CarouselPrevious className="relative static translate-y-0 left-0 mr-2" />
                <CarouselNext className="relative static translate-y-0 right-0" />
              </div>
            </Carousel>
          </div>
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
