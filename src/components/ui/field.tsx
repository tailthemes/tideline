import type { ReactNode } from "react";
import { FieldRoot, type FieldRenderProps } from "./_tt/field";
import type { FieldRecipe } from "./_tt/field.axes";
import { FOCUS, MONO, TEXT, TRANSITION } from "./type";

/**
 * The theme's field: the library owns the id wiring, the single message line
 * and the precedence between error, success and description; this file owns
 * every class string, every word and the control's own ground.
 *
 * The one decision worth explaining is the message line's colour. On the
 * near-black ground `--critical` is a desaturated clay rather than a red — a
 * saturated red beside brass on charcoal reads as a browser chrome warning
 * rather than as part of the page. It still clears AA (`--critical` on
 * `--card` is 6.8:1) and it is never the only signal: the control's border
 * steps to the same token and the message line leads with the word.
 */
const base = {
  root: "flex flex-col gap-2",
  label: `${MONO} ${TEXT.label} text-muted-foreground`,
  optional: "opacity-70",
  note: `${TEXT.small} text-muted-foreground`,
  control: "",
  message: `${TEXT.small}`,
  kind: {
    error: "text-(--critical)",
    success: "text-(--positive)",
    description: "text-muted-foreground",
  },
  size: { sm: "", md: "", lg: "" },
} satisfies FieldRecipe;

/**
 * A field whose label is visually hidden hides the **label element**, not its
 * text. Wrapping the words in an `sr-only` span leaves the `<label>` as a
 * zero-height flex item, and the root's `gap-2` then pushes the control down
 * by 8px — which is invisible until the control is beside a button, and then
 * reads as a misalignment nobody can find. `sr-only` is `position: absolute`,
 * so on the label itself it stops being a flex item and the gap goes with it.
 */
function recipeFor(labelHidden: boolean): FieldRecipe {
  return labelHidden ? { ...base, label: `${base.label} sr-only` } : base;
}

/** The native control's ground. Shared by every input in the theme. */
export const CONTROL = `h-(--control-height) w-full rounded-(--radius) border bg-(--field) px-4 ${TEXT.body} text-foreground placeholder:text-muted-foreground/80 border-(--field-border) data-[invalid=true]:border-(--critical) disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS} ${TRANSITION}`;

export function Field({
  id,
  label,
  description,
  error,
  success,
  optional,
  disabled,
  labelHidden = false,
  valid,
  readOnly,
  readOnlyNote,
  className,
  children,
}: {
  id: string;
  label: ReactNode;
  description?: string;
  error?: string;
  success?: string;
  optional?: boolean;
  disabled?: boolean;
  /** Hide the label visually, keeping it for assistive technology. */
  labelHidden?: boolean;
  /** Draws the passing edge. `success` carries the words. */
  valid?: boolean;
  readOnly?: boolean;
  /** Read-only is the native attribute PLUS text saying so — never a lock
   *  glyph alone (CONTRACT §Shared state names). */
  readOnlyNote?: string;
  className?: string;
  children: (field: FieldRenderProps) => ReactNode;
}) {
  return (
    <FieldRoot
      id={id}
      label={label}
      description={description}
      error={error}
      success={success}
      optional={optional}
      disabled={disabled}
      valid={valid}
      readOnly={readOnly}
      readOnlyNote={readOnlyNote}
      className={className}
      recipe={recipeFor(labelHidden)}
      labels={{ optional: "optional" }}
    >
      {children}
    </FieldRoot>
  );
}
