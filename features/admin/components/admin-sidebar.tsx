import Link from "next/link";
import { BarChart3, Boxes, ClipboardList } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList }
];

export function AdminSidebar() {
  return (
    <aside className="h-fit rounded-md border border-ink-200 bg-white p-3 dark:border-white/15 dark:bg-white/5 lg:sticky lg:top-24">
      <nav className="grid gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold hover:bg-ink-100 dark:hover:bg-white/10"
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
