import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import { CalendarDays, Users, Moon } from 'lucide-react';
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

const BookingSummary = ({ accommodation, startDate, endDate, guests, nights, selectedTent }: BookingSummaryProps) => {
  const { t, language } = useLanguage();

  const locale = language === 'el' ? el : enUS;
  const fmt = (d: Date) => format(d, 'EEE, d MMM yyyy', { locale });

  const accommodationName = accommodation.type === 'house'
    ? t('accommodation.woodenHouse')
    : t('accommodation.glampingTent');

  const fullName = selectedTent
    ? `${accommodationName} · Tent ${selectedTent}`
    : accommodationName;

  const nickname = accommodation.id === 'wooden-house' ? 'Metaxaki' : 'Metaxoula';

  return (
    <div className="space-y-5">
      {/* Property preview */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={accommodation.images[0] || '/images/placeholder.svg'}
            alt={accommodationName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-xs text-wood font-sans font-semibold uppercase tracking-widest mb-0.5">{nickname}</p>
          <h4 className="font-heading font-semibold text-forest-dark leading-tight">{fullName}</h4>
          <p className="text-xs text-gray-400 mt-0.5">Mikros Gialos, Lefkada</p>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Dates + guests */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <CalendarDays className="h-4 w-4 text-forest/60 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{t('summary.checkIn')}</p>
                <p className="font-medium text-gray-800">{fmt(startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{t('summary.checkOut')}</p>
                <p className="font-medium text-gray-800">{fmt(endDate)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Moon className="h-4 w-4 text-forest/60 flex-shrink-0" />
          <span className="text-gray-700">{nights} {language === 'el' ? 'διανυκτερεύσεις' : nights === 1 ? 'night' : 'nights'}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Users className="h-4 w-4 text-forest/60 flex-shrink-0" />
          <span className="text-gray-700">{guests} {language === 'el' ? 'επισκέπτες' : guests === 1 ? 'guest' : 'guests'}</span>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Pricing note */}
      <p className="text-xs text-gray-400 italic leading-relaxed">
        {t('pricing.contactForQuote')}
      </p>
    </div>
  );
};

export default BookingSummary;
