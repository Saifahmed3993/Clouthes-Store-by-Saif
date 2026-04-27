import { apiClient } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { CartItem, CartTotals } from "@/types/cart";
import type { CheckoutPayload, Order } from "@/types/order";

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await apiClient.get<any>(endpoints.orders.my);
    // Support either old mock array or backend PaginatedResponse items array
    return Array.isArray(response.data) ? response.data : response.data.items;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(endpoints.orders.detail(id));
    return response.data;
  },

  async createOrder(payload: CheckoutPayload, idempotencyKey?: string): Promise<Order> {
    const requestPayload = {
      shippingAddress: {
        street: payload.address.street,
        city: payload.address.city,
        state: payload.address.state,
        zipCode: payload.address.postalCode,
        country: payload.address.country
      },
      paymentMethod: payload.paymentMethod === "card" ? "Stripe" : "CashOnDelivery"
    };

    const response = await apiClient.post<Order>(endpoints.orders.root, requestPayload, {
      headers: idempotencyKey ? { "X-Idempotency-Key": idempotencyKey } : undefined,
    });
    return response.data;
  }
};
