import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Star, BadgeCheck, Clock, Phone, ArrowLeft, CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getDemoShop, demoShops } from '@/data/demoShops';

export default function ShopProfilePage() {
  const { slug } = useParams();
  const shop = slug ? getDemoShop(slug) : undefined;

  if (!shop) {
    return (
      <div className="container-wide py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Shop not found</h1>
        <Button asChild className="mt-6">
          <Link to="/shops">Back to shops</Link>
        </Button>
      </div>
    );
  }

  const related = demoShops.filter((s) => s.slug !== shop.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide py-8">
        <Link to="/shops" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> All shops
        </Link>

        <Card className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-4xl shrink-0">
              {shop.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl md:text-3xl font-bold">{shop.name}</h1>
                {shop.verified && (
                  <Badge variant="secondary" className="gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </Badge>
                )}
                {shop.premium && <Badge>Premium seller</Badge>}
              </div>
              <p className="text-muted-foreground mt-1">{shop.tagline}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <Star className="w-4 h-4 fill-accent text-accent" /> {shop.rating}
                  <span className="text-muted-foreground font-normal">({shop.reviews})</span>
                </span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{shop.area}, {shop.city}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{shop.hours}</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" />{shop.yearsActive} yrs on the market</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:w-48">
              <Button className="btn-gradient gap-2">
                <Phone className="w-4 h-4" /> Contact shop
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/listings?category=${shop.categorySlug}`}>Browse category</Link>
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold mb-3">About this shop</h2>
              <p className="text-muted-foreground leading-relaxed">{shop.about}</p>
              <Separator className="my-5" />
              <div className="flex flex-wrap gap-2">
                {shop.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Popular offerings</h2>
              <ul className="divide-y divide-border">
                {shop.offerings.map((o) => (
                  <li key={o.name} className="flex items-center justify-between py-3">
                    <span className="text-sm">{o.name}</span>
                    <span className="text-sm font-semibold">{o.price}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="font-semibold mb-3">Shop details</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Owner</dt>
                  <dd className="font-medium text-right">{shop.owner}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium text-right">{shop.categoryName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="font-medium text-right">{shop.phone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Hours</dt>
                  <dd className="font-medium text-right">{shop.hours}</dd>
                </div>
              </dl>
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold mb-4">Other shops nearby</h2>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link key={r.slug} to={`/shops/${r.slug}`} className="flex items-center gap-3 hover:bg-secondary/50 rounded-lg p-2 -m-2 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">{r.emoji}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.categoryName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
