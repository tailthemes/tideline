/* @tt-ui ui/parts/field/axes.ts library=1.5.1 sha256=cfcf2209104fff635de8de2aba963b68ec0350432133ce1c3868b63b016cc574
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * `field` — the shell that makes a native control legible and announced.
 *
 * SIX SLOTS, AND THE FIFTH IS THE ARGUMENT. `root · label · optional · note ·
 * control · message`. The message line is **single**: precedence is
 * error → success → description and `core/field-ids` computes it, so there is
 * one id, one element and one sentence. Docket's family is the reference and
 * its comment is the reasoning — *a field says one thing at a time, and what it
 * says while wrong is what to do about it*
 * (`themes/docket/src/components/ui/field.tsx:84-140`). A field that renders
 * the hint under the error has buried the error in the middle of a paragraph,
 * and no recipe can unbury it.
 *
 * `note` carries the read-only sentence. Canon §4.2 lists `readOnlyNote` as an
 * option and CONTRACT § Shared state names makes the reason binding: read-only
 * is *the native attribute plus text saying so*, never a lock glyph alone —
 * which is `themes/docket/src/components/ui/field.tsx:214-225`'s one defect in
 * an otherwise exemplary form family. A separate slot, not the message line,
 * because a read-only field can also be describing itself.
 *
 * TWO AXES.
 *
 * `kind` is the message's semantic role, and it is an axis rather than three
 * slots because the three are mutually exclusive by construction: one element,
 * one class string, chosen by what `fieldIds()` returned. A theme paints
 * critical, positive and muted here and that is the whole of the difference.
 *
 * `size` is the shell's scale and lives here rather than on the control,
 * because that is where the collision actually was: appetite spells it
 * `fieldSize` to dodge the native `size` attribute on `<input>`
 * (library.md §3.2), and moving the axis up to the shell dissolves the clash
 * instead of renaming around it. A theme with one field height writes three
 * empty strings — legal, and `cx()` drops them — or narrows the axis on its own
 * wrapper (PATTERNS P4).
 *
 * *Rejected*: a `state` axis (`rest | invalid | valid | read-only | disabled`).
 * Docket's `state()` swap is exactly that shape and it is right for a theme,
 * but as a required axis it obliges fourteen themes to write five class strings
 * for a control the library does not render — the control is the caller's
 * child, and its ground is styled by the theme's own `input.tsx`. The root
 * carries `data-state` instead, so a theme that wants the swap writes one
 * `data-[state=invalid]:` variant in the recipe.
 */

import { axes, type AxisValue, type Recipe } from "./recipe";

export const fieldAxes = axes({
  slots: ["root", "label", "optional", "note", "control", "message"],
  /** Which verdict the one message line is carrying. */
  kind: ["error", "success", "description"],
  /** The shell's scale — never the native `size` attribute. */
  size: ["sm", "md", "lg"],
});

export type FieldRecipe = Recipe<typeof fieldAxes>;

/** `sm | md | lg`. */
export type FieldSize = AxisValue<typeof fieldAxes, "size">;
/** `error | success | description` — the kind `core/field-ids` decided. */
export type FieldMessageKind = AxisValue<typeof fieldAxes, "kind">;
