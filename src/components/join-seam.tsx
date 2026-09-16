import { HOUSE, derive } from "../fixtures/marram";
import { JoinForm } from "./join-form";
import { Container, Eyebrow } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * The join seam — the same form the hero carries, at the foot of every
 * interior route.
 *
 * One form component, two placements. The alternative (a second, "simpler"
 * footer form) is how a site ends up with two validation behaviours and one of
 * them untested; this is the same `JoinForm`, in its `onPage` tone, so the
 * error state that was checked once is checked everywhere.
 *
 * It sits on `--surface-sunken` rather than a card, because a boxed CTA at the
 * bottom of a page is the shape every SaaS template uses and this theme's
 * bands are separated by hairlines throughout.
 */
export function JoinSeam({ headingId = "join" }: { headingId?: string }) {
  const { plasteredOf } = derive();

  return (
    <Reveal
      as="section"
      className="border-t border-hairline bg-(--surface-sunken) py-20 sm:py-24"
    >
      <Container className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
        <div>
          <Eyebrow>Opening {HOUSE.opensShort}</Eyebrow>
          <h2
            id={headingId}
            className={`mt-5 max-w-[16ch] text-balance ${DISPLAY} ${TEXT.d2} text-foreground`}
          >
            Nothing to book. A list to be on.
          </h2>
          <p className={`mt-5 max-w-[44ch] text-pretty ${TEXT.body} text-muted-foreground`}>
            Five emails over the next year, and then an invitation forty-eight hours before
            anybody else gets one.
          </p>
        </div>

        <div>
          <JoinForm tone="onPage" />
          <p className={`mt-4 ${MONO} ${TEXT.caption} ${TNUM} text-muted-foreground`}>
            {HOUSE.listCount.toLocaleString("en-GB")} ahead of you · {plasteredOf} rooms
            plastered
          </p>
        </div>
      </Container>
    </Reveal>
  );
}
