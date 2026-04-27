import type { Metadata } from "next";
import { Protected } from "@/features/auth/components/protected";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AnalyticsCards } from "@/features/admin/components/analytics-cards";
import { SalesChart } from "@/features/admin/components/sales-chart";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Clouthes commerce analytics and management dashboard."
};

export default function AdminPage() {
  return (
    <Protected role="admin">
      <section className="container-shell py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">Admin</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-6xl">Commerce command center.</h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
          <AdminSidebar />
          <div className="space-y-6">
            <AnalyticsCards />
            <SalesChart />
          </div>
        </div>
      </section>
    </Protected>
  );
}
