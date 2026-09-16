import bed from "../assets/tl-room-bed.jpg";
import kitchen from "../assets/tl-room-kitchen.jpg";
import stair from "../assets/tl-room-stair.jpg";
import window from "../assets/tl-room-window.jpg";
import { STAGE_LABEL, derive, type Stage } from "../fixtures/marram";
import { Badge, STAGE_ICON, stageTone } from "./ui/badge";
import { Container, Eyebrow } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * Four rooms at four different stages, in the order the building goes through
 * them. It is the build log's argument made in pictures rather than in dates:
 * *this is what "roofed" looks like, and this is what "furnished" looks like,
 * and there are seven of the first and three of the last.*
 *
 * Each plate settles from 1.12 to 1 as it enters — the one scroll-driven effect
 * that runs on ordinary content rather than on a full-bleed band. It is small
 * on purpose. A photograph that breathes reads as a photograph; one that zooms
 * reads as a slideshow, and this page already has enough happening.
 *
 * The counts come from `derive()`, so a room changing stage in the fixture
 * changes the number under its picture here without anybody editing this file.
 */

const STATES: readonly {
  plate: { src: string };
  alt: string;
  stage: Stage;
  title: string;
  body: string;
}[] = [
  {
    plate: stair,
    alt: "A narrow stone staircase in the unfinished house, bare plaster walls, worn oak treads, a small window part way up throwing a hard rectangle of light.",
    stage: "shell",
    title: "The stair, which is the whole problem",
    body: "This is why there is no lift and why the access statement says what it says. The core is the building; taking it out is not something the building survives.",
  },
  {
    plate: window,
    alt: "A deep-set stone window reveal in a bare plastered room looking out over the estuary at low water, the sill worn oak, the room dark around the bright opening.",
    stage: "plastered",
    title: "Plastered, and nothing else yet",
    body: "Three coats of lime and a week between each. The window was there before we were; the sill is the one piece of oak in the house we did not buy.",
  },
  {
    plate: kitchen,
    alt: "A long run of unfinished oak kitchen cabinetry against a plastered wall, no doors hung, a deep stone sink set in, a folded dust sheet on the worktop.",
    stage: "fitted",
    title: "Fitted: the run, no doors",
    body: "Eleven feet, one run, no island — the room is eleven feet wide and an island would be a wall. Commissioned in June from a workshop in Machynlleth.",
  },
  {
    plate: bed,
    alt: "A finished bedroom: one low oak bed with an undyed wool blanket folded across it, bare plaster walls, a deep window onto the estuary, nothing else in the room.",
    stage: "furnished",
    title: "Furnished, which means finished",
    body: "A bed, a blanket, a window and a floor. If it looks like something is missing, nothing is — this is the whole specification.",
  },
];

export function RoomStates({ headingId = "states" }: { headingId?: string }) {
  const rooms = derive();

  return (
    <section aria-labelledby={headingId} className="border-t border-hairline py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow>Four stages</Eyebrow>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <h2
              id={headingId}
              className={`max-w-[20ch] text-balance ${DISPLAY} ${TEXT.d2} text-foreground`}
            >
              What each stage actually looks like
            </h2>
            <p className={`max-w-[34ch] ${TEXT.body} text-muted-foreground`}>
              <span className={TNUM}>{rooms.plastered}</span> of the{" "}
              <span className={TNUM}>{rooms.total}</span> are past the second of these.
              Three are past the last.
            </p>
          </div>
        </Reveal>

        <ol className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {STATES.map((state, index) => (
            <Reveal as="li" key={state.stage} delay={Math.min(index, 3) * 60}>
              <figure>
                <div className="overflow-hidden rounded-(--radius)">
                  {/* eslint-disable-next-line @next/next/no-img-element -- see ui/primitives */}
                  <img
                    src={state.plate.src}
                    alt={state.alt}
                    className="tideline-settle aspect-[3/2] w-full object-cover will-change-transform"
                  />
                </div>
                <figcaption className="mt-5">
                  <Badge tone={stageTone(state.stage)} icon={STAGE_ICON[state.stage]}>
                    {STAGE_LABEL[state.stage]}
                  </Badge>
                  <p
                    className={`mt-3 ${DISPLAY} ${TEXT.d1} text-foreground`}
                  >
                    {state.title}
                  </p>
                  <p
                    className={`mt-3 max-w-[44ch] text-pretty ${TEXT.body} text-muted-foreground`}
                  >
                    {state.body}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
