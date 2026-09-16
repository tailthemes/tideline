/* @tt-ui ui/core/react/field-ids.ts library=1.5.1 sha256=35fec81ab029d7128c886046a9dc5c526549a3f008253b5679a25c3cd6d78206
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * One control, one verdict, and the ids that carry it.
 *
 * A field can hold four things a reader might need — a description, an error, a
 * success receipt, and whatever the caller has attached itself (a character
 * count, a menu item's disabled reason) — and the catalog gets the arithmetic
 * wrong in both directions. `themes/atrium/src/components/ui/control.tsx:130-142`
 * has a `TextArea` that never sets `aria-invalid` while its two siblings do;
 * nine themes show an invalid `Input` and no invalid `Select`. Both are the
 * same defect: the wiring was retyped per control instead of derived once.
 *
 * THREE RULES, AND THEY ARE THE WHOLE MODULE.
 *
 * 1. **Precedence is error → success → description**, single-slot. Docket's
 *    field family is the reference (`themes/docket/src/components/ui/field.tsx:84-140`)
 *    and its comment is the reasoning: *a field says one thing at a time, and
 *    what it says while wrong is what to do about it*. A field that shows the
 *    hint under the error has buried the error in the middle of a paragraph.
 *
 * 2. **`aria-describedby` is composed in that same order**, so the error is
 *    read first when a caller genuinely has more than one target. Ordering is
 *    not cosmetic: assistive technology reads described-by ids in the order the
 *    attribute lists them, not in document order, so the list *is* the reading
 *    order.
 *
 * 3. **`aria-invalid` appears only when the field is invalid.** Never
 *    `aria-invalid="false"` on every control on the page — that is the
 *    `aria-sort="none"` mistake (`table-sort.ts`) in a different attribute, and
 *    it costs the same: an attribute present everywhere carries no information
 *    anywhere.
 *
 * The tri-state is kept from kiln (`themes/kiln/src/components/ui/field.tsx:98-103`),
 * where `undefined` deliberately hands the decision to CSS `:user-invalid` so
 * an untouched required field is not announced as wrong before it has been
 * filled in: pass nothing and the error's presence decides; pass `false`
 * explicitly and the attribute stays off even while a message is showing.
 *
 * Pure — no React, no `useId`. The id is the caller's (`id` is required on
 * `field`, canon §4.2), because a `useId`-minted id cannot be pointed at by a
 * `form-error-summary`'s `href="#<field-id>"` in the markup a server rendered.
 * Every derived id is `${id}-…`, which is the convention `check.ts` can read
 * and the HTML edition's `_tt/field.js` reproduces without a runtime.
 */

export interface FieldIdsInput {
  /** The control's own id. Required, and the root of every other id here. */
  id: string;
  /** What went wrong and what to do about it. Takes precedence over both others. */
  error?: string;
  /** A durable receipt for a value that has been checked. */
  success?: string;
  /** One clause about what the field wants. */
  description?: string;
  /**
   * Explicit override. Omit and the presence of `error` decides; pass `false`
   * to keep the attribute off and leave the verdict to `:user-invalid`.
   */
  invalid?: boolean;
  /**
   * Ids the caller owns and wants appended after the field's own — a live
   * character count, a shared format note. Undefined entries are dropped, so a
   * conditional target needs no ternary at the call site.
   */
  describedBy?: readonly (string | false | null | undefined)[];
}

export interface FieldIds {
  /** For a `<label id>` where the control is not labelled by `for`/`id`. */
  labelId: string;
  /** The single message line's id, whichever of the three is showing. */
  messageId: string;
  /**
   * Which message to render, or `null` for none. The *kind* is here so the
   * theme can pick the glyph and the ink; the *words* are the theme's and never
   * pass through this module.
   */
  message: { kind: "error" | "success" | "description"; text: string } | null;
  /** Spread onto the native control. */
  control: {
    id: string;
    "aria-invalid": true | undefined;
    "aria-describedby": string | undefined;
  };
}

export function fieldIds(input: FieldIdsInput): FieldIds {
  const { id, error, success, description } = input;
  const messageId = `${id}-message`;

  const message =
    error !== undefined
      ? ({ kind: "error", text: error } as const)
      : success !== undefined
        ? ({ kind: "success", text: success } as const)
        : description !== undefined
          ? ({ kind: "description", text: description } as const)
          : null;

  const invalid = input.invalid ?? error !== undefined;

  const described = [message ? messageId : undefined, ...(input.describedBy ?? [])].filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );

  return {
    labelId: `${id}-label`,
    messageId,
    message,
    control: {
      id,
      "aria-invalid": invalid ? true : undefined,
      "aria-describedby": described.length > 0 ? described.join(" ") : undefined,
    },
  };
}
