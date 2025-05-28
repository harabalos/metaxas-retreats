
import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import Layout from '@/components/Layout/Layout';
import { accommodations } from '@/data/accommodations';
import { Button } from '@/components/ui/button';
import BookingSummary from '@/components/Booking/BookingSummary';
import ContactSection from '@/components/Booking/ContactSection';
import { format, eachDayOfInterval } from 'date-fns';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const accommodation = accommodations.find(acc => acc.id === id);
  
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const guestsParam = searchParams.get('guests');
  const tentParam = searchParams.get('tent');
  
  const startDate = startParam ? new Date(startParam) : undefined;
  const endDate = endParam ? new Date(endParam) : undefined;
  const guests = guestsParam ? parseInt(guestsParam) : 1;
  const selectedTent = tentParam || "1";
  
  const isGlampingTent = id === 'glamping-tent';
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  if (!accommodation || !startDate || !endDate) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Booking Information Missing</h1>
          <p className="mb-8">Please select an accommodation and dates before proceeding.</p>
          <Button onClick={() => navigate('/')} className="bg-sea hover:bg-sea-dark">
            Return to Home
          </Button>
        </div>
      </Layout>
    );
  }
  
  const nights = differenceInDays(endDate!, startDate!);
  const totalPrice = (startDate && endDate)
  ? eachDayOfInterval({ start: startDate, end: new Date(endDate.getTime() - 86400000) })
      .reduce((sum, date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dailyPrice = accommodation.dailyPricing?.[dateStr] ?? accommodation.price;
        return sum + dailyPrice;
      }, 0)
  : 0;
  
  // Get the accommodation name with tent number if applicable
  const getAccommodationDisplayName = () => {
    if (isGlampingTent) {
      return `${accommodation.name} (Tent ${selectedTent})`;
    }
    return accommodation.name;
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-sea-dark">
          Contact Us for Booking
        </h1>
        <p className="mb-8 text-gray-600">
          Contact us directly to confirm availability and complete your booking.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContactSection />
          </div>
          
          <div>
            <BookingSummary
              accommodation={accommodation}
              startDate={startDate}
              endDate={endDate}
              guests={guests}
              nights={nights}
              totalPrice={totalPrice}
              selectedTent={isGlampingTent ? selectedTent : undefined}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
