"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorState({ title, message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-6 py-8 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
          <p className="text-sm leading-6 text-red-800 dark:text-red-100">{message}</p>
          {actionLabel && onAction ? (
            <Button variant="danger" className="mt-3" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
