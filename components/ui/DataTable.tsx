import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The one square-cornered component in the system.
 *
 * Zebra on sunken, label-type header, figures right-aligned and tabular. The
 * dashboard is the demo — this is what an organiser opens instead of a
 * spreadsheet, and it has to be right the first time they look at it.
 */

export type Column<Row> = {
  key: string;
  header: string;
  /** Figures are right-aligned and tabular; everything else is left. */
  numeric?: boolean;
  render: (row: Row) => ReactNode;
};

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  caption,
  footer,
}: {
  columns: ReadonlyArray<Column<Row>>;
  rows: readonly Row[];
  getRowKey: (row: Row) => string;
  /** Names the table for screen readers. Visually hidden. */
  caption: string;
  footer?: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-surface-sunken">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "t-label border-b border-hairline px-4 py-3 text-ink-muted",
                  c.numeric && "text-right",
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={getRowKey(row)}
              className={cn(
                "border-b border-hairline transition-colors duration-150 ease-brand hover:bg-surface-hover",
                i % 2 === 1 && "bg-surface-sunken/60",
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "px-4 py-4 text-[15px] text-ink",
                    c.numeric && "figure text-right",
                  )}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footer ? (
        <div className="t-body-sm flex flex-wrap items-center justify-between gap-4 px-4 py-4 text-ink-muted">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
