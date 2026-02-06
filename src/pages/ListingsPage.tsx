import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ListingsGrid } from '@/components/listings/ListingsGrid';
import { useListings } from '@/hooks/useListings';
import { useCategories } from '@/hooks/useCategories';
import { useLocation } from '@/contexts/LocationContext';
import { ListingType } from '@/types/database';
import { formatPrice } from '@/lib/utils';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedLocation } = useLocation();
  const { data: categories } = useCategories();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [listingType, setListingType] = useState<ListingType | ''>((searchParams.get('type') as ListingType) || '');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: listings, isLoading } = useListings({
    search: searchQuery || undefined,
    categoryId: categoryId || undefined,
    locationId: selectedLocation?.id,
    listingType: listingType as ListingType || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value === 'all' ? '' : value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const handleTypeChange = (value: string) => {
    setListingType(value === 'all' ? '' : value as ListingType);
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('type', value);
    } else {
      params.delete('type');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryId('');
    setListingType('');
    setPriceRange([0, 10000]);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = searchQuery || categoryId || listingType || priceRange[0] > 0 || priceRange[1] < 10000;

  const selectedCategory = categories?.find(c => c.id === categoryId);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-secondary/30 border-b border-border">
        <div className="container-wide py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">
                {selectedCategory ? selectedCategory.name : 'All Listings'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {selectedLocation ? `Showing results in ${selectedLocation.name}` : 'Browse all listings'}
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-40">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
              {/* Category Filter */}
              <Select value={categoryId || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={listingType || 'all'} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                  <SelectItem value="product">Products</SelectItem>
                </SelectContent>
              </Select>

              {/* More Filters - Mobile Sheet */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <Label>Price Range</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={10000}
                        step={100}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}+</span>
                      </div>
                    </div>
                    <Button onClick={() => setFiltersOpen(false)} className="w-full">
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="w-8 h-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="w-8 h-8"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="container-wide py-8">
        <ListingsGrid 
          listings={listings} 
          isLoading={isLoading}
          emptyMessage={
            hasActiveFilters 
              ? 'No listings match your filters. Try adjusting your search.'
              : 'No listings yet. Check back later!'
          }
        />
      </div>
    </div>
  );
}
