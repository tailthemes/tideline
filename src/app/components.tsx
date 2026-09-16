import { AccessNote } from "../components/access-note";
import manifest from "../../theme.json";
import { BuildStrip } from "../components/build-strip";
import { EmailNotes } from "../components/email-notes";
import { EmailSequence } from "../components/email-sequence";
import { Faq } from "../components/faq";
import { Hero } from "../components/hero";
import { LandGallery } from "../components/land-gallery";
import { MaterialRail } from "../components/material-rail";
import { RoomStates } from "../components/room-states";
import { JoinForm } from "../components/join-form";
import { JoinSeam } from "../components/join-seam";
import { MaterialsBoard } from "../components/materials-board";
import { PrivacyNote } from "../components/privacy-note";
import { RoomIndex } from "../components/room-index";
import { RoomTable } from "../components/room-table";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { UpdatesFeed } from "../components/updates-feed";
import { WavesTable } from "../components/waves-table";
import { Accordion } from "../components/ui/accordion-disclosure";
import { Badge, BadgeLink, STAGE_ICON, stageTone } from "../components/ui/badge";
import { CONTROL, Field } from "../components/ui/field";
import { Button, Container, Eyebrow, Stat } from "../components/ui/primitives";
import { DISPLAY, MONO, TEXT, TNUM } from "../components/ui/type";
import { MATERIALS, STAGES, STAGE_LABEL } from "../fixtures/marram";

const sectionCount = manifest.components.filter(
  (component) => !component.name.startsWith("ui/"),
).length;
const primitiveCount = manifest.components.filter((component) =>
  component.name.startsWith("ui/"),
).length;
const tokenCount = Object.keys(manifest.tokens).length;

/**
 * `/components` — the living styleguide. It ships in the buyer's zip and it is
 * what the marketplace's parts catalogue reads.
 *
 * Two halves. The **parts** come first, with every state rendered rather than
 * described — the field's error and success specimens are the actual field
 * component holding those props, so a specimen cannot claim a state the
 * component does not have. The **sections** follow at full width.
 *
 * Every `data-component` attribute below is written out **literally at its own
 * call site**, never composed from a prop by the `Frame` helper. That is not
 * style: the manifest-parity check reads this file with a source scan, and an
 * attribute assembled at runtime is invisible to it — a part would be shipped,
 * charged for, and unseeable in the catalogue with nothing failing.
 *
 * The token panel is the materials board a second time, which is the point of
 * the signature: the palette is not a row of hexes with invented names, it is
 * five samples with sources and codes, and this page shows them as tokens
 * beside the photograph that shows them as objects.
 */

function Frame({
  name,
  note,
  children,
}: {
  name: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-hairline">
      <div className="flex flex-wrap items-baseline justify-between gap-3 py-4">
        <h3 className={`${MONO} ${TEXT.label} text-(--primary-ink)`}>{name}</h3>
        {note ? <p className={`${TEXT.caption} text-muted-foreground`}>{note}</p> : null}
      </div>
      <div className="pb-12">{children}</div>
    </div>
  );
}

function SectionLabel({ name }: { name: string }) {
  return (
    <Container>
      <p className={`border-t border-hairline py-4 ${MONO} ${TEXT.label} text-(--primary-ink)`}>
        {name}
      </p>
    </Container>
  );
}

function Swatch({ token, name, detail }: { token: string; name: string; detail: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-hairline py-3">
      <span
        aria-hidden="true"
        className="size-9 shrink-0 rounded-(--radius-inner) border border-border"
        style={{ background: `var(${token})` }}
      />
      <div className="min-w-0 flex-1">
        <p className={`${TEXT.small} font-medium text-foreground`}>{name}</p>
        <p className={`${TEXT.caption} text-muted-foreground`}>{detail}</p>
      </div>
      <code className={`${MONO} ${TEXT.caption} text-muted-foreground`}>{token}</code>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader current="/components" />

      <main id="main" tabIndex={-1} className="pt-32 focus:outline-none sm:pt-40">
        <Container>
          <Eyebrow>The system</Eyebrow>
          <h1 className={`mt-5 max-w-[18ch] text-balance ${DISPLAY} ${TEXT.d3} text-foreground`}>
            Every part, in every state it ships in
          </h1>
          <p className={`mt-6 max-w-[54ch] text-pretty ${TEXT.lead} text-muted-foreground`}>
            The {sectionCount} sections, {primitiveCount} primitives and {tokenCount} tokens below are the components themselves holding the props, not
            pictures of them. A state shown here is a state that exists.
          </p>
        </Container>

        {/* ── tokens ──────────────────────────────────────────────────────
            The combined `tokens` and `ui` frames below are what the screenshot
            pipeline photographs for the marketplace's parts catalogue — the
            per-part frames inside them are the detail shots. A styleguide with
            only the detail shots gives the catalogue nothing to lead with. */}
        <section data-component="tokens">
        <Container className="mt-20">
          <h2 className={`${DISPLAY} ${TEXT.d2} text-foreground`}>Tokens</h2>

          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className={`${MONO} ${TEXT.label} text-(--primary-ink)`}>The materials</h3>
              <p className={`mt-3 max-w-[42ch] ${TEXT.small} text-muted-foreground`}>
                Five samples, each carrying the token it is. The swatch and the photograph
                on the board are the same decision.
              </p>
              <div className="mt-6 border-t border-hairline">
                {MATERIALS.map((material) => (
                  <Swatch
                    key={material.key}
                    token={material.token}
                    name={`${material.name} · ${material.code}`}
                    detail={material.source}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className={`${MONO} ${TEXT.label} text-(--primary-ink)`}>The surfaces</h3>
              <p className={`mt-3 max-w-[42ch] ${TEXT.small} text-muted-foreground`}>
                Dark is the default ground. In light mode brass is a fill and never a
                graphic — <code className={MONO}>--primary-ink</code> is what a rule or a
                mark uses, and <code className={MONO}>--plate-ink</code> is what sits on a
                photograph, because the photographs do not invert.
              </p>
              <div className="mt-6 border-t border-hairline">
                <Swatch token="--background" name="Page" detail="the ground" />
                <Swatch token="--card" name="Card" detail="panels, email frames" />
                <Swatch token="--surface-sunken" name="Sunken" detail="the join seam" />
                <Swatch token="--primary" name="Brass" detail="fills only in light mode" />
                <Swatch token="--primary-ink" name="Brass ink" detail="rules, marks, links" />
                <Swatch token="--plate-ink" name="Plate ink" detail="type on a photograph — same in both modes" />
                <Swatch token="--hairline" name="Hairline" detail="every band divider" />
              </div>
            </div>
          </div>

          <h3 className={`mt-16 ${MONO} ${TEXT.label} text-(--primary-ink)`}>
            The ladder · ratio 1.500
          </h3>
          <div className="mt-6 flex flex-col gap-5 border-t border-hairline pt-8">
            {(
              [
                ["d4", TEXT.d4, "5.0625rem"],
                ["d3", TEXT.d3, "3.375rem"],
                ["d2", TEXT.d2, "2.25rem"],
                ["d1", TEXT.d1, "1.5rem"],
              ] as const
            ).map(([name, cls, size]) => (
              <div key={name} className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <span className={`w-10 shrink-0 ${MONO} ${TEXT.caption} text-muted-foreground`}>
                  {name}
                </span>
                <span className={`${DISPLAY} ${cls} text-foreground`}>Above the estuary</span>
                <span className={`${MONO} ${TEXT.caption} ${TNUM} text-muted-foreground`}>
                  {size}
                </span>
              </div>
            ))}
            {(
              [
                ["lead", TEXT.lead],
                ["body", TEXT.body],
                ["small", TEXT.small],
                ["caption", TEXT.caption],
              ] as const
            ).map(([name, cls]) => (
              <div key={name} className="flex flex-wrap items-baseline gap-x-6">
                <span className={`w-10 shrink-0 ${MONO} ${TEXT.caption} text-muted-foreground`}>
                  {name}
                </span>
                <span className={`${cls} text-foreground`}>
                  Nothing is finished and nothing is bookable.
                </span>
              </div>
            ))}
          </div>
        </Container>

        </section>

        {/* ── parts ───────────────────────────────────────────────────── */}
        <section data-component="ui">
        <Container className="mt-24">
          <h2 className={`${DISPLAY} ${TEXT.d2} text-foreground`}>Parts</h2>

          <div className="mt-10">
            <section data-component="ui/button">
              <Frame name="ui/button" note="rest · hover · active · disabled">
                <div className="flex flex-wrap items-center gap-4">
                  <Button>Join the list</Button>
                  <Button tone="quiet">The build log</Button>
                  <Button disabled>Joining…</Button>
                </div>
              </Frame>
            </section>

            <section data-component="ui/field">
              <Frame
                name="ui/field"
                note="every state the library defines, drawn — a state only reachable by typing is a state no capture has seen"
              >
                {/* One pane per state, and the `data-state` attributes are
                    written out here rather than read off the rendered root.
                    The parity check is a source scan: it looks in this frame's
                    text for each state the part declares, because a state that
                    exists only at runtime is one nobody has ever photographed. */}
                <div className="grid gap-8 sm:grid-cols-2">
                  <div data-state="rest">
                    <Field id="spec-rest" label="Email address">
                      {({ control }) => (
                        <input {...control} type="email" placeholder="you@example.com" className={CONTROL} />
                      )}
                    </Field>
                  </div>

                  <div data-state="rest">
                    <Field
                      id="spec-desc"
                      label="Email address"
                      description="We send five emails, then an invitation."
                    >
                      {({ control }) => (
                        <input {...control} type="email" placeholder="you@example.com" className={CONTROL} />
                      )}
                    </Field>
                  </div>

                  <div data-state="invalid">
                    <Field
                      id="spec-error"
                      label="Email address"
                      error="That does not look like an email address. Check it and try again."
                    >
                      {({ control }) => (
                        <input
                          {...control}
                          type="email"
                          defaultValue="hello@"
                          data-invalid="true"
                          className={CONTROL}
                        />
                      )}
                    </Field>
                  </div>

                  <div data-state="valid">
                    <Field
                      id="spec-ok"
                      label="Email address"
                      valid
                      success="Confirmed. You are number 1,205."
                    >
                      {({ control }) => (
                        <input {...control} type="email" defaultValue="you@example.com" className={CONTROL} />
                      )}
                    </Field>
                  </div>

                  <div data-state="read-only">
                    <Field
                      id="spec-ro"
                      label="Email address"
                      readOnly
                      readOnlyNote="Set when you confirmed. Write to us to change it."
                    >
                      {({ control }) => (
                        <input {...control} type="email" readOnly defaultValue="you@example.com" className={CONTROL} />
                      )}
                    </Field>
                  </div>

                  <div data-state="disabled">
                    <Field id="spec-off" label="Email address" disabled>
                      {({ control }) => (
                        <input {...control} type="email" disabled placeholder="you@example.com" className={CONTROL} />
                      )}
                    </Field>
                  </div>
                </div>
              </Frame>
            </section>

            <section data-component="ui/accordion-disclosure">
              <Frame
                name="ui/accordion-disclosure"
                note="Escape closes · aria-expanded on the trigger · + and − swap off data-state"
              >
                <div className="max-w-2xl border-t border-hairline">
                  <div data-state="open">
                    <Accordion summary="Can I book a room?" defaultOpen>
                      No. Nothing is bookable and there is no deposit to pay.
                    </Accordion>
                  </div>
                  <div data-state="closed">
                    <Accordion summary="What does joining cost?">
                      Nothing, and it never will.
                    </Accordion>
                  </div>
                </div>
              </Frame>
            </section>

            <section data-component="ui/badge">
              <Frame
                name="ui/badge"
                note="quiet · marked · the stage ladder · as a link — one shape, two tones, never colour alone"
              >
                <div className="flex flex-col gap-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>Wave 2</Badge>
                    <Badge tone="marked">Wave 1</Badge>
                    <Badge>Wave undecided</Badge>
                  </div>

                  {/* The ladder in order. Read across, it is a sequence — an
                      empty frame, a roof, plaster, tools, done — which is what
                      makes eleven stage words scannable in the room table. */}
                  <div className="flex flex-wrap items-center gap-2">
                    {STAGES.map((stage) => (
                      <Badge key={stage} tone={stageTone(stage)} icon={STAGE_ICON[stage]}>
                        {STAGE_LABEL[stage]}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <BadgeLink href="/rooms#room-01" tone="marked">
                      01 Cocklers
                    </BadgeLink>
                    <BadgeLink href="/rooms#room-05">05 Marram</BadgeLink>
                  </div>

                  {/* On a plate, where neither mode's tokens apply. */}
                  <div className="flex flex-wrap items-center gap-2 bg-(--surface-sunken) p-5">
                    <Badge onPlate>Over a photograph</Badge>
                    <Badge onPlate icon={STAGE_ICON.furnished}>
                      Furnished
                    </Badge>
                  </div>
                </div>
              </Frame>
            </section>

            <section data-component="ui/eyebrow">
              <Frame name="ui/eyebrow" note="page register, and the on-plate register">
                <div className="flex flex-col gap-5">
                  <Eyebrow>Opening May 2027 · the list is open</Eyebrow>
                  <div className="max-w-md bg-(--surface-sunken) p-5">
                    <Eyebrow onPlate>The same eyebrow, on a plate</Eyebrow>
                  </div>
                </div>
              </Frame>
            </section>

            <section data-component="ui/stat">
              <Frame name="ui/stat">
                <dl className="flex flex-wrap gap-14">
                  <Stat label="Rooms plastered">7 / 11</Stat>
                  <Stat label="First season" sub="invitations">
                    40
                  </Stat>
                </dl>
              </Frame>
            </section>

            <section data-component="join-form">
              <Frame name="join-form" note="the live control — rest, invalid, submitting, done">
                <div className="max-w-lg">
                  <JoinForm tone="onPage" />
                </div>
              </Frame>
            </section>
          </div>
        </Container>

        </section>

        {/* ── sections ────────────────────────────────────────────────── */}
        <Container className="mt-24">
          <h2 className={`${DISPLAY} ${TEXT.d2} text-foreground`}>Sections</h2>
          <p className={`mt-4 max-w-[54ch] ${TEXT.body} text-muted-foreground`}>
            Each one at full width, in the order a visitor meets it.
          </p>
        </Container>

        <div className="mt-12">
          <section data-component="hero">
            <SectionLabel name="hero" />
            <Hero level={2} />
          </section>

          <section data-component="build-strip">
            <SectionLabel name="build-strip" />
            <BuildStrip />
          </section>

          <section data-component="land-gallery">
            <SectionLabel name="land-gallery" />
            <LandGallery headingId="spec-land" />
          </section>

          <section data-component="materials-board">
            <SectionLabel name="materials-board" />
            <MaterialsBoard headingId="spec-board" />
          </section>

          <section data-component="material-rail">
            <SectionLabel name="material-rail" />
            <MaterialRail headingId="spec-rail" />
          </section>

          <section data-component="room-index">
            <SectionLabel name="room-index" />
            <RoomIndex headingId="spec-rooms" />
          </section>

          <section data-component="room-table">
            <SectionLabel name="room-table" />
            <RoomTable headingId="spec-room-table" />
          </section>

          <section data-component="room-states">
            <SectionLabel name="room-states" />
            <RoomStates headingId="spec-states" />
          </section>

          <section data-component="updates-feed">
            <SectionLabel name="updates-feed" />
            <UpdatesFeed headingId="spec-updates" limit={1} />
          </section>

          <section data-component="email-sequence">
            <SectionLabel name="email-sequence" />
            <EmailSequence headingId="spec-emails" limit={3} />
          </section>

          <section data-component="email-notes">
            <SectionLabel name="email-notes" />
            <EmailNotes headingId="spec-email-notes" />
          </section>

          <section data-component="waves-table">
            <SectionLabel name="waves-table" />
            <WavesTable headingId="spec-waves" level={2} />
          </section>

          <section data-component="faq">
            <SectionLabel name="faq" />
            <Faq headingId="spec-faq" />
          </section>

          <section data-component="access-note">
            <SectionLabel name="access-note" />
            <AccessNote headingId="spec-access" />
          </section>

          <section data-component="privacy-note">
            <SectionLabel name="privacy-note" />
            <PrivacyNote headingId="spec-privacy" />
          </section>

          <section data-component="join-seam">
            <SectionLabel name="join-seam" />
            <JoinSeam headingId="spec-join" />
          </section>

          <section data-component="site-header">
            <SectionLabel name="site-header" />
            <p className={`mx-auto max-w-[84rem] px-6 pb-12 ${TEXT.body} text-muted-foreground sm:px-10`}>
              At the top of this page, and of every route. It carries two ink registers —
              on a photograph, and on a token ground.
            </p>
          </section>

          <section data-component="site-footer">
            <SectionLabel name="site-footer" />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
