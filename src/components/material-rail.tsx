import brass from "../assets/tl-detail-brass.jpg";
import hooks from "../assets/tl-detail-key.jpg";
import oak from "../assets/tl-detail-oak.jpg";
import plaster from "../assets/tl-detail-plaster.jpg";
import slate from "../assets/tl-detail-slate.jpg";
import wool from "../assets/tl-detail-wool.jpg";
import { MATERIALS, materialFor, type MaterialKey } from "../fixtures/marram";
import { Container, Eyebrow } from "./ui/primitives";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * The materials at working distance — the board's five samples photographed as
 * the things themselves, plus the empty hooks.
 *
 * The board says *what the house is made of*. This says *what it will feel
 * like*, which is a different claim and the one a visitor is actually shopping
 * for. Together they are the theme's whole argument for a building nobody can
 * visit: here is the specification, and here is the specification at the scale
 * you would touch it.
 *
 * ── THE RAIL, AND WHY IT IS NOT A CAROUSEL ───────────────────────────────
 * It travels sideways as the band crosses the viewport, driven by
 * `animation-timeline: view()`. No autoplay, no timer, no arrows, no dots, and
 * nothing that moves while the reader is still. It moves exactly as far as they
 * scroll and stops when they stop, which makes it a long picture read at the
 * reader's pace rather than a slideshow performing at its own.
 *
 * That also means it needs no pause control: WCAG 2.2.2 governs motion that
 * *starts on its own*, and nothing here does.
 *
 * Without `animation-timeline`, and under reduced motion, the rail is a
 * horizontally scrollable strip — `overflow-x-auto` is on the track in every
 * case, so a keyboard and a trackpad can always reach the far end regardless of
 * whether the animation runs at all. The motion is a bonus on top of a control
 * that works without it, never the only way to see the content.
 */

const PLATES: Record<MaterialKey, { src: string }> = {
  slate,
  oak,
  wool,
  plaster,
  brass,
};

const ALT: Record<MaterialKey, string> = {
  slate:
    "The split face of a single piece of riven Welsh slate, blue-grey, catching a cold light across the cleavage plane.",
  oak: "Oiled oak floorboards close up, the grain running diagonally, one hand-cut nail set into the board.",
  wool: "Undyed oatmeal wool blanket folded once, the coarse loose weave in soft daylight.",
  plaster:
    "A chalky lime-plastered wall surface, trowel marks and small pits raking across the frame under low side light.",
  brass:
    "An unlacquered brass door lever on a bare plastered wall, fingerprints and patina visible.",
};

export function MaterialRail({ headingId = "materials" }: { headingId?: string }) {
  return (
    <section
      aria-labelledby={headingId}
      className="overflow-hidden border-t border-hairline py-20 sm:py-28"
    >
      <Container>
        <Eyebrow>At working distance</Eyebrow>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h2
            id={headingId}
            className={`max-w-[20ch] text-balance ${DISPLAY} ${TEXT.d2} text-foreground`}
          >
            What it will feel like
          </h2>
          <p className={`max-w-[36ch] ${TEXT.body} text-muted-foreground`}>
            The board is the specification. This is the specification at the scale you
            would put a hand on.
          </p>
        </div>
      </Container>

      {/* `overflow-x-auto` regardless: the animation is a bonus on top of a
          control that works without it. */}
      <div className="mt-14 overflow-x-auto">
        <ul className="tideline-rail flex w-max gap-5 px-6 will-change-transform sm:px-10">
          {MATERIALS.map((entry) => {
            const material = materialFor(entry.key);
            return (
              <li key={entry.key} className="w-[19rem] shrink-0 sm:w-[24rem]">
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element -- see ui/primitives */}
                  <img
                    src={PLATES[entry.key].src}
                    alt={ALT[entry.key]}
                    className="aspect-square w-full rounded-(--radius) object-cover"
                  />
                  <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="size-3 rounded-(--radius-inner) border border-border"
                        style={{ background: `var(${material.token})` }}
                      />
                      <span className={`${TEXT.small} text-foreground`}>
                        {material.name}
                      </span>
                    </span>
                    <span
                      className={`${MONO} ${TEXT.caption} ${TNUM} text-muted-foreground`}
                    >
                      {material.code}
                    </span>
                  </figcaption>
                  <p className={`mt-2 ${TEXT.caption} text-muted-foreground`}>
                    {material.note}
                  </p>
                </figure>
              </li>
            );
          })}

          {/* The hooks close the rail. Eleven of them, all empty, which is the
              whole site in one photograph. */}
          <li className="w-[19rem] shrink-0 sm:w-[24rem]">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element -- see ui/primitives */}
              <img
                src={hooks.src}
                alt="A row of small brass hooks screwed into a bare oak board on a plastered wall. Every hook is empty."
                className="aspect-square w-full rounded-(--radius) object-cover"
              />
              <figcaption
                className={`mt-4 ${MONO} ${TEXT.small} text-(--primary-ink)`}
              >
                The hooks, still empty
              </figcaption>
              <p className={`mt-2 ${TEXT.caption} text-muted-foreground`}>
                Screwed to the board in June. The tags are cast and lying in a drawer.
              </p>
            </figure>
          </li>
        </ul>
      </div>
    </section>
  );
}
