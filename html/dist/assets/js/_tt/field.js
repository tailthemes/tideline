/* @tt-ui ui/parts/field/vanilla/field.js library=1.5.1 sha256=b701fd1cfd2ac576d28d04fcc56137f16d46ef791ea9d59f8f18d607568a0f06
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * `field`, the HTML edition — the twin of `ui/parts/field/react/field.tsx`.
 *
 * The React shell derives the ids and hands the control a props bag through a
 * render prop, because a render prop is the one form where the wiring cannot be
 * dropped without the call site failing to compile. There is no compiler here
 * and there is no render: the label, the control and the message line are in
 * the server HTML, wired by hand in Nunjucks, and what can be dropped is
 * dropped silently. So this module is the **writer** — `core/field-ids`'
 * `applyField` for the two attributes, and the message line for the one
 * sentence — and the markup contract in `doc.md` is what replaces the type.
 *
 * ── WHAT `themes/covers` TAUGHT, AND IT IS THE REASON FOR THE MODULE ─────
 * `themes/covers/html/src/js/main.js` hand-rolls the whole family — `showError`,
 * `clearError`, `invalidReason` — and it is the catalog's most complete
 * HTML-edition field. Its `aria-describedby` is **assigned**, not composed, so a
 * field carrying a character count loses the count the first time it goes
 * invalid. `applyField` composes (`describedBy` is a list, and the list *is*
 * the reading order, B10.3), which is why that option exists rather than a
 * caller's string concatenation.
 *
 * ── ONE LINE, AND PRECEDENCE IS THE CORE'S ───────────────────────────────
 * error → success → description, single-slot (B10.2). The description a page
 * was served with is **remembered at mount** and comes back when an error
 * clears: without that, a field that has once been wrong loses the clause that
 * said what it wanted, permanently, and the theme would have to hand the
 * sentence back on every call. It is the template's own text, read once, never
 * written by this file.
 *
 * ── THE MESSAGE NODE IS REPLACED WHEN THE KIND CHANGES ───────────────────
 * The React skeleton keys the line by kind, and its comment says why: an
 * unkeyed element in the same position is reused, which is invisible until a
 * theme animates the line's arrival — an `@starting-style` entrance, a swap
 * keyframe — and then the message that matters most is the one that never
 * plays it. A `key` has no meaning here, so the node is **cloned shallowly and
 * swapped in**: same element, same classes the template wrote, new node
 * identity, and the entrance plays. Same rule, different mechanism — the third
 * of the shapes `announce.js`'s header names.
 *
 * Text alone does not swap the node. React reuses the element when only the
 * sentence changed inside one kind, and so does this.
 *
 * ── `data-state` IS DERIVED FROM THE CONTROL, NOT FROM AN OPTION ─────────
 * `disabled` and `readOnly` are native properties the DOM already holds, in the
 * order the React file's `fieldState` puts them: a disabled field is not
 * invalid, it is out of play. Asking the theme to restate them would be a
 * second copy that can disagree with the attribute a reader actually meets.
 *
 * ── WHAT THE THEME PASSES ────────────────────────────────────────────────
 * The sentences, and only when they change: `set({ error })` on a rejected
 * submit, `set({})` when it is corrected. Every word is the theme's, and this
 * file contains none.
 */

import { applyField } from "./field-ids.js";

const MESSAGE = '[data-part="field-message"]';

/**
 * @param {Element} root  `[data-part="field"]`
 * @param {object} [options]
 * @param {Element} [options.control]  the input, textarea or select. Found
 *        inside `[data-part="field-control"]` when omitted.
 * @param {string} [options.description]  overrides the description the template
 *        rendered; omit it and the served one is remembered and restored.
 * @returns {{ set: (input: object) => void, id: () => string,
 *             messageId: () => string, destroy: () => void }}
 */
export function mountField(root, options = {}) {
  if (!root) throw new Error("mountField: a root element is required");

  const control =
    options.control ??
    root.querySelector('[data-part="field-control"] input, [data-part="field-control"] textarea, [data-part="field-control"] select');
  if (!control) throw new Error("mountField: no control inside [data-part=field-control]");
  if (!control.id) throw new Error("mountField: the control needs its own id — a summary's href names it in markup");

  let message = root.querySelector(MESSAGE);

  /* The served description, read once. `data-kind` is what the template wrote;
     a line with no kind is not a description and is not remembered. */
  const served =
    options.description ??
    (message?.getAttribute("data-kind") === "description"
      ? (message.textContent ?? "").trim()
      : undefined);

  /* And the ids the **template** appended, read once for the same reason. This
     is covers' bug named in the header, closed at the only point where it can
     be: `applyField` composes a list and a caller who did not know a character
     counter existed would compose it away. A server that wrote
     `aria-describedby="x-message x-count"` has already declared the
     composition; the module keeps everything that is not the message line. */
  const servedDescribedBy = (control.getAttribute("aria-describedby") ?? "")
    .split(/\s+/)
    .filter((id) => id.length > 0 && id !== `${control.id}-message`);

  function state(invalid) {
    if (control.disabled) return "disabled";
    if (control.readOnly) return "read-only";
    if (invalid) return "invalid";
    if (root.getAttribute("data-valid") === "true") return "valid";
    return "rest";
  }

  function render(ids) {
    if (!message) return;
    const kind = ids.message?.kind;
    if (!kind) {
      message.hidden = true;
      message.removeAttribute("data-kind");
      message.textContent = "";
      return;
    }
    if (message.getAttribute("data-kind") !== kind) {
      /* Shallow, so the theme's own attributes and classes travel and the
         children — a glyph the template drew — do not: the glyph belongs to a
         kind and the kind has just changed. */
      const fresh = message.cloneNode(false);
      message.replaceWith(fresh);
      message = fresh;
    }
    message.setAttribute("data-kind", kind);
    message.textContent = ids.message.text;
    message.hidden = false;
  }

  function set(input = {}) {
    const ids = applyField(control, {
      error: input.error,
      success: input.success,
      description: "description" in input ? input.description : served,
      invalid: input.invalid,
      describedBy: input.describedBy ?? servedDescribedBy,
    });
    render(ids);
    root.setAttribute("data-state", state(ids.control["aria-invalid"] === true));
    return ids;
  }

  set();

  return {
    set,
    id: () => control.id,
    messageId: () => `${control.id}-message`,
    destroy() {
      /* Nothing is bound: this module writes when it is told to. The handle
         keeps the shape every other mount in the library has, so a theme's
         teardown loop does not need a special case for one of them. */
    },
  };
}
