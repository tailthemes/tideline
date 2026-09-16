import { FAQ } from "../fixtures/marram";
import { Accordion } from "./ui/accordion-disclosure";
import { Container, Eyebrow } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, TEXT } from "./ui/type";

/**
 * Six questions, and the first one is "can I book a room?" answered "no".
 *
 * Leading with the refusal is the decision worth defending. The conventional
 * order puts the flattering questions first and buries the disappointing
 * answer at position five, which means the one thing a visitor most wants to
 * know is the thing they have to hunt for. A pre-launch site that is coy about
 * being pre-launch has nothing else to be honest about.
 *
 * The first row ships open, so the answer is visible without a click and the
 * disclosure pattern is demonstrated in its open state on first paint.
 */
export function Faq({ headingId = "faq" }: { headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className="border-t border-hairline py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2
            id={headingId}
            className={`mt-5 max-w-[14ch] text-balance ${DISPLAY} ${TEXT.d2} text-foreground`}
          >
            The six we actually get
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="border-t border-hairline">
            {FAQ.map((item, index) => (
              <Accordion key={item.q} summary={item.q} defaultOpen={index === 0}>
                {item.a}
              </Accordion>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
