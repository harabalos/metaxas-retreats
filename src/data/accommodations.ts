export type PriceRange = {
  season: string;
  price: number;
  months: string;
};

export type Accommodation = {
  id: string;
  name: string;
  type: 'house' | 'tent';
  description: string;
  shortDescription: string;
  price: number; // Starting price (lowest)
  priceRanges: PriceRange[];
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  availableDates?: {
    start: string;
    end: string;
  }[];
};
