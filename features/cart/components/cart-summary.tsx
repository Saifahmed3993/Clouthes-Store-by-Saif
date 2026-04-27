import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import type { CartTotals } from "@/types/cart";

export function CartSummary({ totals, checkout = true }: { totals: CartTotals; checkout?: boolean }) {
  const rows = [
    { label: "Subtotal", value: totals.subtotal },
    { label: "Discount", value: -totals.discount },
    { label: "Shipping", value: totals.shipping },
    { label: "Tax", value: totals.tax }
  ];

  return (
    <aside className="surface h-fit rounded-lg p-5 lg:sticky lg:top-24">
      <h2 className="font-display text-2xl font-semibold">Order summary</h2>
      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-ink-500 dark:text-ink-100">{row.label}</span>
            <span className="font-semibold">{formatCurrency(row.value)}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 border-t border-ink-200 pt-5 dark:border-white/15">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-display text-2xl font-semibold">{formatCurrency(totals.total)}</span>
        </div>
      </div>
      {checkout ? (
        totals.itemCount === 0 ? (
          <Button className="mt-6 w-full" size="lg" disabled>
            Checkout
          </Button>
        ) : (
          <Button asChild className="mt-6 w-full" size="lg">
            <Link href="/checkout">Checkout</Link>
          </Button>
        )
      ) : null}
    </aside>
  );
}
