# tideline — the imagery

Twenty-three plates. All of them are **generated, not stock** — produced with
`bun run generate-image` (Gemini), which means they are ours to license onward
and the zip runs offline with no hotlinked URL in it. They are also
**regenerable**: the prompt is the source, the file is the build artifact.

The art direction that makes twenty-three images read as one commissioned set is in
`ops/design/art/shoot-tideline-2026-08-28.md`. One register (photographic), one
light direction (left, soft-raking overcast), one colour story, three crops.
The verification is not the prompt — it is opening the set side by side at 1280
and checking the shadows agree.

## The shared stem

Appended to every prompt below, verbatim:

> medium-format photograph, 55mm, overcast coastal daylight raking from the
> left, fine film grain, deep near-black shadows in the #0d0f0e family, warm
> brass highlights around #c9a227, cold slate greys, muted and desaturated,
> nothing vivid

Plus the CLI's standing rules, which it appends itself: no text, letters,
numbers, watermarks, logos or UI chrome; no recognisable real people and no
real brands.

## The plates

| File | Crop | Prompt subject |
|---|---|---|
| `tl-hero.jpg` | 2400×1030, 21:9 | A wide tidal estuary at dusk from a low headland, tide far out, wet mudflats and winding channels catching the last warm brass light, dark marram-grass dune in the near foreground left, a low long stone building silhouetted small on the right third of the horizon, calm empty sky across the upper half for text |
| `tl-materials.jpg` | 1600×1067, 3:2 | An architect's material sample board photographed flat from directly overhead against dark slate: riven Welsh slate, a plank of oiled oak, a folded panel of oatmeal wool, a swatch of chalky lime plaster, a small polished brass plate, in a loose grid with generous dark space between them, each casting a soft shadow to the right |
| `tl-room.jpg` | 1600×1067, 3:2 | The interior of an unfinished room in a coastal house, bare chalky lime-plastered walls still drying, a tall deep-set window on the left throwing a hard pale rectangle of estuary light across a raw oak floor, a wooden step-ladder folded against the right wall, no furniture, dust in the air |
| `tl-marram.jpg` | 1200×1200, 1:1 | Macro texture of dry marram grass on a coastal dune, fine pale stems in the #b9a878 family bending left in wind, shallow depth of field, dark sand shadow behind, seamless and even across the frame |
| `tl-slate.jpg` | 1600×1067, 3:2 | A tall stack of riven Welsh roofing slate resting on wooden bearers in a wet builder's yard beside a stone wall, the top slates catching a cold gleam of low sun, a coil of rope and a folded tarpaulin at the edge of frame, dark wet ground, no people |
| `tl-table.jpg` | 1600×1067, 3:2 | A long oiled-oak table under a deep-set window in a bare lime-plastered room, eleven feet of unbroken top, one wooden chair, morning estuary light falling across the grain from the left, nothing laid on the table, no people |
| `tl-key.png` | 1200×1200, 1:1 | A single aged solid-brass hotel room tag on a short leather fob with one iron key, lying flat and fully inside the frame, photographed from directly overhead, **flat pure chroma green #00b140 seamless background**, hard clean edge separation, even soft studio light, no shadow on the background |

## The cut-out, and why it is keyed rather than asked for

`tl-key.png` and `tl-layer-dune.png` are the two transparent assets. The model
cannot produce a genuine alpha channel however nicely you ask, so both were
generated on flat chroma green and keyed afterwards.

The key is not `magick -fuzz N -transparent green`. A hard threshold leaves a
hard matte edge and, worse, leaves green **spill** on the subject — and brass
picks up a lot of green. The pass that ships does two things:

1. **Alpha ramps on greenness**, `g − max(r, b)`, fully transparent above 0.18
   and fully opaque below 0.02, linear between. That gives a soft matte instead
   of a cut edge.
2. **Despill**: any pixel whose green exceeds the mean of its red and blue has
   its green pulled back to that mean. This is what stops the brass reading
   faintly lime against a near-black ground.

**The contact shadow is CSS** (`--shadow-cutout`), not baked into the file.
That is what lets the same PNG sit correctly on the near-black ground and on
the cream one. Flattening this file onto a background — "optimising" it —
breaks light mode.

## Rules that bind anything added here

- Text over any plate clears AA **against the actual pixels**, not against an
  assumed ground. The hero's scrim was measured at the plate's darkest, mean
  and brightest points: 17.11 / 15.12 / 8.98:1 for `#f4efe4`.
- Every `<img>` carries real `alt`. `alt=""` plus `aria-hidden` is only correct
  for a plate that says nothing; none of the informative plates qualify.
- **The plates stay dark in both modes.** See AGENTS.md §The one sanctioned
  deviation — the page inverts, the window does not.
- The registry payload substitutes a token-coloured stand-in for every
  photograph at the real intrinsic size (ADR-011), so `bun run check-registry
  tideline` is the gate that proves an imagery change, not `bun run check`.

## The number on the tag is not in the tag

`tl-key.png` ships blank. The room number over it on `/rooms` and `/` is HTML —
`--font-mono` at `--text-d2`, `mix-blend-multiply` so it sinks into the brass
like an engraving. Baking it in would have meant eleven files instead of one, a
number no screen reader can read, and a number a buyer cannot rebrand. The
standing rule against generated typography is not only about the letterforms
being wrong; it is about what a picture of a word cannot do.

## Added 2026-08-28, after the first render review

`tl-slate.jpg` and `tl-table.jpg` were generated because the first full-page
capture put the **materials board on the home page twice** — once as the
signature and once illustrating the "slate landed" entry in the build log. Two
appearances of one photograph reads as a page that ran out of pictures. Each
log entry now has its own plate, and the kitchen entry gained one instead of
running as text alone.

## The second shoot, 2026-08-28 (owner: more imagery, and make it move)

Sixteen more plates, same stem, same light direction, verified as one set on a
contact sheet rather than one at a time — sixteen is past the number anybody
checks by eye.

**The parallax pair is the interesting one.** `tl-layer-sky.jpg` is the estuary
generated with **no foreground at all**; `tl-layer-dune.png` is the foreground
alone, generated on flat chroma green and keyed with the same ramp-and-despill
pass as the brass tag. Two real planes travelling at different rates is what
produces depth. Scaling one photograph produces a photograph that scales, which
is what most marketing "parallax" actually is — and it is why this cost two
generations instead of a transform. Grass is also the worst possible subject for
a hard chroma threshold (thousands of thin stems, every one of them picking up
green), so the soft matte is doing real work here.

| File | Crop | Role |
|---|---|---|
| `tl-layer-sky.jpg` | 2400×1030 | hero plane 1 — the estuary, no foreground |
| `tl-layer-dune.png` | 2400×1030 | hero plane 3 — keyed dune foreground |
| `tl-land-tide.jpg` | 2400×1030 | land gallery — the incoming tide |
| `tl-land-sand.jpg` | 2400×1030 | land gallery — ribbed sand at low water |
| `tl-land-marsh.jpg` | 2400×1030 | land gallery — the saltings from above |
| `tl-land-night.jpg` | 2400×1030 | land gallery — the house after dark |
| `tl-room-window.jpg` | 1600×1067 | room states — plastered |
| `tl-room-stair.jpg` | 1600×1067 | room states — shell |
| `tl-room-kitchen.jpg` | 1600×1067 | room states — fitted |
| `tl-room-bed.jpg` | 1600×1067 | room states — furnished |
| `tl-detail-slate.jpg` | 1000×1000 | material rail |
| `tl-detail-oak.jpg` | 1000×1000 | material rail |
| `tl-detail-wool.jpg` | 1000×1000 | material rail |
| `tl-detail-plaster.jpg` | 1000×1000 | material rail |
| `tl-detail-brass.jpg` | 1000×1000 | material rail |
| `tl-detail-key.jpg` | 1000×1000 | material rail — the empty hooks |

**Type over any of these is measured, not assumed.** The land gallery runs from
a night shot to bright wet sand; the first scrim it was given measured **1.1:1**
behind the caption over the sand. The scrim is now solid through the caption
zone and released above it, which puts every caption at **15.8:1** for
`--plate-ink` and **9.8:1** for the brass against the brightest pixel behind it.
One gradient across four plates of that range only works if somebody measures.
