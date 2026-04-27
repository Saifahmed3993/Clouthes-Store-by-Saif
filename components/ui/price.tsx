import { formatCurrency } from "@/utils/format";

export function Price({ value, originalValue }: { value: number; originalValue?: number }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="font-semibold">{formatCurrency(value)}</span>
      {originalValue && originalValue > value ? (
        <span className="text-sm text-ink-500 line-through dark:text-ink-100">{formatCurrency(originalValue)}</span>
      ) : null}
    </span>
  );
}
