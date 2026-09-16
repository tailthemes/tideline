import { HOUSE, UPDATES, derive, formatDate } from "../fixtures/marram";

/**
 * The five emails, as one description rendered two ways.
 *
 * Why not five `.html` files written by hand: the site has to *show* the
 * sequence — that is half of what this theme is selling — and a preview built
 * separately from the artifact is a preview that lies the first time somebody
 * edits one and not the other. It is the same argument the marketplace makes
 * about its own post editor, and the failure mode is identical.
 *
 * So: this file is the source. `render-html.ts` turns an entry into a
 * table-based document an inbox will accept; `components/email-sequence.tsx`
 * renders the same entry as React for `/emails`. Neither knows the words.
 *
 * Every number comes from the fixture, so email 02's standing and the hero's
 * standing are the same number, and email 04's "7 of 11" is `derive()`.
 */

/** The photographs an email may carry. Symbolic, never a filename. */
export type PlateKey = "room" | "marram";

export interface EmailBlock {
  kind: "text" | "figure" | "plate" | "rule";
  /** `text` — a paragraph. `figure` — a large brass numeral with a caption. */
  text?: string;
  figure?: string;
  caption?: string;
  /** `plate` — one of the shipped photographs, by SYMBOLIC key.
   *
   *  Not a filename, and the reason is a gate: a registry item is text-only, so
   *  the payload substitutes a token-coloured stand-in for every photograph
   *  (ADR-011). A filename literal in a `.ts` or `.tsx` file survives that
   *  substitution and installs as a reference to a binary the payload does not
   *  carry — `check-registry --fresh` refuses it, and it is right to. The React
   *  renderer maps these keys to imported modules; the email renderer maps them
   *  to URLs its caller supplies. */
  plate?: PlateKey;
  alt?: string;
}

export interface EmailEntry {
  /** 01–05, and the order they arrive in. */
  id: string;
  /** What the sequence calls this step internally. */
  step: string;
  /** The Subject: line. Word budget: ≤ 42 characters, no emoji, no "Re:". */
  subject: string;
  /** The preview text an inbox shows beside the subject. Never a repeat of it. */
  preheader: string;
  /** When it arrives, in the reader's terms. */
  when: string;
  kicker: string;
  heading: string;
  blocks: EmailBlock[];
  cta?: { label: string; href: string };
  /** One sentence under the rule, above the unsubscribe. */
  signoff: string;
}

const list = HOUSE.listCount.toLocaleString("en-GB");
const { plasteredOf, plastered, total } = derive();
const slate = UPDATES.find((u) => u.title === "The slate landed");

export const SEQUENCE: readonly EmailEntry[] = [
  {
    id: "01",
    step: "Confirm",
    subject: "Confirm your address",
    preheader: "One tap, and then nothing until there is news.",
    when: "Immediately",
    kicker: "Email 01",
    heading: "One tap and you're on the list",
    blocks: [
      {
        kind: "text",
        text: "Somebody put this address on the list for Marram. If that was you, confirm it below and we will stop bothering you until there is something true to say.",
      },
      {
        kind: "text",
        text: "If it wasn't you, ignore this. Nothing happens, and the address is deleted in seven days.",
      },
    ],
    cta: { label: "Confirm this address", href: "https://example.com/confirm" },
    signoff: "No deposit, no booking, no card. It is a list.",
  },
  {
    id: "02",
    step: "Standing",
    subject: "You're on the list",
    preheader: `Number ${list}, and what that actually gets you.`,
    when: "Straight after confirming",
    kicker: "Email 02",
    heading: "You're on the list",
    blocks: [
      { kind: "figure", figure: list, caption: "your place in the queue" },
      {
        kind: "text",
        text: `The first season goes out as ${HOUSE.firstSeasonInvites} invitations in two waves — ${HOUSE.waves[0].when} and ${HOUSE.waves[1].when}. Everyone here gets forty-eight hours before the public each time.`,
      },
      {
        kind: "text",
        text: "Being high on the list is not a reservation and does not hold a room. It decides the order the invitations go out in, and nothing else.",
      },
    ],
    cta: { label: "What the waves mean", href: "https://example.com/list" },
    signoff: "Roughly monthly, and only when something has happened.",
  },
  {
    id: "03",
    step: "Referral",
    subject: "Two rooms, if you know the estuary",
    preheader: "The only thing we will ever ask you for.",
    when: "About a fortnight later",
    kicker: "Email 03",
    heading: "The only ask, and it is a small one",
    blocks: [
      {
        kind: "plate",
        plate: "marram",
        alt: "Dry marram grass on the dune above the house, bending in the wind.",
      },
      {
        kind: "text",
        text: "We are not advertising this and we are not going to. The list has grown by people telling one other person, which is the rate we can actually build for.",
      },
      {
        kind: "text",
        text: "If somebody comes to mind — the one who knows this coast, or has been looking for somewhere to put a long weekend — send them the link. That is the whole scheme. There is no discount and no leaderboard.",
      },
    ],
    cta: { label: "Copy the link", href: "https://example.com/" },
    signoff: "You can leave the list at the bottom of any of these.",
  },
  {
    id: "04",
    step: "Build update",
    subject: `${plastered} of ${total}, and the slate is here`,
    preheader: "Photographs, and what is still wrong with the kitchen.",
    when: "Whenever something happens",
    kicker: "Email 04",
    heading: `${plasteredOf} rooms plastered`,
    blocks: [
      {
        kind: "plate",
        plate: "room",
        alt: "An unfinished room at Marram: bare lime plaster, a deep window onto the estuary, a step-ladder against the far wall.",
      },
      {
        kind: "text",
        text: slate
          ? `${slate.body} It landed on ${formatDate(slate.date)}.`
          : "The slate is here.",
      },
      {
        kind: "text",
        text: "Lime takes three coats and a week between each, which is why seven rooms took the whole summer and the last four are next spring's problem. The kitchen is commissioned and the run is eleven feet, which is shorter than we wanted.",
      },
      { kind: "rule" },
      {
        kind: "text",
        text: "Nothing here is bookable yet. This is a progress note, not an offer.",
      },
    ],
    cta: { label: "The full build log", href: "https://example.com/the-build" },
    signoff: "Four of these have gone out in twelve months.",
  },
  {
    id: "05",
    step: "The opening",
    subject: "Your window opens on Thursday",
    preheader: "Forty-eight hours before anybody else.",
    when: `When ${HOUSE.opens} finally arrives`,
    kicker: "Email 05",
    heading: "Your window is open",
    blocks: [
      {
        kind: "text",
        text: `Wave one opens on Thursday at nine. You have forty-eight hours before the public list, and there are ${HOUSE.firstSeasonInvites} invitations going out across the rooms that are finished.`,
      },
      {
        kind: "text",
        text: "The tag with a number on it is already on its hook. If Thursday does not suit, wave two is in April and you keep your place.",
      },
    ],
    cta: { label: "Take a room", href: "https://example.com/rooms" },
    signoff: "Thank you for waiting two and a half years.",
  },
] as const;

/** Shared chrome, so the five documents cannot drift apart. */
export const EMAIL_CHROME = {
  from: `${HOUSE.name} · ${HOUSE.where}`,
  address: `${HOUSE.name}, ${HOUSE.where}. Nearest station ${HOUSE.station}.`,
  unsubscribe: "Leave the list",
  unsubscribeHref: "https://example.com/unsubscribe",
} as const;
