
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

export const accommodations: Accommodation[] = [
  {
    id: "wooden-house",
    name: "Wooden House",
    type: "house",
    description: "Experience authentic Greek island living in our charming wooden house. Nestled among olive trees with stunning sea views. The spacious terrace is ideal for enjoying the famous Greek sunsets while sipping local wine. Inside, you'll find a fully equipped kitchen, comfortable living area, and thoughtfully designed bedrooms with premium linens.",
    shortDescription: "Charming wooden house with sea views for comfortable vacation",
    price: 50, // Starting from price
    priceRanges: [
      { season: "low", price: 50, months: "May, November" },
      { season: "mid", price: 70, months: "October" },
      { season: "shoulder", price: 90, months: "June, September" },
      { season: "high", price: 120, months: "July" },
      { season: "peak", price: 140, months: "August" }
    ],
    guests: 4,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: [
      "Sea view",
      "Parking",
      "50m from the beach",
      "Air conditioning", 
      "Fully equipped kitchen", 
      "High-speed Wi-Fi", 
      "Private terrace", 
      "Outdoor dining area",
      "Washing machine",
      "Ramp access"
    ],
    images: [
      "/assets/e9f9bd84-9f74-4189-bf30-d6640a566fd3.jpg",
      "/assets/f3dbfe79-a8c0-42d5-87d3-df85833746be.jpg", 
      "/assets/c684f5f3-b382-4e9b-b997-9a4614320960.jpg",
      "/assets/b548966e-47b9-4b60-a67c-8860d08b8aac.jpg", 
      "/assets/85ab03d1-caf1-4700-8b73-024e7542386a.jpg", 
      "/assets/88d93693-0850-4a0d-994d-97a5c35dfc96.jpg", 
      "/assets/fd98c289-04aa-409e-abf0-a5369a9855be.jpg", 
      "/assets/avli.jpg",
      "/assets/avli2.jpg", 
      "/assets/477283771.jpg",
      "/assets/479336955.jpg",
      "/assets/480234586.jpg",
      "/assets/krev.jpg",
      "/assets/krev2.jpg",
    ],
    availableDates: [
      {
        start: "2025-05-01",
        end: "2025-11-30"
      }
    ]
  },
  {
    id: "glamping-tent",
    name: "Glamping Tent",
    type: "tent",
    description: "Our luxury glamping tent offers an unforgettable experience combining the adventure of camping with hotel-like amenities. Set in a peaceful location among ancient olive trees, this spacious tent features one comfortable double-sized bed and 3 single beds with premium linens, electricity, and stylish furnishings. The private outdoor seating area is perfect for morning coffee or evening relaxation under the stars. Experience the magic of island living with all the comforts you need.",
    shortDescription: "Spacious glamping experience with hotel-quality comfort surrounded by beautiful trees",
    price: 50, // Starting from price
    priceRanges: [
      { season: "low", price: 50, months: "May, November" },
      { season: "mid", price: 70, months: "October" },
      { season: "shoulder", price: 80, months: "June, September" },
      { season: "high", price: 110, months: "July" },
      { season: "peak", price: 120, months: "August" }
    ],
    guests: 5,
    bedrooms: 2,
    beds: 5,
    bathrooms: 1,
    amenities: [
      "Sea view",
      "Parking",
      "Air Conditioning", 
      "Private outdoor seating", 
      "Eco-friendly amenities",
      "50m from the beach",
      "Fully equipped kitchen", 
      "High-speed Wi-Fi", 
      "Private terrace"
    ],
    images: [
      "/assets/glamping-tent/prosopsi.jpg", 
      "/assets/glamping-tent/prosopsiLight.jpg", 
      "/assets/glamping-tent/prosopsi2.jpg",
      "/assets/glamping-tent/prosopsi3.jpg",
      "/assets/glamping-tent/fonto.jpg",
      "/assets/glamping-tent/krasaki.jpg",
      "/assets/glamping-tent/kouzina.jpg",
      "/assets/glamping-tent/trapezaria.jpg",
      "/assets/glamping-tent/trapezaria2.jpg",
      "/assets/glamping-tent/trapezariaNight.jpg",
      "/assets/glamping-tent/trapezariaClose.jpg",
      "/assets/glamping-tent/krevatia.jpg",
      "/assets/glamping-tent/krevatia2.jpg",
      "/assets/glamping-tent/krevati.jpg",
      "/assets/glamping-tent/krevati2.jpg",
      "/assets/glamping-tent/banio.jpg",
      "/assets/glamping-tent/banio2.jpg",
      "/assets/glamping-tent/banio3.jpg",
      "/assets/glamping-tent/view.jpg",
      "/assets/glamping-tent/view2.jpg"
    ],
    availableDates: [
      {
        start: "2023-05-01",
        end: "2023-11-30"
      }
    ]
  }
];
