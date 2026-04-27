import { apiClient } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { PaymentIntentResponse } from "@/types/payment";

export const paymentsService = {
  async createIntent(orderId: string, idempotencyKey?: string): Promise<PaymentIntentResponse> {
    const response = await apiClient.post<PaymentIntentResponse>(endpoints.payments.intent, { orderId }, {
      headers: idempotencyKey ? { "X-Idempotency-Key": idempotencyKey } : undefined,
    });
    return response.data;
  }
};
