import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Eye, 
  Users, 
  FileText, 
  DollarSign, 
  Plus, 
  TrendingUp,
  ArrowRight,
  Inbox
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useSellerStats } from '@/hooks/useSellerStats';
import { useMyListings } from '@/hooks/useListings';
import { useMyLeads } from '@/hooks/useLeads';
import { formatPrice } from '@/lib/utils';

export default function SellerDashboardPage() {
  const { isAuthenticated, isSeller, isLoading: authLoading, profile } = useAuth();
  const { data: stats, isLoading: statsLoading } = useSellerStats();
  const { data: listings, isLoading: listingsLoading } = useMyListings();
  const { data: leads, isLoading: leadsLoading } = useMyLeads();

  if (authLoading) {
    return (
      <div className="container-wide py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isSeller) {
    return (
      <div className="container-wide py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Become a Seller</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You need a seller account to access the dashboard. Sign up as a seller to start listing your services and products.
        </p>
        <Button asChild>
          <Link to="/auth?mode=signup&role=seller">Sign Up as Seller</Link>
        </Button>
      </div>
    );
  }

  const recentListings = listings?.slice(0, 5) || [];
  const recentLeads = leads?.filter(l => l.status === 'new').slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container-wide py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0] || 'Seller'}!</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your listings</p>
          </div>
          <Button className="btn-gradient gap-2" asChild>
            <Link to="/seller/listings/new">
              <Plus className="w-5 h-5" />
              Create Listing
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">{stats?.totalViews.toLocaleString() || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">{stats?.totalLeads || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">{stats?.activeListings || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">{stats?.conversionRate.toFixed(1) || 0}%</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Listings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Listings</CardTitle>
                <CardDescription>Your most recent listings</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/seller/listings" className="gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {listingsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : recentListings.length > 0 ? (
                <div className="space-y-3">
                  {recentListings.map((listing) => (
                    <Link
                      key={listing.id}
                      to={`/seller/listings/${listing.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {listing.images?.[0] && (
                          <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {listing.views_count || 0} views • {listing.leads_count || 0} leads
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        listing.status === 'active' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {listing.status}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No listings yet</p>
                  <Button size="sm" asChild>
                    <Link to="/seller/listings/new">Create Your First Listing</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>New Leads</CardTitle>
                <CardDescription>Recent inquiries from customers</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/seller/leads" className="gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : recentLeads.length > 0 ? (
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      to="/seller/leads"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{lead.consumer?.full_name || 'Customer'}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {lead.message || 'Interested in your listing'}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">New</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No new leads yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Leads will appear here when customers contact you
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
