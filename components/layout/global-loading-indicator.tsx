"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const visible = isFetching + isMutating > 0;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed left-0 right-0 top-0 z-[80] h-1 origin-left bg-citrus"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
      ) : null}
    </AnimatePresence>
  );
}
