"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RatingStars } from "@/components/ui/rating-stars";
import { Select } from "@/components/ui/select";
import { useAddReview } from "@/features/products/hooks/use-products";
import type { Product } from "@/types/product";
import { formatDate } from "@/utils/format";

const reviewSchema = z.object({
  author: z.string().min(2, "Name is required"),
  rating: z.coerce.number().min(1).max(5),
  title: z.string().min(3, "Title is required"),
  content: z.string().min(10, "Review must be at least 10 characters")
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ProductReviews({ product }: { product: Product }) {
  const addReview = useAddReview(product.id, product.slug);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author: "",
      rating: 5,
      title: "",
      content: ""
    }
  });

  return (
    <section className="container-shell section-space grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div>
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="headline-h2">Reviews</h2>
            <div className="mt-2 flex items-center gap-2">
              <RatingStars rating={product.rating} />
              <span className="text-sm text-muted">
                {product.rating} from {product.reviewCount} reviews
              </span>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {product.reviews.map((review) => (
            <article key={review.id} className="surface rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{review.title}</h3>
                  <p className="text-sm text-muted">
                    {review.author} · {formatDate(review.createdAt)}
                  </p>
                </div>
                <RatingStars rating={review.rating} />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{review.content}</p>
            </article>
          ))}
        </div>
      </div>

      <form
        className="surface h-fit rounded-lg p-5"
        onSubmit={handleSubmit((values) => {
          addReview.mutate(values, { onSuccess: () => reset() });
        })}
      >
        <h3 className="font-display text-xl font-semibold">Write a review</h3>
        <div className="mt-5 space-y-4">
          <Input label="Name" error={errors.author?.message} {...register("author")} />
          <Select
            label="Rating"
            error={errors.rating?.message}
            options={[1, 2, 3, 4, 5].map((rating) => ({ label: `${rating} stars`, value: rating }))}
            {...register("rating")}
          />
          <Input label="Title" error={errors.title?.message} {...register("title")} />
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-ink-700 dark:text-ink-50">Review</span>
            <textarea
              className="focus-ring min-h-28 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-white/5"
              {...register("content")}
            />
            {errors.content?.message ? <span className="text-xs font-medium text-red-600">{errors.content.message}</span> : null}
          </label>
          <Button type="submit" className="w-full" disabled={addReview.isPending}>
            <Send className="h-4 w-4" />
            {addReview.isPending ? "Publishing" : "Publish review"}
          </Button>
        </div>
      </form>
    </section>
  );
}
