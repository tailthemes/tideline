import { HOUSE, UPDATES, derive, formatDate } from "../fixtures/marram";
import { Container, Stat } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { MONO, TEXT, TNUM } from "./ui/type";

/**
 * The honest countdown.
 *
 * Every waitlist template on the market puts a `00:00:00` clock here. A clock
 * is a fabricated urgency device — it counts to a date the builder invented,
 * and on a project that will slip by a season it is a promise the site cannot
 * keep. This strip counts the things that have actually happened instead:
 * rooms plastered, the day the slate landed, what is commissioned, how many
 * beds the first season has.
 *
 * All four figures resolve through `derive()` and the fixture, so the strip
 * cannot disagree with `/rooms` or with email 04.
 *
 * Four hairline-separated cells, no cards. `divide-x` rather than borders per
 * cell so the outer edges stay open and the strip reads as a rule across the
 * page rather than as a row of boxes.
 */
export function BuildStrip() {
  const { plastered, total, sleeps } = derive();
  const slate = UPDATES.find((u) => u.title === "The slate landed");

  return (
    <Reveal as="section" className="border-y border-hairline">
      <Container>
        <h2 className="sr-only">Where the build has got to</h2>
        <dl className="grid grid-cols-2 divide-hairline sm:grid-cols-4 sm:divide-x">
          <div className="border-b border-hairline py-7 pr-6 sm:border-b-0">
            <Stat label="Rooms plastered">
              <span className={TNUM}>{plastered}</span>
              <span className="text-muted-foreground"> / {total}</span>
            </Stat>
          </div>
          <div className="border-b border-hairline py-7 sm:border-b-0 sm:px-6">
            <Stat label="Slate landed">
              <span className={TNUM}>{slate ? formatDate(slate.date).slice(0, 6) : "—"}</span>
            </Stat>
          </div>
          <div className="py-7 pr-6 sm:px-6">
            <Stat label="Kitchen">Commissioned</Stat>
          </div>
          <div className="py-7 sm:pl-6">
            <Stat label="First season" sub="invitations">
              <span className={TNUM}>{HOUSE.firstSeasonInvites}</span>
            </Stat>
          </div>
        </dl>
        <p className={`pb-7 ${MONO} ${TEXT.caption} text-muted-foreground`}>
          Sleeps {sleeps} across {total} rooms. No clock on this page — the date moves,
          and a countdown to a date that moves is a promise we would rather not make.
        </p>
      </Container>
    </Reveal>
  );
}
