/** Join class names, dropping anything falsy.
 *
 *  Deliberately not `tailwind-merge`: every component here picks its classes
 *  from an explicit variant map rather than layering overrides, so there is
 *  nothing to de-duplicate. If a component ever needs conflict resolution,
 *  that is a sign the variant map is wrong. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
