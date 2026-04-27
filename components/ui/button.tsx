"use client";

import { cloneElement, isValidElement, type ButtonHTMLAttributes, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-ink-700 hover:shadow-lift dark:bg-citrus dark:text-ink-900 dark:hover:bg-citrus/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-ink-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
  ghost: "text-ink-700 hover:bg-ink-100 dark:text-ink-50 dark:hover:bg-white/10",
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline:
    "border border-ink-200 bg-surface text-ink-900 hover:bg-ink-50 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-11 w-11 p-0"
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-semibold transition duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export function Button({ asChild, variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const classes = buttonClasses({ variant, size, className });

  if (asChild && isValidElement(children)) {
    const { disabled, onClick, ...childProps } = props;
    const child = children as ReactElement<Record<string, unknown>>;
    const childClassName = typeof child.props.className === "string" ? child.props.className : undefined;
    const childOnClick = child.props.onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined;

    return cloneElement(child, {
      ...childProps,
      className: cn(classes, childClassName),
      "aria-disabled": disabled ? true : undefined,
      onClick: (event: MouseEvent<HTMLElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        childOnClick?.(event);
        onClick?.(event as MouseEvent<HTMLButtonElement>);
      }
    } as Record<string, unknown>);
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
