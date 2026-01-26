
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import { Calendar, Users, Tent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DateRangePicker from './DateRangePicker';
import { Accommodation } from '@/data/accommodations';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/context/LanguageContext';

interface BookingFormProps {
  accommodation: Accommodation;
  isDetail?: boolean;
}

const BookingForm = ({ accommodation, isDetail = false }: BookingFormProps) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(1);
  const [selectedTent, setSelectedTent] = useState<"1" | "2">("1");
  
  // Determine if we're booking a glamping tent
  const isGlampingTent = accommodation.id === 'glamping-tent';

  // Calculate number of nights
  const nights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Reset dates when the tent selection changes
  useEffect(() => {
    if (isGlampingTent) {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [selectedTent, isGlampingTent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error(language === 'el' ? 'Παρακαλώ επιλέξτε ημερομηνίες' : 'Please select check-in and check-out dates');
      return;
    }
    
    if (guests < 1 || guests > accommodation.guests) {
      toast.error(`${language === 'el' ? 'Παρακαλώ επιλέξτε μεταξύ 1 και' : 'Please select between 1 and'} ${accommodation.guests} ${language === 'el' ? 'επισκέπτες' : 'guests'}`);
      return;
    }
    
    // Add tent selection to query params if it's a glamping tent
    const tentParam = isGlampingTent ? `&tent=${selectedTent}` : '';
    
    // Navigate to booking page with dates and guests (no price)
    navigate(`/booking/${accommodation.id}?start=${startDate.toISOString()}&end=${endDate.toISOString()}&guests=${guests}${tentParam}`);
  };

  // Get actual accommodation ID for the calendar based on tent selection
  const getCalendarAccommodationId = () => {
    if (isGlampingTent) {
      return `${accommodation.id}-${selectedTent}`;
    }
    return accommodation.id;
  };

  return (
    <Card className={`shadow ${isDetail ? 'w-full md:w-[350px] lg:w-[400px] h-fit sticky top-24' : ''}`}>
      {isDetail && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-forest-dark">
            {language === 'el' ? 'Κάντε Κράτηση' : 'Book Your Stay'}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={isDetail ? 'pt-4' : ''}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isGlampingTent && (
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Tent className="h-4 w-4 mr-2 text-sea" />
                  <span>{language === 'el' ? 'Επιλέξτε Σκηνή' : 'Select Tent'}</span>
                </Label>
                <RadioGroup
                  value={selectedTent}
                  onValueChange={(value) => setSelectedTent(value as "1" | "2")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="tent1" />
                    <Label htmlFor="tent1" className="cursor-pointer">{t('booking.tent')} 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="tent2" />
                    <Label htmlFor="tent2" className="cursor-pointer">{t('booking.tent')} 2</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="date-range" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-sea" />
                <span>{language === 'el' ? 'Ημερομηνίες' : 'Dates'}</span>
              </Label>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
                accommodationId={getCalendarAccommodationId()}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-sea" />
                <span>{language === 'el' ? 'Επισκέπτες' : 'Guests'}</span>
              </Label>
              <Input
                id="guests"
                type="number"
                min={1}
                max={accommodation.guests}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="border-sea-light focus-visible:ring-sea-light"
              />
              <p className="text-xs text-gray-500">
                {language === 'el' ? `Μέγιστο ${accommodation.guests} άτομα` : `Max ${accommodation.guests} guests`}
              </p>
            </div>
            
            {(startDate && endDate) && (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{nights} {language === 'el' ? 'διανυκτερεύσεις' : 'nights'}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('pricing.contactForQuote')}
                </p>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-4 bg-forest hover:bg-forest-dark text-white"
            disabled={!startDate || !endDate}
          >
            {isDetail 
              ? (language === 'el' ? 'Ζητήστε Προσφορά' : 'Get Quote') 
              : (language === 'el' ? 'Ελέγξτε Διαθεσιμότητα' : 'Check Availability')
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
