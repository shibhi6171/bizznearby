import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, BadgeCheck, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { demoShops, demoShopCategories } from '@/data/demoShops';

export default function ShopsPage() {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<string>('all');

  const shops = demoShops.filter((shop) => {
    const matchesCategory = category === 'all' || shop.categorySlug === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      shop.name.toLowerCase().includes(q) ||
      shop.city.toLowerCase().includes(q) ||
      shop.area.toLowerCase().includes(q) ||
      shop.categoryName.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide py-10">
        <header className="mb-8">
          <Badge variant="secondary" className="mb-3">Prototype showcase</Badge>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Shop Profiles</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Sample seller profiles across every category — kirana stores, cafes, salons, clinics,
            venues and more — showing how a real shop appears on LocalMart.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <Input
            placeholder="Search shops, areas or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="md:max-w-sm"
          />
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              size="sm"
              variant={category === 'all' ? 'default' : 'outline'}
              onClick={() => setCategory('all')}
            >
              All
            </Button>
            {demoShopCategories.map((c) => (
              <Button
                key={c.slug}
                size="sm"
                variant={category === c.slug ? 'default' : 'outline'}
                onClick={() => setCategory(c.slug)}
                className="whitespace-nowrap"
              >
                {c.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shops.map((shop) => (
            <Link key={shop.slug} to={`/shops/${shop.slug}`}>
              <Card className="p-5 h-full hover:shadow-lg hover:border-accent/50 transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
                    {shop.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-semibold truncate group-hover:text-accent transition-colors">
                        {shop.name}
                      </h2>
                      {shop.verified && <BadgeCheck className="w-4 h-4 text-accent shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{shop.categoryName}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{shop.tagline}</p>

                <div className="flex items-center gap-3 mt-4 text-sm">
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    {shop.rating}
                  </span>
                  <span className="text-muted-foreground text-xs">({shop.reviews} reviews)</span>
                  {shop.premium && <Badge className="ml-auto">Premium</Badge>}
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

        {shops.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No shops match that search.</p>
        )}
      </div>
    </div>
  );
}
