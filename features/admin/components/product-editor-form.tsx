"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useUpdateProduct } from "@/features/admin/hooks/use-admin";
import type { Product, ProductCategory } from "@/types/product";
import { productCategories } from "@/utils/constants";

const productEditorSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().min(1),
  inventory: z.coerce.number().min(0),
  category: z.enum(["essentials", "performance", "graphic", "oversized", "limited"])
});

type ProductEditorValues = z.infer<typeof productEditorSchema>;

export function ProductEditorForm({ product, onSaved }: { product: Product; onSaved: () => void }) {
  const updateProduct = useUpdateProduct();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductEditorValues>({
    resolver: zodResolver(productEditorSchema),
    values: {
      name: product.name,
      price: product.price,
      inventory: product.inventory,
      category: product.category
    }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) =>
        updateProduct.mutate(
          {
            productId: product.id,
            payload: {
              name: values.name,
              price: values.price,
              inventory: values.inventory,
              category: values.category as ProductCategory
            }
          },
          { onSuccess: onSaved }
        )
      )}
    >
      <Input label="Product name" error={errors.name?.message} {...register("name")} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Price" type="number" min={1} error={errors.price?.message} {...register("price")} />
        <Input label="Inventory" type="number" min={0} error={errors.inventory?.message} {...register("inventory")} />
      </div>
      <Select
        label="Category"
        error={errors.category?.message}
        options={productCategories
          .filter((category) => category.value !== "all")
          .map((category) => ({ label: category.label, value: category.value }))}
        {...register("category")}
      />
      <Button type="submit" className="w-full" disabled={updateProduct.isPending}>
        <Save className="h-4 w-4" />
        {updateProduct.isPending ? "Saving" : "Save changes"}
      </Button>
    </form>
  );
}
