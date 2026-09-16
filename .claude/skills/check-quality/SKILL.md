---
name: check-quality
description: Run Tideline's real repository gate, then verify its fixture projection, 25-part styleguide, both modes, reader-driven motion, HTML boundary, and join-form states.
---

# Check Tideline

File paths under inspection are relative to the Tideline project root. Commands
that begin with `themes/tideline/` run from the marketplace root.

## 1. Run the canonical repository gate

From the marketplace repository:

```sh
bun run verify-theme tideline
```

That command is the fail-fast release gate. It runs TypeScript, a production
build, source consistency, screenshots, capture inventory, frame distance,
colour area, palette distance, strict responsive and reduced-motion captures,
the UI behavior contract, a fresh registry install and the standalone package.

To diagnose the non-runtime layer before that full run:

```sh
bunx tsc --noEmit
bun run build-html tideline
bun lib/pipeline/check.ts
```

`bun lib/pipeline/check.ts` is the scoped manifest/source check. It verifies the
page registry, component frames, token keys and values, fonts, dependencies and
the `ui_library.files` inventory without running every repository-wide HTML
gate.

In the downloaded project, `verify-theme` is not a package script. Run:

```sh
bunx tsc --noEmit
bun run build
bun run build:html
```

Then complete the manual checks below.

## 2. Check the inventory

The on-disk totals are:

- 6 React routes and 6 matching HTML routes
- 25 manifest components: 19 sections and 6 `ui/*` primitives
- 86 manifest tokens in light and 86 in dark
- 23 generated image assets
- 3 typeface roles in 4 woff2 files
- 14 `ui_library.files`: 11 React and 3 HTML vendored files

Every non-`ui/*` manifest row needs one literal `data-component` frame in
`src/app/components.tsx`. Every vendored React part needs its required state
panes there. Helpers, fixture files and `_tt/` files are not component rows.

The two adopted library parts have different HTML status:

- `ui/field` is mounted indirectly by `html/src/js/join-form.js`.
- `ui/accordion-disclosure` is vendored but not mounted in HTML. The FAQ and
  mobile nav are bare `<details>` elements and do not close on Escape.

Do not report native `<details>` as supplying Escape. If that behavior changes,
mount the vendored module over the real markup and drive it in both editions.

## 3. Check the fixture and HTML projection

`src/fixtures/marram.ts` is canonical for React and the email renderers.
`html/src/data/marram.json` is a checked-in projection; no generator on disk
updates it.

After a fixture or email change, compare these in both editions:

- list standing and next position
- 7 of 11 rooms plastered
- 3 furnished rooms and 3 wave-one rooms
- 25 people slept and 40 first-season invitations
- opening month, latest update and slate date
- the five materials, eleven rooms and five email entries

A mismatch is a release failure even when TypeScript is green.

## 4. Recompute contrast in both modes

Run the executable ratio table in `rebrand` after any token change. The shipped
knife-edge rules are:

- `--primary` on the light background is 1.88:1, so it is fill only.
- `--primary-ink` is 5.35:1 on the light background and 10.42:1 on the shipped
  dark background.
- primary foreground over primary, hover and active is 7.61:1, 9.12:1 and
  10.83:1 in both modes.
- hero plate ink measured 17.11:1, 15.12:1 and 8.98:1 against the actual darkest,
  mean and brightest sampled pixels.
- land-gallery caption ink is 15.8:1 and its brass ink is 9.8:1 against the
  brightest caption-zone pixel.

Token arithmetic does not prove a photograph. Re-sample every changed plate or
scrim where text overlays it.

## 5. Inspect both modes and four widths

The canonical gate captures all six routes at 375, 768, 1280 and 1920 in light
and dark. Look at the outputs rather than stopping at the exit code.

Check these Tideline-specific failure modes:

1. The light/dark class lands on `.tt-tideline`, not only on an ancestor. The
   scoped default tokens otherwise win and leave mixed-mode bands.
2. Every word over a photograph uses `--plate-ink*`. The images stay dark in
   both modes, so light-mode `--foreground` disappears over them.
3. The 375 and 768 captures show the full mobile header, tables, gallery dots
   and horizontal material rail without page overflow.
4. The desaturated view still communicates active gallery slide, field error,
   wave and stage through text, shape or `aria-current`, not colour alone.
5. Focus is visible on every link, button, summary and input.

## 6. Drive motion and controls

The theme's motion personality is tidal: slow, one-directional and never
self-starting. Verify:

- hero layers move only with page scroll
- gallery tracker scroll, dot click and keyboard activation select the same
  plate
- the material rail remains horizontally reachable when animation is absent
- room plates settle once
- reveal elements play once and never remain hidden with JavaScript off
- reduced motion leaves every element on its finished frame

Drive the join form in React and compiled HTML:

1. Submit empty. The error names what to fix and focus returns to the input.
2. Type a valid address. The error clears while typing.
3. Submit. The label changes to `Joining…` and the controls disable.
4. Confirm the durable success panel replaces the form and receives focus.

The shipped pending control does not emit `aria-busy`; the HTML boundary ledger
records that reduction. Do not describe it as present without changing and
driving both editions.

## 7. Check copy and links

Every href resolves to a route or a real email artifact URL. There are no `#`
stubs. Run the content-pass mechanical checks on changed user-facing strings:

```sh
rg -n "—" themes/tideline/README.md
rg -ni '\b(seamless|powerful|beautiful|stunning|delightful|supercharge|unlock|elevate|empower|effortless|robust|cutting-edge|next-level|game-chang(e|ing)?|revolutioniz(e|ing)?|simply|actually|really|very)\b|just works' themes/tideline/README.md
```

Replace the final path with another changed user-facing file when needed. Read
changed strings aloud, check their surface budgets and remove padding.

## 8. Package-only checks

An imagery change requires the real text-only projection:

```sh
bun run check-registry tideline --fresh
```

The final artifact check is:

```sh
bun run package tideline
```

Open the packaged `html/dist/index.html` from `file://`. Confirm all six local
routes, local fonts, images, the mode control and the bundled classic script
work without a server.
