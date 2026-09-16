import { BedDouble, Compass, Ruler } from "lucide-react";
import { ROOMS, STAGE_LABEL, materialFor } from "../fixtures/marram";
import { Badge, STAGE_ICON, stageTone } from "./ui/badge";
import { Container } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * Eleven rooms, one row each, and the row is the honest unit: a name, where it
 * is in the building, what you see out of it, how big it is, what stage it has
 * got to, and one sentence that is true rather than flattering.
 *
 * A grid of eleven photo cards was the obvious alternative and is the wrong
 * shape twice over — nine of the eleven rooms are building sites and would be
 * nine near-identical pictures of bare plaster, and a card grid implies the
 * rooms are equivalent when three of them are demonstrably worse (Saltings is
 * the darkest room in the house and says so).
 *
 * Rows, not a `<table>`: there is no column a reader compares vertically
 * except area, and a real table at 375px either scrolls sideways or collapses
 * into rows anyway.
 *
 * **This is the section the icons exist for.** Eleven rows each carrying an
 * aspect, an area, a bed count and a stage is a wall of text; four glyphs turn
 * it into columns the eye can jump between, and the stage ladder in particular
 * reads as a sequence across the eleven in a way five words do not
 * (`ui/badge.tsx` argues the policy). Every one is `aria-hidden` with its word
 * beside it, so nothing here is carried by the glyph alone.
 */
export function RoomTable({ headingId = "room-list" }: { headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className="border-t border-hairline py-20 sm:py-28">
      <Container>
        <h2 className="sr-only" id={headingId}>
          Every room, and what stage it is at
        </h2>

        <ol className="border-t border-hairline">
          {ROOMS.map((room, index) => (
            <Reveal
              as="li"
              key={room.number}
              delay={Math.min(index, 3) * 60}
              className="border-b border-hairline"
            >
              <article
                id={`room-${room.number}`}
                className="grid scroll-mt-24 gap-x-8 gap-y-4 py-8 sm:grid-cols-[4rem_1fr_auto] sm:py-9"
              >
                <p className={`${MONO} ${TEXT.d1} ${TNUM} text-(--primary-ink)`}>
                  {room.number}
                </p>

                <div>
                  <h3 className={`${DISPLAY} ${TEXT.d1} text-foreground`}>{room.name}</h3>
                  <p className={`mt-1.5 ${TEXT.small} text-muted-foreground`}>{room.where}</p>

                  {/* The scannable row: aspect, area, beds. Three glyphs, three
                      columns for the eye — and the words are all still there. */}
                  <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <li
                      className={`flex items-center gap-2 ${TEXT.small} text-muted-foreground`}
                    >
                      <Compass aria-hidden className="size-3.5 shrink-0" />
                      {room.aspect}
                    </li>
                    <li
                      className={`flex items-center gap-2 ${MONO} ${TEXT.small} ${TNUM} text-muted-foreground`}
                    >
                      <Ruler aria-hidden className="size-3.5 shrink-0" />
                      {room.area} m²
                    </li>
                    <li
                      className={`flex items-center gap-2 ${TEXT.small} text-muted-foreground`}
                    >
                      <BedDouble aria-hidden className="size-3.5 shrink-0" />
                      {room.beds}
                    </li>
                  </ul>

                  <p className={`mt-3.5 max-w-[52ch] text-pretty ${TEXT.body} text-foreground`}>
                    {room.note}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                    {room.materials.map((key) => {
                      const material = materialFor(key);
                      return (
                        <li
                          key={key}
                          className={`flex items-center gap-2 ${MONO} ${TEXT.caption} text-muted-foreground`}
                        >
                          {/* The swatch is the icon here — a glyph beside it
                              would be the same information twice. */}
                          <span
                            aria-hidden="true"
                            className="size-2.5 rounded-(--radius-inner) border border-border"
                            style={{ background: `var(${material.token})` }}
                          />
                          {material.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-wrap items-start gap-2 sm:flex-col sm:items-end">
                  <Badge tone={stageTone(room.stage)} icon={STAGE_ICON[room.stage]}>
                    {STAGE_LABEL[room.stage]}
                  </Badge>
                  <Badge tone={room.wave === 1 ? "marked" : "quiet"}>
                    {room.wave === 3 ? "Wave undecided" : `Wave ${room.wave}`}
                  </Badge>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
