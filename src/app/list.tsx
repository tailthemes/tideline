import { Faq } from "../components/faq";
import { JoinSeam } from "../components/join-seam";
import { PrivacyNote } from "../components/privacy-note";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { WavesTable } from "../components/waves-table";

/**
 * `/list` — opens with the waves table, which is this theme's pricing page
 * with the prices removed because there are none.
 *
 * Order is the argument again: what you get and when, then the six questions
 * we actually get, then exactly what happens to the address. A visitor who
 * reads all three in order has had every objection answered before the form
 * appears at the bottom, which is why the form is at the bottom.
 */
export default function ListPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader current="/list" />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <WavesTable headingId="list-title" />
        <Faq />
        <PrivacyNote />
        <JoinSeam />
      </main>
      <SiteFooter />
    </div>
  );
}
