import { BedDouble, Check, Frame, Hammer, Home, PaintRoller } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import type { Stage } from "../../fixtures/marram";
import { FOCUS, MONO, TEXT, TNUM, TRANSITION } from "./type";

/**
 * The badge, and the theme's whole icon policy.
 *
 * ── ONE SHAPE, TWO TONES ─────────────────────────────────────────────────
 * A hairline-outlined mono label. The catalog's habit is a rainbow of tinted
 * pills — one colour per status — and this theme cannot do that even if it
 * wanted to: `accent_mode` is `monochrome-plus-spot`, so there is exactly one
 * chromatic ink available and it is brass. So the axis is not hue, it is
 * **marked or not**:
 *
 *   quiet   — the default. Hairline, muted ink. Most badges are this.
 *   marked  — brass ink on the accent wash. Reserved for "this one is ahead
 *             of the others": a wave-one room, a finished stage.
 *
 * That is also why the tone is never the only signal. Every badge carries its
 * word, and the ones that name a lifecycle position carry a glyph as well, so
 * a reader who cannot see the difference between hairline and brass still has
 * two other channels.
 *
 * ── WHERE AN ICON IS ALLOWED, AND WHY IT IS A SHORT LIST ─────────────────
 * The register here is quiet and editorial, and an icon on every heading is
 * the fastest way to make an editorial page look like a dashboard. So a glyph
 * has to be doing one of exactly two jobs:
 *
 *   1. **Making a repeated row scannable.** Eleven room rows each carrying an
 *      aspect, an area and a bed count read as a wall of text; three glyphs
 *      turn them into three columns the eye can jump between. This is the
 *      stage ladder's job too — `Frame → Home → PaintRoller → Hammer → Check`
 *      is a sequence you can read at a glance across eleven rows in a way that
 *      five words are not.
 *   2. **Naming a thing that is genuinely a place or a time**, where the glyph
 *      is faster than the label: the station in the footer, the arrival time
 *      on an email card.
 *
 * Everything else has no icon, deliberately: no glyph in an eyebrow, none on a
 * section heading, none in the hero, and none on the materials board — where
 * the swatch already *is* the icon and a second mark beside it would be the
 * same information twice.
 *
 * Hand-rolling an icon stays a bug (CONTRACT §Component rules). These are
 * `lucide-react`, sized by class, coloured by `currentColor`, `aria-hidden`
 * because the word beside them is the label.
 */

type Tone = "quiet" | "marked";

const TONE: Record<Tone, string> = {
  quiet: "border-border text-muted-foreground",
  marked: "border-(--primary-border) bg-accent text-(--primary-ink)",
};

/** Over a photograph, where neither mode's tokens apply — see AGENTS.md. */
const ON_PLATE = "border-(--plate-ink-muted)/50 text-(--plate-ink-muted)";

export function Badge({
  children,
  tone = "quiet",
  icon: Icon,
  onPlate = false,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  /** A lucide component. Rendered `aria-hidden`; the word is the label. */
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  onPlate?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-(--radius) border px-2.5 py-1 ${MONO} ${TEXT.caption} tracking-(--tracking-label) uppercase ${
        onPlate ? ON_PLATE : TONE[tone]
      } ${className}`}
    >
      {Icon ? <Icon aria-hidden className="size-3 shrink-0" /> : null}
      {children}
    </span>
  );
}

/** The same shape as a link — used by the room chips, which navigate. */
export function BadgeLink({
  children,
  href,
  tone = "quiet",
  icon: Icon,
  className = "",
}: {
  children: ReactNode;
  href: string;
  tone?: Tone;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-(--radius) border px-2.5 py-2 ${MONO} ${TEXT.caption} tracking-(--tracking-label) uppercase ${TONE[tone]} ${
        tone === "quiet" ? "hover:text-foreground" : ""
      } ${TRANSITION} ${FOCUS} ${className}`}
    >
      {Icon ? <Icon aria-hidden className="size-3 shrink-0" /> : null}
      {children}
    </a>
  );
}

/**
 * The build ladder, in order. Read across eleven rows this is a sequence — an
 * empty frame, then a roof, then plaster, then tools, then done — which is
 * what makes eleven stage words scannable instead of a column of prose.
 */
export const STAGE_ICON: Record<
  Stage,
  ComponentType<{ className?: string; "aria-hidden"?: boolean }>
> = {
  shell: Frame,
  roofed: Home,
  plastered: PaintRoller,
  fitted: Hammer,
  furnished: Check,
};

/** Only `furnished` is marked: it is the one stage that means "you could stay". */
export function stageTone(stage: Stage): Tone {
  return stage === "furnished" ? "marked" : "quiet";
}

/** Beds are a count, so the badge sets them in tabular figures. */
export function BedBadge({ beds }: { beds: string }) {
  return (
    <Badge icon={BedDouble} className={TNUM}>
      {beds}
    </Badge>
  );
}
