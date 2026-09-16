/* @tt-ui ui/parts/field/react/field.tsx library=1.5.1 sha256=53e09e10287d039d9b03fff3c8e8927d6d3155f5541b620bcdc8e15a1bb40c04
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * `field` — one control, one label, one message line.
 *
 * Every `className` in this file comes from `recipe`; there is no fallback
 * string in it and no visual utility outside the structural allow-list.
 *
 * ── No `"use client"`, deliberately ───────────────────────────────────────
 * Nothing here holds state, so the shell renders on the server — and that is
 * load-bearing rather than incidental. Grove split its field family out of its
 * form family for exactly this reason and wrote the scar down:
 * *"`ui/form.tsx` carries `use client` because it owns a hook. Everything in
 * this file is pure, and it has to stay callable from a server component: the
 * `/components` styleguide renders the rest and error specimens on the server,
 * and a client module's plain function cannot be invoked from there. Shipping
 * them in one file broke that page — the capture gate caught it"*
 * (`themes/grove/src/components/ui/field.tsx:5-18`). One boundary, one file.
 *
 * ── Why the control arrives as a render prop ──────────────────────────────
 * The shell derives the ids and the wiring (`core/field-ids`) and the control
 * is the caller's own `<input>`, `<textarea>` or `<select>` — the canon keeps
 * those native (§4.2) and the theme styles them in its own `input.tsx`. So the
 * two have to meet somewhere:
 *
 *   *Rejected*: `cloneElement` on `children`. It works until a caller wraps the
 *   control in anything at all — a currency prefix, a `<span>` for an icon —
 *   and then the props land on the wrapper, silently.
 *   *Rejected*: React context. A provider is a client component, which would
 *   drag the whole shell across the boundary the file header just explained.
 *   *Rejected*: an `inputProps` object the caller spreads by hand. That is
 *   docket's shape (`field.tsx:88-92`, *"wiring is the caller's and
 *   deliberately explicit"*) and it is how nine themes ended up with an invalid
 *   `Input` and no invalid `Select`: explicit wiring is wiring that can be
 *   forgotten once per control type.
 *
 * A render prop is the one form where the wiring cannot be dropped without the
 * call site failing to compile, and it stays a server component.
 *
 * ── The message line is not a live region ─────────────────────────────────
 * `form-error-summary` is `role="alert"` and `core/form` moves focus to it (or
 * to the single failing control), so the field's own sentence is read on
 * arrival. A per-field live region would announce every message of a rejected
 * multi-field submit at once, in DOM order, over the summary that was supposed
 * to be the one thing you heard.
 */

import type { ReactNode } from "react";
import { fieldIds, type FieldIds } from "./field-ids";
import { cx } from "./recipe";
import type { FieldMessageKind, FieldRecipe, FieldSize } from "./field.axes";

/** Every word in a field is the theme's. This is the one the shell writes. */
export interface FieldLabels {
  /** Marks a field optional in text, because required-by-asterisk is a code. */
  optional: string;
}

/** The glyph beside each kind of message. The theme's icons, or none. */
export interface FieldIcons {
  error?: ReactNode;
  success?: ReactNode;
  description?: ReactNode;
}

/** What the render prop hands the control. Spread `control` and it is wired. */
export interface FieldRenderProps {
  /** `id`, `aria-invalid` and `aria-describedby`, composed by `core/field-ids`.
   *  The shape is `core/field-ids`' own — re-declaring it here made two
   *  descriptions of one object, and the second one to change would have been
   *  wrong with no error. */
  control: FieldIds["control"];
  /** For a control that is not natively labelable — a `date-picker` trigger,
   *  a `combobox`'s own button — where `aria-labelledby` is the only route. */
  labelId: string;
  /** The one message line's id, for a caller composing its own described-by. */
  messageId: string;
}

export interface FieldRootProps {
  /** Required, and the root of every derived id. Not `useId`: a
   *  `form-error-summary`'s `href="#<field-id>"` has to name it in markup. */
  id: string;
  label: ReactNode;
  /** One clause about what the field wants. Lowest precedence. */
  description?: string;
  /** What went wrong and what to do about it. Highest precedence. */
  error?: string;
  /** A durable receipt for a value that has been checked. */
  success?: string;
  /** Explicit override for `aria-invalid`; omit and `error` decides. `false`
   *  hands the verdict to CSS `:user-invalid` (kiln's tri-state). */
  invalid?: boolean;
  /** Draws the passing edge. Presentation only — `success` carries the words. */
  valid?: boolean;
  optional?: boolean;
  /** The sentence that says the value is not editable here. Text, never a lock
   *  glyph alone (CONTRACT § Shared state names). */
  readOnlyNote?: string;
  /** Native state, mirrored onto `data-state` for the recipe. The attributes
   *  themselves belong on the control the caller renders. */
  disabled?: boolean;
  readOnly?: boolean;
  size?: FieldSize;
  /**
   * The call site's own measurement of this field in *its* layout — the
   * `sm:col-span-2` on the one field that spans the form's grid. It is a
   * pass-through and not a fallback: the library still decides nothing, and
   * there is no `??` here (`skeleton`'s header argues the same case at length,
   * and `sort-head` already takes one). Without it a theme wraps every wide
   * field in an extra `<div>`, which puts the grid's own child one node away
   * from the grid.
   */
  className?: string;
  /** Ids the caller owns, appended after the field's own message. */
  describedBy?: readonly (string | false | null | undefined)[];
  recipe: FieldRecipe;
  labels: FieldLabels;
  icons?: FieldIcons;
  children: (field: FieldRenderProps) => ReactNode;
}

/** One state name for the recipe to key off, in the order a reader meets them:
 *  a disabled field is not invalid, it is out of play. */
function fieldState(props: FieldRootProps, invalid: boolean): string {
  if (props.disabled) return "disabled";
  if (props.readOnly) return "read-only";
  if (invalid) return "invalid";
  if (props.valid) return "valid";
  return "rest";
}

export function FieldRoot(props: FieldRootProps) {
  const {
    id,
    label,
    description,
    error,
    success,
    invalid,
    optional,
    readOnlyNote,
    size = "md",
    className,
    describedBy,
    recipe,
    labels,
    icons,
    children,
  } = props;

  const ids = fieldIds({ id, error, success, description, invalid, describedBy });
  const kind: FieldMessageKind | undefined = ids.message?.kind;
  const state = fieldState(props, ids.control["aria-invalid"] === true);

  return (
    <div data-part="field" data-state={state} className={cx(recipe.root, recipe.size[size], className)}>
      <label id={ids.labelId} htmlFor={id} data-part="field-label" className={recipe.label}>
        {label}
        {optional ? (
          <span data-part="field-optional" className={recipe.optional}>
            {labels.optional}
          </span>
        ) : null}
      </label>

      {readOnlyNote ? (
        <p data-part="field-note" className={recipe.note}>
          {readOnlyNote}
        </p>
      ) : null}

      <div data-part="field-control" className={recipe.control}>
        {children({ control: ids.control, labelId: ids.labelId, messageId: ids.messageId })}
      </div>

      {ids.message && kind ? (
        <p
          /* Keyed by kind, so error → success is a **new node** rather than the
             same `<p>` with a changed attribute. React reuses an unkeyed
             element in the same position, which is invisible until a theme
             animates the line's arrival — an `@starting-style` entrance, a
             swap keyframe — and then the message that matters most is the one
             that never plays it. A key is the only way to say "this is a
             different sentence" and it cannot be supplied from outside. */
          key={kind}
          id={ids.messageId}
          data-part="field-message"
          data-kind={kind}
          className={cx(recipe.message, recipe.kind[kind])}
        >
          {icons?.[kind] ?? null}
          {ids.message.text}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The part is its own specimen: it has no layer to strip, so `/components`
 * photographs `FieldRoot` itself. The alias exists so every part answers to the
 * same `capture.specimen` name and a frame stub can be written without a
 * per-part special case.
 */
export { FieldRoot as FieldSpecimen };
