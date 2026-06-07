import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useLanguage } from '../context/LanguageContext';
import { Accommodation, PriceRange } from '../data/accommodations';
import { Database } from '../integrations/supabase/types';

type AccommodationRow = Database['public']['Tables']['accommodations']['Row'] & {
  accommodation_prices: Database['public']['Tables']['accommodation_prices']['Row'][];
};

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
      const mapped = (data as AccommodationRow[]).map((acc) => {
        // Extract correct language string from JSONb (fallback to 'en')
        const name = (acc.name as Record<string, string>)[language] || (acc.name as Record<string, string>)['en'] || '';
        const description = (acc.description as Record<string, string>)[language] || (acc.description as Record<string, string>)['en'] || '';
        const shortDescription = (acc.short_description as Record<string, string>)[language] || (acc.short_description as Record<string, string>)['en'] || '';

        const priceRanges: PriceRange[] = acc.accommodation_prices
          ? acc.accommodation_prices.map((pr) => ({
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
          amenities: (acc.amenities as string[]) || [],
          images: (acc.images as string[]) || [],
        };
      });

      // ── Merge the two identical glamping tents into a single listing ──
      // Tent 1 & Tent 2 are physically identical (same photos, layout, view);
      // only their calendars differ. We present them as ONE "Glamping Tent"
      // and combine availability in useBlockedDates (free if either tent is free).
      // The two separate calendars stay intact in the backend (iCal sync per tent).
      const isTent = (id: string) => id === 'glamping-tent-1' || id === 'glamping-tent-2';
      const result: Accommodation[] = [];
      let tentMerged = false;
      for (const acc of mapped) {
        if (isTent(acc.id)) {
          if (!tentMerged) {
            const base = mapped.find((a) => a.id === 'glamping-tent-1') || acc;
            result.push({
              ...base,
              id: 'glamping-tent',
              name: base.name.replace(/\s*\d+\s*$/, ''), // "Glamping Tent 1" → "Glamping Tent"
            });
            tentMerged = true;
          }
          continue;
        }
        result.push(acc);
      }
      return result;
    },
  });
};
