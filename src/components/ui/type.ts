/**
 * The type ladder as class strings. Bare `text-*` utilities are banned in theme
 * components (themes/CONTRACT.md §Type scale) — sizes route through tokens
 * exactly like colours do, and this file is the only place that knows the token
 * names.
 *
 * Ratio **1.500** (editorial/brand, on the CONTRACT list), anchored at 1.5rem:
 *
 *   d1 1.5rem (24px) · d2 2.25rem (36px) · d3 3.375rem (54px) · d4 5.0625rem (81px)
 *
 * d4 exists because this theme has no product shot to lead with. On a
 * pre-launch site the headline is the largest object on the page by a long way,
 * and 1.500 is the ratio that gets from a 24px section heading to an 81px hero
 * in three steps without a size in between that reads as neither.
 */
export const TEXT = {
  caption: "text-(length:--text-caption) leading-(--leading-caption)",
  small: "text-(length:--text-small) leading-(--leading-small)",
  body: "text-(length:--text-body) leading-(--leading-body)",
  lead: "text-(length:--text-lead) leading-(--leading-lead)",
  d1: "text-(length:--text-d1) leading-(--leading-d1) tracking-(--tracking-d1)",
  d2: "text-(length:--text-d2) leading-(--leading-d2) tracking-(--tracking-d2)",
  d3: "text-(length:--text-d3) leading-(--leading-d3) tracking-(--tracking-d3)",
  d4: "text-(length:--text-d4) leading-(--leading-d4) tracking-(--tracking-d4)",
  /** The eyebrow: caption size, wide tracking, uppercase. */
  eyebrow:
    "text-(length:--text-caption) leading-(--leading-caption) tracking-(--tracking-eyebrow) uppercase",
  /** Tighter than the eyebrow — table labels, chips, email kickers. */
  label:
    "text-(length:--text-caption) leading-(--leading-caption) tracking-(--tracking-label) uppercase",
} as const;

/**
 * Spectral at the weight the active mode declares — 300 on the near-black
 * ground, 400 on the cream, because light ink on dark reads heavier than dark
 * ink on light and the family actually ships the range to correct it.
 */
export const DISPLAY =
  "font-(family-name:--font-display) font-(number:--weight-display)";

/** Martian Mono. Dates, room numbers, material codes, list standing. */
export const MONO = "font-mono";

/** Every figure a reader compares vertically: areas, dates, room numbers. */
export const TNUM = "tabular-nums";

/** A standalone display figure reads loose with equal-width digits. */
export const PNUM = "proportional-nums";

/** Nested corners step down from --radius; never the other way round. */
export const INNER_RADIUS = "rounded-(--radius-inner)";

/** One ring, everywhere, instant — never transitioned (motion-pass P-11). */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * Micro-feedback only: 140ms, ease-out, colour and opacity. The property list
 * is spelled out rather than left open, because an unscoped transition
 * animates properties nobody considered — and the focus ring must never be
 * caught by one (P-11).
 */
export const TRANSITION =
  "motion-safe:transition-[color,background-color,border-color,opacity] motion-safe:duration-(--duration-micro) motion-safe:ease-out";

/**
 * In light mode brass is a fill, never a graphic: `--primary` on the cream
 * ground measures 1.88:1, under the 3:1 graphic tier. Anything that would be
 * brass *ink* — an eyebrow, a rule, a figure, a link — uses this instead,
 * which resolves to light brass in dark (10.42:1) and to dark brass in
 * light (5.35:1). Reaching for `text-primary` on a hairline is the bug this
 * token exists to prevent; the values are in `theme.css`, which is the one
 * file allowed to name them.
 */
export const INK = "text-(--primary-ink)";
export const INK_BORDER = "border-(--primary-ink)";
