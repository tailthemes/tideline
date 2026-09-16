import localFont from "next/font/local";

/**
 * Three roles, three families, no collision with any shipped theme
 * (ops/design/catalog-dna.md, checked 2026-08-28 against all 14 manifests).
 *
 * Spectral is the display voice. A pre-launch site has no product to show, so
 * the headline is doing the work a photograph of the finished building would
 * do, and it is set very large — 5rem at d4. Spectral holds at that size
 * without the thin-stroke collapse that the obvious "luxury hotel" pairings
 * (Cormorant, Playfair) fall into, and it ships a genuine italic, which the
 * hero's one italic phrase needs.
 *
 * **One weight, and the reason is a gate.** This shipped four faces at first —
 * 300 for the dark ground, 400 for light, 600 unused, plus a light italic — and
 * the screenshot gate failed: `document.fonts.check` asks at weight 400 by
 * default, 400 was demanded by nothing in dark mode, and an undemanded face is
 * an unloaded face. The gate was right to fail. Four files where two are used
 * is bytes the buyer pays for, and a weight step between modes is not worth
 * either. The dark-mode compensation composition-pass asks for is carried by
 * **tracking** instead (`theme.css`, +0.004em in dark), which is the same
 * answer covers reached for the same reason.
 *
 * Manrope is the text voice. Chosen against the catalog's shipped text faces
 * (Inter Tight, Schibsted, Karla, Archivo, Golos, Work Sans, Public Sans, IBM
 * Plex Sans, Source Sans, Instrument Sans, Geist) — none of which it repeats —
 * and because its slightly geometric humanist shapes stay legible in the 13px
 * grey register this theme uses for almost all body copy on a near-black
 * ground, where a more delicate humanist blurs.
 *
 * Martian Mono is the machine register: dates, room numbers, waitlist
 * standing, material codes, and every letterspaced eyebrow. It is deliberately
 * wide — at 10px with 0.2em tracking that width is the point, and it avoids
 * the catalog's mono pile-up (IBM Plex Mono x3, Spline Sans Mono x2, Red Hat
 * Mono x2, JetBrains Mono x2, DM Mono, Courier Prime, Geist Mono).
 *
 * All three are OFL; the verbatim licences ship beside the woff2 files. Latin
 * subset only. `next/font/google` is forbidden in themes (CONTRACT §Typeface)
 * because a build-time fetch breaks the offline-zip guarantee.
 */
export const spectral = localFont({
  src: [
    { path: "./fonts/Spectral-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Spectral-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-tideline-display",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const manrope = localFont({
  src: [{ path: "./fonts/Manrope-Variable.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-tideline-text",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const martianMono = localFont({
  src: [{ path: "./fonts/MartianMono-Variable.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-tideline-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Courier New", "monospace"],
  adjustFontFallback: false,
});

export const fontClassName = `${spectral.variable} ${manrope.variable} ${martianMono.variable}`;
