import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/features/cart/components/cart-item";
import { TrackingTimeline } from "@/features/orders/components/tracking-timeline";
import type { Order, OrderStatus } from "@/types/order";
import { formatCurrency, formatDate } from "@/utils/format";

const statusTone: Record<OrderStatus, "neutral" | "success" | "warning" | "danger" | "info"> = {
  placed: "warning",
  confirmed: "info",
  packed: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger"
};

export function OrderCard({ order }: { order: Order }) {
  return (
    <article className="rounded-md border border-ink-200 bg-white p-5 dark:border-white/15 dark:bg-white/5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-semibold">{order.orderNumber}</h2>
            <Badge tone={statusTone[order.status]}>{order.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-100">
            Ordered {formatDate(order.createdAt)} · ETA {formatDate(order.eta)}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-ink-500 dark:text-ink-100">Total</p>
          <p className="font-display text-2xl font-semibold">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="mt-6">
        <TrackingTimeline status={order.status} />
      </div>

      <div className="mt-6 grid gap-3">
        {order.items.map((item) => (
          <CartItem key={item.id} item={item} compact />
        ))}
      </div>

      {order.trackingNumber ? (
        <div className="mt-5 flex flex-col justify-between gap-3 rounded-md bg-ink-100 p-4 text-sm dark:bg-white/10 sm:flex-row sm:items-center">
          <span>
            Tracking number: <strong>{order.trackingNumber}</strong>
          </span>
          <Button asChild size="sm" variant="outline">
            <Link href="/orders">Track package</Link>
          </Button>
        </div>
      ) : null}
    </article>
  );
}
