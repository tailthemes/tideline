/* @tt-ui ui/parts/accordion-disclosure/vanilla/accordion-disclosure.js library=1.5.1 sha256=1bd3330c88e303290f3fb337652ad9f8ff1a008e15e4d48c502ad779572f89ac
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * `accordion-disclosure`, the HTML edition — the twin of
 * `ui/parts/accordion-disclosure/react/accordion-disclosure.tsx`.
 *
 * Read that file's header first: the two renderings, why Escape is local rather
 * than a stack entry, and why `onToggle` is the one place the vocabulary allows
 * that word. Every decision below is that file's. What this one adds is the
 * reason the part matters *more* on this side than on the React one.
 *
 * ── THIS IS THE PART THE HTML EDITIONS ALREADY ARE ───────────────────────
 * All fourteen editions ship `<details>` — twenty-four templates across the
 * catalog — and library.md §2.1 accepts it: *"native `<details>` accepted; the
 * Escape row is then deliberately changed with a reason"*. So the module is not
 * a rendering of the part. It is **the enhancement on top of the element**, and
 * it is exactly the size of the gap the element leaves:
 *
 *   what `<details>` already gives   the summary is a real control, Enter and
 *                                    Space open it, `aria-expanded` is implicit
 *                                    and correct, the panel is in the page a
 *                                    crawler reads, and none of it needs script
 *   what it does not give            **Escape from inside the panel collapses
 *                                    it and returns focus to the summary**
 *
 * That one row is why a bare `<details>` is *preserved-with-a-gap* and never
 * *preserved* (§2.1, `mobile-nav`). `themes/appetite/html/src/js/main.js:191-211`
 * is the only edition in the catalog that implements it, on its
 * `button` + region rendering — and it binds the key on the **region** alone,
 * so Escape pressed while the summary itself holds focus does nothing, which is
 * where a reader who has just tabbed back up to it is standing. Here the
 * listener is on the root, which is both.
 *
 * Appetite's focus return is also a bare `button.focus()`. Every other return
 * in this library is guarded (`layer.js`'s `isConnected`), and a disclosure
 * whose panel contains the control that removes the row it is in is not exotic.
 *
 * ── ESCAPE IS LOCAL, AND STOPS ───────────────────────────────────────────
 * A bubble-phase listener on this root, **not** `registerLayer`. The stack
 * delivers Escape to its top entry from anywhere on the page, which is right
 * for a layer and wrong for this: an FAQ with six open answers would collapse
 * the last-opened one when a reader pressed Escape somewhere else entirely.
 * Locality is the behaviour, and `stopPropagation` is what keeps a nested
 * disclosure from also collapsing the one around it.
 *
 * The cost is the React file's, unchanged and still true here: a disclosure
 * open *inside* an open dialog does not take Escape from it, because
 * `layer.js`'s document listener is on the capture phase and runs first. The
 * dialog closes and takes the disclosure with it, so nothing is stranded — but
 * the innermost thing is not the thing that closed.
 *
 * ── WHAT THE THEME PASSES ────────────────────────────────────────────────
 * Nothing it must. `onToggle` when something outside the panel follows the
 * state (a mobile nav that locks nothing but wants to know), and that is all —
 * there is no duration here, no class and no word. The marker's two glyphs are
 * two nodes the template drew and the theme's CSS shows one of them off
 * `data-state`, the way this edition already swaps the mode toggle's pair.
 */

/**
 * @param {Element} root  `[data-part="accordion-disclosure"]` — a `<details>`,
 *        or the wrapper of a `button` + `region` pair.
 * @param {object} [options]
 * @param {(open: boolean) => void} [options.onToggle]  the state it moved to.
 * @returns {{ setOpen: (open: boolean) => void, isOpen: () => boolean, destroy: () => void }}
 */
export function mountAccordionDisclosure(root, options = {}) {
  if (!root) throw new Error("mountAccordionDisclosure: a root element is required");
  const { onToggle } = options;

  const trigger = root.querySelector('[data-part="accordion-disclosure-trigger"]');
  const region = root.querySelector('[data-part="accordion-disclosure-region"]');
  if (!trigger) throw new Error("mountAccordionDisclosure: no [data-part=…-trigger] inside the root");

  /* The element decides the rendering, not an option. `element="details"` is a
     prop on the React side because JSX has to choose which tree to emit; here
     the tree is already in the document and asking the theme to describe it a
     second time is a second thing that can disagree with the first. */
  const native = root.tagName === "DETAILS";

  const read = () =>
    native ? root.open : trigger.getAttribute("aria-expanded") === "true";

  function state(open) {
    root.setAttribute("data-state", open ? "open" : "closed");
  }

  /* The one place the two renderings differ, and it is one line each way: the
     browser owns `[open]` and tells us afterwards, so the native path only ever
     *reports*; the button path owns the whole state and writes all three
     attributes.

     **`write` owns the notification, and on the native path it does not make
     one.** Assigning `root.open` queues the element's own `toggle` event, and
     `onNativeToggle` is what reports that — so a caller that also notified sent
     the theme two callbacks for one collapse. Driven on `fixtures/accordion.html`
     before the fix: one Escape on an open `<details>` produced
     `["faq:true", "faq:false", "faq:false"]`. Callers therefore call `write`
     and nothing else; the asymmetry lives here, once, rather than at each of
     the three call sites. */
  function write(open) {
    if (native) {
      root.open = open;
      state(open);
      return;
    }
    trigger.setAttribute("aria-expanded", String(open));
    if (region) region.hidden = !open;
    state(open);
    onToggle?.(open);
  }

  const onNativeToggle = () => {
    state(root.open);
    onToggle?.(root.open);
  };

  /* Bound on the button path only, where `write` is the notifier. */
  const onClick = () => write(!read());

  const onKeyDown = (event) => {
    if (event.key !== "Escape" || !read()) return;
    /* Stopped, not prevented: the keypress has been answered by this subtree
       and must not also reach an accordion wrapping it. `preventDefault` would
       suppress a browser default this key does not have here. */
    event.stopPropagation();
    write(false);
    /* Guarded, unlike `themes/appetite/html/src/js/main.js:210`: a panel can
       contain the control that removed the row its own summary is in, and
       focusing a detached node drops focus on `<body>` silently. */
    if (trigger.isConnected) trigger.focus({ preventScroll: true });
  };

  if (native) root.addEventListener("toggle", onNativeToggle);
  else trigger.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);
  state(read());

  return {
    /** For a call site outside the panel: a mobile nav closing on a route
     *  change, an accordion that allows one answer at a time. */
    setOpen(open) {
      if (open === read()) return;
      write(open);
    },
    isOpen: read,
    destroy() {
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("toggle", onNativeToggle);
      trigger.removeEventListener("click", onClick);
    },
  };
}
