import { SEQUENCE } from "../emails/sequence";
import { Container, Eyebrow } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * The privacy note, on the page rather than behind a link.
 *
 * A waitlist's whole transaction is an email address, so the sentence
 * explaining what happens to it belongs beside the field, not in a policy
 * nobody opens. Five bullets, each one a thing that does or does not happen,
 * and the count of emails comes from the sequence — so a sixth email cannot be
 * added without this paragraph updating itself.
 */
export function PrivacyNote({ headingId = "privacy" }: { headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className="border-t border-hairline py-20 sm:py-24">
      <Container size="prose">
        <Reveal>
          <Eyebrow>Your address</Eyebrow>
          <h2 id={headingId} className={`mt-5 ${DISPLAY} ${TEXT.d1} text-foreground`}>
            What happens to it, in full
          </h2>
          <ul className={`mt-6 flex flex-col gap-3.5 ${TEXT.body} text-foreground`}>
            {[
              <>
                It sits in one list and receives the{" "}
                <span className={`${MONO} ${TNUM}`}>{SEQUENCE.length}</span> emails described
                on this site. Nothing else is sent to it.
              </>,
              <>No advertising, ever, from us or from anybody we might sell to.</>,
              <>
                It is not shared, not sold, and not loaded into an analytics profile. There
                is no pixel in these emails.
              </>,
              <>
                Unsubscribing deletes the row. Not &ldquo;marks it inactive&rdquo; —{" "}
                deletes it.
              </>,
              <>
                If the house never opens, the list is deleted and we send one email saying
                so.
              </>,
            ].map((line, index) => (
              <li key={index} className="flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-px w-4 shrink-0 bg-(--primary-ink)"
                />
                <span className="text-pretty">{line}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
