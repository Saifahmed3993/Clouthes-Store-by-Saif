import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: Array<{ label: string; value: string | number }>;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <label className="block space-y-2" htmlFor={selectId}>
        {label ? <span className="text-sm font-semibold text-ink-700 dark:text-ink-50">{label}</span> : null}
        <span className="relative block">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "focus-ring h-11 w-full appearance-none rounded-md border border-ink-200 bg-surface px-3 pr-10 text-sm text-ink-900 transition focus-visible:border-ink-500 dark:border-white/15 dark:bg-ink-900 dark:text-white",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
        </span>
        {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
      </label>
    );
  }
);

Select.displayName = "Select";
