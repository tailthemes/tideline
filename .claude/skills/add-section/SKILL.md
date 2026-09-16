---
name: add-section
description: Add a Tideline section in React and HTML, keep its facts on the fixture spine, and register a literal styleguide frame plus the manifest rows.
---

# Add a section to Tideline

Read `AGENTS.md` first. In the marketplace repository, a visible change also
runs `.claude/skills/design-pass/SKILL.md` through Phases 0–3 before markup.
Run the colour pass first if the section changes a token, surface, state colour
or mode, and run the content pass for every string.

File paths below are relative to the Tideline project root. Run the repository
gate commands from the marketplace root.

## 1. Name the block's job

Write one sentence stating what question the section answers and why an
existing section cannot answer it. Tideline separates major bands with a
hairline and changes density before it reaches for a card or shadow.

The shipped React pattern is:

- one named export in `src/components/<name>.tsx`
- a semantic `<section aria-labelledby={headingId}>`
- `Container`, `Eyebrow`, `DISPLAY`, `MONO`, `TEXT` and `TNUM` from
  `src/components/ui/` rather than new utility vocabularies
- `Reveal` around content below the fold, with at most 240ms total stagger
- `border-t border-hairline py-20 sm:py-28` for a standard band
- a `headingId` prop when the section can appear more than once
- `level?: 1 | 2` when the section can open a route; `room-index.tsx`,
  `updates-feed.tsx`, `email-sequence.tsx` and `waves-table.tsx` are the models

`hero.tsx` and `join-seam.tsx` already compose `JoinForm`. That is the only
existing section-to-section seam. Do not create another; shared presentation
belongs in `src/components/ui/`, and shared facts belong in the fixture.

```tsx
import { SOMETHING } from "../fixtures/marram";
import { Container, Eyebrow } from "./ui/primitives";
import { Reveal } from "./ui/reveal";
import { DISPLAY, TEXT } from "./ui/type";

export function MySection({ headingId = "my-section" }: { headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className="border-t border-hairline py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow>The kicker</Eyebrow>
          <h2 id={headingId} className={`mt-5 text-balance ${DISPLAY} ${TEXT.d2} text-foreground`}>
            The heading
          </h2>
        </Reveal>
      </Container>
    </section>
  );
}
```

## 2. Keep Tideline's invariants

1. Figures come from `src/fixtures/marram.ts`. If the HTML edition needs the
   fact, update `html/src/data/marram.json` in the same change; no generator on
   disk performs that projection.
2. Components use semantic colour utilities and the type constants. No raw
   colour, Tailwind palette class or bare text-size utility.
3. Light-mode rules, marks, links and small labels use `--primary-ink`, not
   `--primary`. The latter measures 1.88:1 on the cream ground.
4. Text on a photograph uses `--plate-ink`, `--plate-ink-muted` or
   `--plate-ink-brass`, which do not invert.
5. The resting frame is complete. New motion must stop under reduced motion and
   may not hide content when JavaScript or `IntersectionObserver` is absent.
6. UI icons come from `lucide-react`; add any new package to `theme.json`
   `dependencies` before using it.

## 3. Register the React section

All three edits are required:

1. Import and render it in `src/app/<route>.tsx`.
2. Add a literal frame in `src/app/components.tsx`:

   ```tsx
   <section data-component="my-section">
     <SectionLabel name="my-section" />
     <MySection headingId="spec-my-section" />
   </section>
   ```

   The attribute must be written at the call site. The inventory check scans
   source and cannot see an attribute assembled from a prop.
3. Add one `theme.json` `components` row with the real file and a `renders`
   sentence, then add the component name to every affected page's `sections`
   array in render order.
4. Bump the manifest patch version. Published `slug@version` artifacts are
   immutable, so a changed section cannot reuse the shipped version.

Do not add helpers, fixture modules or vendored `_tt/` files as manifest rows.

## 4. Author the HTML twin

Tideline's HTML edition is independent source. Add either a reusable include at
`html/src/components/<name>.html` or route-local markup in
`html/src/pages/<route>.html`, matching the route's real composition. Use the
same semantic tokens and data keys, but do not copy JSX or interaction code.

If the section is interactive, put theme behavior in a named module under
`html/src/js/`. Mount a vendored `_tt/` module when the library owns the
behavior; never reimplement or edit it. Add a literal `data-component` frame to
`html/src/pages/components.html` when the HTML styleguide presents the section.

Rebuild with:

```sh
bun run build-html tideline
```

In the downloaded project, the command is `bun run build:html`.

## 5. Verify

From the marketplace repository, run the canonical gate:

```sh
bun run verify-theme tideline
```

For a quick manifest-only diagnosis before the full gate:

```sh
bunx tsc --noEmit
bun lib/pipeline/check.ts
```

In a downloaded project, run `bunx tsc --noEmit`, `bun run build` and
`bun run build:html`, then follow `check-quality` for the manual both-mode and
interaction checks.
