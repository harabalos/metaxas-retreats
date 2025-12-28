
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accommodation } from '@/data/accommodations';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t, language } = useLanguage();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  // Get translated accommodation name
  const translatedAccommodationName = accommodation.type === 'house' 
    ? t('accommodation.woodenHouse')
    : t('accommodation.glampingTent');

  // Get the accommodation name with tent number if applicable
  const accommodationName = selectedTent 
    ? `${translatedAccommodationName} (${t('booking.tent')} ${selectedTent})` 
    : translatedAccommodationName;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('summary.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={accommodation.images[0] || '/images/placeholder.svg'}
                alt={translatedAccommodationName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sea-dark">
                {accommodationName}
              </h3>
              <p className="text-sm text-gray-600">
                {translatedAccommodationName}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('summary.checkIn')}</span>
              <span className="font-medium">{formatDate(startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('summary.checkOut')}</span>
              <span className="font-medium">{formatDate(endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('summary.guests')}</span>
              <span className="font-medium">{guests}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
            </div>
            <div className="flex justify-between font-bold">
              <span>{t('summary.total')}</span>
              <span>€{totalPrice}</span>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
