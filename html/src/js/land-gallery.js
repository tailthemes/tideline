/**
 * The land gallery — the theme's own module, and the HTML edition's twin of
 * `src/components/land-gallery.tsx`.
 *
 * The library has no part for this and should not: a gallery whose state is
 * driven by scroll position is a theme decision, not a correctness one. What
 * the library owns elsewhere (Escape, focus return, scroll lock) has no
 * bearing here, because nothing opens and nothing traps.
 *
 * Three routes to one piece of state, exactly as in the React edition:
 * scrolling past a tracker, clicking a dot, and reaching a dot by keyboard.
 * **Nothing autoplays** — no timer, no interval — which is what keeps this
 * outside WCAG 2.2.2. A carousel owes a pause control because it moves on its
 * own; this moves only as far as somebody moves it.
 *
 * The served HTML already has slide one active, so with this file absent the
 * section is a full-bleed photograph with a caption and four inert dots rather
 * than an empty frame.
 */
export function mountGalleries(root = document) {
  for (const gallery of root.querySelectorAll("[data-gallery]")) {
    const plates = [...gallery.querySelectorAll("[data-gallery-plate]")];
    const captions = [...gallery.querySelectorAll("[data-gallery-caption]")];
    const dots = [...gallery.querySelectorAll("[data-gallery-dot]")];
    const trackers = [...gallery.querySelectorAll("[data-gallery-tracker]")];
    if (plates.length === 0 || trackers.length !== plates.length) continue;

    let active = 0;

    function paint(next) {
      if (next === active) return;
      active = next;

      plates.forEach((plate, index) => {
        if (index === active) {
          plate.setAttribute("data-active", "true");
          plate.removeAttribute("aria-hidden");
          /* The alternative moves with the picture: the plate a sighted reader
             is looking at is the one whose description should be readable.
             `data-alt` is authored on every plate by the template — only the
             served active slide carries a live `alt`, so reading the attribute
             here captured an empty string for slides two to four, which is
             exactly what driving the compiled page turned up. */
          plate.setAttribute("alt", plate.dataset.alt ?? "");
        } else {
          plate.removeAttribute("data-active");
          plate.setAttribute("aria-hidden", "true");
          plate.setAttribute("alt", "");
        }
      });

      captions.forEach((caption, index) => {
        caption.hidden = index !== active;
        if (index === active) caption.setAttribute("data-active", "true");
        else caption.removeAttribute("data-active");
      });

      dots.forEach((dot, index) => {
        if (index === active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    for (const dot of dots) {
      dot.addEventListener("click", () => {
        const index = Number(dot.dataset.galleryDot);
        const tracker = trackers[index];
        if (!tracker) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        tracker.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "center",
        });
        /* Paint immediately as well: a smooth scroll takes a moment to reach
           the observer's band, and a dot that lights up only when the travel
           finishes reads as a dot that did not work. */
        paint(index);
      });
    }

    if (typeof IntersectionObserver === "undefined") continue;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.dataset.galleryTracker);
          if (!Number.isNaN(index)) paint(index);
        }
      },
      /* A band across the middle of the viewport: the frame changes when the
         reader is looking at the middle of the screen, which is where the frame
         is. */
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const tracker of trackers) io.observe(tracker);
  }
}
