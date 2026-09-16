/* @tt-ui ui/parts/capture.ts library=1.5.1 sha256=73f3ef6945383cc3aa947687e22fe6c18e7107bacfae298d1caa4148e64378b8
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * The shape of a part's `capture.ts`, written once.
 *
 * Twenty-two parts declare the same four fields and, before this module, twenty-
 * two `as const` object literals declared them independently: twelve exported a
 * `<Part>CaptureState` alias and ten did not, and the only reader-side type was
 * an ad-hoc structural predicate inside `ui/cli/inventory.ts` looking for
 * *"something with a string `id`"*. A part could misspell `specimen`, forget
 * `live` on an overlay, or add a field the CLI silently ignores, and nothing
 * would say so until a theme's `/components` frame came out missing a pane
 * three commands later. One type for one shape, exported from one place
 * (CLAUDE.md §7.7).
 *
 * **Not a React module and not vendored.** `capture.ts` is read by
 * `ui/cli/inventory.ts` at generation time and by `lib/pipeline/check.ts`
 * through the inventory; none of it reaches a buyer's zip. It holds no words, no
 * classes and no markup — a pane's *content* is the theme's fixture and is
 * forbidden to be shared.
 *
 * **When a part also exports a `<Part>CaptureState` alias**: only when something
 * reads it. `field` and `search-input` key their `fixtures.schema.ts` off the
 * pane list (`{ [State in FieldCaptureState]: … }`), which is the alias earning
 * its place; ten other parts exported one that nothing anywhere imported, and
 * those are gone. `PartCapture<S>` carries the parameter for the two that need
 * it.
 *
 * *Rejected*: putting this in `ui/core/react/`. Nothing here is behaviour and
 * nothing here imports React; `core/` is layer 1 and this is metadata about
 * layer 2.
 */

export interface PartCapture<S extends string = string> {
  /** The manifest row name, the `data-component` value and the capture key. */
  id: `ui/${string}`;
  /**
   * The `data-state` panes the part's one `/components` frame must carry.
   *
   * **An overlay's list includes `live`** — the pane that mounts the real part
   * with a real trigger, because a specimen surface has nothing to open and a
   * frame with only a specimen passes every static check while giving
   * `gate:ui-contract` nothing to click.
   */
  states: readonly S[];
  /** The skeleton export `/components` mounts in the non-`live` panes. */
  specimen: string;
  /**
   * `false` for a part with no frame of its own — `form` is the only one, and
   * it is exercised inside the frames of the parts it orchestrates. Absent
   * means `true`.
   */
  frame?: boolean;
}

/**
 * Identity, with `const` inference — the same device `core/react/recipe.ts`'s
 * `axes()` is, and for the same reason: it keeps the literal types `as const`
 * would give while making the shape checkable at the point of declaration
 * rather than at the point of reading.
 */
export function capture<const C extends PartCapture>(definition: C): C {
  return definition;
}
