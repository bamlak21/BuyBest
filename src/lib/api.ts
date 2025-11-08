import axios from 'axios';
import { Product, ProductsResponse, CreateProductRequest, Category } from '../types/product';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const productApi = {
  getProducts: (limit = 10, skip = 0): Promise<ProductsResponse> =>
    api.get(`/products?limit=${limit}&skip=${skip}`).then(res => res.data),

  searchProducts: (query: string, limit = 10, skip = 0): Promise<ProductsResponse> =>
    api.get(`/products/search?q=${query}&limit=${limit}&skip=${skip}`).then(res => res.data),

  getProductById: (id: number): Promise<Product> =>
    api.get(`/products/${id}`).then(res => res.data),

  getCategories: (): Promise<Category[]> =>
    api.get('/products/categories').then(res => res.data),

  getProductsByCategory: (category: string, limit = 10, skip = 0): Promise<ProductsResponse> =>
    api.get(`/products/category/${category}?limit=${limit}&skip=${skip}`).then(res => res.data),

  createProduct: (product: CreateProductRequest): Promise<Product> =>
    api.post('/products/add', product).then(res => res.data),

  updateProduct: (id: number, product: Partial<CreateProductRequest>): Promise<Product> =>
    api.patch(`/products/${id}`, product).then(res => res.data),

  deleteProduct: (id: number): Promise<Product> =>
    api.delete(`/products/${id}`).then(res => res.data),
};