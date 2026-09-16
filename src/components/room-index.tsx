import keyCutout from "../assets/tl-key.png";
import { ROOMS, STAGE_LABEL, derive } from "../fixtures/marram";
import { BadgeLink } from "./ui/badge";
import { Container, Eyebrow } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * The brass tag, floating, and the eleven rooms as chips.
 *
 * The cut-out is the theme's one piece of imagery with no rectangle around it:
 * generated on flat chroma green, keyed to transparency, and despilled so the
 * brass has no green in it. Its contact shadow is `--shadow-cutout` in CSS and
 * is **not** baked into the PNG — which is what lets it sit correctly on the
 * near-black ground and on the cream one, and what would break the moment
 * somebody "optimised" the file by flattening it.
 *
 * The chips carry the room number in mono and the stage in words. A wave-1
 * room is marked with a border and a label, never with colour alone — eleven
 * brass-vs-grey chips would be an unreadable key, and four of them are the
 * rooms that are actually spoken for, which is a fact worth stating rather
 * than tinting.
 */
export function RoomIndex({
  headingId = "rooms",
  level = 2,
}: {
  headingId?: string;
  /** 1 when this section opens a route — every page has exactly one h1. */
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  const { spokenFor, total } = derive();
  // The tag on the hook is a real room, not a decorative number: East gable
  // is the one the photographs keep being taken in, so it is the one shown.
  const featured = ROOMS.find((room) => room.name === "East gable") ?? ROOMS[0];

  return (
    <section aria-labelledby={headingId} className="pb-20 sm:pb-28">
      <Container className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          {/* The number is set in HTML over the tag rather than generated into
              it. Generated typography is always subtly wrong, and a number
              baked into the PNG could not be rebranded, could not be a real
              character for a screen reader, and would need eleven files
              instead of one. `tag` is the positioning context; the percentages
              are measured off the plate's own geometry. */}
          <div className="relative mx-auto w-2/3 max-w-xs lg:w-3/4">
            {/* eslint-disable-next-line @next/next/no-img-element -- see ui/primitives */}
            <img
              src={keyCutout.src}
              alt="A brass room tag on a worn leather fob with one iron key, photographed from above."
              className="w-full drop-shadow-(--shadow-cutout)"
            />
            <span
              aria-hidden="true"
              className={`absolute left-[50.5%] top-[55%] -translate-x-1/2 -translate-y-1/2 rotate-[-1.5deg] ${MONO} ${TNUM} text-(length:--text-d2) text-[color-mix(in_oklab,var(--primary-foreground)_78%,transparent)] mix-blend-multiply`}
            >
              {featured.number}
            </span>
          </div>
        </Reveal>

        <Reveal delay={80} className="order-1 lg:order-2">
          <Eyebrow>The rooms</Eyebrow>
          <Heading
            id={headingId}
            className={`mt-5 text-balance ${DISPLAY} ${level === 1 ? TEXT.d3 : TEXT.d2} text-foreground`}
          >
            Eleven tags on eleven hooks
          </Heading>
          <p className={`mt-5 max-w-[40ch] text-pretty ${TEXT.body} text-muted-foreground`}>
            Every room has a name, a gable and a stage it has got to.{" "}
            <span className={TNUM}>{spokenFor}</span> of the {total} are spoken for by the
            people who funded the roof.
          </p>

          {/* The chips were this shape before `ui/badge` existed; they are the
              reason it does. One primitive, one hairline, one marked tone. */}
          <ul className="mt-8 flex flex-wrap gap-2">
            {ROOMS.map((room) => (
              <li key={room.number}>
                <BadgeLink
                  href={`/rooms#room-${room.number}`}
                  tone={room.wave === 1 ? "marked" : "quiet"}
                >
                  <span className={TNUM}>{room.number}</span>
                  <span>{room.name}</span>
                </BadgeLink>
              </li>
            ))}
          </ul>
          <p className={`mt-4 ${MONO} ${TEXT.caption} text-muted-foreground`}>
            Marked rooms are wave one — {STAGE_LABEL.furnished.toLowerCase()} and released
            first.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
