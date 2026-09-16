import { mountGalleries } from "./land-gallery.js";
import { mountJoinForms } from "./join-form.js";
import { mountReveals } from "./reveal.js";

/**
 * The HTML edition's entry point. Four things mount, and the list is short on
 * purpose: the FAQ and mobile navigation are native `<details>`, so Enter,
 * Space and the open/closed state come from the platform. Escape does not; the
 * vendored accordion module is present but not mounted over their markup, a
 * reduction recorded in AGENTS.md's HTML ledger. The parallax, the rail and
 * the plate settle are pure CSS and mount nothing at all.
 *
 * `build-html` bundles this graph into one classic script, so `dist/` still
 * opens from `file://` with no server and no module loader.
 */

/**
 * The mode picker. Dark is this theme's default, which is the opposite of the
 * catalog's habit and the reason `light` is the class that gets ADDED — the
 * bare document is already dark, and the pre-paint script in the layout adds
 * the class before the stylesheet paints so a light-mode reader never sees a
 * near-black flash.
 *
 * The button carries both labels and CSS shows one, so nothing here writes
 * text. All this owns is the class, the stored preference, and the accessible
 * name — which has to be updated in script because it is an attribute, not a
 * child that CSS can hide.
 */
function mountModeToggles(root = document) {
  const key = document.documentElement.getAttribute("data-mode-key");

  function paint() {
    const light = document.documentElement.classList.contains("light");
    for (const button of root.querySelectorAll("[data-mode-toggle]")) {
      button.setAttribute(
        "aria-label",
        light ? "Switch to dark mode" : "Switch to light mode",
      );
    }
  }

  for (const button of root.querySelectorAll("[data-mode-toggle]")) {
    button.addEventListener("click", () => {
      const light = !document.documentElement.classList.contains("light");
      document.documentElement.classList.toggle("light", light);
      try {
        if (key) localStorage.setItem(key, light ? "light" : "dark");
      } catch {
        /* Storage can be unavailable — private mode, blocked cookies. The
           toggle still works for this page view, which is the part that
           matters; only the memory is lost. */
      }
      paint();
    });
  }

  paint();
}

function mount() {
  mountModeToggles();
  mountJoinForms();
  mountGalleries();
  mountReveals();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount, { once: true });
} else {
  mount();
}
