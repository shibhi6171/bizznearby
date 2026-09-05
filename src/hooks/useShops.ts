import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const SHOPS_PAGE_SIZE = 9;
export const SHOP_IMAGES_BUCKET = 'shop-images';

export interface ShopOffering {
  name: string;
  price: string;
}

export interface Shop {
  id: string;
  seller_id: string | null;
  category_id: string | null;
  location_id: string | null;
  name: string;
  slug: string;
  tagline: string | null;
  about: string | null;
  emoji: string | null;
  cover_image: string | null;
  images: string[];
  offerings: ShopOffering[];
  tags: string[];
  city: string | null;
  area: string | null;
  phone: string | null;
  hours: string | null;
  rating: number;
  reviews_count: number;
  years_active: number;
  is_verified: boolean;
  is_premium: boolean;
  latitude: number | null;
  longitude: number | null;
  status: string;
  created_at: string;
  category?: { id: string; name: string; slug: string } | null;
  location?: { id: string; name: string; city: string } | null;
}

export interface ShopsCursor {
  created_at: string;
  id: string;
}

const SHOP_SELECT = `
  *,
  category:categories(id, name, slug),
  location:locations(id, name, city)
`;

const normalize = (row: any): Shop => ({
  ...row,
  images: row.images ?? [],
  tags: row.tags ?? [],
  offerings: Array.isArray(row.offerings) ? (row.offerings as ShopOffering[]) : [],
});

interface ShopFilters {
  search?: string;
  categoryId?: string | null;
  city?: string | null;
}

/** Keyset (cursor) paginated shop list, ordered newest first. */
export function useShopsInfinite({ search, categoryId, city }: ShopFilters) {
  return useInfiniteQuery({
    queryKey: ['shops', search ?? '', categoryId ?? 'all', city ?? 'all'],
    initialPageParam: null as ShopsCursor | null,
    queryFn: async ({ pageParam }) => {
      let query = supabase
        .from('shops')
        .select(SHOP_SELECT)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .limit(SHOPS_PAGE_SIZE);

      if (categoryId) query = query.eq('category_id', categoryId);
      if (city) query = query.eq('city', city);

      const term = search?.trim();
      if (term) {
        const safe = term.replace(/[,%()]/g, ' ');
        query = query.or(
          `name.ilike.%${safe}%,city.ilike.%${safe}%,area.ilike.%${safe}%,tagline.ilike.%${safe}%`
        );
      }

      if (pageParam) {
        query = query.or(
          `created_at.lt.${pageParam.created_at},and(created_at.eq.${pageParam.created_at},id.lt.${pageParam.id})`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      const rows = (data ?? []).map(normalize);
      const nextCursor =
        rows.length === SHOPS_PAGE_SIZE
          ? { created_at: rows[rows.length - 1].created_at, id: rows[rows.length - 1].id }
          : null;

      return { rows, nextCursor };
    },
    getNextPageParam: (last) => last.nextCursor,
  });
}

export function useShopCities() {
  return useQuery({
    queryKey: ['shop-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shops')
        .select('city')
        .eq('status', 'active')
        .not('city', 'is', null);
      if (error) throw error;
      return Array.from(new Set((data ?? []).map((r: any) => r.city as string))).sort();
    },
  });
}

export function useShop(slug?: string) {
  return useQuery({
    queryKey: ['shop', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shops')
        .select(SHOP_SELECT)
        .eq('slug', slug!)
        .maybeSingle();
      if (error) throw error;
      return data ? normalize(data) : null;
    },
  });
}

export interface NearbyShop {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  cover_image: string | null;
  city: string | null;
  area: string | null;
  rating: number;
  category_id: string | null;
  distance_km: number;
}

/** Distance-ranked nearby shops around a coordinate (haversine radius query). */
export function useNearbyShops(params: {
  lat?: number | null;
  lng?: number | null;
  excludeId?: string;
  radiusKm?: number;
  limit?: number;
}) {
  const { lat, lng, excludeId, radiusKm = 500, limit = 5 } = params;
  return useQuery({
    queryKey: ['shops-nearby', lat, lng, excludeId, radiusKm, limit],
    enabled: lat != null && lng != null,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('shops_nearby', {
        _lat: lat as number,
        _lng: lng as number,
        _radius_km: radiusKm,
        _exclude_id: excludeId ?? null,
        _limit: limit,
      });
      if (error) throw error;
      return (data ?? []) as NearbyShop[];
    },
  });
}

/** Fallback list when we have no coordinates to measure distance from. */
export function useOtherShops(excludeId?: string, limit = 5) {
  return useQuery({
    queryKey: ['shops-other', excludeId, limit],
    queryFn: async () => {
      let query = supabase
        .from('shops')
        .select('id, name, slug, emoji, cover_image, city, area, rating, category_id')
        .eq('status', 'active')
        .order('rating', { ascending: false })
        .limit(limit + 1);
      const { data, error } = await query;
      if (error) throw error;
      return ((data ?? []) as any[]).filter((s) => s.id !== excludeId).slice(0, limit) as NearbyShop[];
    },
  });
}

export function useShopContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ shop, message }: { shop: Shop; message: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to contact this shop.');
      if (!shop.seller_id) throw new Error('This shop has no owner to contact yet.');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('leads')
        .insert({
          shop_id: shop.id,
          seller_id: shop.seller_id,
          consumer_id: profile.id,
          message,
          contact_method: 'app',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-leads'] }),
  });
}

/** Uploads images to storage and appends their paths to the shop. */
export function useUploadShopImages(shop?: Shop | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (files: File[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !shop) throw new Error('Not authorised');

      const paths: string[] = [];
      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
        const path = `${user.id}/${shop.slug}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from(SHOP_IMAGES_BUCKET)
          .upload(path, file, { cacheControl: '3600', upsert: false });
        if (error) throw error;
        paths.push(path);
      }

      const images = [...shop.images, ...paths];
      const { error: updateError } = await supabase
        .from('shops')
        .update({ images, cover_image: shop.cover_image ?? paths[0] })
        .eq('id', shop.id);
      if (updateError) throw updateError;

      return paths;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop', shop?.slug] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
}

/** Resolves storage paths to viewable signed URLs. */
export function useShopImageUrls(paths: string[]) {
  return useQuery({
    queryKey: ['shop-image-urls', paths.join('|')],
    enabled: paths.length > 0,
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from(SHOP_IMAGES_BUCKET)
        .createSignedUrls(paths, 60 * 60);
      if (error) throw error;
      return (data ?? [])
        .map((d) => d.signedUrl)
        .filter((u): u is string => !!u);
    },
  });
}

export function useMyProfileId() {
  return useQuery({
    queryKey: ['my-profile-id'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      return data?.id ?? null;
    },
  });
}
