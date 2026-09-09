import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPin,
  Star,
  BadgeCheck,
  Clock,
  Phone,
  ArrowLeft,
  CalendarDays,
  Heart,
  Share2,
  Store,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

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
      <div className="min-h-screen bg-slate-50">
        <div className="container-wide flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
              <Store className="h-8 w-8 text-orange-500" />
            </div>

            <h1 className="font-display text-2xl font-bold text-slate-900">
              Shop not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The shop you're looking for doesn't exist or may have been removed.
            </p>

            <Button asChild className="mt-6 btn-gradient">
              <Link to="/shops">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to shops
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const related = demoShops
    .filter((s) => s.slug !== shop.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-wide px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        <div className="mb-6">
          <Link
            to="/shops"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            All shops
          </Link>
        </div>

        {/* Hero Section */}
        <Card className="mb-6 overflow-hidden rounded-2xl border-slate-200 shadow-sm">
          {/* Banner */}
          <div className="relative h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-orange-500 sm:h-40">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-orange-300 blur-3xl" />
            </div>
          </div>

          <div className="relative px-5 pb-6 sm:px-8">
            {/* Shop logo */}
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-white text-4xl shadow-lg sm:h-28 sm:w-28">
                {shop.emoji}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {shop.name}
                  </h1>

                  {shop.verified && (
                    <Badge className="gap-1 border-0 bg-blue-50 text-blue-600 hover:bg-blue-50">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </Badge>
                  )}

                  {shop.premium && (
                    <Badge className="border-0 bg-orange-100 text-orange-700 hover:bg-orange-100">
                      Premium seller
                    </Badge>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  {shop.tagline}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  title="Save shop"
                >
                  <Heart className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  title="Share shop"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Shop stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <Star className="h-5 w-5 fill-orange-400 text-orange-400" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {shop.rating}
                  </p>
                  <p className="text-xs text-slate-500">
                    {shop.reviews} reviews
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <MapPin className="h-5 w-5 text-slate-600" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {shop.area}
                  </p>
                  <p className="text-xs text-slate-500">
                    {shop.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Clock className="h-5 w-5 text-slate-600" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    {shop.hours}
                  </p>
                  <p className="text-xs text-slate-500">
                    Business hours
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <CalendarDays className="h-5 w-5 text-slate-600" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {shop.yearsActive} years
                  </p>
                  <p className="text-xs text-slate-500">
                    On LocalMart
                  </p>
                </div>
              </div>
            </div>

            {/* Main CTA */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button className="btn-gradient h-11 flex-1 gap-2 sm:flex-none sm:px-8">
                <Phone className="h-4 w-4" />
                Contact shop
              </Button>

              <Button variant="outline" asChild className="h-11">
                <Link to={`/listings?category=${shop.categorySlug}`}>
                  Browse category
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* About */}
            <Card className="rounded-2xl border-slate-200 p-6 shadow-sm sm:p-7">
              <div className="mb-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  About
                </p>

                <h2 className="font-display text-xl font-bold text-slate-900">
                  About this shop
                </h2>
              </div>

              <p className="leading-7 text-slate-600">
                {shop.about}
              </p>

              <Separator className="my-6" />

              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                What this shop offers
              </h3>

              <div className="flex flex-wrap gap-2">
                {shop.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Offerings */}
            <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
              <div className="p-6 sm:p-7">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Services & products
                </p>

                <h2 className="font-display text-xl font-bold text-slate-900">
                  Popular offerings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Popular products and services available from this shop.
                </p>
              </div>

              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {shop.offerings.map((o) => (
                  <div
                    key={o.name}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50 sm:px-7"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                        <CheckCircle2 className="h-4 w-4 text-orange-500" />
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {o.name}
                      </span>
                    </div>

                    <span className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-900">
                      {o.price}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Shop details */}
            <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Shop details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Information about this seller.
                </p>
              </div>

              <dl className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserIcon />

                  <div className="flex-1">
                    <dt className="text-xs text-slate-500">Owner</dt>
                    <dd className="mt-0.5 font-medium text-slate-900">
                      {shop.owner}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CategoryIcon />

                  <div className="flex-1">
                    <dt className="text-xs text-slate-500">Category</dt>
                    <dd className="mt-0.5 font-medium text-slate-900">
                      {shop.categoryName}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneIcon />

                  <div className="flex-1">
                    <dt className="text-xs text-slate-500">Phone</dt>
                    <dd className="mt-0.5 font-medium text-slate-900">
                      {shop.phone}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ClockIcon />

                  <div className="flex-1">
                    <dt className="text-xs text-slate-500">Hours</dt>
                    <dd className="mt-0.5 font-medium text-slate-900">
                      {shop.hours}
                    </dd>
                  </div>
                </div>
              </dl>
            </Card>

            {/* Verified seller */}
            {shop.verified && (
              <Card className="rounded-2xl border-blue-100 bg-blue-50/50 p-6 shadow-sm">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    <BadgeCheck className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Verified seller
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      This shop has been verified by LocalMart.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Nearby shops */}
            <Card className="rounded-2xl border-slate-200 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Other shops nearby
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Explore more local businesses
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/shops/${r.slug}`}
                    className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
                      {r.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {r.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {r.categoryName}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                        <span className="font-medium text-slate-700">
                          {r.rating}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
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

/* Small reusable icons for the details card */

function UserIcon() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
      <span className="text-sm">👤</span>
    </div>
  );
}

function CategoryIcon() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
      <Store className="h-4 w-4 text-slate-600" />
    </div>
  );
}

function PhoneIcon() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
      <Phone className="h-4 w-4 text-slate-600" />
    </div>
  );
}

function ClockIcon() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
      <Clock className="h-4 w-4 text-slate-600" />
    </div>
  );
}
