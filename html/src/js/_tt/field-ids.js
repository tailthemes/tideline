/* @tt-ui ui/core/vanilla/field-ids.js library=1.5.1 sha256=4119460471503dd645e4a31bde82276ae83d743ccc3cd2bb82382b96ba53caec
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * One control, one verdict, and the ids that carry it — the twin of
 * `ui/core/react/field-ids.ts`.
 *
 * `fieldIds()` is transliterated exactly, because the derivation is arithmetic
 * over strings and both editions owe the same answer. What is added is
 * `applyField`, which writes it: a React skeleton spreads `ids.control` onto the
 * input, and an HTML edition has an input the server already rendered.
 *
 * THREE RULES, AND THEY ARE THE WHOLE MODULE.
 *
 * 1. **Precedence is error → success → description**, single-slot. A field says
 *    one thing at a time, and what it says while wrong is what to do about it.
 * 2. **`aria-describedby` is composed in that same order.** Assistive
 *    technology reads described-by ids in the order the attribute lists them,
 *    not in document order, so the list *is* the reading order.
 * 3. **`aria-invalid` appears only when the field is invalid** — removed, never
 *    `"false"`.
 *
 * WHAT THIS EDITION TAUGHT THE MODULE. `themes/covers/html/src/js/main.js`
 * hand-rolls the whole family (`showError` / `clearError` / `invalidReason`)
 * and it is the catalog's most complete HTML-edition field — and its
 * `aria-describedby` is *assigned*, not composed, so a field carrying a
 * character count loses the count the first time it goes invalid. Composition
 * is why `describedBy` is an option here rather than a caller's string concat.
 *
 * Every derived id is `${id}-…`, and the control's own `id` is required: a
 * generated id cannot be pointed at by a `form-error-summary`'s
 * `href="#<field-id>"` in markup a server rendered.
 *
 * No words. `error`, `success` and `description` are the theme's sentences,
 * arriving as arguments and leaving as `message.text` for the theme to write
 * into its own message node.
 */

/**
 * @typedef {object} FieldIdsInput
 * @property {string} id                       the control's own id
 * @property {string} [error]                  takes precedence over both others
 * @property {string} [success]
 * @property {string} [description]
 * @property {boolean} [invalid]               explicit override; `false` keeps the attribute off
 * @property {Array<string|false|null|undefined>} [describedBy]  ids appended after the field's own
 */

/**
 * @param {FieldIdsInput} input
 * @returns {{
 *   labelId: string,
 *   messageId: string,
 *   message: { kind: "error"|"success"|"description", text: string } | null,
 *   control: { id: string, "aria-invalid": true|undefined, "aria-describedby": string|undefined }
 * }}
 */
export function fieldIds(input) {
  const { id, error, success, description } = input;
  const messageId = `${id}-message`;

  const message =
    error !== undefined
      ? { kind: "error", text: error }
      : success !== undefined
        ? { kind: "success", text: success }
        : description !== undefined
          ? { kind: "description", text: description }
          : null;

  const invalid = input.invalid ?? error !== undefined;

  const described = [message ? messageId : undefined, ...(input.describedBy ?? [])].filter(
    (value) => typeof value === "string" && value.length > 0,
  );

  return {
    labelId: `${id}-label`,
    messageId,
    message,
    control: {
      id,
      "aria-invalid": invalid ? true : undefined,
      "aria-describedby": described.length > 0 ? described.join(" ") : undefined,
    },
  };
}

/**
 * Write the derivation onto a live control and return the message to render.
 *
 * It writes two attributes and removes them when they do not apply; it does not
 * touch the message node, because the message node is markup and its sentence
 * is words. The caller does `node.textContent = ids.message?.text ?? ""` in its
 * own template's terms and picks the glyph off `ids.message.kind`.
 *
 * @param {Element} control
 * @param {Omit<FieldIdsInput, "id">} input   `id` is read off the control
 * @returns {ReturnType<typeof fieldIds>}
 */
export function applyField(control, input) {
  const ids = fieldIds({ ...input, id: control.id });
  if (ids.control["aria-invalid"]) control.setAttribute("aria-invalid", "true");
  else control.removeAttribute("aria-invalid");
  const described = ids.control["aria-describedby"];
  if (described) control.setAttribute("aria-describedby", described);
  else control.removeAttribute("aria-describedby");
  return ids;
}
