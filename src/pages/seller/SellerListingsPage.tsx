import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Pause, 
  Play,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useMyListings, useUpdateListing, useDeleteListing } from '@/hooks/useListings';
import { formatPrice, formatDate, truncate } from '@/lib/utils';
import { toast } from 'sonner';

export default function SellerListingsPage() {
  const { isAuthenticated, isSeller, isLoading: authLoading } = useAuth();
  const { data: listings, isLoading } = useMyListings();
  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="container-wide py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isSeller) {
    return <Navigate to="/auth" replace />;
  }

  const filteredListings = listings?.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await updateListing.mutateAsync({ id, status: newStatus });
      toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (error) {
      toast.error('Failed to update listing status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteListing.mutateAsync(deleteId);
      toast.success('Listing deleted');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container-wide py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">My Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your services and products
            </p>
          </div>
          <Button className="btn-gradient gap-2" asChild>
            <Link to="/seller/listings/new">
              <Plus className="w-5 h-5" />
              Create Listing
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Listings */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {listing.images?.[0] ? (
                        <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{listing.title}</h3>
                        {listing.is_boosted && (
                          <Badge className="badge-boosted gap-1 flex-shrink-0">
                            <Zap className="w-3 h-3" />
                            Boosted
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {listing.category?.name} • {listing.location?.name}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">{formatPrice(listing.price)}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {listing.views_count || 0} views
                        </span>
                        <span className="text-muted-foreground">
                          {listing.leads_count || 0} leads
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <Badge
                      variant={listing.status === 'active' ? 'default' : 'secondary'}
                      className={listing.status === 'active' ? 'bg-success' : ''}
                    >
                      {listing.status}
                    </Badge>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/listings/${listing.id}`} className="gap-2">
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/seller/listings/${listing.id}/edit`} className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(listing.id, listing.status)}
                          className="gap-2"
                        >
                          {listing.status === 'active' ? (
                            <>
                              <Pause className="w-4 h-4" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(listing.id)}
                          className="text-destructive gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-sm mx-auto">
              <h3 className="font-display text-xl font-semibold mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first listing to start reaching local customers
              </p>
              <Button className="btn-gradient gap-2" asChild>
                <Link to="/seller/listings/new">
                  <Plus className="w-5 h-5" />
                  Create Your First Listing
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your listing
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
