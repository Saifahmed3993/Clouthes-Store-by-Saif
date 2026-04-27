import { apiClient } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { AnalyticsPoint, AdminMetric } from "@/types/admin";
import type { Order, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import { adminMetrics, analyticsSeries, orders, products } from "@/utils/seed-data";

const mocksEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false";
let mockProducts = [...products];
let mockOrders = [...orders];

async function mockDelay() {
  await new Promise((resolve) => globalThis.setTimeout(resolve, 320));
}

export const adminService = {
  async getMetrics(): Promise<AdminMetric[]> {
    if (mocksEnabled) {
      await mockDelay();
      return adminMetrics;
    }

    const response = await apiClient.get<AdminMetric[]>(endpoints.admin.analytics);
    return response.data;
  },

  async getAnalytics(): Promise<AnalyticsPoint[]> {
    if (mocksEnabled) {
      await mockDelay();
      return analyticsSeries;
    }

    const response = await apiClient.get<AnalyticsPoint[]>(endpoints.admin.analytics, {
      params: { range: "6m" }
    });
    return response.data;
  },

  async getProducts(): Promise<Product[]> {
    if (mocksEnabled) {
      await mockDelay();
      return mockProducts;
    }

    const response = await apiClient.get<Product[]>(endpoints.admin.products);
    return response.data;
  },

  async updateProduct(productId: string, payload: Partial<Product>): Promise<Product> {
    if (mocksEnabled) {
      await mockDelay();
      const product = mockProducts.find((item) => item.id === productId);
      if (!product) {
        throw new Error("Product not found");
      }
      const updatedProduct = { ...product, ...payload };
      mockProducts = mockProducts.map((item) => (item.id === productId ? updatedProduct : item));
      return updatedProduct;
    }

    const response = await apiClient.patch<Product>(`${endpoints.admin.products}/${productId}`, payload);
    return response.data;
  },

  async deleteProduct(productId: string): Promise<void> {
    if (mocksEnabled) {
      await mockDelay();
      mockProducts = mockProducts.filter((product) => product.id !== productId);
      return;
    }

    await apiClient.delete(`${endpoints.admin.products}/${productId}`);
  },

  async getOrders(): Promise<Order[]> {
    if (mocksEnabled) {
      await mockDelay();
      return mockOrders;
    }

    const response = await apiClient.get<Order[]>(endpoints.admin.orders);
    return response.data;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    if (mocksEnabled) {
      await mockDelay();
      const order = mockOrders.find((item) => item.id === orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      const updatedOrder = { ...order, status };
      mockOrders = mockOrders.map((item) => (item.id === orderId ? updatedOrder : item));
      return updatedOrder;
    }

    const response = await apiClient.patch<Order>(`${endpoints.admin.orders}/${orderId}`, { status });
    return response.data;
  }
};
