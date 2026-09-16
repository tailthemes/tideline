import { AccessNote } from "../components/access-note";
import { JoinSeam } from "../components/join-seam";
import { RoomIndex } from "../components/room-index";
import { RoomTable } from "../components/room-table";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

/**
 * `/rooms` — opens with **the cut-out**, not with a masthead.
 *
 * The brass tag floating in dead space is this route's instrument and it is
 * the only page that leads with an object. Home leads with a landscape,
 * `/the-build` with a dated log, `/emails` with a grid of cards, `/list` with
 * a table — five routes, five openers, which is what the page-variety rule
 * asks for.
 *
 * The access statement sits directly after the room list rather than in a
 * footer link, because the reader deciding between Ferryman and East gable is
 * the reader who needs to know about the stairs.
 */
export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader current="/rooms" />
      <main id="main" tabIndex={-1} className="pt-32 focus:outline-none sm:pt-40">
        <RoomIndex level={1} headingId="rooms-title" />
        <RoomTable />
        <AccessNote />
        <JoinSeam />
      </main>
      <SiteFooter />
    </div>
  );
}
