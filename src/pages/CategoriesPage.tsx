import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useCategories } from '@/hooks/useCategories';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { Category } from '@/types/database';

function CategorySection({ title, subtitle, items }: { title: string; subtitle: string; items: Category[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mb-12">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-1 mb-6">{subtitle}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((category) => (
          <Link key={category.id} to={`/listings?category=${category.id}`}>
            <Card className="p-6 h-full text-center hover:shadow-lg hover:border-accent/50 transition-all group cursor-pointer">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {getCategoryIcon(category.icon)}
              </div>
              <h3 className="font-medium text-sm group-hover:text-accent transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{category.description}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide py-10">
        <header className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold">All Categories</h1>
          <p className="text-muted-foreground mt-2">
            Browse shops, places, groceries, services and everything else near you.
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            <CategorySection
              title="Services"
              subtitle="Book trusted local professionals and venues"
              items={(categories || []).filter((c) => c.listing_type === 'service')}
            />
            <CategorySection
              title="Shops & Products"
              subtitle="Groceries, retail shops and everyday goods"
              items={(categories || []).filter((c) => c.listing_type === 'product')}
            />
          </>
        )}
      </div>
    </div>
  );
}
