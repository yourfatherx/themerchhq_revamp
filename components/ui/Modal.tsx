"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconButton } from "./IconButton";
import { cn } from "@/lib/cn";

/**
 * Modal and drawer, both built on native `<dialog>`.
 *
 * `showModal()` gives focus trapping, the top layer, Escape-to-close and
 * `inert` on the rest of the page for free — all the things a hand-rolled
 * overlay gets subtly wrong. e3 is reserved for these two and nothing else.
 */

function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fires for Escape as well as an explicit close().
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    el.addEventListener("cancel", onCancel);
    return () => el.removeEventListener("cancel", onCancel);
  }, [onClose]);

  return ref;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useDialog(open, onClose);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      className={cn(
        "m-auto w-[min(92vw,520px)] rounded-lg bg-surface p-0 text-ink shadow-e3",
        "backdrop:bg-ink/40",
      )}
    >
      <div className="flex items-start justify-between gap-4 p-6 pb-0">
        <h2 id="modal-title" className="t-h3 text-ink">
          {title}
        </h2>
        <IconButton icon="cross" label="Close" onClick={onClose} />
      </div>
      <div className="t-body px-6 py-5 text-ink-muted">{children}</div>
      {footer ? (
        <div className="flex flex-wrap justify-end gap-3 px-6 pb-6">{footer}</div>
      ) : null}
    </dialog>
  );
}

/** A right-hand drawer — the cart, on a storefront. */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useDialog(open, onClose);

  return (
    <dialog
      ref={ref}
      aria-labelledby="drawer-title"
      className={cn(
        "mt-0 mr-0 mb-0 ml-auto h-full max-h-none w-[min(92vw,420px)] rounded-none rounded-l-lg",
        "bg-surface p-0 text-ink shadow-e3 backdrop:bg-ink/40",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-hairline p-5">
          <h2 id="drawer-title" className="t-h4 text-ink">
            {title}
          </h2>
          <IconButton icon="cross" label="Close" onClick={onClose} />
        </div>
        <div className="grow overflow-y-auto p-5">{children}</div>
        {footer ? (
          <div className="border-t border-hairline p-5">{footer}</div>
        ) : null}
      </div>
    </dialog>
  );
}
