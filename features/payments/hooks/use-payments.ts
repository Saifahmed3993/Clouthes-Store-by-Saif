"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentsService } from "@/features/payments/services/payments.service";
import { generateIdempotencyKey } from "@/services/idempotency";

export const paymentKeys = {
  all: ["payments"] as const,
  intent: (orderId: string) => [...paymentKeys.all, "intent", orderId] as const
};

// Stable idempotency key per order ID so retries/refetches don't create duplicate intents
const intentKeyMap = new Map<string, string>();
function getIntentIdempotencyKey(orderId: string): string {
  if (!intentKeyMap.has(orderId)) {
    intentKeyMap.set(orderId, generateIdempotencyKey());
  }
  return intentKeyMap.get(orderId)!;
}

export function usePaymentIntent(orderId: string) {
  return useQuery({
    queryKey: paymentKeys.intent(orderId),
    queryFn: () => paymentsService.createIntent(orderId, getIntentIdempotencyKey(orderId)),
    enabled: Boolean(orderId),
    staleTime: 1000 * 60 * 10, // 10 mins — intent is valid for ~30min on Stripe
    retry: 2, // Payment intent fetch is critical for checkout
  });
}
