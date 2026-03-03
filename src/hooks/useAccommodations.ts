import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useLanguage } from '../context/LanguageContext';
import { Accommodation, PriceRange } from '../data/accommodations';

export const useAccommodations = () => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['accommodations', language],
    queryFn: async (): Promise<Accommodation[]> => {
      // Fetch accommodations alongside their seasonal prices
      const { data, error } = await supabase
        .from('accommodations')
        .select(`
          *,
          accommodation_prices (*)
        `);

      if (error) {
        console.error('Error fetching accommodations:', error);
        throw error;
      }

      // Map Supabase DB response to the frontend Accommodation type
      return data.map((acc: any) => {
        // Extract correct language string from JSONb (fallback to 'en')
        const name = acc.name[language] || acc.name['en'] || '';
        const description = acc.description[language] || acc.description['en'] || '';
        const shortDescription = acc.short_description[language] || acc.short_description['en'] || '';

        const priceRanges: PriceRange[] = acc.accommodation_prices
          ? acc.accommodation_prices.map((pr: any) => ({
              season: pr.season,
              price: pr.price,
              months: pr.months,
            }))
          : [];

        // Note: we use 'slug' from DB mapped to 'id' in frontend for backward compatibility
        return {
          id: acc.slug,
          name,
          type: acc.type as 'house' | 'tent',
          description,
          shortDescription,
          price: acc.base_price,
          priceRanges,
          guests: acc.guests,
          bedrooms: acc.bedrooms,
          beds: acc.beds,
          bathrooms: acc.bathrooms,
          amenities: acc.amenities || [],
          images: acc.images || [],
        };
      });
    },
  });
};
