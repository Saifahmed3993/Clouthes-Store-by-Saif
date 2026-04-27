"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import type { UserRole } from "@/types/auth";

export function Protected({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const user = useAuthStore((state) => state.user);

  if (!user || (role && user.role !== role)) {
    return (
      <section className="container-shell py-16">
        <div className="rounded-md border border-ink-200 bg-white p-8 text-center dark:border-white/15 dark:bg-white/5">
          <Lock className="mx-auto h-8 w-8 text-clay" />
          <h1 className="mt-4 font-display text-3xl font-semibold">Sign in required</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500 dark:text-ink-100">
            Your session is needed to continue into this secure area.
          </p>
          <Button asChild className="mt-6">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
