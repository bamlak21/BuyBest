import Link from 'next/link';
import { ProductForm } from '../../../components/ProductForm';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../../../components/ThemeToggle';

export default function CreateProductPage() {
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
                <Plus className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold">Create Product</h1>
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
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-foreground">Create Product</span>
            </li>
          </ol>
        </nav>
        <ProductForm />
      </main>
    </div>
  );
}