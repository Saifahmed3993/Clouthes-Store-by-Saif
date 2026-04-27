"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuantityStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function QuantityStepper({ value, min = 1, max = 99, onChange }: QuantityStepperProps) {
  return (
    <div className="inline-grid h-10 grid-cols-[2.5rem_3rem_2.5rem] overflow-hidden rounded-md border border-ink-200 bg-white dark:border-white/15 dark:bg-white/5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 rounded-none"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="flex items-center justify-center text-sm font-semibold">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 rounded-none"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
