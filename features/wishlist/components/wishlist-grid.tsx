"use client";

import { Heart } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductGridSkeleton } from "@/features/products/components/product-skeleton";
import { useWishlistProducts } from "@/features/products/hooks/use-products";
import { useWishlistStore } from "@/store/wishlist.store";

export function WishlistGrid() {
  const productIds = useWishlistStore((state) => state.productIds);
  const query = useWishlistProducts(productIds);

  if (productIds.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        message="Save the tees you want to compare or buy later."
        actionHref="/products"
        actionLabel="Explore products"
      />
    );
  }

  if (query.isLoading) {
    return <ProductGridSkeleton count={4} />;
  }

  if (query.isError) {
    return <ErrorState title="Wishlist could not load" message="Saved products are unavailable right now." actionLabel="Retry" onAction={() => query.refetch()} />;
  }

  return <ProductGrid products={query.data ?? []} />;
}
