import { Separator } from '@/components/ui/separator';
import { Accommodation } from '@/data/accommodations';
import { useLanguage } from '@/context/LanguageContext';

interface BookingSummaryProps {
  accommodation: Accommodation;
  startDate: Date;
  endDate: Date;
  guests: number;
  nights: number;
  selectedTent?: string;
}

const BookingSummary = ({ 
  accommodation,
  startDate,
  endDate,
  guests,
  nights,
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

  const translatedAccommodationName = accommodation.type === 'house' 
    ? t('accommodation.woodenHouse')
    : t('accommodation.glampingTent');

  const accommodationName = selectedTent 
    ? `${translatedAccommodationName} (${t('booking.tent')} ${selectedTent})` 
    : translatedAccommodationName;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">{t('summary.title')}</h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={accommodation.images[0] || '/images/placeholder.svg'}
              alt={translatedAccommodationName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sea-dark">
              {accommodationName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {nights} {language === 'el' ? 'διανυκτερεύσεις' : 'nights'}
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">{t('summary.checkIn')}</p>
            <p className="font-medium">{formatDate(startDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('summary.checkOut')}</p>
            <p className="font-medium">{formatDate(endDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('summary.guests')}</p>
            <p className="font-medium">{guests}</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BookingSummary;
