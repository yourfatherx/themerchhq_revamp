import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { buttonClasses, type ButtonLook } from "./Button";

/**
 * A link that looks like a button.
 *
 * Use this for anything that navigates — "Request a quote", "See the
 * catalogue". Use `Button` only for things that act. Keeping them separate
 * means a CTA is never a `<button>` inside an `<a>`, and middle-click, open-in-
 * new-tab and "copy link address" all behave the way a reader expects.
 */
export type ButtonLinkProps = ButtonLook & {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "className">;

export function ButtonLink({
  variant,
  size,
  onDark,
  fullWidth,
  leadingIcon,
  trailingIcon,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        buttonClasses({ variant, size, onDark, fullWidth }),
        "no-underline hover:no-underline",
      )}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </Link>
  );
}
