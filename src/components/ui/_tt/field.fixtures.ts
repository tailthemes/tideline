/* @tt-ui ui/parts/field/fixtures.schema.ts library=1.5.1 sha256=74a51b18ca5a621b342b3e8d00b325c54458e039f9e99c9f61f469bcedca1834
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * The SHAPE of a theme's `field` specimens — never the strings.
 *
 * Every label, every error sentence and every read-only note is the theme's
 * (CONTRACT § What is forbidden to share: *copy of every kind*). What is shared
 * is that the invalid pane owes an `error`, the valid pane owes a `success`,
 * and each control type is shown separately — the schema is where "shown
 * separately" becomes a type error rather than a review note.
 */

import type { FieldCaptureState } from "./field.capture";

/** The native control a pane is demonstrating. `field` renders none of them. */
export type FieldControlKind = "input" | "textarea" | "select";

export interface FieldSpecimenFixture {
  id: string;
  label: string;
  control: FieldControlKind;
  description?: string;
  error?: string;
  success?: string;
  optional?: boolean;
  readOnlyNote?: string;
}

/**
 * One fixture per state per control kind. A theme that shows three states of an
 * `input` and none of its `select` cannot satisfy this type, which is the
 * defect the canon names, expressed where it can be caught.
 */
export type FieldFixtures = {
  [State in FieldCaptureState]: readonly FieldSpecimenFixture[];
};
