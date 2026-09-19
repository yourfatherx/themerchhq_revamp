"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import type { IconName } from "@/components/brand/icons";
import { cn } from "@/lib/cn";

/**
 * Bottom-right, ink fill, e2, auto-dismiss at 3.2s.
 *
 * Toasts are always ink, never semantic — a red toast competes with the inline
 * alert that caused it. The icon carries the state, and white on ink is
 * 18.62:1.
 */
export function Toast({
  icon = "tick",
  children,
  action,
  onDismiss,
  durationMs = 3200,
}: {
  icon?: IconName;
  children: ReactNode;
  /** One optional action, usually an undo. */
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
  durationMs?: number;
}) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!durationMs) return;
    const t = setTimeout(() => {
      setOpen(false);
      onDismiss?.();
    }, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onDismiss]);

  if (!open) return null;

  return (
    <div
      // Polite: a toast confirms something the user just did; it should not
      // interrupt what they are reading.
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-md bg-ink px-4 py-3 text-surface shadow-e3"
    >
      <Icon name={icon} size={20} className="shrink-0" />
      <span className="t-body-sm">{children}</span>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="ml-2 rounded-sm px-2 py-1 text-[14px] font-semibold text-surface underline underline-offset-2 transition-colors duration-150 ease-brand hover:text-tint"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}

/** The fixed region toasts stack into. Mount once, near the app root. */
export function ToastRegion({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none fixed right-5 bottom-5 z-[100] flex flex-col items-end gap-3">
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {children}
      </div>
    </div>
  );
}

/** Ink fill, radius sm, 13px. Describes; never the only source of a fact. */
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className="group/tt relative inline-flex items-center gap-1">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 w-max max-w-[260px] -translate-x-1/2",
          "rounded-sm bg-ink px-3 py-2 text-[13px] leading-[1.45] text-surface shadow-e3",
          "opacity-0 transition-opacity duration-150 ease-brand",
          "group-hover/tt:opacity-100 group-focus-within/tt:opacity-100",
        )}
      >
        {label}
      </span>
    </span>
  );
}
