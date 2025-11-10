export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number | string;
  stock: number | string;
  brand: string;
  category: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}