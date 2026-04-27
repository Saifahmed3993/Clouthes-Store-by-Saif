"use client";

import Image from "next/image";
import { Edit, PackageX, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductEditorForm } from "@/features/admin/components/product-editor-form";
import { useAdminProducts, useDeleteProduct } from "@/features/admin/hooks/use-admin";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/format";

export function ProductManagementTable() {
  const query = useAdminProducts();
  const deleteProduct = useDeleteProduct();
  const [editing, setEditing] = useState<Product | null>(null);

  if (query.isLoading) {
    return <Skeleton className="h-96" />;
  }

  if (query.isError) {
    return <ErrorState title="Products unavailable" message="Admin products could not be loaded." actionLabel="Retry" onAction={() => query.refetch()} />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-md border border-ink-200 bg-white dark:border-white/15 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-ink-100 text-xs uppercase tracking-[0.16em] text-ink-500 dark:bg-white/10 dark:text-ink-100">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Inventory</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.map((product) => (
                <tr key={product.id} className="border-t border-ink-200 dark:border-white/10">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-md bg-ink-100 dark:bg-white/10">
                        <Image src={product.images[0].src} alt={product.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-ink-500 dark:text-ink-100">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone="info">{product.category}</Badge>
                  </td>
                  <td className="px-4 py-4 font-semibold">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-4">
                    <Badge tone={product.inventory < 20 ? "warning" : "success"}>{product.inventory} units</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(product)}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteProduct.mutate(product.id)}>
                        <PackageX className="h-4 w-4" />
                        Archive
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editing ? (
          <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-ink-900/60" aria-label="Close editor" onClick={() => setEditing(null)} />
            <motion.div
              className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-5 shadow-lift dark:bg-ink-900"
              initial={{ scale: 0.96, y: "-48%", x: "-50%" }}
              animate={{ scale: 1, y: "-50%", x: "-50%" }}
              exit={{ scale: 0.96, opacity: 0 }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">Edit product</h2>
                <Button variant="ghost" size="icon" aria-label="Close editor" onClick={() => setEditing(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ProductEditorForm product={editing} onSaved={() => setEditing(null)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
