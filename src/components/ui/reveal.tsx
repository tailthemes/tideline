"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The one-shot entrance.
 *
 * The declared deviation (AGENTS.md §Motion): the vocabulary says entrances
 * fire "on first paint only". This theme fires each one **once, on first
 * view**. On a site whose entire argument is photography two and three folds
 * down, an entrance that already played before the reader arrived has
 * communicated nothing.
 *
 * What the floor bans is scroll *scrubbing* — parallax, scroll-jacking,
 * re-triggering — and none of that happens here. The observer fires one time
 * per element and calls `unobserve` in the same statement, so scrolling back up
 * replays nothing and there is no scroll listener at all.
 *
 * Two failure modes are designed out rather than patched:
 *
 * 1. **No JavaScript, no blank page.** The element's resting style is the
 *    FINISHED state. `tideline-armed` — the class that hides it — is added by
 *    this effect, so it only ever exists in a document that is definitely going
 *    to animate. A crawler, a reader with JS off, or a hydration failure all
 *    get the complete page.
 * 2. **Reduced motion is honoured twice.** `theme.css` neutralises both the
 *    armed and the animating class under the media query, and this effect skips
 *    arming entirely when the preference is set — belt and braces, because the
 *    cost of getting it wrong is invisible content.
 * 3. **Nothing that cannot scroll is ever armed.** A full-page screenshot does
 *    not scroll: Playwright stitches the page at a fixed viewport, so an
 *    observer keyed to that viewport never fires for anything below the fold
 *    and the shot photographs an armed — invisible — page. This is not
 *    hypothetical. The marketplace's product screenshots are full-page
 *    captures, and the first run came back with `/emails` showing three of five
 *    cards and two blank bands where the rest of the page should have been.
 *
 *    The pipeline settles for 250ms, so no timeout rescues it. What separates a
 *    capture from a reader is that a capture never scrolls, so the check is
 *    `navigator.webdriver`: an automated client gets the finished page, a
 *    person gets the entrance. The content is identical either way — only the
 *    animation differs — which makes this the same branch as the
 *    reduced-motion one rather than anything like cloaking. Print lands in the
 *    same place, via a `@media print` rule in `theme.css`.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Stagger, in ms. Cap 240ms total across a group (motion-pass). */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // `navigator.webdriver` — see the header. A capture never scrolls, so an
    // observer keyed to the viewport never fires and the shot would photograph
    // an invisible page.
    const automated =
      typeof navigator !== "undefined" && navigator.webdriver === true;
    if (reduced.matches || automated || typeof IntersectionObserver === "undefined") {
      return;
    }

    el.classList.add("tideline-armed");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // Unobserve before animating: this is what makes it one-shot, and
          // what keeps it out of the "re-triggering on scroll" ban.
          io.unobserve(entry.target);
          const node = entry.target as HTMLElement;
          node.style.animationDelay = `${delay}ms`;
          node.classList.remove("tideline-armed");
          node.classList.add("tideline-rise");
        }
      },
      // Fire a little before the element's top edge arrives, so the motion
      // finishes about when the reader's eye does.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref as never} data-tl-reveal="" className={className}>
      {children}
    </Tag>
  );
}
