import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SellerStats } from '@/types/database';

export function useSellerStats() {
  return useQuery({
    queryKey: ['seller-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      // Get listings stats
      const { data: listings } = await supabase
        .from('listings')
        .select('id, views_count, leads_count, status')
        .eq('seller_id', profile.id);

      // Get leads
      const { data: leads } = await supabase
        .from('leads')
        .select('id, status')
        .eq('seller_id', profile.id);

      // Get transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, status')
        .eq('user_id', profile.id)
        .eq('status', 'completed');

      const totalViews = listings?.reduce((acc, l) => acc + (l.views_count || 0), 0) || 0;
      const totalLeads = leads?.length || 0;
      const totalListings = listings?.length || 0;
      const activeListings = listings?.filter(l => l.status === 'active').length || 0;
      const convertedLeads = leads?.filter(l => l.status === 'converted').length || 0;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
      const totalEarnings = transactions?.reduce((acc, t) => acc + t.amount, 0) || 0;

      return {
        totalViews,
        totalLeads,
        totalListings,
        activeListings,
        conversionRate,
        totalEarnings,
      } as SellerStats;
    },
  });
}
