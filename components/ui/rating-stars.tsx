import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

export function RatingStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index + 1 <= Math.round(rating);
        return (
          <Star
            key={index}
            className={cn("h-4 w-4", filled ? "fill-citrus text-citrus" : "fill-transparent text-ink-200")}
          />
        );
      })}
    </span>
  );
}
