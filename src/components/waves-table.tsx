import { HOUSE, ROOMS, derive } from "../fixtures/marram";
import { Badge } from "./ui/badge";
import { Container, Eyebrow } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * The pricing table's honest form.
 *
 * A pre-launch site has no prices, so the marketing floor's pricing row is
 * declared out (AGENTS.md) and this stands in its place. It answers the same
 * question a pricing table answers — *what do I get and when* — with the one
 * axis that exists: which wave a room is in, and what being on the list buys
 * you at each one.
 *
 * The third wave is deliberately "not yet". A tier with no date is exactly the
 * thing a pricing table would fabricate a date for, and the second floor is
 * genuinely not finished.
 */
export function WavesTable({
  headingId = "waves",
  level = 1,
}: {
  headingId?: string;
  /** 2 on /components, where the page owns the h1. */
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  const { total } = derive();

  return (
    <section aria-labelledby={headingId} className="pt-32 pb-20 sm:pt-40 sm:pb-28">
      <Container>
        <Reveal>
          <Eyebrow>The list</Eyebrow>
          <Heading
            id={headingId}
            className={`mt-5 max-w-[18ch] text-balance ${DISPLAY} ${TEXT.d3} text-foreground`}
          >
            What joining means, and what it does not
          </Heading>
          <p className={`mt-6 max-w-[52ch] text-pretty ${TEXT.lead} text-muted-foreground`}>
            It is a list. It costs nothing, it holds no room, and it takes no card. What it
            does is decide the order the invitations go out in.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-14">
          <ol className="border-t border-hairline">
            {HOUSE.waves.map((wave) => {
              const rooms = ROOMS.filter((room) => room.wave === wave.wave);
              return (
                <li
                  key={wave.wave}
                  className="grid gap-x-8 gap-y-3 border-b border-hairline py-7 sm:grid-cols-[8rem_1fr_auto]"
                >
                  <p>
                    <Badge tone={wave.wave === 1 ? "marked" : "quiet"}>
                      Wave {wave.wave}
                    </Badge>
                  </p>
                  <div>
                    <p className={`${DISPLAY} ${TEXT.d1} text-foreground`}>{wave.when}</p>
                    <p className={`mt-2 max-w-[48ch] ${TEXT.body} text-muted-foreground`}>
                      {wave.what}
                    </p>
                  </div>
                  <p
                    className={`${MONO} ${TEXT.small} ${TNUM} text-muted-foreground sm:text-right`}
                  >
                    {rooms.length} of {total} rooms
                  </p>
                </li>
              );
            })}
          </ol>
          <p className={`mt-6 ${MONO} ${TEXT.caption} text-muted-foreground`}>
            {HOUSE.firstSeasonInvites} invitations in the first season · no deposit at any
            stage
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
