import { useParams, useNavigate } from 'react-router-dom';
import { Home, Tent, Users, BedDouble, Bath, Coffee } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { accommodations } from '@/data/accommodations';
import AccommodationGallery from '@/components/Accommodations/AccommodationGallery';
import BookingForm from '@/components/Booking/BookingForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SEOHead from '@/components/SEO/SEOHead';

const AccommodationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const accommodation = accommodations.find(acc => acc.id === id);
  
  if (!accommodation) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Accommodation Not Found</h1>
          <p className="mb-8">The accommodation you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} className="bg-sea hover:bg-sea-dark">
            Return to Home
          </Button>
        </div>
      </Layout>
    );
  }

  // Schema for VacationRental
  const accommodationSchema = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "name": `${accommodation.name} - Metaxas Retreats Lefkada`,
    "description": accommodation.description,
    "url": `https://metaxasretreats.com/accommodation/${accommodation.id}`,
    "image": accommodation.images.map(img => `https://metaxasretreats.com${img}`),
    "numberOfRooms": accommodation.bedrooms,
    "occupancy": {
      "@type": "QuantitativeValue",
      "maxValue": accommodation.guests
    },
    "numberOfBedrooms": accommodation.bedrooms,
    "numberOfBathroomsTotal": accommodation.bathrooms,
    "petsAllowed": false,
    "amenityFeature": accommodation.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    })),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mikros Gialos, Poros",
      "addressLocality": "Lefkada",
      "addressRegion": "Ionian Islands",
      "addressCountry": "GR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "38.640048",
      "longitude": "20.698988"
    }
  };

  const seoTitle = accommodation.type === 'house' 
    ? "Wooden House with Sea View - Lefkada Vacation Rental"
    : "Luxury Glamping Tent - Lefkada Accommodation";
  
  const seoDescription = accommodation.type === 'house'
    ? `Charming wooden house overlooking Mikros Gialos bay in Lefkada. Sleeps ${accommodation.guests}, fully equipped kitchen, private terrace. From €${accommodation.price}/night. Book your Greek island getaway.`
    : `Spacious glamping tent among olive trees in Lefkada, Greece. Sleeps ${accommodation.guests}, air conditioning, sea views. From €${accommodation.price}/night. Perfect for families and couples.`;

  return (
    <Layout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={`/accommodation/${accommodation.id}`}
        image={`https://metaxasretreats.com${accommodation.images[0]}`}
        schema={accommodationSchema}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Accommodation name and type */}
        <div className="flex items-center mb-6">
          <div className="mr-3">
            {accommodation?.type === 'house' ? (
              <Home className="h-6 w-6 text-forest" />
            ) : (
              <Tent className="h-6 w-6 text-olive" />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-forest-dark">
            {accommodation?.name}
          </h1>
        </div>
        
        {/* Main content with optimized loading */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow lg:max-w-4xl">
            {/* Gallery with lazy loading */}
            <div className="mb-8">
              <AccommodationGallery 
                images={accommodation?.images || []} 
                name={accommodation?.name || ''} 
              />
            </div>
            
            <div className="mt-4">
              {/* Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-semibold mb-4 text-forest-dark">
                  About this accommodation
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {accommodation?.description}
                </p>
              </div>
              
              {/* Features */}
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-semibold mb-4 text-forest-dark">
                  Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-forest mr-2" />
                    <span>{accommodation?.guests} guests</span>
                  </div>
                  <div className="flex items-center">
                    <BedDouble className="h-5 w-5 text-forest mr-2" />
                    <span>{accommodation?.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <BedDouble className="h-5 w-5 text-forest mr-2" />
                    <span>{accommodation?.beds} beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 text-forest mr-2" />
                    <span>{accommodation?.bathrooms} bathrooms</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-semibold mb-4 text-forest-dark">
                  Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accommodation?.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Coffee className="h-5 w-5 text-forest mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking form */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <BookingForm accommodation={accommodation} isDetail={true} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccommodationDetail;
