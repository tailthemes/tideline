/* @tt-ui ui/parts/accordion-disclosure/axes.ts library=1.5.1 sha256=8c4974c7a235c6ef952c028aeed7ff5ab7761ffa03ccec535774f8b4520c985e
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * `accordion-disclosure` — seven slots, no axes, and no `closeMs`.
 *
 * The axes module is **data, not types**: `ui/cli`'s `add` reads it to write
 * every slot into the theme's stub with a `TODO(design-pass)` beside it, and
 * `gate:recipe-distance` reads it to tokenize a recipe per slot.
 *
 * ── WHY THERE IS NO AXIS AT ALL ───────────────────────────────────────────
 * A disclosure has one appearance and two states, and both states are already
 * carried where CSS can reach them: `data-state="open" | "closed"` on the root,
 * and — in the native rendering — the `[open]` attribute that `group-open:` and
 * `::details-content` are written against. An axis would ask fourteen themes
 * for class strings that a single `[data-state="open"]` rule writes once. The
 * marker is a *prop*, not an axis, because it is an icon and icons are the
 * theme's (foundry swaps `+` for `−`, appetite turns a chevron 90°, and neither
 * is a value in a set).
 *
 * ── WHY THERE IS NO `LayerMotion` ─────────────────────────────────────────
 * Every other part with an exit unmounts a node, so something has to hold it
 * mounted for its keyframe. This one never unmounts anything: the region and
 * its content stay in the DOM in both states, which is what makes the height
 * tween possible at all (`::details-content` behind
 * `@supports (interpolate-size: allow-keywords)`) and what keeps a marketing
 * theme's FAQ answers in the page a crawler reads. With nothing to hold, a
 * required `closeMs` would be a number no code consumes — and the first theme
 * to write one teaches the next reader that it means something.
 */

import { axes, type Recipe } from "./recipe";

export const accordionDisclosureAxes = axes({
  slots: ["root", "heading", "summary", "marker", "label", "meta", "region"],
});

/** Every slot. No optional keys. */
export type AccordionDisclosureRecipe = Recipe<typeof accordionDisclosureAxes>;
