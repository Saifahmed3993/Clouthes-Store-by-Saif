import type { Metadata } from "next";
import { Protected } from "@/features/auth/components/protected";
import { WishlistGrid } from "@/features/wishlist/components/wishlist-grid";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Saved Clouthes products."
};

export default function WishlistPage() {
  return (
    <Protected>
      <section className="container-shell py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">Wishlist</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-6xl">Saved for later.</h1>
        </div>
        <WishlistGrid />
      </section>
    </Protected>
  );
}
