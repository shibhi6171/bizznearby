import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, BadgeCheck, Clock, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/useCategories';
import { useShopsInfinite, useShopCities, useShopImageUrls, Shop } from '@/hooks/useShops';

function ShopCover({ shop }: { shop: Shop }) {
  const path = shop.cover_image ?? shop.images[0];
  const { data: urls } = useShopImageUrls(path ? [path] : []);
  const url = urls?.[0];

  if (url) {
    return (
      <img
        src={url}
        alt={`${shop.name} storefront`}
        loading="lazy"
        className="w-12 h-12 rounded-xl object-cover shrink-0"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
      {shop.emoji ?? '🏪'}
    </div>
  );
}

export default function ShopsPage() {
  const [queryInput, setQueryInput] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [categoryId, setCategoryId] = React.useState<string | null>(null);
  const [city, setCity] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setSearch(queryInput), 300);
    return () => clearTimeout(t);
  }, [queryInput]);

  const { data: categories } = useCategories();
  const { data: cities } = useShopCities();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useShopsInfinite({ search, categoryId, city });

  const shops = data?.pages.flatMap((p) => p.rows) ?? [];
  const usedCategoryIds = new Set(shops.map((s) => s.category_id));
  const categoryOptions = (categories ?? []).filter(
    (c) => usedCategoryIds.has(c.id) || c.id === categoryId
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide py-10">
        <header className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Shop Profiles</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Browse local shops across every category — kirana stores, cafes, salons, clinics,
            venues and more.
          </p>
        </header>

        <div className="flex flex-col gap-3 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Search shops, areas or categories..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="md:max-w-sm"
            />
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Button size="sm" variant={!city ? 'default' : 'outline'} onClick={() => setCity(null)}>
                All cities
              </Button>
              {(cities ?? []).map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={city === c ? 'default' : 'outline'}
                  onClick={() => setCity(c)}
                  className="whitespace-nowrap"
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              size="sm"
              variant={!categoryId ? 'default' : 'outline'}
              onClick={() => setCategoryId(null)}
            >
              All categories
            </Button>
            {categoryOptions.map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant={categoryId === c.id ? 'default' : 'outline'}
                onClick={() => setCategoryId(c.id)}
                className="whitespace-nowrap"
              >
                {c.name}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shops.map((shop) => (
              <Link key={shop.id} to={`/shops/${shop.slug}`}>
                <Card className="p-5 h-full hover:shadow-lg hover:border-accent/50 transition-all group">
                  <div className="flex items-start gap-3">
                    <ShopCover shop={shop} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-semibold truncate group-hover:text-accent transition-colors">
                          {shop.name}
                        </h2>
                        {shop.is_verified && <BadgeCheck className="w-4 h-4 text-accent shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{shop.category?.name}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{shop.tagline}</p>

                  <div className="flex items-center gap-3 mt-4 text-sm">
                    <span className="flex items-center gap-1 font-medium">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      {shop.rating}
                    </span>
                    <span className="text-muted-foreground text-xs">({shop.reviews_count} reviews)</span>
                    {shop.is_premium && <Badge className="ml-auto">Premium</Badge>}
                  </div>

                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {shop.area}, {shop.city}
                    <span className="mx-1">•</span>
                    <Clock className="w-3.5 h-3.5" />
                    {shop.hours}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && shops.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No shops match that search.</p>
        )}

        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Load more shops
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
