"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/utils/constants";
import { leftDrawerMotion } from "@/utils/motion";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button className="absolute inset-0 bg-ink-900/55" aria-label="Close navigation" onClick={onClose} />
          <motion.aside className="absolute left-0 top-0 h-full w-[84vw] max-w-sm bg-ink-50 p-5 shadow-lift dark:bg-ink-900" {...leftDrawerMotion}>
            <div className="flex items-center justify-between">
              <Link href="/" className="font-display text-2xl font-semibold" onClick={onClose}>
                Clouthes
              </Link>
              <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="mt-8 grid gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="rounded-md px-3 py-3 text-base font-semibold hover:bg-ink-100 dark:hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
