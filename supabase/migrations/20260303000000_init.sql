-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Accommodations Table
create table public.accommodations (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null, -- e.g. "wooden-house"
  name jsonb not null,       -- Store translations: {"en": "Wooden House", "el": "Ξύλινο Σπίτι", ...}
  type text not null check (type in ('house', 'tent')),
  description jsonb not null,
  short_description jsonb not null,
  base_price integer not null,
  guests integer not null,
  bedrooms integer not null,
  beds integer not null,
  bathrooms integer not null,
  amenities jsonb not null default '[]'::jsonb, -- Array of strings
  images jsonb not null default '[]'::jsonb,    -- Array of image URLs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seasonal Prices Table
create table public.accommodation_prices (
  id uuid default uuid_generate_v4() primary key,
  accommodation_id uuid references public.accommodations(id) on delete cascade,
  season text not null,      -- e.g. "high", "low"
  price integer not null,
  months text not null,      -- e.g. "July, August"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup Row Level Security (RLS)
alter table public.accommodations enable row level security;
alter table public.accommodation_prices enable row level security;

-- Policies: Anyone can read, only authenticated users can write
create policy "Allow public read access on accommodations" on public.accommodations for select using (true);
create policy "Allow public read access on prices" on public.accommodation_prices for select using (true);

create policy "Allow authenticated users to insert accommodations" on public.accommodations for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated users to update accommodations" on public.accommodations for update using (auth.role() = 'authenticated');
create policy "Allow authenticated users to delete accommodations" on public.accommodations for delete using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert prices" on public.accommodation_prices for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated users to update prices" on public.accommodation_prices for update using (auth.role() = 'authenticated');
create policy "Allow authenticated users to delete prices" on public.accommodation_prices for delete using (auth.role() = 'authenticated');
