import type { ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import type { IconName } from "@/components/brand/icons";

/**
 * 32px glyph on a 72px tint plate · h2 headline · one primary action and one
 * escape hatch.
 *
 * An empty screen is an invitation to act, so the copy says what will land here
 * and the actions say what to do next — never "No data".
 */
export function EmptyState({
  icon,
  title,
  children,
  action,
  escape,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
  action?: ReactNode;
  escape?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-[72px] place-items-center rounded-lg bg-accent-tint text-accent">
        <Icon name={icon} size={32} />
      </span>
      <h2 className="t-h2 mt-6 text-ink">{title}</h2>
      <p className="t-body-lg mt-3 max-w-[52ch] text-ink-muted">{children}</p>
      {action || escape ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {action}
          {escape}
        </div>
      ) : null}
    </div>
  );
}
