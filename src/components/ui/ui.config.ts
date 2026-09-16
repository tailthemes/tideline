/* tideline's cross-part UI knobs — theme-owned, read by every recipe beside it.
 *
 * `layerHost` is the only entry here that is a real decision rather than a
 * restatement of `theme.css`, and it is `nearest-host` for the reason the stub
 * describes: this theme is rendered inside `.tt-tideline` in the marketplace
 * preview, and a layer portalled to `document.body` would land outside that
 * scope with none of the theme's tokens resolving. It would not throw. It would
 * paint an unstyled menu on a black page, which is exactly the failure the
 * light-mode capture found in a different form — a wrapper class deciding what
 * a descendant inherits.
 *
 * The motion numbers mirror `theme.css`'s `--duration-*` because a recipe
 * reaching for a duration cannot read a CSS variable. They are duplicated, and
 * that duplication is the only one in the theme: if you change one, change the
 * other. `close` is 150ms against `state`'s 250 — motion-pass's open/close
 * asymmetry, and the one place this theme's "tidal" personality lets an exit be
 * faster than an entrance, because a close that lingers reads as a page that
 * did not hear you.
 */

export const ui = {
  layerHost: "nearest-host" as const,
  scope: ".tt-tideline",
  /** Mirrors --duration-micro / --duration-state in theme.css. */
  motion: { micro: 140, state: 250, close: 150 },
  density: "comfortable" as const,
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
};
