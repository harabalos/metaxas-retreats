import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import { Calendar, Users, Tent } from 'lucide-react';
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
  const [selectedTent, setSelectedTent] = useState<'1' | '2'>('1');

  const isGlampingTent = accommodation.id === 'glamping-tent';
  const nights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };

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

    const tentParam = isGlampingTent ? `&tent=${selectedTent}` : '';
    navigate(`/booking/${accommodation.id}?start=${startDate.toISOString()}&end=${endDate.toISOString()}&guests=${guests}${tentParam}`);
  };

  const getCalendarAccommodationId = () => {
    if (isGlampingTent) return `${accommodation.id}-${selectedTent}`;
    return accommodation.id;
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-card ${isDetail ? 'p-6' : 'p-5'}`}>
      {isDetail && (
        <div className="mb-5 pb-4 border-b border-gray-100">
          <p className="text-xs font-sans font-semibold uppercase tracking-widest text-wood mb-1">
            {language === 'el' ? 'Κρατήστε Τώρα' : 'Reserve Your Stay'}
          </p>
          <h3 className="text-xl font-heading font-semibold text-forest-dark">
            {language === 'el' ? 'Κάντε Κράτηση' : 'Book Your Stay'}
          </h3>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tent selector */}
        {isGlampingTent && (
          <div>
            <Label className="flex items-center gap-2 text-sm font-sans font-medium text-gray-700 mb-2">
              <Tent className="h-4 w-4 text-forest/60" />
              {language === 'el' ? 'Επιλέξτε Σκηνή' : 'Select Tent'}
            </Label>
            <RadioGroup
              value={selectedTent}
              onValueChange={(v) => setSelectedTent(v as '1' | '2')}
              className="flex gap-3"
            >
              {['1', '2'].map((n) => (
                <label
                  key={n}
                  htmlFor={`tent${n}`}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-sans font-medium ${
                    selectedTent === n
                      ? 'border-forest bg-forest text-white'
                      : 'border-gray-200 text-gray-600 hover:border-forest/40'
                  }`}
                >
                  <RadioGroupItem value={n} id={`tent${n}`} className="sr-only" />
                  {t('booking.tent')} {n}
                </label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Date picker */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-sans font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 text-forest/60" />
            {language === 'el' ? 'Ημερομηνίες' : 'Dates'}
          </Label>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            accommodationId={getCalendarAccommodationId()}
          />
        </div>

        {/* Guests */}
        <div>
          <Label htmlFor="guests" className="flex items-center gap-2 text-sm font-sans font-medium text-gray-700 mb-2">
            <Users className="h-4 w-4 text-forest/60" />
            {language === 'el' ? 'Επισκέπτες' : 'Guests'}
          </Label>
          <Input
            id="guests"
            type="number"
            min={1}
            max={accommodation.guests}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="border-gray-200 focus-visible:ring-forest/30 focus-visible:border-forest rounded-xl"
          />
          <p className="text-xs text-gray-400 mt-1">
            {language === 'el' ? `Μέγιστο ${accommodation.guests} άτομα` : `Max ${accommodation.guests} guests`}
          </p>
        </div>

        {/* Nights summary */}
        {nights > 0 && (
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-forest/4 text-sm">
            <span className="text-gray-600">
              {nights} {language === 'el' ? 'διανυκτερεύσεις' : nights === 1 ? 'night' : 'nights'}
            </span>
            <span className="text-xs text-gray-400 italic">
              {t('pricing.contactForQuote')}
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!startDate || !endDate}
          className="w-full py-3.5 rounded-xl bg-wood text-forest-dark font-sans font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-wood-light hover:shadow-cta active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:bg-wood"
        >
          {isDetail
            ? (language === 'el' ? 'Ζητήστε Προσφορά' : 'Get Quote')
            : (language === 'el' ? 'Ελέγξτε Διαθεσιμότητα' : 'Check Availability')}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
