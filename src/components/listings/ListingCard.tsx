import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Listing } from '@/types/database';
import { formatPrice, truncate } from '@/lib/utils';
import { useToggleWishlist, useIsWishlisted } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { isAuthenticated } = useAuth();
  const isWishlisted = useIsWishlisted(listing.id);
  const toggleWishlist = useToggleWishlist();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleWishlist.mutate(listing.id);
    }
  };

  const placeholderImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
  const imageUrl = listing.images?.[0] || placeholderImage;

  return (
    <Link to={`/listings/${listing.id}`}>
      <Card className="group overflow-hidden card-elevated h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.is_boosted && (
              <Badge className="badge-boosted gap-1">
                <Zap className="w-3 h-3" />
                Boosted
              </Badge>
            )}
            {listing.is_featured && (
              <Badge className="badge-featured">Featured</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background",
                isWishlisted && "text-destructive"
              )}
              onClick={handleWishlistClick}
            >
              <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
            </Button>
          )}

          {/* Price Tag */}
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm font-semibold text-sm">
              {formatPrice(listing.price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category & Location */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="capitalize">{listing.category?.name || listing.listing_type}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {listing.location?.name || 'Unknown'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-accent transition-colors">
            {truncate(listing.title, 50)}
          </h3>

          {/* Description */}
          {listing.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {listing.description}
            </p>
          )}

          {/* Rating & Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-sm font-medium">
                {listing.average_rating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-xs text-muted-foreground">
                ({listing.review_count || 0})
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {listing.views_count || 0} views
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
