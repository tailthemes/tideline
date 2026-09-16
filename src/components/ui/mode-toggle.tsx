"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { FOCUS, MONO, TEXT, TRANSITION } from "./type";

/**
 * The mode picker. Two buttons in a group rather than one toggle, because a
 * single button that says "dark" is ambiguous about whether it names the
 * current state or the one you would get — a confusion that costs a click
 * every time and is invisible in a screenshot.
 *
 * Dark is the default here, which is the opposite of the catalog's habit and
 * is why `light` is the class that gets added rather than `dark` (theme.css
 * scopes the near-black tokens to `:root`).
 */
export function ModeToggle({ onPlate = false }: { onPlate?: boolean } = {}) {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const light = mode === "light";
    // Both, and the second one is not belt-and-braces — it is the whole bug.
    //
    // theme.css scopes the default (dark) tokens to `:root, .tt-tideline`, so
    // in the marketplace preview the wrapper carrying `.tt-tideline` re-declares
    // every dark value on itself. A `light` class on <html> then loses, because
    // the wrapper is closer to the content than the root is, and the page comes
    // back dark with a couple of stray light bands where nothing was re-declared.
    // Caught in the first light-mode capture, which is the only way it shows up:
    // standalone (a buyer's own app, no wrapper) the root class works fine and
    // the fault is invisible.
    document.documentElement.classList.toggle("light", light);
    for (const scope of document.querySelectorAll(".tt-tideline")) {
      scope.classList.toggle("light", light);
    }
  }, [mode]);

  return (
    <div
      role="group"
      aria-label="Colour mode"
      className={`flex items-center gap-0.5 rounded-(--radius) border p-0.5 ${
        onPlate ? "border-(--plate-ink-muted)/40" : "border-border"
      }`}
    >
      {(
        [
          ["dark", Moon, "Dark"],
          ["light", Sun, "Light"],
        ] as const
      ).map(([value, Icon, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={mode === value}
          onClick={() => setMode(value)}
          className={`flex items-center gap-1.5 rounded-(--radius-inner) px-2.5 py-1.5 ${MONO} ${TEXT.label} ${TRANSITION} ${FOCUS} ${
            mode === value
              ? onPlate
                ? "bg-(--plate-ink)/15 text-(--plate-ink)"
                : "bg-secondary text-foreground"
              : onPlate
                ? "text-(--plate-ink-muted) hover:text-(--plate-ink)"
                : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon aria-hidden="true" className="size-3" />
          {label}
        </button>
      ))}
    </div>
  );
}
