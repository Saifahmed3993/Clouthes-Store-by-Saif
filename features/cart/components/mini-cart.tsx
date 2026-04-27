"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartItem } from "@/features/cart/components/cart-item";
import { useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";
import { useCart } from "@/features/cart/hooks/use-cart";
import { formatCurrency } from "@/utils/format";
import { drawerMotion } from "@/utils/motion";

export function MiniCart() {
  const open = useUiStore((state) => state.isMiniCartOpen);
  const setOpen = useUiStore((state) => state.setMiniCartOpen);
  const { items, totals } = useCart();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[75]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button className="absolute inset-0 bg-ink-900/55" aria-label="Close cart" onClick={() => setOpen(false)} />
          <motion.aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ink-50 shadow-lift dark:bg-ink-900" {...drawerMotion}>
            <div className="flex items-center justify-between border-b border-ink-200 p-5 dark:border-white/15">
              <h2 className="font-display text-2xl font-semibold">Cart</h2>
              <Button variant="ghost" size="icon" aria-label="Close cart" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <EmptyState title="Your cart is empty" message="Your premium picks will appear here as soon as you add them." actionHref="/products" actionLabel="Shop products" />
              ) : (
                <div className="grid gap-3">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} compact />
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-ink-200 p-5 dark:border-white/15">
              <div className="mb-1 flex items-center justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="mb-4 flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" onClick={() => setOpen(false)}>
                  <Link href="/cart">View cart</Link>
                </Button>
                {items.length === 0 ? (
                  <Button disabled>Checkout</Button>
                ) : (
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
