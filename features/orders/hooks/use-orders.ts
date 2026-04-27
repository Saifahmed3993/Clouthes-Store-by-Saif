"use client";

import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { orderService } from "@/features/orders/services/orders.service";
import { useCartStore } from "@/store/cart.store";
import { useIdempotencyKey } from "@/services/idempotency";
import { paymentLimiter } from "@/services/rate-limiter";
import type { CartItem, CartTotals } from "@/types/cart";
import type { CheckoutPayload } from "@/types/order";

import { cartKeys } from "@/features/cart/hooks/use-cart";

export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const
};

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: () => orderService.getOrders()
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: Boolean(id)
  });
}

export function useCreateOrder() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearCartLocal = useCartStore((state) => state.clearCart);
  const { getKey, reset: resetKey } = useIdempotencyKey("order");
  const isSubmittingRef = useRef(false);

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => {
      // Rate limit check
      if (!paymentLimiter.canProceed("create-order")) {
        return Promise.reject({ message: "Too many attempts. Please wait a moment before trying again." });
      }

      // Prevent double-submit while in-flight
      if (isSubmittingRef.current) {
        return Promise.reject({ message: "Order is already being placed." });
      }
      isSubmittingRef.current = true;

      return orderService.createOrder(payload, getKey());
    },
    onSuccess: async (order, payload) => {
      isSubmittingRef.current = false;
      resetKey(); // Generate fresh key for next order

      clearCartLocal();
      await queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      await queryClient.invalidateQueries({ queryKey: orderKeys.list() });
      
      if (payload.paymentMethod === "card") {
        router.push(`/checkout/payment/${order.id}`);
      } else {
        toast.success(`Order ${order.orderNumber} placed`);
        router.push(`/orders/${order.id}`);
      }
    },
    onError: (error: { message?: string }) => {
      isSubmittingRef.current = false;
      toast.error(error.message ?? "Order could not be placed");
    }
  });
}
