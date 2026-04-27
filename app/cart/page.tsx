"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartItem } from "@/features/cart/components/cart-item";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { useCart } from "@/features/cart/hooks/use-cart";

export default function CartPage() {
  const { items, totals } = useCart();

  return (
    <section className="container-shell py-6 sm:py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Cart</p>
          <h1 className="mt-2 headline-h1">Review your rotation.</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Add a premium tee before checkout."
          actionHref="/products"
          actionLabel="Shop products"
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="grid gap-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <CartSummary totals={totals} />
        </div>
      )}
      {items.length > 0 ? (
        <div className="fixed inset-x-4 bottom-4 z-40 pb-[max(env(safe-area-inset-bottom),0.5rem)] lg:hidden">
          <Button asChild size="lg" className="w-full shadow-float">
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
      ) : null}
    </section>
  );
}
