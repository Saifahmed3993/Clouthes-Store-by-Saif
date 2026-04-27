"use client";

import { useEffect, useRef } from "react";
import { WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useNetworkStatus } from "@/hooks/use-network-status";

export function NetworkStatusBar() {
  const { isOnline } = useNetworkStatus();
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
    } else if (wasOfflineRef.current) {
      wasOfflineRef.current = false;
      toast.success("Back online");
    }
  }, [isOnline]);

  return (
    <AnimatePresence>
      {!isOnline ? (
        <motion.div
          className="fixed inset-x-0 top-0 z-[90] flex items-center justify-center gap-2 bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          initial={{ y: -40 }}
          animate={{ y: 0 }}
          exit={{ y: -40 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <WifiOff className="h-4 w-4" />
          You&rsquo;re offline &mdash; some features may be unavailable
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
