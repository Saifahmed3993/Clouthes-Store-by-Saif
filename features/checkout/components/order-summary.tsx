"use client";

import { useMemo } from "react";
import { CartItem } from "@/features/cart/components/cart-item";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { useCartStore } from "@/store/cart.store";

export function CheckoutOrderSummary() {
  const items = useCartStore((state) => state.items);
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const discount = subtotal >= 180 ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal === 0 || subtotal >= 120 ? 0 : 8;
    const tax = Math.round((subtotal - discount) * 0.0825);
    return { subtotal, shipping, tax, discount, total: subtotal - discount + shipping + tax, itemCount };
  }, [items]);

  return (
    <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <CartSummary totals={totals} checkout={false} />
      <div className="grid gap-3">
        {items.map((item) => (
          <CartItem key={item.id} item={item} compact />
        ))}
      </div>
    </div>
  );
}

