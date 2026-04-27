import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-[linear-gradient(110deg,#e7e5da,45%,#f7f7f2,55%,#e7e5da)] bg-[length:700px_100%] dark:bg-[linear-gradient(110deg,rgba(255,255,255,0.06),45%,rgba(255,255,255,0.12),55%,rgba(255,255,255,0.06))]",
        className
      )}
      {...props}
    />
  );
}
