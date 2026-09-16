"use client";

import { useEffect, useRef, useState } from "react";
import marshPlate from "../assets/tl-land-marsh.jpg";
import nightPlate from "../assets/tl-land-night.jpg";
import sandPlate from "../assets/tl-land-sand.jpg";
import tidePlate from "../assets/tl-land-tide.jpg";
import { HOUSE } from "../fixtures/marram";
import { MONO, TEXT, TNUM } from "./ui/type";

/**
 * The land, as one frame that changes.
 *
 * ── WHY THIS SECTION EXISTS ──────────────────────────────────────────────
 * It answers the question the rest of the site cannot. A visitor deciding
 * whether to join is deciding whether they want to be *there*, and there is no
 * room to show them — nine of eleven are building sites. The land is the only
 * finished thing, so it gets the biggest, quietest run of the page.
 *
 * ── THE MECHANISM ────────────────────────────────────────────────────────
 * One pinned frame, four invisible trackers behind it. An IntersectionObserver
 * on the trackers sets the active index as they pass; the frame cross-fades the
 * plate and lifts the caption. The dots at the right edge are real `<button>`s that
 * scroll their tracker into view, so the same state is reachable by pointer,
 * by keyboard, and by scrolling — three routes to one piece of state rather
 * than a scroll effect with decorative dots beside it.
 *
 * **Nothing autoplays.** No timer, no interval, nothing that advances while the
 * reader is still. That is what keeps this outside WCAG 2.2.2 — a carousel owes
 * a pause control because it moves on its own; this moves only as far as
 * somebody moves it.
 *
 * **The page's scroll speed is untouched.** The trackers are ordinary boxes and
 * the wheel does what it always does; `End` still reaches the footer. That is
 * the line between this and the scroll-jacking motion-pass bans — AGENTS.md
 * carries the owner amendment that lifted the parallax rule for this theme.
 *
 * ── WHAT A CAPTURE SEES ──────────────────────────────────────────────────
 * A stitched full-page screenshot does not scroll, so the frame paints once
 * with slide one and the trackers behind it are empty. That is why the trackers
 * are `70svh` rather than a full screen each: it is the shortest travel that
 * still gives each slide a comfortable read, and it keeps the section from
 * photographing as four screens of nothing. Accepted with open eyes rather than
 * discovered later.
 *
 * ── WITHOUT JAVASCRIPT ───────────────────────────────────────────────────
 * The first slide is rendered active by the server, so the section is a
 * full-bleed photograph with a caption on it and four inert dots. Every other
 * slide's text is in the DOM behind `hidden`, so no content is lost to a
 * crawler; only the ability to change frames is.
 */

const SLIDES = [
  {
    id: "tide",
    plate: tidePlate,
    alt: "The incoming tide running fast up a wide sand channel at dusk, a sheet of water advancing over ribbed sand.",
    kicker: "The tide",
    line: "It comes in across four miles of sand faster than you walk.",
    figure: HOUSE.tideRange,
    figureLabel: "spring range",
  },
  {
    id: "low-water",
    plate: sandPlate,
    alt: "Ribbed wet sand at low water filling the frame, ridges holding thin lines of water, one line of bird tracks crossing.",
    kicker: "Low water",
    line: "Six hours later it is a plain, and you can walk to the channel.",
    figure: HOUSE.walkToWater,
    figureLabel: "of sand to the channel",
  },
  {
    id: "saltings",
    plate: marshPlate,
    alt: "Salt marsh channels seen from above at first light, the creeks branching through dark vegetation.",
    kicker: "The saltings",
    line: "Behind the dune the marsh drains in creeks that move every winter.",
    figure: "9m",
    figureLabel: "the channel moved since 2019",
  },
  {
    id: "after-dark",
    plate: nightPlate,
    alt: "The house alone on a dark headland at night, three windows lit warm, the estuary black and still in front of it.",
    kicker: "After dark",
    line: "There is no other light on this side of the water.",
    figure: HOUSE.opensShort,
    figureLabel: "when the lights are ours",
  },
] as const;

export function LandGallery({ headingId = "land" }: { headingId?: string }) {
  const [active, setActive] = useState(0);
  const trackers = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const nodes = trackers.current.filter((n): n is HTMLDivElement => n !== null);
    if (nodes.length === 0 || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      /* A band across the middle of the viewport. Keyed to the centre rather
         than an edge so the frame changes when the reader is looking at the
         middle of the screen, which is where the frame is. */
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, []);

  function show(index: number) {
    const node = trackers.current[index];
    if (!node) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    // Set it immediately as well: a smooth scroll takes a moment to reach the
    // observer's band, and a dot that lights up only after the travel finishes
    // reads as a dot that did not work.
    setActive(index);
  }

  return (
    <section
      aria-labelledby={headingId}
      aria-roledescription="gallery"
      className="relative isolate"
    >
      <h2 id={headingId} className="sr-only">
        The land, and what it does
      </h2>

      <div className="sticky top-0 h-[92svh] min-h-[32rem] overflow-hidden">
        {SLIDES.map((slide, index) => (
          /* Every plate is in the DOM and only opacity moves, so there is no
             load pause on the way to slide four and nothing pops in. */
          <img
            key={slide.id}
            src={slide.plate.src}
            alt={index === active ? slide.alt : ""}
            aria-hidden={index === active ? undefined : "true"}
            data-active={index === active ? "true" : undefined}
            className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-0 will-change-[opacity,transform] data-[active]:scale-100 data-[active]:opacity-100 motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out"
          />
        ))}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(0deg,var(--scrim)_0%,var(--scrim)_30%,transparent_72%)] opacity-[0.93]"
        />

        {/* The dots sit at the vertical centre of the right edge rather than on
            the caption's baseline: they belong to the frame, not to the words
            in it, and a reader asking "how many more" looks at the edge. */}
        <ol className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3.5 sm:right-8">
          {SLIDES.map((slide, index) => (
            <li key={slide.id}>
              <button
                type="button"
                onClick={() => show(index)}
                aria-current={index === active ? "true" : undefined}
                aria-label={`${slide.kicker} — slide ${index + 1} of ${SLIDES.length}`}
                className="group flex size-7 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full border border-(--plate-ink)/70 bg-(--plate-ink)/15 transition-[background-color,border-color,transform] duration-(--duration-state) group-hover:border-(--plate-ink) group-hover:bg-(--plate-ink)/40 group-aria-[current]:scale-125 group-aria-[current]:border-(--plate-ink-brass) group-aria-[current]:bg-(--plate-ink-brass)"
                />
              </button>
            </li>
          ))}
        </ol>

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[84rem] px-6 pb-20 pr-20 sm:px-10 sm:pb-24 sm:pr-24">
            <div className="min-w-0">
              {SLIDES.map((slide, index) => (
                <figure
                  key={slide.id}
                  hidden={index !== active}
                  data-active={index === active ? "true" : undefined}
                  className="translate-y-3 opacity-0 data-[active]:translate-y-0 data-[active]:opacity-100 motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out"
                >
                  <figcaption>
                    <p className={`${MONO} ${TEXT.label} text-(--plate-ink-brass)`}>
                      {slide.kicker}
                    </p>
                    <p className="mt-4 max-w-[22ch] text-balance font-(family-name:--font-display) font-(number:--weight-display) text-(length:--text-d3) leading-(--leading-d3) tracking-(--tracking-d3) text-(--plate-ink)">
                      {slide.line}
                    </p>
                    <p
                      className={`mt-6 ${MONO} ${TEXT.caption} ${TNUM} text-(--plate-ink-muted)`}
                    >
                      <span className="text-(--plate-ink-brass)">{slide.figure}</span>{" "}
                      {slide.figureLabel}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* The trackers. 70svh is the shortest travel that still gives a slide a
          comfortable read — see the header on what a capture sees. */}
      <div className="-mt-[92svh]">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            data-index={index}
            ref={(node) => {
              trackers.current[index] = node;
            }}
            aria-hidden="true"
            className="h-[70svh] first:h-[92svh]"
          />
        ))}
      </div>
    </section>
  );
}
