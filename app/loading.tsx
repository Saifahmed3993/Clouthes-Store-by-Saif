import { ProductGridSkeleton } from "@/features/products/components/product-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container-shell py-10">
      <Skeleton className="mb-8 h-10 w-72" />
      <ProductGridSkeleton count={8} />
    </section>
  );
}
