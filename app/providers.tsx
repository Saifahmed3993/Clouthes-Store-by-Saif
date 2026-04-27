"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";
import { GlobalLoadingIndicator } from "@/components/layout/global-loading-indicator";
import { NetworkStatusBar } from "@/components/layout/network-status-bar";
import { createQueryClient } from "@/services/query-client";
import { reportError, flushErrors } from "@/services/error-reporter";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  // Global error listeners — catch unhandled errors and promise rejections
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      reportError(event.error ?? event.message, { source: "window.onerror" });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      reportError(event.reason, { source: "unhandledrejection" });
    }

    function handleBeforeUnload() {
      flushErrors();
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <NetworkStatusBar />
        <GlobalLoadingIndicator />
        {children}
        <Toaster richColors closeButton position="top-right" toastOptions={{ className: "rounded-md" }} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
