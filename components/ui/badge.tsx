import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-ink-50",
  success: "bg-moss/15 text-moss dark:bg-moss/25 dark:text-moss/80",
  warning: "bg-citrus/25 text-ink-700 dark:bg-citrus/25 dark:text-citrus",
  danger: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200",
  info: "bg-ocean/15 text-ocean dark:bg-ocean/30 dark:text-ocean/80"
};

export function Badge({ className, tone = "neutral", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
