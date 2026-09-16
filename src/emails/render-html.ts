import { EMAIL_CHROME, type EmailEntry, type PlateKey } from "./sequence";

/**
 * Turn one entry from `sequence.ts` into a document an inbox will actually
 * render. This is the part of the theme that most templates skip, and the
 * reason they skip it is that email HTML is 2003 and does not forgive.
 *
 * The constraints this file is written against, each of which is a real client
 * bug rather than a superstition:
 *
 * - **No Tailwind, no classes, no `<style>` selectors that matter.** Gmail
 *   strips `<head>` styles in some clients and rewrites class names in others.
 *   Everything that must survive is an inline `style` attribute.
 * - **Tables, not flexbox or grid.** Outlook on Windows renders through Word,
 *   which supports neither. Every column here is a `<td>`.
 * - **The tokens are inlined as hex, on purpose.** `var()` does not resolve in
 *   most clients. The values below are copied from `theme.css` and the token
 *   each one came from is named beside it, so a rebrand is a find-and-replace
 *   with a map rather than a guess.
 * - **Dark mode is not `prefers-color-scheme` alone.** Several clients invert
 *   colours themselves; the ones that do respect `color-scheme` are told the
 *   document is already dark so they leave it alone. The result is a dark
 *   email everywhere, which matches the site, rather than a light email that
 *   some clients invert into mud.
 * - **The preheader is a hidden span, not the first paragraph.** Otherwise the
 *   inbox preview repeats the subject line back at the reader.
 *
 * Images come in as a **URL map from the caller**, not as filenames baked in
 * here. Two reasons, and the second is the load-bearing one: an email's images
 * have to be absolutely-addressed on a host the sender controls (no client
 * fetches a relative path out of an inbox), and a filename literal in a `.ts`
 * file breaks the registry projection, which substitutes every photograph with
 * a token-coloured stand-in because a registry item is text-only (ADR-011).
 * A `cid:` build is the other option and is left out because it is
 * sender-specific.
 */

/** Copied from theme.css's dark block — the token name is the comment. */
const C = {
  page: "#0a0c0b", // --surface-sunken
  card: "#0d0f0e", // --background
  panel: "#141816", // --card
  ink: "#ece7dc", // --foreground
  muted: "#9ba39c", // --muted-foreground
  hairline: "#2a302c", // --border
  brass: "#c9a227", // --primary
  brassInk: "#e0bb4a", // --primary-ink
  onBrass: "#17140a", // --primary-foreground
} as const;

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

/**
 * Spectral, Manrope and Martian Mono are not webfont-safe in email — Outlook
 * ignores `@font-face` entirely and falls back mid-document, which is worse
 * than not trying. The emails use the nearest system stacks and say so; the
 * *shape* of the design carries the identity here, not the letterforms.
 */

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function block(
  b: EmailEntry["blocks"][number],
  plates: Partial<Record<PlateKey, string>>,
): string {
  switch (b.kind) {
    case "text":
      return `
          <tr><td style="padding:0 32px 18px;font-family:${SANS};font-size:15px;line-height:1.62;color:${C.ink};">
            ${escape(b.text ?? "")}
          </td></tr>`;
    case "figure":
      return `
          <tr><td style="padding:6px 32px 4px;font-family:${SERIF};font-size:46px;line-height:1;color:${C.brassInk};">
            ${escape(b.figure ?? "")}
          </td></tr>
          <tr><td style="padding:0 32px 20px;font-family:${MONO};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${C.muted};">
            ${escape(b.caption ?? "")}
          </td></tr>`;
    case "plate":
      // width/height on the tag as well as in the style: Outlook reads the
      // attributes, everything else reads the style, and a plate with only one
      // of the two blows the layout out in whichever client reads the other.
      {
        const src = b.plate ? plates[b.plate] : undefined;
        // A plate with no URL is dropped rather than rendered broken: an inbox
        // shows a missing image as a grey box with the alt in it, which is
        // worse than the paragraph that follows it standing alone.
        if (!src) return "";
        return `
          <tr><td style="padding:0 32px 20px;">
            <img src="${src}" width="504" alt="${escape(b.alt ?? "")}"
              style="display:block;width:100%;max-width:504px;height:auto;border:0;outline:none;text-decoration:none;">
          </td></tr>`;
      }
    case "rule":
      return `
          <tr><td style="padding:6px 32px 22px;">
            <div style="height:1px;line-height:1px;font-size:0;background:${C.hairline};">&nbsp;</div>
          </td></tr>`;
  }
}

export function renderEmail(
  entry: EmailEntry,
  /** Absolute URLs for the plates, on a host the sender controls. */
  { plates = {} }: { plates?: Partial<Record<PlateKey, string>> } = {},
): string {
  const cta = entry.cta
    ? `
          <tr><td style="padding:8px 32px 30px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:${C.brass};">
                <a href="${entry.cta.href}"
                   style="display:inline-block;padding:14px 26px;font-family:${MONO};font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${C.onBrass};text-decoration:none;">
                  ${escape(entry.cta.label)}
                </a>
              </td>
            </tr></table>
          </td></tr>`
    : "";

  return `<!doctype html>
<html lang="en" style="color-scheme:dark;supported-color-schemes:dark;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escape(entry.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
  <span style="display:none;font-size:1px;color:${C.page};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escape(entry.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
    <tr><td align="center" style="padding:32px 12px;">
      <table role="presentation" width="568" cellpadding="0" cellspacing="0" border="0"
             style="width:100%;max-width:568px;background:${C.card};border:1px solid ${C.hairline};">

        <tr><td style="padding:26px 32px 22px;border-bottom:1px solid ${C.hairline};">
          <span style="font-family:${MONO};font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:${C.ink};">MARRAM</span>
        </td></tr>

        <tr><td style="padding:28px 32px 0;font-family:${MONO};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${C.brassInk};">
          ${escape(entry.kicker)}
        </td></tr>
        <tr><td style="padding:12px 32px 20px;font-family:${SERIF};font-size:30px;line-height:1.14;color:${C.ink};">
          ${escape(entry.heading)}
        </td></tr>

        ${entry.blocks.map((b) => block(b, plates)).join("")}
        ${cta}

        <tr><td style="padding:0 32px;">
          <div style="height:1px;line-height:1px;font-size:0;background:${C.hairline};">&nbsp;</div>
        </td></tr>
        <tr><td style="padding:20px 32px 28px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted};">
          ${escape(entry.signoff)}<br>
          ${escape(EMAIL_CHROME.address)}<br>
          <a href="${EMAIL_CHROME.unsubscribeHref}" style="color:${C.muted};text-decoration:underline;">${escape(EMAIL_CHROME.unsubscribe)}</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`;
}

/**
 * The text/plain part. A sender that ships HTML alone gets filtered harder, and
 * the plain part is also the accessible fallback — so it is generated from the
 * same entry rather than being an afterthought somebody writes once.
 */
export function renderText(entry: EmailEntry): string {
  const lines: string[] = [entry.heading.toUpperCase(), ""];
  for (const b of entry.blocks) {
    if (b.kind === "text" && b.text) lines.push(b.text, "");
    if (b.kind === "figure") lines.push(`${b.figure} — ${b.caption}`, "");
  }
  if (entry.cta) lines.push(`${entry.cta.label}: ${entry.cta.href}`, "");
  lines.push("--", entry.signoff, EMAIL_CHROME.address, `${EMAIL_CHROME.unsubscribe}: ${EMAIL_CHROME.unsubscribeHref}`);
  return lines.join("\n");
}
