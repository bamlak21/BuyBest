import Link from 'next/link';

export default function CreateProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Create Product</span>
      </nav>
      <h1 className="text-3xl font-bold mb-6">Create Product</h1>
      <p>Create product functionality coming soon...</p>
    </div>
  );
}