import { Card } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br p-0 from-card to-card/80 border-0 shadow-lg">
      <div className="relative w-full pt-[100%] overflow-hidden rounded-t-lg bg-muted/30">
        <div className="absolute inset-0 bg-muted animate-pulse" />
      </div>

      <div className="p-4 sm:p-5 bg-gradient-to-b from-transparent to-muted/20 space-y-3">
        {/* Category and rating skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-6 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse" />
          <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-1">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
        </div>

        {/* Price and brand skeleton */}
        <div className="flex items-end justify-between pt-2 border-t border-border/30">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <div className="h-6 w-12 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </Card>
  );
}