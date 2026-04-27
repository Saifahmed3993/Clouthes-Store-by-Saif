import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, id, ...props }, ref) => {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      {label ? <span className="text-sm font-semibold text-ink-700 dark:text-ink-50">{label}</span> : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "focus-ring h-11 w-full rounded-md border border-ink-200 bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-500 transition focus-visible:border-ink-500 dark:border-white/15 dark:bg-white/5 dark:text-white",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
});

Input.displayName = "Input";
