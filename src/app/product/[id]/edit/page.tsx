'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '../../../../types/product';
import { productApi } from '../../../../lib/api';
import { ProductForm } from '../../../../components/ProductForm';
import { showErrorToast } from '../../../../lib/toast';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../../../../components/ThemeToggle';

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productApi.getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error loading product:', err);
        showErrorToast('Failed to load product');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link href="/" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center space-x-3">
                <Edit className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold">Edit Product</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-foreground">{product.title}</span>
            </li>
          </ol>
        </nav>
        <ProductForm product={product} isEdit={true} />
      </main>
    </div>
  );
}