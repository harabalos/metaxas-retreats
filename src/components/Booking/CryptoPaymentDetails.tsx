
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { CryptoCurrency } from '@/utils/cryptoUtils';

interface CryptoPaymentDetailsProps {
  currency: CryptoCurrency;
  totalAmount: number;
}

const CryptoPaymentDetails = ({ currency, totalAmount }: CryptoPaymentDetailsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (currency?.address) {
      navigator.clipboard.writeText(currency.address);
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };
  
  useEffect(() => {
    console.log('CryptoPaymentDetails currency:', currency);
    console.log('Currency address:', currency?.address);
    console.log('Currency QR code:', currency?.qrCode);
  }, [currency]);

  if (!currency) {
    console.error('No currency data provided to CryptoPaymentDetails');
    return <div>No cryptocurrency selected</div>;
  }

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h3 className="font-medium mb-2">Payment Details</h3>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-shrink-0">
          {currency.qrCode && (
            <img 
              src={currency.qrCode} 
              alt={`QR code for ${currency.name}`} 
              className="w-40 h-40 border rounded-md"
            />
          )}
        </div>
        <div className="space-y-4 flex-grow">
          <div>
            <p className="text-sm text-gray-500">Amount to pay</p>
            <p className="font-bold text-lg">€{totalAmount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Network</p>
            <p className="font-medium">{currency.network}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{currency.name} Address</p>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 p-2 rounded text-sm break-all">
                {currency.address}
              </code>
              <Button variant="ghost" size="icon" onClick={handleCopyAddress} className="flex-shrink-0">
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>Send exactly the amount shown to the address above.</p>
            <p>The booking will be confirmed after the transaction is verified.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPaymentDetails;
