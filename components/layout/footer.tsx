import Link from "next/link";
import { Instagram, Twitter, Youtube } from "lucide-react";

const footerLinks = [
  { href: "/products", label: "Shop" },
  { href: "/orders", label: "Orders" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/admin", label: "Admin" }
];

export function Footer() {
  return (
    <footer className="border-t border-ink-200/75 bg-white dark:border-white/10 dark:bg-ink-900">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Link href="/" className="font-display text-2xl font-semibold">
            Clouthes
          </Link>
          <p className="max-w-md text-sm leading-6 text-ink-500 dark:text-ink-100">
            Premium t-shirts built with considered materials, consistent fits, and a store experience ready for scale.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-100">Store</h2>
          <div className="mt-4 grid gap-2 text-sm">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-clay">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-100">Social</h2>
          <div className="mt-4 flex gap-2">
            {[Instagram, Twitter, Youtube].map((Icon, index) => (
              <span
                key={index}
                className="flex h-10 w-10 items-center justify-center rounded-md bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-white"
              >
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
