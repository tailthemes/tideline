import { EmailNotes } from "../components/email-notes";
import { EmailSequence } from "../components/email-sequence";
import { JoinSeam } from "../components/join-seam";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

/**
 * `/emails` — the page that sells the differentiator.
 *
 * All five, then the technical notes written to the *buyer* rather than in the
 * house's voice. That register break is deliberate and is the only one in the
 * theme: this is the route where somebody evaluating the template wants to
 * know whether the documents survive Outlook, and answering that in a Welsh
 * hotel's voice would be hiding it.
 */
export default function EmailsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader current="/emails" />
      <main id="main" tabIndex={-1} className="pt-32 focus:outline-none sm:pt-40">
        <EmailSequence level={1} headingId="emails-title" />
        <EmailNotes />
        <JoinSeam />
      </main>
      <SiteFooter />
    </div>
  );
}
