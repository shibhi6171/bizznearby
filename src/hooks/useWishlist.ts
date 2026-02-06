import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Wishlist } from '@/types/database';

export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return [];

      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          listing:listings(
            *,
            category:categories(*),
            location:locations(*),
            seller:profiles(id, full_name, avatar_url)
          )
        `)
        .eq('consumer_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Wishlist[];
    },
  });
}

export function useIsWishlisted(listingId: string) {
  const { data: wishlist } = useWishlist();
  return wishlist?.some(w => w.listing_id === listingId) ?? false;
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      // Check if already wishlisted
      const { data: existing } = await supabase
        .from('wishlists')
        .select('id')
        .eq('consumer_id', profile.id)
        .eq('listing_id', listingId)
        .single();

      if (existing) {
        // Remove from wishlist
        await supabase
          .from('wishlists')
          .delete()
          .eq('id', existing.id);
        return { added: false };
      } else {
        // Add to wishlist
        await supabase
          .from('wishlists')
          .insert({
            consumer_id: profile.id,
            listing_id: listingId,
          });
        return { added: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
