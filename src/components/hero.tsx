import duneLayer from "../assets/tl-layer-dune.png";
import skyLayer from "../assets/tl-layer-sky.jpg";
import { HOUSE, derive } from "../fixtures/marram";
import { JoinForm } from "./join-form";
import { Container, Eyebrow } from "./ui/primitives";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * Hero archetype **A4** — full-bleed image, type overlaid — built as three
 * parallax planes rather than one flat plate.
 *
 * A4 rather than the type-only slab foundry and docket use, because this theme
 * argues that on a pre-launch site the photograph *is* the product: there is no
 * screenshot, no menu, no booking widget, nothing to put in the right half of a
 * 50/50.
 *
 * ── THE LAYERS, AND WHY THEY ARE SEPARATE FILES ──────────────────────────
 * `tl-layer-sky.jpg` is the estuary generated with **no foreground at all**;
 * `tl-layer-dune.png` is the foreground alone, generated on flat chroma green
 * and keyed. Compositing two real planes at different rates is what produces
 * depth. Scaling one photograph produces a photograph that scales — which is
 * what most "parallax" on marketing sites actually is, and it is why this cost
 * two extra generations rather than a transform.
 *
 * Each plane runs a CSS scroll-driven animation on `scroll(root block)` across
 * the first viewport height: no scroll listener, no main-thread work, and the
 * page's own scroll speed untouched. `theme.css` argues why that is the
 * distinction the parallax ban is about; AGENTS.md carries the owner amendment
 * that lifted it.
 *
 * **The type does not move.** Three travelling planes with travelling text on
 * top is where parallax stops being depth and becomes a fairground ride, and
 * the headline is the one thing here a reader must be able to read while the
 * page is still settling.
 *
 * The oversized moment: the H1 at `--text-d4` (81px at 1280) is the largest
 * object on the site by a factor of three. Nothing else gets d4.
 */
export function Hero({
  level = 1,
}: {
  /** 2 on /components, where the page owns the h1 and this is a specimen. */
  level?: 1 | 2;
} = {}) {
  const Heading = level === 1 ? "h1" : "h2";
  const { plasteredOf } = derive();

  return (
    <section
      className="relative isolate h-[34rem] overflow-hidden sm:h-[42rem] lg:h-[46rem]"
      aria-labelledby="hero-title"
    >
      {/* Plane 1 — the estuary. Travels *down* as the page scrolls, which is
          what makes it read as furthest away. Sized past the frame on both
          edges so the drift never exposes one. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- see ui/primitives */}
      <img
        src={skyLayer.src}
        alt="The Dyfi estuary at dusk seen from the headland above Marram: the tide far out across four miles of ribbed sand, water channels catching the last light, hills low on the horizon."
        className="tideline-layer-back absolute inset-x-0 -top-[10%] h-[124%] w-full object-cover will-change-transform"
      />

      {/* Plane 2 — the scrim, on its own plane so the type keeps its measured
          contrast while the photograph moves underneath it. */}
      <div
        aria-hidden="true"
        className="tideline-layer-mid absolute inset-x-0 -top-[6%] h-[114%] bg-[linear-gradient(100deg,var(--scrim)_0%,var(--scrim)_34%,transparent_86%)] opacity-[0.82] will-change-transform"
      />

      {/* Plane 3 — the dune, keyed off chroma green so it can travel alone. It
          moves *up*, faster than the page: what near things do. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- see ui/primitives */}
      <img
        src={duneLayer.src}
        alt=""
        aria-hidden="true"
        className="tideline-layer-fore pointer-events-none absolute inset-x-0 -bottom-[8%] h-[52%] w-full object-cover object-bottom will-change-transform"
      />

      {/* The plate fades into the page rather than ending on a hard edge — the
          band below is the same token, so the seam disappears. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-40 bg-[linear-gradient(0deg,var(--background)_4%,transparent_100%)]"
      />

      <div className="absolute inset-0 z-20 flex items-end pb-14 sm:pb-20">
        <Container>
          <Eyebrow onPlate className="max-w-md">
            Opening {HOUSE.opensShort} · the list is open
          </Eyebrow>

          <Heading
            id="hero-title"
            className={`mt-6 max-w-[15ch] text-balance ${DISPLAY} ${TEXT.d4} text-(--plate-ink)`}
          >
            Eleven rooms above{" "}
            {/* The one italic in the theme. Spectral's italic is why this
                family was chosen over the obvious luxury serifs. */}
            <em className="italic text-(--plate-ink-brass)">the estuary</em>
          </Heading>

          <p className={`mt-7 max-w-[44ch] text-pretty ${TEXT.lead} text-(--plate-ink-muted)`}>
            A stone house on the Dyfi, with {HOUSE.walkToWater} of tidal sand at the
            door. Nothing is finished and nothing is bookable. This is the list.
          </p>

          <JoinForm className="mt-9 max-w-[30rem]" />

          <p className={`mt-4 ${MONO} ${TEXT.caption} ${TNUM} text-(--plate-ink-muted)`}>
            <span className="text-(--plate-ink-brass)">
              {HOUSE.listCount.toLocaleString("en-GB")}
            </span>{" "}
            ahead of you · {plasteredOf} rooms plastered ·{" "}
            <span className="text-(--plate-ink-brass)">{HOUSE.firstSeasonInvites}</span>{" "}
            invitations in the first season
          </p>
        </Container>
      </div>
    </section>
  );
}
