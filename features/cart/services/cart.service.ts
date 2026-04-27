import { apiClient } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { CartItemResponse, CartResponse } from "@/types/cart";

export const cartService = {
  async getCart(signal?: AbortSignal): Promise<CartResponse> {
    const response = await apiClient.get<CartResponse>(endpoints.cart.root, { signal });
    return response.data;
  },

  async addToCart(productId: string, variantId: string | null, quantity: number, signal?: AbortSignal): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>(endpoints.cart.items, {
      productId,
      variantId,
      quantity
    }, { signal });
    return response.data;
  },

  async updateQuantity(itemId: string, quantity: number, signal?: AbortSignal): Promise<CartResponse> {
    const response = await apiClient.put<CartResponse>(endpoints.cart.item(itemId), {
      quantity
    }, { signal });
    return response.data;
  },

  async removeItem(itemId: string, signal?: AbortSignal): Promise<CartResponse> {
    const response = await apiClient.delete<CartResponse>(endpoints.cart.item(itemId), { signal });
    return response.data;
  },

  async clearCart(signal?: AbortSignal): Promise<void> {
    await apiClient.delete(endpoints.cart.root, { signal });
  }
};
