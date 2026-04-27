"use client";

import Link from "next/link";
import { ArrowRight, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

export function Promotions() {
  const benefits = [
    { icon: Truck, label: "Free shipping over $120" },
    { icon: RefreshCw, label: "30-day easy returns" },
    { icon: ShieldCheck, label: "Secure checkout" }
  ];

  return (
    <section className="bg-ink-900 text-white">
      <div className="container-shell section-space grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="text-label uppercase text-citrus">Bundle offer</p>
          <h2 className="mt-3 headline-h2 max-w-2xl">Build a 3-tee rotation and save 10%.</h2>
          <p className="mt-4 max-w-2xl text-body text-ink-100">
            Mix heavyweight, performance, and graphic pieces in one cart. The discount applies automatically once your
            subtotal reaches $180.
          </p>
          <Link 
            href="/products" 
            className={buttonClasses({ className: "mt-6 bg-citrus text-ink-900 hover:bg-citrus/90" })}
          >
            Build bundle <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3">
          {benefits.map((benefit) => (
            <div key={benefit.label} className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 p-5">
              <benefit.icon className="h-5 w-5 text-citrus" />
              <span className="text-sm font-semibold">{benefit.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
