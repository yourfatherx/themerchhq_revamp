"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/cn";

/** 2px accent underline, 48px hit height, label 500 → 600 when active. */
export function Tabs({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: ReadonlyArray<{ id: string; label: string }>;
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 border-b border-hairline">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`panel-${t.id}`}
            id={`tab-${t.id}`}
            onClick={() => onChange(t.id)}
            className={cn(
              "h-12 border-b-2 px-4 text-[15px] transition-colors duration-150 ease-brand",
              active
                ? "border-accent font-semibold text-ink"
                : "border-transparent font-medium text-ink-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} tabIndex={0}>
      {children}
    </div>
  );
}

/** Body-sm, Slate chevron, current page in ink and not a link. */
export function Breadcrumb({
  items,
}: {
  items: ReadonlyArray<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {last || !item.href ? (
                <span
                  aria-current={last ? "page" : undefined}
                  className="t-body-sm text-ink"
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="t-body-sm text-ink-muted hover:text-accent-deep">
                  {item.label}
                </Link>
              )}
              {last ? null : (
                <Icon name="chevron" size={16} className="-rotate-90 text-rule" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * First and last page are always reachable; the ellipsis is never a button.
 */
export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  const pages = pageNumbers(page, pageCount);

  const cell =
    "grid h-10 min-w-10 place-items-center rounded-md px-2 text-[15px] transition-colors duration-150 ease-brand";

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(
          cell,
          "text-ink enabled:hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-tint",
        )}
      >
        <Icon name="arrow" size={20} className="rotate-180" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          // Never a button — it is a gap, not a destination.
          <span key={`gap-${i}`} className={cn(cell, "text-ink-muted")} aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              cell,
              "figure",
              p === page
                ? "bg-accent font-medium text-surface"
                : "text-ink hover:bg-surface-hover",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
        className={cn(
          cell,
          "text-ink enabled:hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-tint",
        )}
      >
        <Icon name="arrow" size={20} />
      </button>
    </nav>
  );
}

/** Always includes page 1 and the last page, with at most one gap either side. */
function pageNumbers(page: number, count: number): Array<number | "…"> {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);

  const out: Array<number | "…"> = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(count - 1, page + 1);

  if (from > 2) out.push("…");
  for (let p = from; p <= to; p++) out.push(p);
  if (to < count - 1) out.push("…");
  out.push(count);

  return out;
}
