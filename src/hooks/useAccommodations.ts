import { accommodations, Accommodation } from '../data/accommodations';

/**
 * The site's accommodations.
 *
 * Kept as static data (see src/data/accommodations.ts) rather than fetched, so
 * pages render immediately and there's no backend to be down. The return shape
 * matches the previous data-fetching hook so callers stay unchanged.
 */
export const useAccommodations = (): { data: Accommodation[]; isLoading: false } => {
  return { data: accommodations, isLoading: false };
};
