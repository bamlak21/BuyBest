import Link from 'next/link';

export default function EditProductPage() {
  return (
    <div>
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-foreground">Edit Product</span>
          </li>
        </ol>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
        <p>Edit product functionality coming soon...</p>
      </div>
    </div>
  );
}