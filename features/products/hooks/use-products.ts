"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productService } from "@/features/products/services/products.service";
import type { ProductFilters, ProductReview } from "@/types/product";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  featured: () => [...productKeys.all, "featured"] as const,
  detail: (slug: string) => [...productKeys.all, "detail", slug] as const,
  wishlist: (ids: string[]) => [...productKeys.all, "wishlist", ids] as const
};

export function useInfiniteProducts(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: productKeys.list(filters),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => productService.getProducts({ ...filters, cursor: pageParam, pageSize: 8 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productService.getFeaturedProducts()
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productService.getProduct(slug),
    enabled: Boolean(slug)
  });
}

export function useWishlistProducts(productIds: string[]) {
  return useQuery({
    queryKey: productKeys.wishlist(productIds),
    queryFn: () => productService.getWishlistProducts(productIds),
    enabled: productIds.length > 0
  });
}

export function useAddReview(productId: string, slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: Omit<ProductReview, "id" | "createdAt">) => productService.addReview(productId, review),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productKeys.detail(slug) });
      toast.success("Review added");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Review could not be added");
    }
  });
}
