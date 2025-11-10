"use client";

import { useState } from "react";
import { Product } from "../types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { toggleFavorite } from "../store/slices/favoritesSlice";
import { showSuccessToast } from "../lib/toast";
import { ConfirmDialog } from "./ConfirmDialog";
import { LoadingSpinner } from "./ui/loading-spinner";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export function ProductCard({
  product,
  onDelete,
  showActions = false,
}: ProductCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === product.id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product));
    const isFavorite = favorites.some((item) => item.id === product.id);
    showSuccessToast(
      isFavorite ? "Removed from favorites" : "Added to favorites"
    );
  };

  const handleDelete = async () => {
    if (onDelete) {
      setDeleteLoading(true);
      try {
        await onDelete(product.id);
        setDeleteDialogOpen(false);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return (
    <>
      <Card className="w-full group relative overflow-hidden bg-gradient-to-br p-0 from-card to-card/80 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative w-full pt-[100%] overflow-hidden rounded-t-lg bg-muted/30">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            />

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 rounded-t-lg" />

            {/* Discount badge */}
            {product.discountPercentage > 0 && (
              <div className="absolute top-2 left-2 z-20">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-500 to-red-600 px-2 py-1 text-xs font-bold text-white shadow-lg">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-20 h-9 w-9 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleFavorite();
              }}
            >
              <Heart
                className={`h-4 w-4 transition-all duration-300 ${
                  isFavorite
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-gray-600 hover:text-red-500"
                }`}
              />
            </Button>

            {/* Action buttons */}
            {showActions && (
              <div className="absolute bottom-2 left-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-white/95 hover:bg-white backdrop-blur-sm rounded-lg shadow-lg font-medium text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/product/${product.id}/edit`;
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-500/95 hover:bg-red-600 backdrop-blur-sm rounded-lg shadow-lg font-medium text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <CardContent className="p-4 sm:p-5 bg-gradient-to-b from-transparent to-muted/20">
            <div className="space-y-3">
              {/* Category badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-foreground">
                    {product.rating}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="font-bold text-base sm:text-lg leading-tight text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-300">
                {product.title}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-[2rem]">
                {product.description}
              </p>

              {/* Price and brand */}
              <div className="flex items-end justify-between pt-2 border-t border-border/30">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-foreground">
                      ${product.price}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        $
                        {(
                          product.price *
                          (1 + product.discountPercentage / 100)
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {product.brand}
                  </span>
                </div>

                {/* Stock indicator */}
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    product.stock > 10
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {product.stock > 10
                    ? "In Stock"
                    : `Only ${product.stock} left`}
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </>
  );
}
