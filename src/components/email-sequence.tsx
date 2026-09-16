import { ArrowRight, Clock } from "lucide-react";
import marramPlate from "../assets/tl-marram.jpg";
import roomPlate from "../assets/tl-room.jpg";
import { SEQUENCE, type EmailBlock, type PlateKey } from "../emails/sequence";
import { Container, Eyebrow } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * The sequence, rendered for the site.
 *
 * Same source as the sendable documents (`src/emails/sequence.ts`), different
 * renderer — so this page cannot show a version of email 04 that the artifact
 * does not contain. It is the same argument the marketplace makes about
 * rendering its post preview through the real renderer, applied to a smaller
 * problem.
 *
 * The frame is a plain bordered panel, not a phone mockup. A phone bezel would
 * be the fourth photograph on a page that already has three and would say
 * nothing about the email inside it.
 */

/* Keyed by the symbol, valued by the import. The bundler rewrites the import
   to a real URL and the registry projection substitutes a stand-in for the
   binary — neither of which can happen to a filename in a string. */
const PLATES: Record<PlateKey, { src: string }> = {
  room: roomPlate,
  marram: marramPlate,
};

function Block({ block }: { block: EmailBlock }) {
  switch (block.kind) {
    case "text":
      return <p className={`${TEXT.small} text-foreground`}>{block.text}</p>;
    case "figure":
      return (
        <div>
          <p className={`${DISPLAY} ${TEXT.d2} ${TNUM} text-(--primary-ink)`}>
            {block.figure}
          </p>
          <p className={`mt-1.5 ${MONO} ${TEXT.caption} text-muted-foreground`}>
            {block.caption}
          </p>
        </div>
      );
    case "plate": {
      const plate = block.plate ? PLATES[block.plate] : undefined;
      if (!plate) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element -- see ui/primitives
        <img
          src={plate.src}
          alt={block.alt ?? ""}
          className="w-full rounded-(--radius-inner) border border-border"
        />
      );
    }
    case "rule":
      return <hr className="border-0 border-t border-hairline" />;
  }
}

export function EmailSequence({
  headingId = "emails",
  /** `/` shows three; `/emails` shows all five. */
  limit,
  level = 2,
}: {
  headingId?: string;
  limit?: number;
  /** 1 when this section opens a route — every page has exactly one h1. */
  level?: 1 | 2;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  const shown = limit ? SEQUENCE.slice(0, limit) : SEQUENCE;

  return (
    <section aria-labelledby={headingId} className="border-t border-hairline py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow>The sequence</Eyebrow>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <Heading
              id={headingId}
              className={`max-w-[22ch] text-balance ${DISPLAY} ${level === 1 ? TEXT.d3 : TEXT.d2} text-foreground`}
            >
              Five emails, which is the part nobody ships
            </Heading>
            <p className={`max-w-[34ch] ${TEXT.body} text-muted-foreground`}>
              A waitlist lives in the inbox, not on the page. These are real table-based
              documents with a plain-text part, built from the same tokens.
            </p>
          </div>
        </Reveal>

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((email, index) => (
            <Reveal
              as="li"
              key={email.id}
              // Stagger capped: 3 x 70ms = 210ms, inside the 240ms total.
              delay={Math.min(index, 2) * 70}
              className="flex flex-col overflow-hidden rounded-(--radius) border border-border bg-card"
            >
              <div className="flex items-baseline justify-between gap-3 border-b border-border px-5 py-3.5">
                <span className={`${MONO} ${TEXT.label} text-muted-foreground`}>
                  {email.subject}
                </span>
                <span className={`${MONO} ${TEXT.caption} ${TNUM} text-muted-foreground`}>
                  {email.id}/{SEQUENCE.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4 px-5 py-6">
                <p className={`${MONO} ${TEXT.label} text-(--primary-ink)`}>{email.kicker}</p>
                <h3 className={`${DISPLAY} ${TEXT.d1} text-foreground`}>{email.heading}</h3>
                {email.blocks.slice(0, 2).map((block, i) => (
                  <Block key={i} block={block} />
                ))}
                {email.cta ? (
                  <p className="mt-auto pt-2">
                    <span
                      className={`inline-block rounded-(--radius-inner) bg-primary px-3.5 py-2 ${MONO} ${TEXT.caption} uppercase tracking-(--tracking-label) text-primary-foreground`}
                    >
                      {email.cta.label}
                    </span>
                  </p>
                ) : null}
              </div>

              {/* When it arrives is a time, and a clock says "time" faster than
                  the word does — one of the two jobs an icon is allowed here. */}
              <p
                className={`flex items-center gap-2 border-t border-border px-5 py-3 ${MONO} ${TEXT.caption} text-muted-foreground`}
              >
                <Clock aria-hidden className="size-3 shrink-0" />
                {email.when}
              </p>
            </Reveal>
          ))}
        </ol>

        {limit ? (
          <p className="mt-10">
            <a
              href="/emails"
              className={`group inline-flex items-center gap-2 ${MONO} ${TEXT.label} text-(--primary-ink) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
            >
              All five, and when each one arrives
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
