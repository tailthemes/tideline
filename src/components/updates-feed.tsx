import { ArrowRight } from "lucide-react";
import marramPlate from "../assets/tl-marram.jpg";
import materialsPlate from "../assets/tl-materials.jpg";
import roomPlate from "../assets/tl-room.jpg";
import slatePlate from "../assets/tl-slate.jpg";
import tablePlate from "../assets/tl-table.jpg";
import heroPlate from "../assets/tl-hero.jpg";
import { UPDATES, formatDate } from "../fixtures/marram";
import { Container, Eyebrow, Plate } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * The build log — a changelog for a building.
 *
 * This section does the job a testimonial block does on a normal marketing
 * site, and it is why the testimonial row is declared out (AGENTS.md): the
 * thing a visitor is actually trying to decide is "are these people real and
 * is this happening", and dated entries about lime taking three coats answer
 * that where an invented five-star quote does not.
 *
 * Entries alternate their plate side. Not for variety's sake — the alternation
 * is what stops four stacked rows reading as a table of contents, and it puts
 * the photograph nearest the edge the eye is travelling toward.
 */

const PLATES: Record<string, { src: string }> = {
  estuary: heroPlate,
  materials: materialsPlate,
  room: roomPlate,
  marram: marramPlate,
  slate: slatePlate,
  table: tablePlate,
};

const ALT: Record<string, string> = {
  estuary: "The Dyfi estuary at dusk from the dune above the house.",
  materials: "Five material samples laid out on dark slate, photographed from above.",
  room: "An unfinished room at Marram: bare lime plaster, a deep window, a step-ladder.",
  marram: "Dry marram grass on the dune, bending in the wind.",
  slate: "Eleven tonnes of riven Welsh slate stacked on bearers in the yard, against the boundary wall.",
  table: "The long oak table under the estuary window in a bare lime-plastered room.",
};

export function UpdatesFeed({
  headingId = "updates",
  limit,
  level = 2,
}: {
  headingId?: string;
  limit?: number;
  /** 1 when this section opens a route — every page has exactly one h1. */
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  const shown = limit ? UPDATES.slice(0, limit) : UPDATES;

  return (
    <section aria-labelledby={headingId} className="border-t border-hairline py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow>The build log</Eyebrow>
          <Heading
            id={headingId}
            className={`mt-5 max-w-[20ch] text-balance ${DISPLAY} ${level === 1 ? TEXT.d3 : TEXT.d2} text-foreground`}
          >
            What has actually happened
          </Heading>
          <p className={`mt-5 max-w-[46ch] text-pretty ${TEXT.body} text-muted-foreground`}>
            Four entries in twelve months, which is the real rate. We would rather write
            nothing than write something.
          </p>
        </Reveal>

        <ol className="mt-14 flex flex-col gap-14 sm:gap-20">
          {shown.map((update, index) => {
            const plate = update.plate ? PLATES[update.plate] : undefined;
            const flip = index % 2 === 1;
            return (
              <Reveal as="li" key={update.date}>
                <article
                  className={`grid items-center gap-8 ${
                    plate ? "lg:grid-cols-2 lg:gap-14" : ""
                  }`}
                >
                  {plate ? (
                    <Plate
                      src={plate.src}
                      alt={ALT[update.plate as string] ?? ""}
                      className={`aspect-[3/2] ${flip ? "lg:order-2" : ""}`}
                    />
                  ) : null}
                  <div className={flip ? "lg:order-1" : ""}>
                    <p className={`${MONO} ${TEXT.label} ${TNUM} text-(--primary-ink)`}>
                      {formatDate(update.date)}
                    </p>
                    <h3 className={`mt-3.5 ${DISPLAY} ${TEXT.d1} text-foreground`}>
                      {update.title}
                    </h3>
                    <p
                      className={`mt-4 max-w-[46ch] text-pretty ${TEXT.body} text-muted-foreground`}
                    >
                      {update.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ol>

        {limit && limit < UPDATES.length ? (
          <p className="mt-12">
            {/* motion-pass's learn-more recipe: the arrow moves 2px toward the
                page it points at, on hover only. */}
            <a
              href="/the-build"
              className={`group inline-flex items-center gap-2 ${MONO} ${TEXT.label} text-(--primary-ink) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
            >
              The whole log
              <ArrowRight
                aria-hidden
                className="size-3.5 shrink-0 motion-safe:transition-transform motion-safe:duration-(--duration-micro) motion-safe:group-hover:translate-x-0.5"
              />
            </a>
          </p>
        ) : null}
      </Container>
    </section>
  );
}
