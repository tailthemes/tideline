import type { Metadata } from "next";
import { fontClassName } from "../src/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tideline — Pre-launch & Waitlist",
  description: "Tideline is a coming soon website template for Tailwind and React, built for the studio putting a launch online before there is anything to sell. Its premise is that a pre-launch site has nothing to demo — no product, no screenshots, no booking — so the only honest argument it can make is what the thing is made of and how far along it is. The signature is the materials board: five samples photographed flat, each one carrying the design token it *is*, so the swatch in the styleguide and the plate on the page are the same decision rather than two guesses. The countdown is a build state, not a clock: seven of eleven rooms plastered, slate landed 12 August, and every one of those figures resolves through a single fixture file, so no page can contradict another. The fiction is Marram, an eleven-room house above the Dyfi estuary in Gwynedd, opening May 2027, with nothing bookable and no deposit to take. Where the twelve free waitlist starters ship a form, this ships the part that actually does the work: five table-based HTML emails — confirm, standing, referral, a build update with photography, and the opening — rendered from the same tokens and previewed in the site itself at /emails. Near-black ground with one brass accent, Spectral over Manrope, a full light mode that inverts the page around photography that stays dark in both.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontClassName}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
