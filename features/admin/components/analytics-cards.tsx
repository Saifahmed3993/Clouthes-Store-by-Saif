"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminMetrics } from "@/features/admin/hooks/use-admin";

export function AnalyticsCards() {
  const query = useAdminMetrics();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState title="Metrics unavailable" message="Admin analytics could not be loaded." onAction={() => query.refetch()} actionLabel="Retry" />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {query.data?.map((metric) => {
        const Icon = metric.trend === "up" ? ArrowUpRight : metric.trend === "down" ? ArrowDownRight : ArrowRight;

        return (
          <article key={metric.label} className="rounded-md border border-ink-200 bg-white p-5 dark:border-white/15 dark:bg-white/5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink-500 dark:text-ink-100">{metric.label}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 dark:bg-white/10">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-semibold">{metric.value}</p>
            <p className="mt-1 text-sm font-semibold text-moss">{metric.delta}</p>
          </article>
        );
      })}
    </div>
  );
}
