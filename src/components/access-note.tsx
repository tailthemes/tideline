import { Accessibility } from "lucide-react";
import { ROOMS } from "../fixtures/marram";
import { Container, Eyebrow } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, TEXT } from "./ui/type";

/**
 * The access statement, and it is written to be believed rather than to pass.
 *
 * Most hospitality sites say "we welcome all guests" and leave the visitor to
 * discover the stairs. This one names the single step-free room, says the
 * other ten are up at least one flight, and says the lift does not fit. A
 * disabled reader can decide in ten seconds instead of ringing to find out,
 * which is the entire job of the section.
 *
 * The step-free room is found from the fixture, not named in prose, so if
 * Ferryman's note ever changes this paragraph cannot go stale behind it.
 */
export function AccessNote({ headingId = "access" }: { headingId?: string }) {
  const stepFree = ROOMS.filter((room) => room.note.includes("Step-free"));
  const upstairs = ROOMS.length - stepFree.length;

  return (
    <section
      aria-labelledby={headingId}
      className="border-t border-hairline bg-(--surface-sunken) py-16 sm:py-20"
    >
      <Container size="prose">
        <Reveal>
          <Eyebrow>Getting in</Eyebrow>
          <h2
            id={headingId}
            className={`mt-5 flex items-center gap-3 ${DISPLAY} ${TEXT.d1} text-foreground`}
          >
            <Accessibility aria-hidden className="size-6 shrink-0 text-(--primary-ink)" />
            What the building will and will not do
          </h2>
          <div className={`mt-5 flex flex-col gap-4 text-pretty ${TEXT.body} text-foreground`}>
            <p>
              {stepFree.length === 1 ? (
                <>
                  <strong className="font-medium">{stepFree[0].name}</strong> is step-free from
                  the yard door and will have a level shower.
                </>
              ) : (
                <>{stepFree.length} rooms are step-free from the yard door.</>
              )}{" "}
              The other {upstairs} are up at least one flight, and the two on the second floor
              are behind a low door that six foot two clears and six foot four does not.
            </p>
            <p>
              We looked at a lift. It does not fit the stair core of a building this old
              without taking out the core, and taking out the core is not something the
              building survives. That is a limitation of the house, not a decision we are
              pleased with, and it is better said here than discovered on arrival.
            </p>
            <p className="text-muted-foreground">
              If you want to know something specific about a room before the list opens, ask
              and we will measure it.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
