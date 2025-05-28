
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cryptoCurrencies } from '@/utils/cryptoUtils';
import PaymentProviderSelector from './PaymentProviderSelector';
import CryptocurrencySelector from './CryptocurrencySelector';
import CryptoPaymentDetails from './CryptoPaymentDetails';

interface CryptoPaymentFormProps {
  totalAmount: number;
  onComplete: () => void;
  onBack: () => void;
}

const CryptoPaymentForm = ({ totalAmount, onComplete, onBack }: CryptoPaymentFormProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('btc');
  const [paymentProvider, setPaymentProvider] = useState<string>('btcpay');

  const handleConfirmPayment = () => {
    toast.success('Payment verification initiated!');
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  // Make sure we have a valid selected currency
  const selectedCurrency = cryptoCurrencies[selectedCrypto] || cryptoCurrencies.btc;

  // Debug logs to help troubleshoot
  useEffect(() => {
    console.log('Selected crypto:', selectedCrypto);
    console.log('Selected currency data:', selectedCurrency);
  }, [selectedCrypto, selectedCurrency]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrency Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaymentProviderSelector 
          selected={paymentProvider} 
          onSelect={setPaymentProvider} 
        />
        
        <Separator />
        
        <CryptocurrencySelector 
          selected={selectedCrypto} 
          onSelect={setSelectedCrypto} 
        />
        
        <Separator />
        
        <CryptoPaymentDetails 
          currency={selectedCurrency}
          totalAmount={totalAmount}
        />

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button className="bg-sea hover:bg-sea-dark" onClick={handleConfirmPayment}>
            I've Sent the Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoPaymentForm;
