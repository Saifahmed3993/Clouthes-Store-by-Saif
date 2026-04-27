import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-shell flex min-h-[70vh] flex-col items-start justify-center gap-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">404</p>
      <div className="max-w-xl space-y-4">
        <h1 className="font-display text-4xl font-semibold sm:text-6xl">This rack is empty.</h1>
        <p className="text-base leading-7 text-ink-500 dark:text-ink-100">
          We could not find that page, but the latest drops are still waiting.
        </p>
      </div>
      <Button asChild>
        <Link href="/products">Shop products</Link>
      </Button>
    </section>
  );
}
