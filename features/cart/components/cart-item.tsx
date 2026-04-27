"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCartActions } from "@/features/cart/hooks/use-cart-actions";
import type { CartItem as CartItemType } from "@/types/cart";

export function CartItem({ item, compact = false }: { item: CartItemType; compact?: boolean }) {
  const { removeItem, updateQuantity } = useCartActions();

  return (
    <motion.article layout transition={{ duration: 0.24, ease: "easeOut" }} className="surface grid grid-cols-[5rem_1fr] gap-4 rounded-lg p-3">
      <Link href={`/products/${item.slug}`} className="relative aspect-square overflow-hidden rounded-md bg-ink-100 dark:bg-white/10">
        <Image src={item.image} alt={item.name} fill sizes="120px" className="object-cover" />
      </Link>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/products/${item.slug}`} className="font-semibold hover:text-clay">
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-100">
              {item.color} · {item.size}
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Remove item" onClick={() => removeItem(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Price value={item.price * item.quantity} />
          {compact ? (
            <span className="text-sm font-semibold">Qty {item.quantity}</span>
          ) : (
            <QuantityStepper value={item.quantity} max={item.stock} onChange={(quantity) => updateQuantity(item.id, quantity)} />
          )}
        </div>
      </div>
    </motion.article>
  );
}
