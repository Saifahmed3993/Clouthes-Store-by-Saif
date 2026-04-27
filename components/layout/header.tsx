"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/features/auth/components/user-menu";
import { MiniCart } from "@/features/cart/components/mini-cart";
import { useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";
import { navigationItems } from "@/utils/constants";
import { cn } from "@/utils/cn";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const setMiniCartOpen = useUiStore((state) => state.setMiniCartOpen);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink-200/75 bg-ink-50/88 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/88">
        <div className="container-shell flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="font-display text-2xl font-semibold tracking-normal">
              Clouthes
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 dark:text-ink-100 dark:hover:bg-white/10 dark:hover:text-white",
                  pathname === item.href && "bg-white text-ink-900 shadow-sm dark:bg-white/10 dark:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon" aria-label="Wishlist" title="Wishlist">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open cart"
              title="Cart"
              className="relative"
              onClick={() => setMiniCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </Button>
            <UserMenu />
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <MiniCart />
    </>
  );
}
