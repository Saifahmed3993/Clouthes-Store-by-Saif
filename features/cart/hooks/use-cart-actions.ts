"use client";

import { toast } from "sonner";
import { createCartItemId, useCartStore } from "@/store/cart.store";
import type { Product, ProductSize } from "@/types/product";
import { useAuthStore } from "@/store/auth.store";
import { useCartMutations } from "./use-cart";

export function useCartActions() {
  const status = useAuthStore((state) => state.status);
  const serverCart = useCartMutations();

  const addItemLocal = useCartStore((state) => state.addItem);
  const removeItemLocal = useCartStore((state) => state.removeItem);
  const updateQuantityLocal = useCartStore((state) => state.updateQuantity);
  const clearCartLocal = useCartStore((state) => state.clearCart);

  return {
    addProduct(product: Product, size: ProductSize, color: string, quantity = 1) {
      if (status === "authenticated") {
        const variant = product.variants?.find((v) => v.size === size && v.color === color);
        serverCart.addToCart.mutate({ productId: product.id, variantId: variant?.id || null, quantity });
      } else {
        addItemLocal({
          id: createCartItemId(product.id, size, color),
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0].src,
          size,
          color,
          quantity,
          stock: product.inventory
        });
        toast.success(`${product.name} added to cart`);
      }
    },
    removeItem(id: string) {
      if (status === "authenticated") {
        serverCart.removeItem.mutate(id);
      } else {
        removeItemLocal(id);
        toast.success("Item removed");
      }
    },
    updateQuantity(id: string, quantity: number) {
      if (status === "authenticated") {
        serverCart.updateQuantity.mutate({ itemId: id, quantity });
      } else {
        updateQuantityLocal(id, quantity);
      }
    },
    clearCart() {
      if (status === "authenticated") {
        serverCart.clearCart.mutate();
      } else {
        clearCartLocal();
      }
    }
  };
}
