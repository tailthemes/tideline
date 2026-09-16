/* tt-html-bundle src-sha256=3ed915e8d7f05ad6f35fc289d64599c2e073d7afb6054c9fbc59b295a7988952 */
(() => {
  // themes/tideline/html/src/js/land-gallery.js
  function mountGalleries(root = document) {
    for (const gallery of root.querySelectorAll("[data-gallery]")) {
      let paint = function(next) {
        if (next === active)
          return;
        active = next;
        plates.forEach((plate, index) => {
          if (index === active) {
            plate.setAttribute("data-active", "true");
            plate.removeAttribute("aria-hidden");
            plate.setAttribute("alt", plate.dataset.alt ?? "");
          } else {
            plate.removeAttribute("data-active");
            plate.setAttribute("aria-hidden", "true");
            plate.setAttribute("alt", "");
          }
        });
        captions.forEach((caption, index) => {
          caption.hidden = index !== active;
          if (index === active)
            caption.setAttribute("data-active", "true");
          else
            caption.removeAttribute("data-active");
        });
        dots.forEach((dot, index) => {
          if (index === active)
            dot.setAttribute("aria-current", "true");
          else
            dot.removeAttribute("aria-current");
        });
      };
      const plates = [...gallery.querySelectorAll("[data-gallery-plate]")];
      const captions = [...gallery.querySelectorAll("[data-gallery-caption]")];
      const dots = [...gallery.querySelectorAll("[data-gallery-dot]")];
      const trackers = [...gallery.querySelectorAll("[data-gallery-tracker]")];
      if (plates.length === 0 || trackers.length !== plates.length)
        continue;
      let active = 0;
      for (const dot of dots) {
        dot.addEventListener("click", () => {
          const index = Number(dot.dataset.galleryDot);
          const tracker = trackers[index];
          if (!tracker)
            return;
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          tracker.scrollIntoView({
            behavior: reduced ? "auto" : "smooth",
            block: "center"
          });
          paint(index);
        });
      }
      if (typeof IntersectionObserver === "undefined")
        continue;
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting)
            continue;
          const index = Number(entry.target.dataset.galleryTracker);
          if (!Number.isNaN(index))
            paint(index);
        }
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      for (const tracker of trackers)
        io.observe(tracker);
    }
  }

  // themes/tideline/html/src/js/_tt/field-ids.js
  function fieldIds(input) {
    const { id, error, success, description } = input;
    const messageId = `${id}-message`;
    const message = error !== undefined ? { kind: "error", text: error } : success !== undefined ? { kind: "success", text: success } : description !== undefined ? { kind: "description", text: description } : null;
    const invalid = input.invalid ?? error !== undefined;
    const described = [message ? messageId : undefined, ...input.describedBy ?? []].filter((value) => typeof value === "string" && value.length > 0);
    return {
      labelId: `${id}-label`,
      messageId,
      message,
      control: {
        id,
        "aria-invalid": invalid ? true : undefined,
        "aria-describedby": described.length > 0 ? described.join(" ") : undefined
      }
    };
  }
  function applyField(control, input) {
    const ids = fieldIds({ ...input, id: control.id });
    if (ids.control["aria-invalid"])
      control.setAttribute("aria-invalid", "true");
    else
      control.removeAttribute("aria-invalid");
    const described = ids.control["aria-describedby"];
    if (described)
      control.setAttribute("aria-describedby", described);
    else
      control.removeAttribute("aria-describedby");
    return ids;
  }

  // themes/tideline/html/src/js/_tt/field.js
  var MESSAGE = '[data-part="field-message"]';
  function mountField(root, options = {}) {
    if (!root)
      throw new Error("mountField: a root element is required");
    const control = options.control ?? root.querySelector('[data-part="field-control"] input, [data-part="field-control"] textarea, [data-part="field-control"] select');
    if (!control)
      throw new Error("mountField: no control inside [data-part=field-control]");
    if (!control.id)
      throw new Error("mountField: the control needs its own id — a summary's href names it in markup");
    let message = root.querySelector(MESSAGE);
    const served = options.description ?? (message?.getAttribute("data-kind") === "description" ? (message.textContent ?? "").trim() : undefined);
    const servedDescribedBy = (control.getAttribute("aria-describedby") ?? "").split(/\s+/).filter((id) => id.length > 0 && id !== `${control.id}-message`);
    function state(invalid) {
      if (control.disabled)
        return "disabled";
      if (control.readOnly)
        return "read-only";
      if (invalid)
        return "invalid";
      if (root.getAttribute("data-valid") === "true")
        return "valid";
      return "rest";
    }
    function render(ids) {
      if (!message)
        return;
      const kind = ids.message?.kind;
      if (!kind) {
        message.hidden = true;
        message.removeAttribute("data-kind");
        message.textContent = "";
        return;
      }
      if (message.getAttribute("data-kind") !== kind) {
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
        describedBy: input.describedBy ?? servedDescribedBy
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
      destroy() {}
    };
  }

  // themes/tideline/html/src/js/join-form.js
  var LOOKS_LIKE_EMAIL = /^[^@\s]+@[^@\s.]+\.[^@\s]+$/;
  function mountJoinForms(root = document) {
    for (const scope of root.querySelectorAll("[data-join]")) {
      const form = scope.querySelector("[data-join-form]");
      const done = scope.querySelector("[data-join-done]");
      const fieldRoot = scope.querySelector('[data-part="field"]');
      const button = form?.querySelector('button[type="submit"]');
      const label = scope.querySelector("[data-join-label]");
      if (!form || !done || !fieldRoot || !button || !label)
        continue;
      const field = mountField(fieldRoot);
      const control = fieldRoot.querySelector("input");
      let pending = false;
      control.addEventListener("input", () => {
        if (!pending)
          field.set({});
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (pending)
          return;
        const value = control.value.trim();
        if (!LOOKS_LIKE_EMAIL.test(value)) {
          field.set({
            invalid: true,
            error: "That does not look like an email address. Check it and try again."
          });
          control.focus();
          return;
        }
        field.set({});
        pending = true;
        button.disabled = true;
        label.textContent = "Joining…";
        window.setTimeout(() => {
          pending = false;
          form.hidden = true;
          done.hidden = false;
          done.setAttribute("tabindex", "-1");
          done.focus();
        }, 700);
      });
    }
  }

  // themes/tideline/html/src/js/reveal.js
  function mountReveals(root = document) {
    const targets = root.querySelectorAll("[data-tl-reveal]");
    if (targets.length === 0)
      return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const automated = typeof navigator !== "undefined" && navigator.webdriver === true;
    if (reduced.matches || automated || typeof IntersectionObserver === "undefined") {
      return;
    }
    for (const el of targets)
      el.classList.add("tideline-armed");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting)
          continue;
        observer.unobserve(entry.target);
        entry.target.classList.remove("tideline-armed");
        entry.target.classList.add("tideline-rise");
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.01 });
    for (const el of targets)
      observer.observe(el);
  }

  // themes/tideline/html/src/js/main.js
  function mountModeToggles(root = document) {
    const key = document.documentElement.getAttribute("data-mode-key");
    function paint() {
      const light = document.documentElement.classList.contains("light");
      for (const button of root.querySelectorAll("[data-mode-toggle]")) {
        button.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      }
    }
    for (const button of root.querySelectorAll("[data-mode-toggle]")) {
      button.addEventListener("click", () => {
        const light = !document.documentElement.classList.contains("light");
        document.documentElement.classList.toggle("light", light);
        try {
          if (key)
            localStorage.setItem(key, light ? "light" : "dark");
        } catch {}
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
})();
