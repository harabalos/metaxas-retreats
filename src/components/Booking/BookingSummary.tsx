
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accommodation } from '@/data/accommodations';

interface BookingSummaryProps {
  accommodation: Accommodation;
  startDate: Date;
  endDate: Date;
  guests: number;
  nights: number;
  totalPrice: number;
  selectedTent?: string;
}

const BookingSummary = ({ 
  accommodation,
  startDate,
  endDate,
  guests,
  nights,
  totalPrice,
  selectedTent
}: BookingSummaryProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate the theoretical price on other platforms (15% more)
  const otherPlatformsPrice = Math.round(totalPrice * 1.15);
  const savings = otherPlatformsPrice - totalPrice;

  // Get the accommodation name with tent number if applicable
  const accommodationName = selectedTent 
    ? `${accommodation.name} (Tent ${selectedTent})` 
    : accommodation.name;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={accommodation.images[0] || '/images/placeholder.svg'}
                alt={accommodation.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sea-dark">
                {accommodationName}
              </h3>
              <p className="text-sm text-gray-600">
                {accommodation.type === 'house' ? 'Wooden House' : 'Glamping Tent'}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in</span>
              <span className="font-medium">{formatDate(startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out</span>
              <span className="font-medium">{formatDate(endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests</span>
              <span className="font-medium">{guests}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>€{totalPrice}</span>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 p-3 rounded-md text-sm">
            <p className="font-medium text-green-800">You save €{savings}!</p>
            <p className="text-green-700">
              Our direct booking price (€{totalPrice}) is 15% cheaper than Airbnb/Booking.com (€{otherPlatformsPrice}).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
