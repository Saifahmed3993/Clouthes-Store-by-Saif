import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({ icon: Icon, title, message, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed border-ink-200 bg-white/70 px-6 py-12 text-center dark:border-white/15 dark:bg-white/5">
      {Icon ? (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-white">
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink-500 dark:text-ink-100">{message}</p>
      {actionHref && actionLabel ? (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
