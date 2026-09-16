import { BuildStrip } from "../components/build-strip";
import { EmailSequence } from "../components/email-sequence";
import { Hero } from "../components/hero";
import { LandGallery } from "../components/land-gallery";
import { MaterialRail } from "../components/material-rail";
import { RoomStates } from "../components/room-states";
import { MaterialsBoard } from "../components/materials-board";
import { RoomIndex } from "../components/room-index";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { UpdatesFeed } from "../components/updates-feed";

/**
 * `/` — opens with the photograph, because on a pre-launch site the
 * photograph is the only thing there is to open with.
 *
 * Density: `h-[46rem]` hero · `py-28` standard bands · `py-7` on the build
 * strip, which is the page's quiet register and its one horizontal rule.
 *
 * The order is an argument, not a stack. The parallax plate says *where*; the
 * strip says *how far along*; the pinned land gallery answers the question the
 * rest of the site cannot — *do I want to be there* — because the land is the
 * only finished thing; the board says *what it is made of* and the rail says
 * *what it will feel like*; the rooms say *what you would be getting* and the
 * four stages say *what those words mean*; the log says *these people are
 * real*; and the sequence says *here is what arrives if you join*. Each one
 * answers the objection the previous one raises.
 *
 * It is a long page, deliberately. A pre-launch site's failure mode is having
 * nothing to say; this one's risk is the opposite, and the ordering above is
 * what keeps length from becoming padding.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader current="/" />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <BuildStrip />
        <LandGallery />
        <MaterialsBoard />
        <MaterialRail />
        <RoomIndex />
        <RoomStates />
        <UpdatesFeed limit={2} />
        <EmailSequence limit={3} />
      </main>
      <SiteFooter />
    </div>
  );
}
