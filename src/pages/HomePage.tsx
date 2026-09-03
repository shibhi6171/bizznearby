import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Shield, Zap, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ListingsGrid } from '@/components/listings/ListingsGrid';
import { useCategories } from '@/hooks/useCategories';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { useListings } from '@/hooks/useListings';
import { useLocation } from '@/contexts/LocationContext';

// Category icons mapping

export default function HomePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { selectedLocation } = useLocation();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredListings, isLoading: listingsLoading } = useListings({
    locationId: selectedLocation?.id,
    limit: 8,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/listings?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
        
        <div className="container-wide relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up">
              Find Local{' '}
              <span className="text-gradient">Services & Products</span>
              {' '}Near You
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Connect with trusted local sellers. From home services to unique products, 
              discover what your neighborhood has to offer.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Try 'plumber in my area' or 'vintage furniture'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg bg-background/95 backdrop-blur-sm border-0 shadow-lg"
                  />
                </div>
                <Button type="submit" size="lg" className="btn-gradient h-14 px-8">
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              {[
                { icon: MapPin, label: '8+ Cities', sublabel: 'Covered' },
                { icon: Shield, label: 'Verified', sublabel: 'Sellers' },
                { icon: Zap, label: 'Instant', sublabel: 'Connect' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 px-4 py-2 rounded-full glass">
                  <stat.icon className="w-5 h-5 text-accent" />
                  <div className="text-left">
                    <p className="font-semibold text-primary-foreground">{stat.label}</p>
                    <p className="text-xs text-primary-foreground/60">{stat.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Browse Categories</h2>
              <p className="text-muted-foreground mt-1">Find exactly what you need</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link to="/categories" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoriesLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3" />
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                  </Card>
                ))
              : categories?.slice(0, 10).map((category) => (
                  <Link key={category.id} to={`/listings?category=${category.id}`}>
                    <Card className="p-6 text-center hover:shadow-lg hover:border-accent/50 transition-all group cursor-pointer">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                        {getCategoryIcon(category.icon)}
                      </div>
                      <h3 className="font-medium text-sm group-hover:text-accent transition-colors">
                        {category.name}
                      </h3>
                    </Card>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-secondary/30">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Featured Listings</h2>
              <p className="text-muted-foreground mt-1">
                {selectedLocation ? `Top picks in ${selectedLocation.name}` : 'Popular listings near you'}
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link to="/listings" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <ListingsGrid 
            listings={featuredListings} 
            isLoading={listingsLoading}
            emptyMessage="No listings yet. Be the first to create one!"
          />

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" asChild>
              <Link to="/listings" className="gap-2">
                View All Listings <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hero-gradient">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Join thousands of local sellers. List your services or products and connect with customers in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-gradient" asChild>
                <Link to="/auth?mode=signup&role=seller">
                  Start Selling Today
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/listings">
                  Browse as Consumer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
