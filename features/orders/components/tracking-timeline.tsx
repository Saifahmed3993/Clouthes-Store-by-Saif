import { CheckCircle2, Circle, Package, Truck } from "lucide-react";
import type { OrderStatus } from "@/types/order";
import { cn } from "@/utils/cn";

const steps: Array<{ status: OrderStatus; label: string; icon: typeof Circle }> = [
  { status: "placed", label: "Placed", icon: CheckCircle2 },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { status: "packed", label: "Packed", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 }
];

export function TrackingTimeline({ status }: { status: OrderStatus }) {
  const activeIndex = steps.findIndex((step) => step.status === status);

  return (
    <div className="grid grid-cols-5 gap-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const active = index <= activeIndex;

        return (
          <div key={step.status} className="text-center">
            <div
              className={cn(
                "mx-auto flex h-10 w-10 items-center justify-center rounded-full border",
                active
                  ? "border-moss bg-moss text-white"
                  : "border-ink-200 bg-white text-ink-400 dark:border-white/15 dark:bg-white/5"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-2 text-xs font-semibold">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}
