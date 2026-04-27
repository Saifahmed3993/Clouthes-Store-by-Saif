"use client";

import { use } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { usePaymentIntent } from "@/features/payments/hooks/use-payments";
import { CheckoutPaymentForm } from "@/features/payments/components/checkout-payment-form";
import { Loader2 } from "lucide-react";

// Initialize Stripe outside components so we don't recreate the Promise
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = usePaymentIntent(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-ink-500" />
        <p className="text-sm font-semibold text-ink-500">Preparing secure checkout...</p>
      </div>
    );
  }

  if (error || !data?.clientSecret) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-lg font-semibold text-red-500">Could not initialize payment.</p>
        <p className="text-sm text-ink-500">Please try again or contact support.</p>
      </div>
    );
  }

  return (
    <div className="container-shell mx-auto max-w-2xl pb-20 pt-6 sm:pt-10">
      <div className="mb-8 text-center">
        <h1 className="headline-h2">Complete Payment</h1>
        <p className="text-muted">Securely finalize your order</p>
      </div>
      
      <div className="surface rounded-lg p-5 sm:p-6">
        <Elements stripe={stripePromise} options={{ clientSecret: data.clientSecret, appearance: { theme: 'stripe' } }}>
          <CheckoutPaymentForm orderId={id} />
        </Elements>
      </div>
    </div>
  );
}
