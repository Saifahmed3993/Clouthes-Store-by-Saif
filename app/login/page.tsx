import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Clouthes account."
};

export default function LoginPage() {
  return (
    <section className="container-shell grid min-h-[72vh] place-items-center py-10">
      <div className="w-full max-w-md rounded-md border border-ink-200 bg-white p-6 shadow-soft dark:border-white/15 dark:bg-white/5">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">Account</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Sign in</h1>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
