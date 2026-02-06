import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ListingsGrid } from '@/components/listings/ListingsGrid';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist';
import { Listing } from '@/types/database';

export default function WishlistPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: wishlist, isLoading } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  if (authLoading) {
    return (
      <div className="container-wide py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3]" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const listings = wishlist?.map(w => w.listing).filter(Boolean) as Listing[] | undefined;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container-wide py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-accent" />
          <div>
            <h1 className="font-display text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground mt-1">
              {listings?.length || 0} saved listings
            </p>
          </div>
        </div>

        {/* Listings */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3]" />
            ))}
          </div>
        ) : listings && listings.length > 0 ? (
          <ListingsGrid listings={listings} />
        ) : (
          <Card className="p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">No saved listings</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Browse listings and click the heart icon to save them here for later.
            </p>
            <Button asChild>
              <Link to="/listings">Browse Listings</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
