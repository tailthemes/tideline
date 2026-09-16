# Tideline — HTML edition

Framework-free. `dist/` opens from `file://` with no server, no build step and
no module loader. `src/` is Nunjucks source if you want to rebuild it:

```sh
bun run build-html tideline
```

This edition is **independently authored**. It is not a render of the React
edition, not a static export, and not hydration-stripped output. What the two
share is what ADR-012 says they share: token values, fonts, generated imagery,
and the canonical facts. They share no markup and no interaction code.

`src/data/marram.json` is the checked-in projection of the React edition's
`src/fixtures/marram.ts`. No generator for that projection ships on disk, so a
fact change must update both files in the same change and compare the compiled
pages. `build-html` reads the JSON; it does not rewrite it.

## What ships

```
html/
  html.json                 routes, titles, descriptions, asset copies
  src/
    layouts/base.html       the document, the skip link, the pre-paint mode script
    pages/*.html            one per route
    components/*.html       the partials a page includes
    css/theme.css           the Tailwind bridge + @font-face; decides nothing
    data/marram.json        checked-in projection of the React fixture
    js/
      _tt/                  vendored library modules — never edited
      main.js               entry: mode toggle, and what to mount
      join-form.js          the theme's own module
      land-gallery.js       the theme's own gallery state machine
      reveal.js             the theme's own module
  dist/                     compiled output; this is what a buyer opens
```

## The boundary ledger

Every floor component and every §4 behaviour, in three columns. A *dropped* row
is a declared reduction of the buyer's product and owes a reason; a floor row in
no column is an omission and blocks publish.

### Components

| Row | Column | Note |
|---|---|---|
| button (all states) | **preserved** | Same states, same tokens, authored markup. |
| form field: validation, error, success, submitting | **preserved** | `_tt/field.js`'s `mountField` writes `aria-invalid` and composes `aria-describedby`, exactly as the React shell does. The submitting state and the durable success panel are `js/join-form.js`, the theme's own. |
| nav + mobile nav | **changed** | The mobile nav is a native `<details>` in both editions, but neither bare element closes on Escape or returns focus. |
| accordion | **changed** | React uses the library disclosure for the FAQ. HTML uses bare `<details>` with the same markers and tokens, so Enter and Space work but Escape does not. |
| newsletter / contact | **preserved** | It is the join form; this whole site is that form. |
| pricing toggle | **dropped** | There is no price. The house does not open for a year, nothing is bookable, and a pricing table would be the site's first lie. The waves table on `/list` does the same job — what you get and when — with no number on it. |
| testimonial | **dropped** | There are no guests yet. A pre-opening hotel quoting a delighted visitor is the fabricated-social-proof tell the quality bar exists to reject. The build log does that job honestly. |

### Behaviours (§4)

| Behaviour | Column | Source |
|---|---|---|
| Opens on click and on Enter/Space | **preserved** | Native `<details>` / `<summary>` and native `<button>`. |
| Escape closes | **dropped** | The vendored `_tt/accordion-disclosure.js` exists but is not mounted over the HTML FAQ or mobile nav. Native `<details>` does not close on Escape. |
| Focus trapped and returned | **n/a** | Nothing in this theme is a modal layer, in either edition. There is no overlay to trap into. |
| Scroll locked under a modal, and only there | **n/a** | Same reason. Locking scroll under a non-modal is the defect the contract names, so nothing locks. |
| `aria-expanded` on a non-native trigger | **preserved** | No non-native trigger exists; the expanded state is implicit on `<summary>`. |
| Reduced-motion variant | **preserved** | `js/reveal.js` does not arm at all when the preference is set, and the resting style is the finished state. Script blocked or module failed: the complete page. |
| Never colour alone for state | **preserved** | The invalid field steps its border **and** its message line; wave-one room chips carry a border and a stated caption, not a tint. |

### The scroll-driven media (added 2026-08-28)

| Row | Column | Note |
|---|---|---|
| Three-plane parallax hero | **preserved** | Pure CSS. The keyframes and `animation-timeline` rules live in the shared `src/theme.css`, so both editions run the identical motion off the identical tokens — this edition only had to author the three `<img>` planes. |
| Land gallery | **preserved** | `js/land-gallery.js`, this edition's own module. Same three routes to one piece of state: scroll, dot click, keyboard. Nothing autoplays, so no pause control is owed. Slide one is served active, so with no JavaScript the section is a full-bleed photograph with a caption and four inert dots. |
| Material rail | **preserved** | Pure CSS. `overflow-x-auto` on the track in both editions, so the far end is reachable whether or not the animation runs. |
| Plate settle | **preserved** | Pure CSS, shared keyframe. |

One defect the port produced and driving it caught: every plate now carries
`data-alt`, not just the one served active. Without it the second slide onward
became active with an **empty alternative** — the React edition re-renders the
attribute and never had the bug, which is exactly the kind of thing an
independently authored edition has to be tested for rather than assumed into.

### Deliberately changed

| Thing | React | HTML | Why |
|---|---|---|---|
| Mode control | Two buttons, `Dark` \| `Light`, with `aria-pressed` | One button, "Switch to light" / "Switch to dark" | The two-button group exists because a single button reading "dark" is ambiguous about whether it names the current state or the destination. This edition resolves the same ambiguity by naming the destination in words, which needs no second control to compare against — and both labels sit in the document with CSS choosing one, so it is never briefly wrong on a slow load and the swap costs no script. |
| Reveal wiring | `Reveal` component, one observer per element | One observer over `[data-tl-reveal]` | Same one-shot semantics and the same guarantee that the resting style is the finished state. A per-element observer buys nothing without a component boundary to hang it on. |

## The things that will bite you

- **`src/css/theme.css` decides nothing.** Every value is imported from
  `../../../src/theme.css`. Change a colour there and both editions move.
- **Dark is the default**, which is the opposite of the rest of the catalog.
  The bare `<html>` carries no mode class and the pre-paint script *adds*
  `light`. A dark-first theme that toggles `dark` repaints nothing.
- **The plates do not invert.** Type over a photograph uses `--plate-ink`,
  `--plate-ink-muted`, `--plate-ink-brass` — identical in both token blocks on
  purpose. `--foreground` over the estuary is a near-black headline on a dusk
  photograph in light mode.
- **`js/_tt/` is the library's.** Provenance-headed and hash-locked; a local
  edit is a publish blocker. `bun run ui sync tideline` re-vendors it.
