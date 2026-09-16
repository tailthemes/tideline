---
name: add-page
description: Add a Tideline route with a distinct opener, one h1, matching React and HTML pages, truthful manifest wiring, and styleguide coverage for any new section.
---

# Add a page to Tideline

Read `AGENTS.md` first. In the marketplace repository, run the design pass
through Phases 0–3 before a visible route change and run the content pass on the
new page copy.

File paths below are relative to the Tideline project root. Run the repository
gate commands from the marketplace root.

## 1. Pick a new opening instrument

The six routes deliberately start differently:

| Route | Opening instrument | React file |
|---|---|---|
| `/` | layered landscape photograph | `src/app/home.tsx` |
| `/rooms` | cut-out brass room tag | `src/app/rooms.tsx` |
| `/the-build` | dated log | `src/app/the-build.tsx` |
| `/emails` | email card sequence | `src/app/emails.tsx` |
| `/list` | waves table | `src/app/list.tsx` |
| `/components` | token panel | `src/app/components.tsx` |

A seventh route needs a seventh instrument. If its best opener is a generic
heading band, fold the content into an existing route unless the page has a
specific job that cannot fit there.

Reuse an existing section when it can carry the page's h1. If no section fits,
run `add-section` first and return here.

## 2. Compose the React page

Create `src/app/<name>.tsx` as a plain default-exported component. Page files
compose sections and do not fetch data. Interactive state stays inside the
section that owns it.

```tsx
import { JoinSeam } from "../components/join-seam";
import { MyOpener } from "../components/my-opener";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export default function MyRoutePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <SiteHeader current="/my-route" />
      <main id="main" tabIndex={-1} className="pt-32 focus:outline-none sm:pt-40">
        <MyOpener level={1} headingId="my-route-title" />
        <JoinSeam />
      </main>
      <SiteFooter />
    </div>
  );
}
```

The shell above matches `/rooms`, `/the-build` and `/emails`. `/` needs no top
padding because the header overlays the hero. `/list` also leaves padding off
`<main>` because `WavesTable` owns `pt-32 sm:pt-40`. Decide the padding from the
opening section rather than applying both.

If the new route opens on a dark full-bleed plate, pass `onPlate` to
`SiteHeader`; its default only treats `/` that way.

Exactly one h1 belongs to the opener. A reusable opener takes `level?: 1 | 2`,
uses level 1 on the route and level 2 in `src/app/components.tsx`.

## 3. Wire the React route

1. Add `{ path, title, sections }` to `theme.json` `pages`. List sections in
   render order, including `site-header` and `site-footer`.
2. Add the route to `NAV` in `src/components/site-header.tsx` only if it belongs
   in primary navigation. Four items ship today; five is the practical ceiling
   before the 768px header needs new measurement.
3. Add it to `src/components/site-footer.tsx` if it belongs in the footer
   instead.
4. In the marketplace repository, import the page and add its path key under
   `tideline` in `lib/preview-registry.tsx`. `/my-route` maps to
   `"my-route"`; `/` maps to `"home"`.
5. Bump the manifest patch version. Published `slug@version` artifacts are
   immutable, so a changed page cannot reuse the shipped version.

Every href resolves. Do not add a `#` stub or a self-link.

## 4. Author the HTML route

The HTML edition owes the same route, authored independently:

1. Add a route object to `html/html.json` with `template`, `output`, `path`,
   `title`, `description` and any real `onPlate` or `mainClass` setting.
2. Create `html/src/pages/<name>.html`, extend `layouts/base.html`, and render
   exactly one h1. Use existing includes from `html/src/components/` where they
   fit.
3. Add the route to the `navItems` array in
   `html/src/components/site-header.html` when it is in the React primary nav.
4. Prefix local paths with `{{ root }}` so nested pages still work from
   `file://`.
5. Run `bun run build-html tideline` in the repository, or
   `bun run build:html` in the downloaded project.

`html/dist/` is generated output. Never edit it directly.

## 5. Keep the styleguide and manifest honest

A page composed only from existing sections adds no new component frame. A new
opener or section must first complete `add-section`: one `theme.json`
`components` row and one literal `data-component` frame in
`src/app/components.tsx`, plus the HTML specimen when that edition exposes it.

If the page adds a dependency, declare it in `theme.json` before importing it.

## 6. Verify

From the marketplace repository:

```sh
bun run verify-theme tideline
```

For the scoped type and manifest checks:

```sh
bunx tsc --noEmit
bun lib/pipeline/check.ts
```

In a downloaded project, run `bunx tsc --noEmit`, `bun run build` and
`bun run build:html`, then follow the manual checks in `check-quality`.
