import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Banknote, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentOptionsProps {
  totalPrice: number;
  onSelectPaymentMethod: (method: string, depositOnly?: boolean) => void;
}

const PaymentOptions = ({ totalPrice, onSelectPaymentMethod }: PaymentOptionsProps) => {
  const [paymentMethod, setPaymentMethod] = useState('deposit');

  const isDepositOnly = paymentMethod === 'deposit';
  const depositAmount = Math.round(totalPrice * 0.25);
  const remainingAmount = totalPrice - depositAmount;

  const handleContinue = () => {
    onSelectPaymentMethod(paymentMethod, isDepositOnly);
  };

  const handleBoxClick = (method: string) => {
    setPaymentMethod(method);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 p-3 rounded-md text-sm">
          <p className="font-medium text-green-800">Save 15% by booking direct!</p>
          <p className="text-green-700">Our website prices are 15% cheaper than Airbnb/Booking.com.</p>
        </div>

        <RadioGroup 
          value={paymentMethod} 
          onValueChange={setPaymentMethod}
          className="space-y-3"
        >
          <div 
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleBoxClick('deposit')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="deposit" id="deposit" />
              <Label htmlFor="deposit" className="flex items-center cursor-pointer">
                <Banknote className="h-5 w-5 mr-2 text-sea" />
                <span>25% Deposit + Cash on Arrival</span>
              </Label>
            </div>
            <div className="pl-7 mt-2 text-sm text-gray-600">
              Pay €{depositAmount} deposit now, €{remainingAmount} cash on arrival
            </div>
            {paymentMethod === 'deposit' && (
              <div className="pl-7 mt-2 bg-gray-50 p-3 rounded border text-sm">
                <p className="font-medium mb-1">Bank Transfer Details:</p>
                <p>IBAN: GR16 0172 2020 0052 2012 9152 477</p>
                <p>BIC/SWIFT: PIRBGRAA</p>
                <p>Bank: Piraeus Bank</p>
                <p>Beneficiary: Metaxas Retreats</p>
                <p>Amount: €{depositAmount}</p>
                <p className="mt-2 text-xs text-gray-500">Please include your name and booking dates in the transfer description</p>
              </div>
            )}
          </div>
          
        </RadioGroup>

        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <p>Also available on:</p>
            <div className="flex space-x-3 mt-1">
              <a 
                href="https://www.airbnb.gr/rooms/936140564087838043?source_impression_id=p3_1745246045_P32OFwyiKEHNkXyt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-sea"
              >
                <span>Airbnb</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              <a 
                href="https://www.booking.com/hotel/gr/metaxaki.el.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-sea"
              >
                <span>Booking.com</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
          <Button 
            className="bg-sea hover:bg-sea-dark"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentOptions;
