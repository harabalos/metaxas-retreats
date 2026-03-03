import { Link } from 'react-router-dom';
import { Home, Tent, Users, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Accommodation } from '@/data/accommodations';
import { useLanguage } from '@/context/LanguageContext';

interface AccommodationCardProps {
  accommodation: Accommodation;
}

const AccommodationCard = ({ accommodation }: AccommodationCardProps) => {
  const { id, name, type, shortDescription, guests, beds, images } = accommodation;
  const { t, language } = useLanguage();

  const translatedName = id === 'wooden-house' ? t('accommodation.woodenHouse') : t('accommodation.glampingTent');
  const translatedDescription = id === 'wooden-house' 
    ? t('accommodation.woodenHouse.short') 
    : t('accommodation.glampingTent.short');

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-52 overflow-hidden">
        <img
          src={images[0] || '/images/placeholder.svg'}
          alt={translatedName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow">
          {type === 'house' ? (
            <Home className="h-5 w-5 text-forest" />
          ) : (
            <Tent className="h-5 w-5 text-leaf" />
          )}
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="text-xl font-heading font-semibold text-forest-dark mb-0">{translatedName}</h3>
        <p className="text-sm text-forest mb-3">{id === "wooden-house" ? "Metaxaki" : "Metaxoula"}</p>
        <p className="text-gray-600 mb-4 line-clamp-2">{translatedDescription}</p>
        
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center text-leaf">
            <Users className="mr-1 h-4 w-4" />
            <span>{guests} {t('card.guests')}</span>
          </div>
          <div className="flex items-center text-leaf">
            <BedDouble className="mr-1 h-4 w-4" />
            <span>{beds} {t('card.beds')}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-4 border-t flex justify-between items-center">
        <Link to={`/accommodation/${id}`} onClick={() => window.scrollTo(0, 0)}>
          <Button className="bg-forest hover:bg-forest-dark">{t('card.viewDetails')}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AccommodationCard;
