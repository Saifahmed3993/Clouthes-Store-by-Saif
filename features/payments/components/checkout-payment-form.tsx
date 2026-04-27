"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { paymentLimiter } from "@/services/rate-limiter";

export function CheckoutPaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submittedRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Hard-block re-entry during Stripe confirmation
    if (submittedRef.current) {
      return;
    }

    // Client-side rate limit
    if (!paymentLimiter.canProceed("stripe-confirm")) {
      setErrorMessage("Too many payment attempts. Please wait a moment before trying again.");
      return;
    }

    submittedRef.current = true;
    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${orderId}?success=true`
      }
    });

    if (error) {
      // Allow retry for user-correctable errors
      if (error.type === "card_error" || error.type === "validation_error") {
        submittedRef.current = false;
      }
      setErrorMessage(error.message ?? "An unknown error occurred");
      setIsProcessing(false);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage ? <div className="text-sm font-semibold text-red-500">{errorMessage}</div> : null}
      {isSuccess ? <div className="rounded-md border border-moss/30 bg-moss/10 p-3 text-sm font-semibold text-moss">Payment confirmed. Redirecting to your order...</div> : null}
      <Button type="submit" size="lg" className="w-full" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Pay now"}
      </Button>
      {errorMessage ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            submittedRef.current = false;
            setErrorMessage(null);
          }}
        >
          Try again
        </Button>
      ) : null}
    </form>
  );
}
