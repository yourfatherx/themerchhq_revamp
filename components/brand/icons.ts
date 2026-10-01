import {
  ArrowRight,
  ChevronDown,
  Circle,
  CircleCheck,
  CircleX,
  Clock,
  CreditCard,
  FileText,
  LayoutGrid,
  Link as LinkIcon,
  Minus,
  Package,
  Plus,
  Ruler,
  Search,
  ShieldCheck,
  Shirt,
  SlidersHorizontal,
  Store,
  Trash2,
  Truck,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

/* The Merch HQ — icon set.
 *
 * These were authored in-house on a 24-unit grid: solid fill, no stroke, at
 * most three shapes. That constraint is what sank them. It survives simple
 * geometry — a clock, a tick, a plus — and defeats anything representational:
 * the shirt, the storefront and the group of people all collapsed into blobs,
 * because three solid shapes cannot describe an object.
 *
 * So the set is Lucide now (ISC, bundled as `lucide-react`), chosen by hand per
 * concept rather than imported wholesale. This overrides the brand rule the
 * token page still prints — "never a downloaded set" — which was the user's
 * call, made knowing that is what it costs.
 *
 * It is one library and one weight throughout. A second family anywhere is the
 * one thing people notice, and the point of this file is that there is exactly
 * one place to look.
 *
 * Lucide draws on the same 24 viewBox the old set used, so nothing that renders
 * an icon had to change. It is stroked rather than filled, which is the visible
 * difference: lighter, and better company for a layout built on hairlines.
 */

export type IconName = keyof typeof ICONS;

export const ICONS = {
  /* Commerce and product */
  kit: Package,
  storefront: Store,
  tee: Shirt,
  truck: Truck,
  payment: CreditCard,
  /** The "exacting, not precious" principle — a measure, not a list. */
  sizes: Ruler,
  batch: Users,
  user: User,

  /* State */
  clock: Clock,
  tick: CircleCheck,
  cross: CircleX,
  shield: ShieldCheck,

  /* Interface */
  dashboard: LayoutGrid,
  quote: FileText,
  link: LinkIcon,
  search: Search,
  filter: SlidersHorizontal,
  trash: Trash2,
  arrow: ArrowRight,
  chevron: ChevronDown,
  plus: Plus,
  minus: Minus,
  dot: Circle,
} as const satisfies Record<string, LucideIcon>;
