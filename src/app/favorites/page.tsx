'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ProductCard } from '../../components/ProductCard';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FavoritesPage() {
  const favorites = useSelector((state: RootState) => state.favorites.items);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to shop
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <h1 className="text-lg font-semibold">My Favorites</h1>
                {favorites.length > 0 && (
                  <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {favorites.length}
                  </span>
                )}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding products to your favorites to see them here!
            </p>
            <Link href="/">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Your Favorite Products
              </h2>
              <p className="text-muted-foreground">
                You have {favorites.length} {favorites.length === 1 ? 'product' : 'products'} in your favorites
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}