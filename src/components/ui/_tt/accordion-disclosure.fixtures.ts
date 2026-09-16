/* @tt-ui ui/parts/accordion-disclosure/fixtures.schema.ts library=1.5.1 sha256=a9b9f236cf2c801671006593ddb58dc9f72260fd96b0e5a9a818e33a3f335b19
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * The SHAPE of a disclosure specimen's content. Never a string.
 *
 * The fixture *schema* is required to be shared and the fixture *strings* are
 * forbidden to be (CONTRACT § What is required / forbidden to share). This is
 * the part where that matters most: an FAQ is a theme's objections in a theme's
 * domain and its own voice, and "What does it cost?" answered the same way in
 * two themes is the convergence P-7 was, in the one slot no recipe gate reads.
 *
 * Plain data, no `ReactNode`: the same schema describes the HTML edition's
 * fixture, and that edition has no React in it. The marker is absent
 * deliberately — it is an icon, and icons are the theme's, chosen in the
 * wrapper rather than carried in content.
 */

export interface DisclosureFixture {
  /** The summary row's words — the control's accessible name. */
  summary: string;
  /** A count or a short qualifier beside it. */
  meta?: string;
  /** The panel, as paragraphs. */
  body: readonly string[];
}

/**
 * An accordion is a list of them, and the list is the fixture: a specimen with
 * one row cannot show the rhythm between rows, the rule that separates them, or
 * what two open panels do to each other.
 */
export interface AccordionFixture {
  /** The section's heading, where the theme's FAQ has one. */
  title?: string;
  items: readonly DisclosureFixture[];
  /** Which row the `open` pane should draw open. Defaults to the first. */
  openIndex?: number;
}
