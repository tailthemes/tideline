import { mountField } from "./_tt/field.js";

/**
 * The join form's state machine — the theme's own module, and the only
 * behaviour on this site the library does not already own.
 *
 * The split is deliberate and it is the rule Amendment F is about: `mountField`
 * writes `aria-invalid`, composes `aria-describedby` and owns the single
 * message line's error → success → description precedence, because that is
 * correctness and correctness has one right answer. What is left here is the
 * part that is genuinely this theme's — when to validate, what the button says
 * while it is working, and the fact that success is a durable panel rather than
 * a message that clears itself.
 *
 * **There is no network call**, in either edition. A theme is source a buyer
 * drops into their own app; a fetch here would be a fake endpoint they then
 * have to find and remove. `submit()` below is the single seam.
 */

/* One rule, deliberately. A regex that rejects a valid-but-unusual address is
   worse than a server round-trip, and the only check that is always right at
   this point is whether they typed something shaped like an address at all. */
const LOOKS_LIKE_EMAIL = /^[^@\s]+@[^@\s.]+\.[^@\s]+$/;

export function mountJoinForms(root = document) {
  for (const scope of root.querySelectorAll("[data-join]")) {
    const form = scope.querySelector("[data-join-form]");
    const done = scope.querySelector("[data-join-done]");
    const fieldRoot = scope.querySelector('[data-part="field"]');
    const button = form?.querySelector('button[type="submit"]');
    const label = scope.querySelector("[data-join-label]");
    if (!form || !done || !fieldRoot || !button || !label) continue;

    const field = mountField(fieldRoot);
    const control = fieldRoot.querySelector("input");
    let pending = false;

    /* Clearing on input, not on blur: an error that survives the correction
       that fixed it reads as the page not listening. */
    control.addEventListener("input", () => {
      if (!pending) field.set({});
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (pending) return;

      const value = control.value.trim();
      if (!LOOKS_LIKE_EMAIL.test(value)) {
        field.set({
          invalid: true,
          error: "That does not look like an email address. Check it and try again.",
        });
        control.focus();
        return;
      }

      field.set({});
      pending = true;
      button.disabled = true;
      label.textContent = "Joining…";

      // ── The seam ───────────────────────────────────────────────────────
      // Everything above is yours already. Replace this timeout with your own
      // request and keep the states around it.
      window.setTimeout(() => {
        pending = false;
        form.hidden = true;
        done.hidden = false;
        /* Focus moves to the panel because the thing that replaced the form is
           the thing that has to be read — and it carries the reader's position
           on the list, which is what they came for. */
        done.setAttribute("tabindex", "-1");
        done.focus();
      }, 700);
    });
  }
}
