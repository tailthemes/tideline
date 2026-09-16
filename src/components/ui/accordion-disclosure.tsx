"use client";

import { Minus, Plus } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  AccordionDisclosureRoot,
  AccordionDisclosureSpecimen,
} from "./_tt/accordion-disclosure";
import type { AccordionDisclosureRecipe } from "./_tt/accordion-disclosure.axes";
import { DISPLAY, TEXT } from "./type";
import { ui } from "./ui.config";

/**
 * The theme's disclosure. The library owns Escape, `aria-expanded`, the region
 * wiring and the `<details>` fallback; this file owns every class string.
 *
 * Two glyphs rather than one rotating chevron. A `+` that becomes a `−` reads
 * at a glance in a list of six, and it costs no frame — which matters here
 * because the motion personality is "tidal" and six chevrons all easing at once
 * is the busiest thing that could happen on a deliberately quiet page. Both
 * markers render and one is hidden off the root's `data-state`, which is the
 * shape the library's own header asks for.
 *
 * The `group/row` on the root is what makes that swap work without either
 * marker holding state of its own.
 */
const recipe = {
  root: "group/row border-b border-hairline",
  heading: "",
  summary: `flex w-full cursor-pointer list-none items-center justify-between gap-6 py-5 text-left hover:text-(--primary-ink) motion-safe:transition-colors motion-safe:duration-(--duration-micro) ${ui.focus}`,
  marker: "shrink-0 text-(--primary-ink)",
  label: `${DISPLAY} ${TEXT.d1} text-foreground`,
  meta: `${TEXT.small} text-muted-foreground`,
  region: `pb-6 pr-10 ${TEXT.body} text-muted-foreground`,
} satisfies AccordionDisclosureRecipe;

export type AccordionDisclosureProps = Omit<
  ComponentProps<typeof AccordionDisclosureRoot>,
  "recipe" | "marker"
>;

export function AccordionDisclosure(props: AccordionDisclosureProps) {
  return (
    <AccordionDisclosureRoot
      {...props}
      recipe={recipe}
      marker={
        <>
          <Plus aria-hidden="true" className="size-4 group-data-[state=open]/row:hidden" />
          <Minus
            aria-hidden="true"
            className="hidden size-4 group-data-[state=open]/row:block"
          />
        </>
      }
    />
  );
}

/** The theme's own name for it, used by the FAQ and the styleguide. */
export function Accordion({
  summary,
  children,
  meta,
  defaultOpen,
}: {
  summary: ReactNode;
  children: ReactNode;
  meta?: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <AccordionDisclosure
      summary={summary}
      meta={meta}
      headingLevel={3}
      defaultOpen={defaultOpen}
    >
      {children}
    </AccordionDisclosure>
  );
}

export { AccordionDisclosureSpecimen };
