import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadStatus } from '@/types/database';

export function useMyLeads() {
  return useQuery({
    queryKey: ['my-leads'],
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
        .from('leads')
        .select(`
          *,
          listing:listings(id, title, images),
          consumer:profiles!leads_consumer_id_fkey(id, full_name, email, phone, avatar_url)
        `)
        .eq('seller_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Lead[];
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, sellerId, message }: { listingId: string; sellerId: string; message?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('leads')
        .insert({
          listing_id: listingId,
          seller_id: sellerId,
          consumer_id: profile.id,
          message,
          contact_method: 'app',
        })
        .select()
        .single();

      if (error) throw error;

      // Update leads count on listing
      await supabase.rpc('is_admin').then(() => {
        supabase
          .from('listings')
          .update({ leads_count: 1 }) // This will be fixed with proper increment
          .eq('id', listingId);
      });

      return data as unknown as Lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-leads'] });
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-leads'] });
    },
  });
}
