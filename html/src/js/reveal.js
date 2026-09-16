/**
 * The one-shot entrance, the HTML edition's twin of `src/components/ui/reveal.tsx`.
 *
 * Same declared deviation, same argument (AGENTS.md §Motion): the vocabulary
 * says entrances fire on first paint; this theme fires each one once, on first
 * view, because the page's argument lives two and three folds down in
 * photography and an entrance that already played has communicated nothing.
 *
 * What the floor bans is scroll *scrubbing* — parallax, scroll-jacking,
 * re-triggering. None of that happens: there is no scroll listener, the
 * observer unobserves in the same statement, and scrolling back up replays
 * nothing.
 *
 * **The resting style is the finished state.** `tideline-armed` — the class
 * that hides an element — is added here, so it only ever exists in a document
 * that is certainly going to animate. Script blocked, module failed to parse,
 * or reduced motion set: all three render the complete page. That is why this
 * arms rather than the stylesheet hiding things by default, and it is the
 * difference between a reveal and a blank page.
 */
export function mountReveals(root = document) {
  const targets = root.querySelectorAll("[data-tl-reveal]");
  if (targets.length === 0) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  /* A full-page capture never scrolls, so an observer keyed to the viewport
     never fires for anything below the fold and the shot photographs an armed,
     invisible page. The pipeline settles for 250ms, so no timeout rescues it.
     An automated client gets the finished page; a person gets the entrance. The
     content is identical either way — only the animation differs. */
  const automated =
    typeof navigator !== "undefined" && navigator.webdriver === true;
  if (reduced.matches || automated || typeof IntersectionObserver === "undefined") {
    return;
  }

  for (const el of targets) el.classList.add("tideline-armed");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        entry.target.classList.remove("tideline-armed");
        entry.target.classList.add("tideline-rise");
      }
    },
    /* Fire a little before the top edge arrives, so the motion finishes about
       when the reader's eye does. */
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
  );

  for (const el of targets) observer.observe(el);
}
