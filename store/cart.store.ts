"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, CartTotals } from "@/types/cart";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => CartTotals;
};

const TAX_RATE = 0.0825;
const FREE_SHIPPING_THRESHOLD = 120;
const SHIPPING_PRICE = 8;

function calculateTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const discount = subtotal >= 180 ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
  const tax = Math.round((subtotal - discount) * TAX_RATE);

  return {
    subtotal,
    shipping,
    tax,
    discount,
    total: subtotal - discount + shipping + tax,
    itemCount
  };
}

export const createCartItemId = (productId: string, size: string, color: string) => `${productId}-${size}-${color}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((current) => current.id === item.id);
          if (existing) {
            return {
              items: state.items.map((current) =>
                current.id === item.id
                  ? { ...current, quantity: Math.min(current.quantity + item.quantity, current.stock) }
                  : current
              )
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item
          )
        })),
      clearCart: () => set({ items: [] }),
      getTotals: () => calculateTotals(get().items)
    }),
    {
      name: "clouthes-cart",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
