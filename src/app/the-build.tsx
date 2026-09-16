import { JoinSeam } from "../components/join-seam";
import { MaterialsBoard } from "../components/materials-board";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { UpdatesFeed } from "../components/updates-feed";

/**
 * `/the-build` — opens with the dated log, in full.
 *
 * The board follows rather than leads here, and carries a different heading
 * from the one it carries on `/`: on the home page it is introducing the
 * palette to somebody who has not seen it, here it is answering "what is the
 * house made of" for somebody who has just read four entries about slate.
 * Same component, same five rows, different question — which is the test for
 * whether a section is being reused or just repeated.
 */
export default function TheBuildPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader current="/the-build" />
      <main id="main" tabIndex={-1} className="pt-32 focus:outline-none sm:pt-40">
        <UpdatesFeed level={1} headingId="build-title" />
        <MaterialsBoard
          headingId="build-board"
          heading="Five materials, and where each one came from"
        />
        <JoinSeam />
      </main>
      <SiteFooter />
    </div>
  );
}
