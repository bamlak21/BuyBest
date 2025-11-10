"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { productApi } from "@/lib/api";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { CreateProductRequest, Product, Category } from "@/types/product";
import Link from "next/link";

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [formData, setFormData] = useState<CreateProductRequest>({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    brand: product?.brand || "",
    category: product?.category || "",
  });

  const [errors, setErrors] = useState<Partial<CreateProductRequest>>({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await productApi.getCategories();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateProductRequest> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be 0 or greater";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CreateProductRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "price" || field === "stock" ? Number(value) : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEdit && product) {
        await productApi.updateProduct(product.id, formData);
        showSuccessToast("Product updated successfully");
      } else {
        await productApi.createProduct(formData);
        showSuccessToast("Product created successfully");
      }
      router.push("/");
    } catch (error) {
      console.error("Error saving product:", error);
      showErrorToast(
        isEdit ? "Failed to update product" : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter product title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter product description"
                rows={4}
                className={`w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  // value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  // value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="0"
                  className={errors.stock ? "border-red-500" : ""}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                placeholder="Enter brand name"
                className={errors.brand ? "border-red-500" : ""}
              />
              {errors.brand && (
                <p className="text-sm text-red-500">{errors.brand}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              {categoriesLoading ? (
                <Input disabled placeholder="Loading categories..." />
              ) : (
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={`w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md ${
                    errors.category ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Product"
                  : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
