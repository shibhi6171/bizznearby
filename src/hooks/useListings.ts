import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Listing, ListingType } from '@/types/database';

interface ListingsFilters {
  categoryId?: string;
  locationId?: string;
  listingType?: ListingType;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

export function useListings(filters: ListingsFilters = {}) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select(`
          *,
          category:categories(*),
          location:locations(*),
          seller:profiles(id, full_name, avatar_url)
        `)
        .eq('status', 'active')
        .order('is_boosted', { ascending: false })
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters.locationId) {
        query = query.eq('location_id', filters.locationId);
      }

      if (filters.listingType) {
        query = query.eq('listing_type', filters.listingType);
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as unknown as Listing[];
    },
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          category:categories(*),
          location:locations(*),
          seller:profiles(id, full_name, avatar_url, phone, bio)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch reviews separately
      const { data: reviews } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles(id, full_name, avatar_url)
        `)
        .eq('listing_id', id)
        .order('created_at', { ascending: false });

      // Increment view count (fire and forget)
      supabase
        .from('listings')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id)
        .then(() => {});

      const listingWithReviews = {
        ...data,
        reviews: reviews || [],
        review_count: reviews?.length || 0,
        average_rating: reviews?.length 
          ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
          : 0,
      };

      return listingWithReviews as unknown as Listing;
    },
    enabled: !!id,
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          category:categories(*),
          location:locations(*)
        `)
        .eq('seller_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Listing[];
    },
  });
}

interface CreateListingInput {
  title: string;
  description?: string;
  category_id: string;
  location_id: string;
  listing_type: ListingType;
  price?: number;
  price_unit?: string;
  images?: string[];
  features?: string[];
  status?: 'draft' | 'active' | 'paused' | 'expired';
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: CreateListingInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('listings')
        .insert({
          title: listing.title,
          description: listing.description,
          category_id: listing.category_id,
          location_id: listing.location_id,
          listing_type: listing.listing_type,
          price: listing.price,
          price_unit: listing.price_unit || 'fixed',
          images: listing.images || [],
          features: listing.features || [],
          status: listing.status || 'draft',
          seller_id: profile.id,
          slug: listing.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Listing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<CreateListingInput>) => {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Listing;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', data.id] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}
