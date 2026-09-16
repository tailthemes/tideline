"use client";

import { Check } from "lucide-react";
import { useId, useState } from "react";
import { HOUSE } from "../fixtures/marram";
import { CONTROL, Field } from "./ui/field";
import { Button } from "./ui/primitives";
import { MONO, TEXT, TNUM } from "./ui/type";

/**
 * The only form in the theme, and the one control the whole site exists to
 * present. It ships the four states the marketing floor requires — rest,
 * invalid, submitting, success — and they are real states of a real state
 * machine, not four static specimens on the styleguide.
 *
 * **No network call.** A theme is source a buyer drops into their own app; a
 * `fetch` here would be a fake endpoint they then have to find and remove.
 * `onSubmit` is the single seam: replace the body, keep the states. That is
 * documented in the theme's `add-section` skill and in README.
 *
 * The success state is deliberately *durable* rather than a toast. What it
 * says — the position on the list — is the one fact the visitor came for, and
 * a message that removes itself after four seconds is the wrong shape for a
 * number somebody may want to screenshot.
 */

type State = "rest" | "submitting" | "done";

export function JoinForm({
  className = "",
  tone = "onPlate",
}: {
  className?: string;
  /** `onPlate` sits over the hero photograph; `onPage` over a token ground. */
  tone?: "onPlate" | "onPage";
}) {
  const id = useId();
  const [state, setState] = useState<State>("rest");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  const emailId = `${id}-email`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = value.trim();

    // Validation is deliberately one rule. A regex that rejects a valid but
    // unusual address is worse than a server round-trip, and the only check
    // that is always right at this point is "did they type something shaped
    // like an address at all".
    if (!address || !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(address)) {
      setError("That does not look like an email address. Check it and try again.");
      return;
    }

    setError(undefined);
    setState("submitting");

    // ── The seam ──────────────────────────────────────────────────────────
    // Everything above is yours already. Replace this line with your own
    // request and keep the states around it.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setState("done");
  }

  if (state === "done") {
    return (
      <div
        className={`rounded-(--radius) border border-(--primary-border) bg-(--primary-soft) px-5 py-4 ${className}`}
      >
        <p className={`flex items-center gap-2 ${MONO} ${TEXT.label} text-(--primary-ink)`}>
          <Check aria-hidden className="size-3.5 shrink-0" />
          You are on the list
        </p>
        <p className={`mt-2 ${TEXT.body} text-foreground`}>
          Check your inbox — there is one email there asking you to confirm, and nothing
          else happens until you do.
        </p>
        <p className={`mt-3 ${MONO} ${TEXT.caption} ${TNUM} text-muted-foreground`}>
          You are number {(HOUSE.listCount + 1).toLocaleString("en-GB")}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Field
          id={emailId}
          label="Email address"
          labelHidden={tone === "onPlate"}
          error={error}
          className="flex-1"
        >
          {({ control }) => (
            <input
              {...control}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={value}
              disabled={state === "submitting"}
              data-invalid={error ? "true" : undefined}
              onChange={(event) => {
                setValue(event.target.value);
                if (error) setError(undefined);
              }}
              className={CONTROL}
            />
          )}
        </Field>

        <Button
          type="submit"
          size="control"
          disabled={state === "submitting"}
          className="shrink-0"
          aria-live="polite"
        >
          {state === "submitting" ? "Joining…" : "Join the list"}
        </Button>
      </div>
    </form>
  );
}
