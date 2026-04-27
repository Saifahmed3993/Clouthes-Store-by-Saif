"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAnalytics } from "@/features/admin/hooks/use-admin";
import { formatCurrency } from "@/utils/format";

export function SalesChart() {
  const query = useAdminAnalytics();

  if (query.isLoading) {
    return <Skeleton className="h-80" />;
  }

  if (query.isError) {
    return <ErrorState title="Chart unavailable" message="Revenue analytics could not be loaded." actionLabel="Retry" onAction={() => query.refetch()} />;
  }

  return (
    <div className="rounded-md border border-ink-200 bg-white p-5 dark:border-white/15 dark:bg-white/5">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold">Revenue trend</h2>
        <p className="text-sm text-ink-500 dark:text-ink-100">Six-month store performance</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={query.data}>
            <defs>
              <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#205b73" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#205b73" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,115,100,0.25)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Area type="monotone" dataKey="revenue" stroke="#205b73" fill="url(#revenue)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
