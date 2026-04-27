"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartService } from "@/features/cart/services/cart.service";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import type { CartResponse } from "@/types/cart";

export const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all, "detail"] as const
};

export function useServerCart() {
  const status = useAuthStore((state) => state.status);
  
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: ({ signal }) => cartService.getCart(signal),
    enabled: status === "authenticated",
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

function calculateShipping(subtotal: number) {
  return subtotal >= 120 || subtotal === 0 ? 0 : 8;
}

function calculateTax(subtotal: number, discount: number) {
  return Math.round((subtotal - discount) * 0.0825);
}

export function useCart() {
  const status = useAuthStore(state => state.status);
  const isAuth = status === "authenticated";
  
  const localItems = useCartStore(state => state.items);
  const localTotals = useMemo(() => {
    const subtotal = localItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = localItems.reduce((sum, item) => sum + item.quantity, 0);
    const discount = subtotal >= 180 ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal === 0 || subtotal >= 120 ? 0 : 8;
    const tax = Math.round((subtotal - discount) * 0.0825);
    return { subtotal, shipping, tax, discount, total: subtotal - discount + shipping + tax, itemCount };
  }, [localItems]);
  
  const { data: serverData, isLoading } = useServerCart();
  
  const serverItems = (serverData?.items || []).map(i => {
    const sizeColor = i.variantDescription ? i.variantDescription.split(" / ") : ["", ""];
    return {
      id: i.id,
      productId: i.productId,
      slug: i.productId, // Fallback since backend doesn't return slug
      name: i.productName,
      price: i.unitPrice,
      image: i.imageUrl || "",
      size: sizeColor[0] as any,
      color: sizeColor[1] || "",
      quantity: i.quantity,
      stock: 100 // Backend validates stock on action
    };
  });
  
  const discount = serverData?.totalAmount && serverData.totalAmount >= 180 ? Math.round(serverData.totalAmount * 0.1) : 0;
  const subtotal = serverData?.totalAmount || 0;
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal, discount);

  const serverTotals = {
     subtotal,
     shipping,
     tax,
     discount,
     total: subtotal - discount + shipping + tax,
     itemCount: serverData?.totalItems || 0
  };

  return {
    items: isAuth ? serverItems : localItems,
    totals: isAuth ? serverTotals : localTotals,
    isLoading: isAuth ? isLoading : false
  };
}

export function useCartMutations() {
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: ({ productId, variantId, quantity }: { productId: string; variantId: string | null; quantity: number }) => 
      cartService.addToCart(productId, variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success("Added to cart");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Could not add to cart");
    }
  });

  const updateQuantity = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => 
      cartService.updateQuantity(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });

      // Snapshot current value
      const previous = queryClient.getQueryData<CartResponse>(cartKeys.detail());

      // Optimistically update quantity in cache
      if (previous) {
        queryClient.setQueryData<CartResponse>(cartKeys.detail(), {
          ...previous,
          items: previous.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      }

      return { previous };
    },
    onError: (_error, _vars, context) => {
      // Rollback on failure
      if (context?.previous) {
        queryClient.setQueryData(cartKeys.detail(), context.previous);
      }
      toast.error("Could not update quantity");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });

      const previous = queryClient.getQueryData<CartResponse>(cartKeys.detail());

      // Optimistically remove item from cache
      if (previous) {
        queryClient.setQueryData<CartResponse>(cartKeys.detail(), {
          ...previous,
          items: previous.items.filter((item) => item.id !== itemId),
          totalItems: previous.totalItems - 1,
        });
      }

      return { previous };
    },
    onSuccess: () => {
      toast.success("Item removed");
    },
    onError: (_error, _itemId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(cartKeys.detail(), context.previous);
      }
      toast.error("Could not remove item");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });

  const clearCart = useMutation({
    mutationFn: () => cartService.clearCart(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      const previous = queryClient.getQueryData<CartResponse>(cartKeys.detail());

      if (previous) {
        queryClient.setQueryData<CartResponse>(cartKeys.detail(), {
          ...previous,
          items: [],
          totalAmount: 0,
          totalItems: 0,
        });
      }

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(cartKeys.detail(), context.previous);
      }
      toast.error("Could not clear cart");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });

  return {
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  };
}
