/**
 * The fixture spine. Every figure on every route, and every number in all five
 * emails, resolves through this file — there is no second source and no number
 * typed into a component.
 *
 * Why it matters more here than in a normal theme: a pre-launch site is a set
 * of claims about a thing that does not exist yet, so the one property it must
 * have is that the claims agree. "Seven of eleven rooms plastered" on the home
 * page, the seven `plastered`-or-later rooms on /rooms, the build log's own
 * entry, and the "7 of 11" in email 04 are one computation, not four copies of
 * a sentence — and the first capture caught them disagreeing, because Osprey
 * was a stage ahead of the log that was supposed to describe it. `derive()` at the bottom is where that happens; a
 * component that wants a total calls it rather than counting.
 *
 * The fiction: Marram, an eleven-room house on the Dyfi estuary in Gwynedd,
 * opening May 2027. Nothing is bookable. Nothing claims to be.
 */

export type Stage = "shell" | "roofed" | "plastered" | "fitted" | "furnished";

/** Ordered worst → best; a room at index >= plastered counts as plastered. */
export const STAGES: readonly Stage[] = [
  "shell",
  "roofed",
  "plastered",
  "fitted",
  "furnished",
] as const;

export const STAGE_LABEL: Record<Stage, string> = {
  shell: "Shell",
  roofed: "Roofed",
  plastered: "Plastered",
  fitted: "Fitted",
  furnished: "Furnished",
};

export interface Room {
  /** 01–11, and the number stamped on the brass tag. */
  number: string;
  name: string;
  /** Which part of the building, in the house's own words. */
  where: string;
  /** Compass aspect — what you see from the window. */
  aspect: string;
  /** Floor area in square metres. Real rooms are not all the same size. */
  area: number;
  beds: string;
  /** How many people it sleeps. Explicit, because counting words in `beds`
   *  produced 11 for a house that sleeps 25 — and a figure nobody can check by
   *  hand is the fake precision this theme exists to refuse. */
  sleeps: number;
  stage: Stage;
  /** Which release wave the room goes into. Wave 3 is "not yet decided". */
  wave: 1 | 2 | 3;
  /** Materials, by token key — the board is where these resolve. */
  materials: MaterialKey[];
  note: string;
}

export type MaterialKey = "slate" | "oak" | "wool" | "plaster" | "brass";

export interface Material {
  key: MaterialKey;
  name: string;
  /** The sample code the joiner and the site office both use. */
  code: string;
  /** The theme token this material *is*. The swatch and the plate agree. */
  token: string;
  source: string;
  note: string;
}

export const MATERIALS: readonly Material[] = [
  {
    key: "slate",
    name: "Riven slate",
    code: "DS-04",
    token: "--material-slate",
    source: "Ffestiniog, 34 miles",
    note: "Roof and the four window sills that take weather.",
  },
  {
    key: "oak",
    name: "Oiled oak",
    code: "OO-12",
    token: "--material-oak",
    source: "Powys, air-dried four years",
    note: "Floors throughout, and the long table.",
  },
  {
    key: "wool",
    name: "Oatmeal wool",
    code: "OW-07",
    token: "--material-wool",
    source: "Trefriw mill",
    note: "Blankets and the stair runner. Undyed.",
  },
  {
    key: "plaster",
    name: "Lime plaster",
    code: "LP-01",
    token: "--material-plaster",
    source: "Mixed on site",
    note: "Every wall. It moves with the building instead of cracking.",
  },
  {
    key: "brass",
    name: "Polished brass",
    code: "BP-09",
    token: "--material-brass",
    source: "Birmingham, unlacquered",
    note: "Handles, hooks, and the eleven room tags.",
  },
] as const;

export const ROOMS: readonly Room[] = [
  {
    number: "01",
    name: "Cocklers",
    where: "Ground, east end",
    aspect: "East, over the saltings",
    area: 19,
    beds: "One double",
    sleeps: 2,
    stage: "furnished",
    wave: 1,
    materials: ["oak", "plaster", "brass"],
    note: "The first room finished, because it is the one the plasterer wanted to practise on.",
  },
  {
    number: "02",
    name: "Ferryman",
    where: "Ground, east end",
    aspect: "East, over the saltings",
    area: 17,
    beds: "One double",
    sleeps: 2,
    stage: "furnished",
    wave: 1,
    materials: ["oak", "plaster", "wool"],
    note: "Step-free from the yard door. The only ground-floor room that is.",
  },
  {
    number: "03",
    name: "Saltings",
    where: "Ground, north",
    aspect: "North, into the hill",
    area: 15,
    beds: "One double",
    sleeps: 2,
    stage: "fitted",
    wave: 2,
    materials: ["oak", "plaster"],
    note: "Darkest room in the house. We are not going to pretend otherwise.",
  },
  {
    number: "04",
    name: "East gable",
    where: "First floor, east",
    aspect: "East and south, two windows",
    area: 24,
    beds: "One double, one single",
    sleeps: 3,
    stage: "furnished",
    wave: 1,
    materials: ["oak", "plaster", "wool", "brass"],
    note: "The room the photographs keep being taken in.",
  },
  {
    number: "05",
    name: "Marram",
    where: "First floor, south",
    aspect: "South, the dune and the channel",
    area: 21,
    beds: "One double",
    sleeps: 2,
    stage: "plastered",
    wave: 2,
    materials: ["plaster", "slate"],
    note: "Named before the house was, and the house was named after it.",
  },
  {
    number: "06",
    name: "Bar",
    where: "First floor, south",
    aspect: "South, the channel",
    area: 20,
    beds: "One double",
    sleeps: 2,
    stage: "plastered",
    wave: 2,
    materials: ["plaster", "oak"],
    note: "A sandbar, not a drinks bar. People ask.",
  },
  {
    number: "07",
    name: "Osprey",
    where: "First floor, west",
    aspect: "West, the estuary mouth",
    area: 22,
    beds: "One double",
    sleeps: 2,
    stage: "roofed",
    wave: 2,
    materials: ["plaster", "oak", "wool"],
    note: "Best light in the building between six and eight in the evening.",
  },
  {
    number: "08",
    name: "Wick",
    where: "First floor, north",
    aspect: "North, into the hill",
    area: 16,
    beds: "One double",
    sleeps: 2,
    stage: "fitted",
    wave: 2,
    materials: ["plaster", "oak", "brass"],
    note: "Small, and priced as such when there is a price.",
  },
  {
    number: "09",
    name: "Kiln",
    where: "Second floor, east",
    aspect: "East, roof height",
    area: 18,
    beds: "One double",
    sleeps: 2,
    stage: "roofed",
    wave: 3,
    materials: ["slate", "oak"],
    note: "Under the slates. Warm in August, and we are working on that.",
  },
  {
    number: "10",
    name: "Netloft",
    where: "Second floor, west",
    aspect: "West, roof height",
    area: 18,
    beds: "Two singles",
    sleeps: 2,
    stage: "roofed",
    wave: 3,
    materials: ["slate", "oak"],
    note: "Low door. Six foot two is the practical ceiling.",
  },
  {
    number: "11",
    name: "Long room",
    where: "Second floor, across",
    aspect: "South and west",
    area: 31,
    beds: "One double, two singles",
    sleeps: 4,
    stage: "shell",
    wave: 3,
    materials: ["slate"],
    note: "Still a shell, and the last thing we will finish.",
  },
] as const;

export interface Update {
  /** ISO date — the components format it, never the fixture. */
  date: string;
  title: string;
  body: string;
  /** Which of the five plates, if any, this update is illustrated by. */
  plate?: "estuary" | "materials" | "room" | "marram" | "slate" | "table";
}

export const UPDATES: readonly Update[] = [
  {
    date: "2026-08-12",
    title: "The slate landed",
    body: "Eleven tonnes from Ffestiniog, stacked in the yard for a fortnight while the roofers finish the west pitch. It is a colder grey than the sample, which we prefer and did not plan.",
    plate: "slate",
  },
  {
    date: "2026-07-30",
    title: "Seven rooms plastered",
    body: "Lime, three coats, and each one needs a week between them, which is why this took the whole summer and why the last four are next spring's problem.",
    plate: "room",
  },
  {
    date: "2026-06-18",
    title: "The kitchen is commissioned",
    body: "Signed with a workshop in Machynlleth. Oak, and one long run rather than an island, because the room is eleven feet wide and an island would be a wall.",
    plate: "table",
  },
  {
    date: "2026-05-02",
    title: "We had the survey back on the dune",
    body: "The marram is holding and the channel has moved nine metres east since the 2019 chart. Neither is a problem for the building. Both change the walk to the water.",
    plate: "marram",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQ: readonly Faq[] = [
  {
    q: "Can I book a room?",
    a: "No. Nothing is bookable and there is no deposit to pay. The list is a list; when the first wave opens in February, everyone on it gets forty-eight hours before the public.",
  },
  {
    q: "What does joining cost?",
    a: "Nothing, and it never will. We are not selling a membership and there is no tier above the one you are on.",
  },
  {
    q: "How often will you write?",
    a: "Roughly monthly, and only when something has actually happened. Four emails have gone out in the last twelve months.",
  },
  {
    q: "Is the house accessible?",
    a: "Partly, and honestly: Ferryman is step-free from the yard door and has a level shower. The other ten rooms are up at least one flight, and the second floor has a low door. The lift we would need does not fit the stair core.",
  },
  {
    q: "Where exactly is it?",
    a: "Above the Dyfi estuary in Gwynedd, four miles of tidal sand from the door. The nearest station is Penhelyg; we will publish the walk when there is something to walk to.",
  },
  {
    q: "What happens to my address?",
    a: "It sits in one list, used to send the five emails described on this site, and nothing else. No advertising, no sharing, no analytics profile. Unsubscribing removes the row.",
  },
];

/** The house, and the numbers about it that are not per-room. */
export const HOUSE = {
  name: "Marram",
  where: "Dyfi estuary, Gwynedd",
  station: "Penhelyg",
  opens: "May 2027",
  opensShort: "May 2027",
  /** Standing on the list. One number, quoted in the hero and in email 02. */
  listCount: 1204,
  /** Invitations sent for the first season, across two waves. More than the
   *  house sleeps, because they are spread over dates — the earlier
   *  "40 beds" contradicted the 25 the eleven rooms actually sleep. */
  firstSeasonInvites: 40,
  waves: [
    { wave: 1 as const, when: "February", what: "Everyone on the list, forty-eight hours early." },
    { wave: 2 as const, when: "April", what: "The remaining rooms, list first, then public." },
    { wave: 3 as const, when: "Not yet", what: "The second floor, when it is finished." },
  ],
  /* Bare figures. The label belongs to the caption that uses them —
   * carrying units in the value produced "4.1m springs spring range". */
  tideRange: "4.1m",
  walkToWater: "600m",
} as const;

/* ── derived, never typed twice ─────────────────────────────────────────── */

const stageIndex = (s: Stage) => STAGES.indexOf(s);

export function derive() {
  const total = ROOMS.length;
  const plastered = ROOMS.filter(
    (r) => stageIndex(r.stage) >= stageIndex("plastered"),
  ).length;
  const furnished = ROOMS.filter((r) => r.stage === "furnished").length;
  const spokenFor = ROOMS.filter((r) => r.wave === 1).length;
  const sleeps = ROOMS.reduce((n, r) => n + r.sleeps, 0);
  return {
    total,
    plastered,
    furnished,
    spokenFor,
    sleeps,
    /** "7 of 11" — the string the home page, /rooms and email 04 all use. */
    plasteredOf: `${plastered} of ${total}`,
    latestUpdate: UPDATES[0],
  };
}

/** Rooms at or past a stage, for the build log and the room index. */
export function roomsAtLeast(stage: Stage): Room[] {
  return ROOMS.filter((r) => stageIndex(r.stage) >= stageIndex(stage));
}

export function materialFor(key: MaterialKey): Material {
  const found = MATERIALS.find((m) => m.key === key);
  // Build-time throw, deliberately: a room that names a material the board does
  // not carry is a fixture bug, and the alternative is a silently missing
  // swatch that nobody notices until a buyer opens the zip.
  if (!found) throw new Error(`tideline: no material "${key}" on the board`);
  return found;
}

/** 2026-08-12 → "12 Aug 2026". One formatter, no per-component Date logic. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
  return `${d} ${months[m - 1]} ${y}`;
}
