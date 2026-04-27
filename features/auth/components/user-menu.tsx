"use client";

import Link from "next/link";
import { LogOut, Shield, UserCircle } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/store/auth.store";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  if (!user) {
    return (
      <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
        <Link href="/login">
          <UserCircle className="h-4 w-4" />
          Sign in
        </Link>
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button variant="secondary" size="icon" aria-label="Open account menu" onClick={() => setOpen((value) => !value)}>
        {user.role === "admin" ? <Shield className="h-5 w-5" /> : <UserCircle className="h-5 w-5" />}
      </Button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute right-0 mt-3 w-64 rounded-md border border-ink-200 bg-white p-2 shadow-lift dark:border-white/15 dark:bg-ink-900"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <div className="px-3 py-2">
              <p className="font-semibold">{user.name}</p>
              <p className="truncate text-sm text-ink-500 dark:text-ink-100">{user.email}</p>
            </div>
            <Link className="block rounded-md px-3 py-2 text-sm font-semibold hover:bg-ink-100 dark:hover:bg-white/10" href="/orders">
              Orders
            </Link>
            {user.role === "admin" ? (
              <Link className="block rounded-md px-3 py-2 text-sm font-semibold hover:bg-ink-100 dark:hover:bg-white/10" href="/admin">
                Admin dashboard
              </Link>
            ) : null}
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              onClick={() => logout.mutate()}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
