import { MapPin, TrainFront } from "lucide-react";
import { HOUSE, derive } from "../fixtures/marram";
import { Brand, Container } from "./ui/primitives";
import { FOCUS, MONO, TEXT, TNUM, TRANSITION } from "./ui/type";

/**
 * The footer states where the house is and what stage it is at, and then
 * stops. The reference puts a newsletter form here, but this whole site is a
 * newsletter form — a third instance of it below the join seam would be the
 * same ask three times on one page.
 */

const COLUMNS = [
  {
    heading: "The house",
    links: [
      { href: "/rooms", label: "The rooms" },
      { href: "/the-build", label: "The build log" },
    ],
  },
  {
    heading: "The list",
    links: [
      { href: "/list", label: "What joining means" },
      { href: "/emails", label: "The five emails" },
    ],
  },
  {
    heading: "The theme",
    links: [{ href: "/components", label: "Components" }],
  },
] as const;

export function SiteFooter() {
  const { plasteredOf } = derive();

  return (
    <footer className="border-t border-hairline py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Brand />
            {/* A place and a station: the two facts in this footer a glyph
                names faster than the words do. */}
            <ul className={`mt-4 flex max-w-[32ch] flex-col gap-2 ${TEXT.small} text-muted-foreground`}>
              <li className="flex items-start gap-2.5">
                <MapPin aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                An eleven-room house above the {HOUSE.where.split(",")[0]}, opening{" "}
                {HOUSE.opens}.
              </li>
              <li className="flex items-center gap-2.5">
                <TrainFront aria-hidden className="size-3.5 shrink-0" />
                Nearest station {HOUSE.station}.
              </li>
            </ul>
            <p className={`mt-4 ${MONO} ${TEXT.caption} ${TNUM} text-muted-foreground`}>
              {plasteredOf} rooms plastered · {HOUSE.tideRange} on springs ·{" "}
              {HOUSE.walkToWater} to the water
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className={`${MONO} ${TEXT.label} text-muted-foreground`}>
                {column.heading}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`${TEXT.small} text-foreground hover:text-(--primary-ink) ${TRANSITION} ${FOCUS} rounded-(--radius)`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p
          className={`mt-12 border-t border-hairline pt-7 ${MONO} ${TEXT.caption} text-muted-foreground`}
        >
          Nothing on this site is bookable. No deposit is taken at any stage.
        </p>
      </Container>
    </footer>
  );
}
