"use client";

import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Protected } from "@/features/auth/components/protected";
import { OrderCard } from "@/features/orders/components/order-card";
import { useOrders } from "@/features/orders/hooks/use-orders";

export default function OrdersPage() {
  const query = useOrders();

  return (
    <Protected>
      <section className="container-shell py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">Orders</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-6xl">Track every order.</h1>
        </div>
        {query.isLoading ? (
          <div className="grid gap-4">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        ) : null}
        {query.isError ? (
          <ErrorState title="Orders could not load" message="Your order history is temporarily unavailable." actionLabel="Retry" onAction={() => query.refetch()} />
        ) : null}
        {query.data?.length === 0 ? (
          <EmptyState icon={PackageSearch} title="No orders yet" message="Your order history will appear after checkout." actionHref="/products" actionLabel="Shop products" />
        ) : null}
        <div className="grid gap-5">
          {query.data?.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </section>
    </Protected>
  );
}
