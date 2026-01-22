import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Bitcoin, Banknote } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import SEOHead from '@/components/SEO/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const bookingData = location.state;
  
  if (!bookingData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Booking Information Missing</h1>
          <p className="mb-8">Please complete a booking before accessing this page.</p>
          <Button onClick={() => navigate('/')} className="bg-sea hover:bg-sea-dark">
            Return to Home
          </Button>
        </div>
      </Layout>
    );
  }
  
  const { 
    accommodation, 
    startDate, 
    endDate, 
    guests, 
    totalPrice, 
    customerName, 
    paymentMethod, 
    isDepositOnly 
  } = bookingData;
  
  // Format date as "Monday, January 1, 2023"
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate deposit amount if applicable
  const depositAmount = Math.round(totalPrice * 0.25);
  const remainingAmount = totalPrice - depositAmount;
  
  // Payment method details
  const getPaymentDetails = () => {
    switch (paymentMethod) {
      case 'card':
        return {
          title: 'Bank Transfer',
          icon: <CreditCard className="text-sea h-5 w-5 mr-2" />,
          description: `Full amount of €${totalPrice} to be paid by bank transfer.`,
          extraInfo: (
            <div className="mt-2 text-sm bg-gray-50 p-2 rounded border">
              <p className="font-medium mb-1">Bank Details:</p>
              <p>IBAN: GR16 0172 2020 0052 2012 9152 477</p>
              <p>BIC/SWIFT: PIRBGRAA</p>
              <p>Bank: Piraeus Bank</p>
              <p>Beneficiary: Metaxas Retreats</p>
            </div>
          )
        };
      case 'deposit':
        return {
          title: isDepositOnly ? '25% Deposit + Cash on Arrival' : 'Full Payment by Bank Transfer',
          icon: <Banknote className="text-sea h-5 w-5 mr-2" />,
          description: isDepositOnly 
            ? `Deposit of €${depositAmount} to be paid by bank transfer. Remaining €${remainingAmount} to be paid in cash on arrival.`
            : `Full amount of €${totalPrice} to be paid by bank transfer.`,
          extraInfo: (
            <div className="mt-2 text-sm bg-gray-50 p-2 rounded border">
              <p className="font-medium mb-1">Bank Details:</p>
              <p>IBAN: GR16 0172 2020 0052 2012 9152 477</p>
              <p>BIC/SWIFT: PIRBGRAA</p>
              <p>Bank: Piraeus Bank</p>
              <p>Beneficiary: Metaxas Retreats</p>
              <p>Amount: €{isDepositOnly ? depositAmount : totalPrice}</p>
            </div>
          )
        };
      case 'crypto':
        return {
          title: 'Cryptocurrency Payment',
          icon: <Bitcoin className="text-sea h-5 w-5 mr-2" />,
          description: `Payment of €${totalPrice} in cryptocurrency.`,
          extraInfo: (
            <div className="mt-2 text-sm text-green-600">
              <p>We've received confirmation of your cryptocurrency payment request.</p>
              <p>You will receive an email with the payment verification details.</p>
            </div>
          )
        };
      default:
        return {
          title: 'Payment',
          icon: null,
          description: `Total: €${totalPrice}`,
          extraInfo: null
        };
    }
  };

  const paymentDetails = getPaymentDetails();
  
  return (
    <Layout>
      <SEOHead
        title="Booking Confirmation"
        description="Your booking confirmation at Metaxas Retreats glamping in Lefkada, Greece."
        robots="noindex, nofollow"
      />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500 h-16 w-16" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-sea-dark">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your booking. We're looking forward to welcoming you to Metaxas Retreats.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-heading font-semibold mb-4 text-sea-dark">
              Booking Details
            </h2>
            
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
                    {accommodation.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {accommodation.type === 'house' ? 'Wooden House' : 'Glamping Tent'}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Guest Name</p>
                  <p className="font-medium">{customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number of Guests</p>
                  <p className="font-medium">{guests}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-in Date</p>
                  <p className="font-medium">{formatDate(startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out Date</p>
                  <p className="font-medium">{formatDate(endDate)}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center mb-2">
                  {paymentDetails.icon}
                  <span className="font-semibold">{paymentDetails.title}</span>
                </div>
                <p className="text-gray-700">{paymentDetails.description}</p>
                {paymentDetails.extraInfo}
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Price</span>
                <span className="text-xl font-bold text-sea-dark">€{totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6 bg-sand-light p-6 rounded-lg">
          <h2 className="text-xl font-heading font-semibold text-sea-dark">
            What's Next?
          </h2>
          <p>
            We've sent a confirmation email with all the details of your booking. 
            If you have any questions or special requests, please don't hesitate to contact us.
          </p>
          <div className="pt-2">
            <Button onClick={() => navigate('/')} className="bg-sea hover:bg-sea-dark">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingConfirmation;
