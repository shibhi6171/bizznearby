CREATE TABLE public.shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  tagline text,
  about text,
  emoji text,
  cover_image text,
  images text[] NOT NULL DEFAULT '{}',
  offerings jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags text[] NOT NULL DEFAULT '{}',
  city text,
  area text,
  phone text,
  hours text,
  rating numeric NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  years_active integer NOT NULL DEFAULT 0,
  is_verified boolean NOT NULL DEFAULT false,
  is_premium boolean NOT NULL DEFAULT false,
  latitude numeric,
  longitude numeric,
  status listing_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.shops TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shops TO authenticated;
GRANT ALL ON public.shops TO service_role;

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active shops are publicly readable"
ON public.shops FOR SELECT
USING (status = 'active'::listing_status OR seller_id = public.get_my_profile_id() OR public.is_admin());

CREATE POLICY "Sellers can create own shops"
ON public.shops FOR INSERT TO authenticated
WITH CHECK (seller_id = public.get_my_profile_id());

CREATE POLICY "Sellers can update own shops"
ON public.shops FOR UPDATE TO authenticated
USING (seller_id = public.get_my_profile_id() OR public.is_admin());

CREATE POLICY "Sellers can delete own shops"
ON public.shops FOR DELETE TO authenticated
USING (seller_id = public.get_my_profile_id() OR public.is_admin());

CREATE TRIGGER update_shops_updated_at
BEFORE UPDATE ON public.shops
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_shops_created_at ON public.shops (created_at DESC, id DESC);
CREATE INDEX idx_shops_category ON public.shops (category_id);
CREATE INDEX idx_shops_location ON public.shops (location_id);

-- Leads can now belong to a shop instead of a listing
ALTER TABLE public.leads ALTER COLUMN listing_id DROP NOT NULL;
ALTER TABLE public.leads ADD COLUMN shop_id uuid REFERENCES public.shops(id) ON DELETE CASCADE;
ALTER TABLE public.leads ADD CONSTRAINT leads_target_present
  CHECK (listing_id IS NOT NULL OR shop_id IS NOT NULL);

-- Distance-ranked nearby shops (haversine, km)
CREATE OR REPLACE FUNCTION public.shops_nearby(
  _lat numeric,
  _lng numeric,
  _radius_km numeric DEFAULT 50,
  _exclude_id uuid DEFAULT NULL,
  _limit integer DEFAULT 6
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  emoji text,
  cover_image text,
  city text,
  area text,
  rating numeric,
  category_id uuid,
  distance_km numeric
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT s.id, s.name, s.slug, s.emoji, s.cover_image, s.city, s.area, s.rating, s.category_id,
         ROUND((
           6371 * acos(
             LEAST(1, GREATEST(-1,
               cos(radians(_lat)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(_lng))
               + sin(radians(_lat)) * sin(radians(s.latitude))
             ))
           )
         )::numeric, 1) AS distance_km
  FROM public.shops s
  WHERE s.status = 'active'
    AND s.latitude IS NOT NULL AND s.longitude IS NOT NULL
    AND (_exclude_id IS NULL OR s.id <> _exclude_id)
    AND (
      6371 * acos(
        LEAST(1, GREATEST(-1,
          cos(radians(_lat)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(_lng))
          + sin(radians(_lat)) * sin(radians(s.latitude))
        ))
      )
    ) <= _radius_km
  ORDER BY distance_km ASC, s.rating DESC
  LIMIT _limit
$$;