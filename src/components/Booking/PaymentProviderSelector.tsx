
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { paymentProviders } from '@/utils/cryptoUtils';

interface PaymentProviderSelectorProps {
  selected: string;
  onSelect: (value: string) => void;
}

const PaymentProviderSelector = ({ selected, onSelect }: PaymentProviderSelectorProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Select Payment Provider</h3>
      <RadioGroup 
        value={selected} 
        onValueChange={onSelect}
        className="grid grid-cols-1 md:grid-cols-3 gap-2"
      >
        {paymentProviders.map((provider) => (
          <div 
            key={provider.id}
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 ${
              selected === provider.id ? 'border-sea bg-sea-light/10' : ''
            }`}
          >
            <RadioGroupItem 
              value={provider.id} 
              id={`provider-${provider.id}`} 
              className="sr-only"
            />
            <Label 
              htmlFor={`provider-${provider.id}`}
              className="flex items-center cursor-pointer"
            >
              {provider.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PaymentProviderSelector;
