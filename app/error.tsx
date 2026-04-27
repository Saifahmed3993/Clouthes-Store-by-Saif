"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { reportError } from "@/services/error-reporter";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    reportError(error, { boundary: "global", digest: error.digest });
  }, [error]);

  return (
    <section className="container-shell py-16">
      <ErrorState
        title="Something went sideways"
        message="The page could not finish loading. Try again and the store will re-sync."
        actionLabel="Try again"
        onAction={reset}
      />
    </section>
  );
}
