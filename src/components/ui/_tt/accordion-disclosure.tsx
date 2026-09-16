/* @tt-ui ui/parts/accordion-disclosure/react/accordion-disclosure.tsx library=1.5.1 sha256=aaea17eb0937fd3318057c331cf9c3d505d34af51bb624158a46bb2996f903a3
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
"use client";

/**
 * `accordion-disclosure` — one summary, one region, and the key the native
 * element does not give you.
 *
 * Every `className` comes from `recipe`; there is no fallback string and no
 * visual utility of any kind.
 *
 * ── TWO RENDERINGS, ONE GRAPH ─────────────────────────────────────────────
 * Canon §4.6's anatomy names both: `details › summary` + region, **or**
 * `button[aria-expanded, aria-controls]` + `region[role=region,
 * aria-labelledby]`. This part ships both behind `element`, because the catalog
 * genuinely needs both and the difference is not appearance:
 *
 *   `"details"` — ten of fourteen themes' FAQs and mobile navs are a native
 *     `<details>`, and it is the only rendering that works with no JavaScript at
 *     all (ADR-012: `html/dist/` opens over `file://`), that keeps its answers
 *     in the page a crawler reads, and that can tween its height with
 *     `::details-content`.
 *   `"button"` — appetite's, and the right one when the panel is a
 *     `role="region"` a reader is meant to land in, or when a group of them
 *     needs headings *outside* the controls (APG's accordion is
 *     `<h3><button aria-expanded>`, which `<summary>` cannot be: a summary must
 *     be the first child of its details, so its heading goes inside it).
 *
 * A theme picks one and writes one recipe; the slots, the `data-part` names and
 * the Escape contract are identical either way. *Rejected*: two parts. They
 * would have the same seven slots, the same behaviour and the same doc page,
 * and `ui census` would count one theme's disclosure twice.
 *
 * ── ESCAPE IS LOCAL, AND IT IS THE WHOLE POINT OF THE PART ────────────────
 * Canon §4.6: "Escape from inside collapses and returns focus to the summary —
 * the one behaviour the native element does not give and the one every theme is
 * missing". The string `"Escape"` appears nowhere in `src/` for eight of the
 * fourteen themes, and four of them ship a *comment claiming the opposite*.
 *
 * It is handled by a React `onKeyDown` on the root — a bubble-phase listener on
 * this subtree — and **not** by joining `core/layer`'s stack. The stack
 * delivers Escape to its top entry from anywhere on the page, which is right
 * for a layer and wrong for this: an FAQ with six open answers would collapse
 * the last-opened one when a reader pressed Escape somewhere else entirely.
 * Locality is the behaviour.
 *
 * The cost is named rather than hidden: a disclosure open *inside* an open
 * dialog does not take Escape from it, because the stack's document listener is
 * on the capture phase and runs first. The dialog closes and takes the
 * disclosure with it, so nothing is stranded — but the innermost thing is not
 * the thing that closed. Reported.
 *
 * ── CONTROLLED, UNCONTROLLED, AND WHY BOTH ────────────────────────────────
 * `<details>` toggles itself. A theme's FAQ has no state and should need none —
 * foundry's is six `<details>` and zero lines of JavaScript — so the default is
 * uncontrolled with `defaultOpen`. A call site that needs to close a panel from
 * outside (a mobile nav closing on a route change, an accordion that allows one
 * open at a time) passes `open` and `onToggle` and owns it. The internal state
 * is not read while `open` is supplied, so the two cannot drift.
 *
 * `onToggle` rather than `onOpenChange` or `onClose`: § Vocabulary bans the
 * first for the overlay lifecycle, and the second is only half of what happens
 * here — a disclosure opens exactly as often as it closes, and neither
 * direction is a dismissal. § Vocabulary names this part as the one place
 * `onToggle` is the right word, and says why: a disclosure is a control whose
 * state *is* the value it reports. Nothing with a layer may borrow it.
 */

import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import { useIds } from "./ids";
import type { AccordionDisclosureRecipe } from "./accordion-disclosure.axes";

export interface AccordionDisclosureSurfaceProps {
  /** The row's words. The accessible name of the control. */
  summary: ReactNode;
  /** A count or a short qualifier beside the summary. */
  meta?: ReactNode;
  /**
   * The theme's open/closed glyph, rendered `aria-hidden` — the state is
   * announced by `aria-expanded`, never by the marker. A theme that swaps two
   * shapes (foundry's `+` and `−`) passes both and hides one in CSS off
   * `data-state`; a theme that turns one passes it once.
   */
  marker?: ReactNode;
  /**
   * Wraps the summary's label in a heading at this level. Omit it where the
   * disclosure is a control rather than a section — a mobile-nav toggle is not
   * a heading. Canonical values for a nested section (§ Vocabulary).
   */
  headingLevel?: 2 | 3;
  /** The panel's content. Rendered in both states; only its visibility changes. */
  children: ReactNode;
  /** `"details"` is the JS-free rendering and the default. See the header. */
  element?: "details" | "button";
  recipe: AccordionDisclosureRecipe;
}

export interface AccordionDisclosureRootProps extends AccordionDisclosureSurfaceProps {
  /** Supply this to control the panel from outside; omit it and the part owns the state. */
  open?: boolean;
  /** The state the panel is moving to. Required only when `open` is supplied. */
  onToggle?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export function AccordionDisclosureRoot({
  open,
  onToggle,
  defaultOpen = false,
  element = "details",
  summary,
  meta,
  marker,
  headingLevel,
  children,
  recipe,
}: AccordionDisclosureRootProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const controlled = open !== undefined;
  const isOpen = controlled ? open : uncontrolled;
  const summaryRef = useRef<HTMLElement>(null);
  const ids = useIds("accordion-disclosure");
  const summaryId = ids.id("summary");
  const regionId = ids.id("region");

  function set(next: boolean) {
    if (!controlled) setUncontrolled(next);
    onToggle?.(next);
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape" || !isOpen) return;
    /* Stopped, not prevented: the keypress has been answered by this subtree
       and must not also reach an accordion wrapping it. `preventDefault` would
       additionally suppress a browser default this key does not have here. */
    event.stopPropagation();
    set(false);
    summaryRef.current?.focus({ preventScroll: true });
  }

  const state = isOpen ? "open" : "closed";
  const Heading = headingLevel === 2 ? "h2" : "h3";

  const label = (
    <span data-part="accordion-disclosure-label" className={recipe.label}>
      {summary}
    </span>
  );

  /* The heading wraps the *label* in the native rendering and the whole
     *control* in the button one, because a `<summary>` must be the first child
     of its `<details>` and cannot be wrapped in anything, while APG's accordion
     header is a heading containing the button. One slot, two legal positions,
     and the row's contents are otherwise identical. */
  function row(inner: ReactNode) {
    return (
      <>
        {marker ? (
          <span data-part="accordion-disclosure-marker" aria-hidden="true" className={recipe.marker}>
            {marker}
          </span>
        ) : null}
        {inner}
        {meta ? (
          <span data-part="accordion-disclosure-meta" className={recipe.meta}>
            {meta}
          </span>
        ) : null}
      </>
    );
  }

  if (element === "details") {
    return (
      <details
        open={isOpen}
        data-part="accordion-disclosure"
        data-state={state}
        onKeyDown={onKeyDown}
        /* The browser owns this element's state and tells us afterwards —
           `toggle` is fired in a queued task, so `data-state` is always one
           task behind the native `[open]` attribute, and a theme whose first
           frame must be exact keys off `[open]`. With `open` supplied, React
           writes the attribute back on the next render, so the call site stays
           the authority; without it, this is the only thing that moves the
           state.

           The one case this does not cover: a controller that *refuses* the
           change. React writes `open` only when the prop changes, so a refusal
           leaves the element showing what the browser did. Undoing an already
           native toggle costs either a DOM write inside the event (a visible
           open-shut) or a sync-the-DOM effect on every render, and no call site
           in the canon refuses — an accordion that allows one panel at a time
           *accepts* the open and closes its sibling. Named rather than machined
           around; a theme that needs a refusal uses `element="button"`, where
           the state is React's alone. */
        onToggle={(event) => set(event.currentTarget.open)}
        className={recipe.root}
      >
        <summary
          /* A callback ref, because the same ref holds a `<summary>` in one
             rendering and a `<button>` in the other and neither element type is
             assignable to the other's `Ref<T>`. A cast would say the same thing
             less honestly. */
          ref={(node) => {
            summaryRef.current = node;
          }}
          id={summaryId}
          /* `-trigger`, though the anatomy calls it the summary: this is the
             node `gate:ui-contract` presses, and its selector is
             `[data-part$="-trigger"]` (library.md §1.11). The recipe slot keeps
             the anatomy's word. */
          data-part="accordion-disclosure-trigger"
          className={recipe.summary}
        >
          {row(
            headingLevel === undefined ? (
              label
            ) : (
              <Heading data-part="accordion-disclosure-heading" className={recipe.heading}>
                {label}
              </Heading>
            ),
          )}
        </summary>
        <div id={regionId} data-part="accordion-disclosure-region" className={recipe.region}>
          {children}
        </div>
      </details>
    );
  }

  const control = (
    <button
      ref={(node) => {
        summaryRef.current = node;
      }}
      type="button"
      id={summaryId}
      aria-expanded={isOpen}
      aria-controls={regionId}
      data-part="accordion-disclosure-trigger"
      onClick={() => set(!isOpen)}
      className={recipe.summary}
    >
      {row(label)}
    </button>
  );

  return (
    <div
      data-part="accordion-disclosure"
      data-state={state}
      onKeyDown={onKeyDown}
      className={recipe.root}
    >
      {headingLevel === undefined ? (
        control
      ) : (
        <Heading data-part="accordion-disclosure-heading" className={recipe.heading}>
          {control}
        </Heading>
      )}
      <div
        id={regionId}
        role="region"
        aria-labelledby={summaryId}
        /* Hidden rather than unmounted, in both renderings: it is what lets a
           height tween have something to measure, and what keeps a marketing
           theme's FAQ answers in the page a crawler reads. */
        hidden={!isOpen}
        data-part="accordion-disclosure-region"
        className={recipe.region}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * The static rendering: the same seven slots, open or closed, with nothing that
 * responds. What `/components` photographs, in one pane per state.
 *
 * It is the real part with the state pinned — `open` supplied and no
 * `onToggle`, which is a controlled component whose controller never changes
 * its mind. A second copy of the markup would be a specimen that drifts, which
 * is the failure `DialogSpecimen` exists to avoid.
 */
export function AccordionDisclosureSpecimen({
  open,
  ...rest
}: AccordionDisclosureSurfaceProps & { open: boolean }) {
  return <AccordionDisclosureRoot {...rest} open={open} />;
}
