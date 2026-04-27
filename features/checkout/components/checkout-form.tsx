"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, PackageCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCreateOrder } from "@/features/orders/hooks/use-orders";
import { useCart } from "@/features/cart/hooks/use-cart";
import { checkoutSchema, type CheckoutFormValues } from "@/features/checkout/schemas/checkout.schema";

export function CheckoutForm() {
  const { items } = useCart();
  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
      paymentMethod: "card",
      saveAddress: true
    }
  });
  const [step, setStep] = useState(1);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={PackageCheck}
        title="Checkout is ready when your cart is"
        message="Add a t-shirt to your cart before starting checkout."
        actionHref="/products"
        actionLabel="Shop products"
      />
    );
  }

  return (
    <form
      className="surface rounded-lg p-4 sm:p-5"
      onSubmit={handleSubmit((values) =>
        createOrder.mutate({
          address: {
            fullName: values.fullName,
            phone: values.phone,
            street: values.street,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
            country: values.country
          },
          paymentMethod: values.paymentMethod,
          saveAddress: values.saveAddress
        })
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-100 dark:bg-white/10">
          <CreditCard className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-semibold">Delivery and payment</h2>
          <p className="text-sm text-ink-500 dark:text-ink-100">Secure checkout with address validation.</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {["Address", "Payment", "Review"].map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index + 1)}
            className={`focus-ring min-h-11 rounded-md border px-3 py-2.5 text-sm font-semibold transition ${
              step === index + 1
                ? "border-ink-900 bg-ink-900 text-white dark:border-citrus dark:bg-citrus dark:text-ink-900"
                : "border-ink-200 bg-white text-ink-500 dark:border-white/15 dark:bg-white/5 dark:text-ink-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label="Full name" error={errors.fullName?.message} {...register("fullName")} />
        <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
        <Input label="Street" className="sm:col-span-2" error={errors.street?.message} {...register("street")} />
        <Input label="City" error={errors.city?.message} {...register("city")} />
        <Input label="State" error={errors.state?.message} {...register("state")} />
        <Input label="Postal code" error={errors.postalCode?.message} {...register("postalCode")} />
        <Input label="Country" error={errors.country?.message} {...register("country")} />
        {step >= 2 ? (
          <Select
            label="Payment method"
            error={errors.paymentMethod?.message}
            options={[
              { label: "Credit card", value: "card" },
              { label: "PayPal", value: "paypal" },
              { label: "Cash on delivery", value: "cash-on-delivery" }
            ]}
            {...register("paymentMethod")}
          />
        ) : null}
        <label className="flex items-center gap-3 rounded-md border border-ink-200 p-3 text-sm font-semibold dark:border-white/15">
          <input type="checkbox" className="h-4 w-4 accent-ink-900" {...register("saveAddress")} />
          Save this address for next time
        </label>
        {step >= 3 ? (
          <div className="sm:col-span-2 rounded-md border border-moss/30 bg-moss/10 p-4 text-sm">
            Review complete. Confirm your details and place order securely.
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button asChild variant="outline">
          <Link href="/cart">Back to cart</Link>
        </Button>
        <Button type="submit" size="lg" disabled={createOrder.isPending}>
          {createOrder.isPending ? "Placing order" : "Place order"}
        </Button>
      </div>
    </form>
  );
}
