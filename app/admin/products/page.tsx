import type { Metadata } from "next";
import { Protected } from "@/features/auth/components/protected";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { ProductManagementTable } from "@/features/admin/components/product-management-table";

export const metadata: Metadata = {
  title: "Manage Products",
  description: "Manage Clouthes product catalog."
};

export default function AdminProductsPage() {
  return (
    <Protected role="admin">
      <section className="container-shell py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">Admin</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-6xl">Manage products.</h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
          <AdminSidebar />
          <ProductManagementTable />
        </div>
      </section>
    </Protected>
  );
}
