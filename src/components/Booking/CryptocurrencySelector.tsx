
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cryptoCurrencies } from '@/utils/cryptoUtils';

interface CryptocurrencySelectorProps {
  selected: string;
  onSelect: (value: string) => void;
}

const CryptocurrencySelector = ({ selected, onSelect }: CryptocurrencySelectorProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Select Cryptocurrency</h3>
      <RadioGroup 
        value={selected} 
        onValueChange={onSelect}
        className="grid grid-cols-2 md:grid-cols-5 gap-2"
      >
        {Object.values(cryptoCurrencies).map((crypto) => (
          <div 
            key={crypto.id}
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 ${
              selected === crypto.id ? 'border-sea bg-sea-light/10' : ''
            }`}
          >
            <RadioGroupItem 
              value={crypto.id} 
              id={`crypto-${crypto.id}`} 
              className="sr-only"
            />
            <Label 
              htmlFor={`crypto-${crypto.id}`}
              className="flex flex-col items-center cursor-pointer"
            >
              <span>{crypto.name}</span>
              <span className="text-xs text-gray-500">{crypto.symbol}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default CryptocurrencySelector;
