import type { Metadata } from "next";
import { Protected } from "@/features/auth/components/protected";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { CheckoutOrderSummary } from "@/features/checkout/components/order-summary";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for Clouthes orders."
};

export default function CheckoutPage() {
  return (
    <Protected>
      <section className="container-shell py-6 sm:py-10">
        <div className="mb-8">
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-2 headline-h1">Complete your order.</h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
          <CheckoutForm />
          <CheckoutOrderSummary />
        </div>
      </section>
    </Protected>
  );
}
