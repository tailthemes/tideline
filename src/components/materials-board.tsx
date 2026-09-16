import boardPlate from "../assets/tl-materials.jpg";
import { MATERIALS } from "../fixtures/marram";
import { Container, Eyebrow, Plate } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, MONO, TEXT, TNUM } from "./ui/type";

/**
 * **The signature.**
 *
 * Five samples, photographed flat, and beside each one the design token it
 * *is*. `--material-slate` is not "a grey that goes with the photo" — it is the
 * measured colour of the slate in it. That is the whole idea: on a site for a
 * building nobody can visit, the material board is the only honest thing to
 * show, and making it also be the palette means the swatch and the plate cannot
 * drift apart the way a moodboard and a stylesheet always do.
 *
 * It runs here, on `/the-build`, and on `/components` — where the same five
 * rows are the token panel. Three routes, past the ≥2 floor, and not portable:
 * a materials board only means anything for a thing that is being built.
 *
 * The swatch is a `<span>` painted by the token with a text code beside it, so
 * colour is never the only key — the code (`DS-04`) is what the joiner and the
 * site office actually say out loud.
 */
export function MaterialsBoard({
  heading = "The palette is a photograph of the building",
  headingId = "board",
}: {
  heading?: string;
  headingId?: string;
}) {
  return (
    <section aria-labelledby={headingId} className="py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <Reveal>
          <Plate
            src={boardPlate.src}
            alt="Five material samples laid out on dark slate and photographed from above: riven slate, oiled oak, folded oatmeal wool, a lime plaster tile, and a polished brass plate."
          />
        </Reveal>

        <Reveal delay={80}>
          <Eyebrow>The board</Eyebrow>
          <h2
            id={headingId}
            className={`mt-5 text-balance ${DISPLAY} ${TEXT.d2} text-foreground`}
          >
            {heading}
          </h2>
          <p className={`mt-5 max-w-[38ch] text-pretty ${TEXT.body} text-muted-foreground`}>
            Five samples went to the joiner in March. Every colour on this site is one of
            them measured, so the swatch and the plate cannot disagree.
          </p>

          <dl className="mt-8 border-t border-hairline">
            {MATERIALS.map((material) => (
              <div
                key={material.key}
                className="grid grid-cols-[1.75rem_1fr_auto] items-center gap-4 border-b border-hairline py-3.5"
              >
                <span
                  aria-hidden="true"
                  className="size-7 rounded-(--radius-inner) border border-border"
                  style={{ background: `var(${material.token})` }}
                />
                <div>
                  <dt className={`${TEXT.small} font-medium text-foreground`}>
                    {material.name}
                  </dt>
                  <dd className={`${TEXT.caption} text-muted-foreground`}>
                    {material.source}
                  </dd>
                </div>
                <dd className={`${MONO} ${TEXT.caption} ${TNUM} text-muted-foreground`}>
                  {material.code}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
