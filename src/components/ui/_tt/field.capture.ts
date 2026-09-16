/* @tt-ui ui/parts/field/capture.ts library=1.5.1 sha256=52b2b074f51ebe48cb80bf41d6f8a8423971ab440ce83112dc7bd14a0e8b180e
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * What `/components` must render inside `data-component="ui/field"`, and what
 * the camera photographs.
 *
 * Every state is a static pane, which is the point: nine themes ship an invalid
 * `Input` and no invalid `Select` or `Textarea` (canon §4.2), and a state that
 * is only reachable by typing is a state no capture has ever seen. `field` has
 * no layer, so there is no `live` pane — nothing here opens.
 */

import { capture } from "./capture";

export const fieldCapture = capture({
  id: "ui/field",
  /** `rest` is the frame's default pane; the rest are the states a theme has to
   *  have drawn before it can claim the row. */
  states: ["rest", "invalid", "valid", "read-only", "disabled"],
  specimen: "FieldSpecimen",
});

export type FieldCaptureState = (typeof fieldCapture)["states"][number];
