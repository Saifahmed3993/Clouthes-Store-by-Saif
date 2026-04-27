"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ProductImage } from "@/types/product";
import { cn } from "@/utils/cn";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div className="grid gap-4 lg:grid-cols-[5rem_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:grid lg:content-start">
        {images.map((image) => (
          <button
            key={image.src}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-ink-100 dark:bg-white/10",
              selected.src === image.src ? "border-ink-900 dark:border-citrus" : "border-transparent"
            )}
            onClick={() => setSelected(image)}
            aria-label={`View ${image.alt}`}
          >
            <Image src={image.src} alt={image.alt} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="group relative order-1 aspect-[4/5] overflow-hidden rounded-lg bg-ink-100 dark:bg-white/10 lg:order-2">
        <motion.div key={selected.src} initial={{ opacity: 0.75 }} animate={{ opacity: 1 }} className="h-full w-full">
          <Image
            src={selected.src}
            alt={`${productName}: ${selected.alt}`}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        </motion.div>
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink-900/55 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur">
          Hover to zoom
        </div>
      </div>
    </div>
  );
}
