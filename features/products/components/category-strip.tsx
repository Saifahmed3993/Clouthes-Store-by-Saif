import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { productCategories } from "@/utils/constants";

export function CategoryStrip() {
  const categoryImages: Record<string, string> = {
    essentials: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    performance: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    graphic: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80",
    oversized: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    limited: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=800&q=80"
  };

  return (
    <section className="container-shell section-space">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Categories</p>
          <h2 className="mt-2 headline-h2">Find your fit fast.</h2>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {productCategories
          .filter((category) => category.value !== "all")
          .map((category) => (
            <Link
              key={category.value}
              href={`/products?category=${category.value}`}
              className="group surface overflow-hidden rounded-lg p-0 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={categoryImages[category.value] ?? categoryImages.essentials}
                  alt={`${category.label} collection`}
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 to-transparent" />
              </div>
              <div className="p-5">
                <span className="font-display text-xl font-semibold">{category.label}</span>
                <p className="mt-2 min-h-12 text-sm leading-5 text-muted">{category.description}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-clay">
                  Shop <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
