import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Heart, 
  Share2, 
  Phone, 
  MessageCircle,
  Calendar,
  Eye,
  Check,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useListing } from '@/hooks/useListings';
import { useToggleWishlist, useIsWishlisted } from '@/hooks/useWishlist';
import { useCreateLead } from '@/hooks/useLeads';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice, formatDate, getInitials, generateWhatsAppLink, generatePhoneLink, cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  const { data: listing, isLoading, error } = useListing(id || '');
  const isWishlisted = useIsWishlisted(id || '');
  const toggleWishlist = useToggleWishlist();
  const createLead = useCreateLead();

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container-wide py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container-wide py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Listing not found</h2>
        <p className="text-muted-foreground mb-6">This listing may have been removed or doesn't exist.</p>
        <Button asChild>
          <Link to="/listings">Browse Listings</Link>
        </Button>
      </div>
    );
  }

  const handleContact = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to contact the seller');
      navigate('/auth');
      return;
    }

    if (!listing.seller) return;

    try {
      await createLead.mutateAsync({
        listingId: listing.id,
        sellerId: listing.seller.id,
        message: message || 'Interested in this listing',
      });
      toast.success('Message sent! The seller will contact you soon.');
      setContactModalOpen(false);
      setMessage('');
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save listings');
      navigate('/auth');
      return;
    }
    toggleWishlist.mutate(listing.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: listing.description || 'Check out this listing!',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const placeholderImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop';
  const images = listing.images?.length ? listing.images : [placeholderImage];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="container-wide py-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link to="/listings">
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </Link>
        </Button>
      </div>

      <div className="container-wide pb-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
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

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "rounded-full",
                    isWishlisted && "text-destructive"
                  )}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImage === idx ? "border-accent" : "border-transparent hover:border-border"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {listing.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-3">
                    {listing.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Reviews</CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="font-semibold">{listing.average_rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-muted-foreground">({listing.review_count || 0})</span>
                </div>
              </CardHeader>
              <CardContent>
                {listing.reviews && listing.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {listing.reviews.map((review) => (
                      <div key={review.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={review.reviewer?.avatar_url || undefined} />
                          <AvatarFallback>{getInitials(review.reviewer?.full_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{review.reviewer?.full_name || 'Anonymous'}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1 my-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3 h-3",
                                  i < review.rating ? "fill-accent text-accent" : "text-muted"
                                )}
                              />
                            ))}
                          </div>
                          {review.comment && (
                            <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Info & Contact */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-20">
              <CardContent className="pt-6 space-y-6">
                {/* Price */}
                <div>
                  <span className="text-3xl font-display font-bold">{formatPrice(listing.price)}</span>
                  {listing.price_unit && listing.price_unit !== 'fixed' && (
                    <span className="text-muted-foreground ml-1">/{listing.price_unit}</span>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h1 className="font-display text-2xl font-bold leading-tight">{listing.title}</h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {listing.location?.name || 'Unknown'}
                    </span>
                    <span className="capitalize">{listing.category?.name}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 py-3 border-y border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-medium">{listing.average_rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{listing.views_count || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(listing.created_at)}</span>
                  </div>
                </div>

                {/* Seller Info */}
                {listing.seller && (
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={listing.seller.avatar_url || undefined} />
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {getInitials(listing.seller.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{listing.seller.full_name || 'Seller'}</p>
                      <p className="text-sm text-muted-foreground">Seller</p>
                    </div>
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <Button className="w-full btn-gradient gap-2" onClick={() => setContactModalOpen(true)}>
                    <MessageCircle className="w-5 h-5" />
                    Send Message
                  </Button>
                  
                  {listing.seller?.phone && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" asChild>
                        <a href={generatePhoneLink(listing.seller.phone)} className="gap-2">
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a 
                          href={generateWhatsAppLink(listing.seller.phone, `Hi, I'm interested in "${listing.title}"`)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription>
              Send a message to {listing.seller?.full_name || 'the seller'} about this listing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder={`Hi, I'm interested in "${listing.title}". Is it still available?`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleContact} disabled={createLead.isPending}>
              {createLead.isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
