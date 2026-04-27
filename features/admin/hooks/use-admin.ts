"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "@/features/admin/services/admin.service";
import type { OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";

export const adminKeys = {
  all: ["admin"] as const,
  metrics: () => [...adminKeys.all, "metrics"] as const,
  analytics: () => [...adminKeys.all, "analytics"] as const,
  products: () => [...adminKeys.all, "products"] as const,
  orders: () => [...adminKeys.all, "orders"] as const
};

export function useAdminMetrics() {
  return useQuery({
    queryKey: adminKeys.metrics(),
    queryFn: () => adminService.getMetrics()
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics(),
    queryFn: () => adminService.getAnalytics()
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: adminKeys.products(),
    queryFn: () => adminService.getProducts()
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: adminKeys.orders(),
    queryFn: () => adminService.getOrders()
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: Partial<Product> }) =>
      adminService.updateProduct(productId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      toast.success("Product updated");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Product update failed");
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => adminService.deleteProduct(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      toast.success("Product archived");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Product could not be archived");
    }
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) => adminService.updateOrderStatus(orderId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.orders() });
      toast.success("Order status updated");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Order update failed");
    }
  });
}
