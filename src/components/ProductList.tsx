"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { Product, Category } from "../types/product";
import { productApi } from "../lib/api";
import { ProductCard } from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X, Filter } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../lib/toast";
import { LoadingSpinner } from "./ui/loading-spinner";
import { API_CONFIG } from "../lib/constants";
import { RootState } from "../store";

export function ProductList() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const limit = API_CONFIG.DEFAULT_LIMIT;

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await productApi.getCategories();
        // Ensure categories is always an array
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]); // Set empty array on error
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load products with pagination, search, and category support
  const loadProducts = useCallback(
    async (reset = false, query = "", category = "", currentSkip = 0) => {
      try {
        if (reset) {
          setLoading(true);
          setSkip(0);
          currentSkip = 0;
        } else {
          setLoading(false);
        }

        let response;
        if (query) {
          response = await productApi.searchProducts(query, limit, currentSkip);
        } else if (category) {
          response = await productApi.getProductsByCategory(category, limit, currentSkip);
        } else {
          response = await productApi.getProducts(limit, currentSkip);
        }

        if (reset) {
          setProducts(response.products);
        } else {
          setProducts((prev) => [...prev, ...response.products]);
        }

        setHasMore(response.skip + response.limit < response.total);
        setSkip(currentSkip + limit);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    loadProducts(true, "", selectedCategory, 0);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadProducts(false, searchQuery, selectedCategory, skip);
    }
  };

  // Setup Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          handleLoadMore();
        }
      },
      { threshold: API_CONFIG.INTERSECTION_THRESHOLD }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, skip]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchLoading(true);
    // When searching, prioritize search over category
    loadProducts(true, query, query ? "" : selectedCategory, 0);
  };

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return; // Prevent unnecessary re-loads
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when changing category
    // Load products will be triggered by useEffect when selectedCategory changes
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    loadProducts(true, "", "", 0);
  };

  const handleDelete = async (id: number) => {
    try {
      await productApi.deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      showSuccessToast("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      showErrorToast("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearch(e.target.value)
              }
              className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 sm:h-12 px-3 sm:px-4"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden sm:inline">Filters</span>
              {(selectedCategory || searchQuery) && (
                <span className="ml-2 h-2 w-2 bg-primary rounded-full" />
              )}
            </Button>
            {(selectedCategory || searchQuery) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-10 sm:h-12 px-3 sm:px-4"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            {searchLoading && (
              <LoadingSpinner size="default" className="self-center" />
            )}
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Categories</h3>
              {categoriesLoading && (
                <LoadingSpinner size="sm" />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange("")}
                className="text-xs"
              >
                All Products
              </Button>
              {!categoriesLoading && categories && categories.map((category, index) => (
                <Button
                  key={category.slug || `${category.name}-${index}`}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.slug)}
                  className="text-xs capitalize"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      
      <div className="grid grid-cols-1 max-[475px]:grid-cols-1 max-[640px]:grid-cols-2 max-[768px]:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
            showActions={isAuthenticated}
          />
        ))}
      </div>

      
      {loading && products.length === 0 && (
        <div className="flex justify-center py-12 sm:py-16">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm sm:text-base text-muted-foreground">Loading products...</p>
          </div>
        </div>
      )}

      {!loading && hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-6 sm:py-8">
          <LoadingSpinner size="default" />
        </div>
      )}

      {!loading && !hasMore && products.length > 0 && (
        <div className="text-center py-6 sm:py-8">
          <p className="text-sm sm:text-base text-muted-foreground">
            No more products to load
          </p>
        </div>
      )}

      {!loading && !hasMore && products.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <p className="text-sm sm:text-base text-muted-foreground">
            {searchQuery 
              ? `No products found for "${searchQuery}"`
              : selectedCategory
              ? `No products found in "${selectedCategory}"`
              : "No products found"
            }
          </p>
          {(searchQuery || selectedCategory) && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}