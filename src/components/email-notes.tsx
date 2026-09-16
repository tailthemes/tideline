import { SEQUENCE } from "../emails/sequence";
import { Container, Eyebrow } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * What the buyer is actually getting, stated plainly, because "designed
 * emails" is a claim and a buyer evaluating this theme wants to know whether
 * it survives Outlook.
 *
 * This is the one section written to the *buyer* rather than in the fiction's
 * voice, and it is deliberate: `/emails` is the page that sells the
 * differentiator, and dressing the technical facts up in the hotel's voice
 * would hide them.
 */

const NOTES: readonly { term: string; detail: string }[] = [
  {
    term: "Tables, not flexbox",
    detail:
      "Outlook on Windows renders through Word, which supports neither flexbox nor grid. Every column in these documents is a td.",
  },
  {
    term: "Inline styles only",
    detail:
      "Gmail strips head styles in some contexts and rewrites class names in others. Nothing here depends on a selector matching.",
  },
  {
    term: "Tokens inlined as hex",
    detail:
      "var() does not resolve in most clients. Each value is copied from theme.css with the token it came from named beside it, so a rebrand is a find-and-replace with a map.",
  },
  {
    term: "Dark by declaration",
    detail:
      "color-scheme and supported-color-schemes are set to dark so the clients that invert light emails leave these alone, and they match the site instead of becoming mud.",
  },
  {
    term: "A real plain-text part",
    detail:
      "renderText() builds it from the same source. HTML-only mail is filtered harder, and the text part is also the accessible fallback.",
  },
  {
    term: "One source, two renderers",
    detail:
      "The page you are reading and the documents themselves both render src/emails/sequence.ts. A preview built separately is a preview that lies the first time somebody edits one and not the other.",
  },
];

export function EmailNotes({ headingId = "email-notes" }: { headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className="border-t border-hairline py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <Eyebrow>What you get</Eyebrow>
          <h2
            id={headingId}
            className={`mt-5 max-w-[16ch] text-balance ${DISPLAY} ${TEXT.d2} text-foreground`}
          >
            Built for inboxes, not for a screenshot
          </h2>
          <p className={`mt-5 max-w-[40ch] text-pretty ${TEXT.body} text-muted-foreground`}>
            <span className={`${MONO} ${TNUM}`}>{SEQUENCE.length}</span> documents in{" "}
            <code className={MONO}>src/emails/</code>, each with an HTML and a plain-text
            part.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <dl className="border-t border-hairline">
            {NOTES.map((note) => (
              <div key={note.term} className="border-b border-hairline py-5">
                <dt className={`${MONO} ${TEXT.label} text-(--primary-ink)`}>{note.term}</dt>
                <dd className={`mt-2.5 max-w-[62ch] text-pretty ${TEXT.body} text-foreground`}>
                  {note.detail}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
