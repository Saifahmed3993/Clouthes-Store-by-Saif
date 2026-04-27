"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/utils/motion";

export function HeroSection() {
  return (
    <section className="relative min-h-[82svh] overflow-hidden bg-ink-900 text-white">
      <Image
        src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1800&q=85"
        alt="Premium t-shirt editorial campaign"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-75"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,16,13,0.86),rgba(17,16,13,0.42),rgba(17,16,13,0.08))]" />
      <div className="container-shell relative flex min-h-[82svh] flex-col justify-center py-16 sm:py-20">
        <motion.div className="max-w-2xl" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm font-semibold backdrop-blur">
            <Sparkles className="h-4 w-4 text-citrus" />
            Spring capsule is live
          </motion.div>
          <motion.h1 variants={fadeUp} transition={{ duration: 0.55 }} className="headline-hero">
            Clouthes
          </motion.h1>
          <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="mt-4 max-w-xl text-body-lg text-ink-50">
            Premium t-shirts with sharp fits, resilient fabrics, and the quiet confidence of a daily uniform.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-citrus text-ink-900 hover:bg-citrus/90">
              <Link href="/products">
                Shop collection <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
              <Link href="/products?category=limited">Limited drops</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
