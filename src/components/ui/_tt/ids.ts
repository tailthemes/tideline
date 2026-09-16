/* @tt-ui ui/core/react/ids.ts library=1.5.1 sha256=4d23061b17a5e70b175a6ef4a0f60842aa19919f196339de474185773ee73663
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
"use client";

/**
 * Ids for a trigger/surface pair, minted by the hook rather than the markup.
 *
 * `aria-controls` needs the surface's id **while the surface is closed** — the
 * attribute lives on the trigger — so an id generated inside the surface's own
 * render is generated too late and every engine that tried it ended up with a
 * hand-written constant instead (`themes/meridian/src/components/ui/search-dialog.tsx:95`
 * is `const LISTBOX_ID = "search-results"`, which is correct until the page
 * mounts two search dialogs). Atrium's `useLayerIds` and appetite's
 * `useOverlayIds` are the same idea under two names; this is one of them.
 *
 * WHY THE SANITISER. `useId()` returns `«r0»` in React 19 and `:r0:` before it.
 * Both are legal in an `id` attribute and neither is a legal CSS identifier, so
 * `document.querySelector("#" + id)` throws — which is how a conformance probe
 * or a `form-error-summary`'s `href="#…"` finds out. Appetite strips the colons
 * (`ui/overlay.tsx:47`); this strips everything that is not a word character,
 * which covers both delimiters and anything React picks next.
 *
 * The prefix is the caller's and is not decorative: two ids in one document
 * reading `«r3»-surface` and `«r7»-surface` are indistinguishable in a DOM dump,
 * and every gate failure in this area is read from a DOM dump.
 */

import { useId } from "react";

export interface Ids {
  /** The sanitised base. Useful where a part mints its own suffixes in a loop. */
  base: string;
  /** `id("surface")` → `"<base>-surface"`, and `base` already carries the prefix. */
  id: (part: string) => string;
}

export function useIds(prefix: string): Ids {
  const base = `${prefix}-${useId().replace(/\W/g, "")}`;
  return { base, id: (part: string) => `${base}-${part}` };
}

/** The three ids a layer's trigger and surface need between them. */
export interface LayerIds {
  /** `aria-controls` on the trigger; `id` on the surface. */
  surfaceId: string;
  /** `aria-labelledby` target. */
  titleId: string;
  /** `aria-describedby` target, where the part has a description. */
  descriptionId: string;
}

/**
 * B6.1 needs the surface's id **while the surface does not exist** — the
 * attribute lives on the trigger — so the ids have to be minted on the trigger's
 * side of the part, above the `present` gate.
 *
 * Four parts had taken a `surfaceId?: string` prop instead, which pushed the
 * problem out to fourteen call sites and made "the surface's id" something a
 * theme could get wrong. Same three ids, one place, no prop.
 */
export function useLayerIds(prefix: string): LayerIds {
  const ids = useIds(prefix);
  return {
    surfaceId: ids.id("surface"),
    titleId: ids.id("title"),
    descriptionId: ids.id("description"),
  };
}
