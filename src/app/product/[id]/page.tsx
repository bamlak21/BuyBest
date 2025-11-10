'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '../../../types/product';
import { productApi } from '../../../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, Star, Edit, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { toggleFavorite } from '../../../store/slices/favoritesSlice';
import { showSuccessToast, showErrorToast } from '../../../lib/toast';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const productId = parseInt(params.id as string);
  const isFavorite = favorites.some(item => item.id === productId);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productApi.getProductById(productId);
        setProduct(data);
        // Set main image to first image from the images array, fallback to thumbnail
        setMainImage(data.images && data.images.length > 0 ? data.images[0] : data.thumbnail);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleToggleFavorite = () => {
    if (product) {
      dispatch(toggleFavorite(product));
      showSuccessToast(
        isFavorite ? 'Removed from favorites' : 'Added to favorites'
      );
    }
  };

  const handleImageClick = (image: string) => {
    setMainImage(image);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    setBuyModalOpen(true);
  };

  const handleDelete = async () => {
    if (product) {
      setDeleteLoading(true);
      try {
        await productApi.deleteProduct(product.id);
        showSuccessToast('Product deleted successfully');
        setDeleteDialogOpen(false);
        router.push('/');
      } catch (error) {
        console.error('Error deleting product:', error);
        showErrorToast('Failed to delete product');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => router.push('/')}>Back to Products</Button>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <>
                  <Link href={`/product/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Edit</span>
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Delete</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          
          <div className="md:col-span-1 lg:col-span-3 space-y-4 md:space-y-6">
            <div className="aspect-square relative overflow-hidden rounded-xl border bg-muted/50">
              <Image
                src={mainImage || product.thumbnail}
                alt={product.title}
                fill
                className="object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            
            {/* Product Images Gallery */}
            {product.images && product.images.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Product Images</h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <div key={index} className={`aspect-square relative overflow-hidden rounded-lg border-2 group cursor-pointer transition-colors ${
                      mainImage === image ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
                    }`} onClick={() => handleImageClick(image)}>
                      <Image
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          +
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          
          <div className="md:col-span-1 lg:col-span-2 space-y-4 md:space-y-6">
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {product.category}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                  {product.brand}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">{product.title}</h1>
            </div>

            
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-gray-300" />
                <span className="ml-2 text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>

            
            <div className="space-y-3">
              <div className="flex flex-wrap items-end gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">${product.price}</span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-base sm:text-lg text-muted-foreground line-through">
                      ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-1 text-xs sm:text-sm font-medium text-destructive whitespace-nowrap">
                      {product.discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.stock} available
                </span>
              </div>
            </div>

            
            <div className="space-y-3">
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now - ${(product.price * quantity).toFixed(2)}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg" 
                onClick={handleToggleFavorite}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>

            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            
            <Card>
              <CardContent className="p-3 sm:p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Product Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brand</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock</span>
                    <span className={`font-medium ${product.stock < 10 ? 'text-destructive' : 'text-green-600'}`}>
                      {product.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU</span>
                    <span className="font-medium">SKU-{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-muted-foreground ml-1">/5.0</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product ID</span>
                    <span className="font-medium">#{product.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardContent className="p-3 sm:p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Additional Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability</span>
                    <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium">
                      {product.discountPercentage > 0 ? `${product.discountPercentage}% OFF` : 'No Discount'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You Save</span>
                    <span className="font-medium text-green-600">
                      {product.discountPercentage > 0 
                        ? `$${(product.price * product.discountPercentage / 100).toFixed(2)}`
                        : '$0.00'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </main>
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${product?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      
      <Dialog open={buyModalOpen} onOpenChange={setBuyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              Thank You!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Thank you for your purchase! Your order for <span className="font-medium text-foreground">{product.title}</span> has been confirmed.
            </p>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Product:</span>
                <span className="font-medium">{product.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${product.price}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-medium">#ORD-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setBuyModalOpen(false)} className="flex-1">
                Continue Shopping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}