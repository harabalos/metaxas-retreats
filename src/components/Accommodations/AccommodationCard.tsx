import { Link } from 'react-router-dom';
import { Users, BedDouble, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Accommodation } from '@/data/accommodations';
import { useLanguage } from '@/context/LanguageContext';

interface AccommodationCardProps {
  accommodation: Accommodation;
  index?: number;
}

const AccommodationCard = ({ accommodation, index = 0 }: AccommodationCardProps) => {
  const { id, guests, beds, images } = accommodation;
  const { t, language } = useLanguage();

  const translatedName = id === 'wooden-house' ? t('accommodation.woodenHouse') : t('accommodation.glampingTent');
  const translatedDescription = id === 'wooden-house'
    ? t('accommodation.woodenHouse.short')
    : t('accommodation.glampingTent.short');

  const nickname = id === 'wooden-house' ? 'Metaxaki' : 'Metaxoula';
  const tag = id === 'wooden-house'
    ? t('accommodation.woodenHouse')
    : t('accommodation.glampingTent');

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
    >
      <Link
        to={`/accommodation/${id}`}
        onClick={() => window.scrollTo(0, 0)}
        className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400"
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={images[0] || '/images/placeholder.svg'}
            alt={translatedName}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Tag pill */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-forest-dark text-xs font-sans font-semibold tracking-wide">
            {tag}
          </div>

          {/* Arrow on hover */}
          <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-wood flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <ArrowRight className="h-4 w-4 text-forest-dark" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-wood text-xs font-sans font-semibold uppercase tracking-widest mb-1">{nickname}</p>
          <h3 className="text-xl font-heading font-semibold text-forest-dark mb-2 group-hover:text-forest transition-colors">
            {translatedName}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{translatedDescription}</p>

          {/* Stats */}
          <div className="flex items-center gap-5 text-sm text-gray-500 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-forest/60" />
              <span>{guests} {t('card.guests')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-forest/60" />
              <span>{beds} {t('card.beds')}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AccommodationCard;
