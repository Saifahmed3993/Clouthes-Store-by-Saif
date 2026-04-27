"use client";

import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/ui/error-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrders, useUpdateOrderStatus } from "@/features/admin/hooks/use-admin";
import type { OrderStatus } from "@/types/order";
import { formatCurrency, formatDate } from "@/utils/format";

const statusOptions: OrderStatus[] = ["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"];

export function OrderManagementTable() {
  const query = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();

  if (query.isLoading) {
    return <Skeleton className="h-96" />;
  }

  if (query.isError) {
    return <ErrorState title="Orders unavailable" message="Admin orders could not be loaded." actionLabel="Retry" onAction={() => query.refetch()} />;
  }

  return (
    <div className="overflow-hidden rounded-md border border-ink-200 bg-white dark:border-white/15 dark:bg-white/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-ink-100 text-xs uppercase tracking-[0.16em] text-ink-500 dark:bg-white/10 dark:text-ink-100">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {query.data?.map((order) => (
              <tr key={order.id} className="border-t border-ink-200 dark:border-white/10">
                <td className="px-4 py-4 font-semibold">{order.orderNumber}</td>
                <td className="px-4 py-4 text-ink-500 dark:text-ink-100">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-4">
                  <Badge tone={order.status === "cancelled" ? "danger" : order.status === "delivered" ? "success" : "info"}>{order.status}</Badge>
                </td>
                <td className="px-4 py-4 font-semibold">{formatCurrency(order.total)}</td>
                <td className="px-4 py-4">
                  <Select
                    aria-label="Update order status"
                    value={order.status}
                    className="max-w-44"
                    options={statusOptions.map((status) => ({ label: status, value: status }))}
                    onChange={(event) =>
                      updateStatus.mutate({
                        orderId: order.id,
                        status: event.target.value as OrderStatus
                      })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
