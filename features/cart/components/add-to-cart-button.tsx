"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartActions } from "@/features/cart/hooks/use-cart-actions";
import type { Product, ProductSize } from "@/types/product";

type AddToCartButtonProps = {
  product: Product;
  selectedSize: ProductSize | null;
  selectedColor: string;
};

export function AddToCartButton({ product, selectedSize, selectedColor }: AddToCartButtonProps) {
  const { addProduct } = useCartActions();
  const disabled = !selectedSize || !selectedColor || product.inventory < 1;

  return (
    <Button
      size="lg"
      disabled={disabled}
      onClick={() => {
        if (selectedSize) {
          addProduct(product, selectedSize, selectedColor);
        }
      }}
    >
      <ShoppingBag className="h-5 w-5" />
      {product.inventory < 1 ? "Sold out" : "Add to cart"}
    </Button>
  );
}
