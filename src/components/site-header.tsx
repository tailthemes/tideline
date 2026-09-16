import { HOUSE } from "../fixtures/marram";
import { Brand, Container } from "./ui/primitives";
import { ModeToggle } from "./ui/mode-toggle";
import { FOCUS, MONO, TEXT, TRANSITION } from "./ui/type";

/**
 * The header sits **over** the hero plate on `/` and on a token ground
 * everywhere else, which is why it carries no background of its own and no
 * border: on the home page a bar would cut the photograph in half an inch from
 * the top, and on the interior routes the first section's own top rule does
 * the separating.
 *
 * Which means it has two ink registers, and that is not decoration: on `/`
 * the bar sits on the estuary plate, which stays dark in BOTH modes (AGENTS.md
 * §The one sanctioned deviation), so its type has to use the non-inverting
 * `--plate-ink` family. Using `--foreground` there put a near-black wordmark on
 * a dusk photograph the moment light mode was switched on, which is exactly
 * what the first light capture showed.
 *
 * The mobile navigation is a native `<details>`. It needs no focus trap
 * (it is not a modal layer, the page behind it stays reachable and scrollable)
 * and no focus trap or scroll lock. The bare element does not close on Escape;
 * that missing behavior is recorded in AGENTS.md rather than attributed to the
 * platform. Its expanded state is implicit on `<summary>`.
 */

const NAV = [
  { href: "/rooms", label: "The rooms" },
  { href: "/the-build", label: "The build" },
  { href: "/emails", label: "The emails" },
  { href: "/list", label: "The list" },
] as const;

export function SiteHeader({
  current,
  onPlate = current === "/",
}: {
  current: string;
  /** True where the header overlays the hero photograph. */
  onPlate?: boolean;
}) {
  // Written out in full rather than composed. `hover:${ink}` would build a
  // class string at runtime that appears literally in no source file, and
  // Tailwind's scanner only emits what it can see — the hover would be dead and
  // nothing would say so.
  const inkRest = onPlate
    ? "text-(--plate-ink-muted) hover:text-(--plate-ink)"
    : "text-muted-foreground hover:text-foreground";
  const inkMuted = onPlate ? "text-(--plate-ink-muted)" : "text-muted-foreground";
  const inkActive = onPlate ? "text-(--plate-ink-brass)" : "text-(--primary-ink)";

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <Container className="flex items-center justify-between gap-6 py-6">
        <a
          href="/"
          className={`${FOCUS} rounded-(--radius) ${TRANSITION} hover:opacity-80`}
          aria-current={current === "/" ? "page" : undefined}
        >
          <Brand onPlate={onPlate} />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={current === item.href ? "page" : undefined}
              className={`${MONO} ${TEXT.label} ${TRANSITION} ${FOCUS} rounded-(--radius) ${
                current === item.href ? inkActive : inkRest
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <span className={`${MONO} ${TEXT.label} ${inkMuted}`}>{HOUSE.where}</span>
          <ModeToggle onPlate={onPlate} />
        </div>

        {/* Mobile: native disclosure, no script, no trap, no scroll lock —
            because it is not a modal layer and locking scroll under a
            non-modal is the bug the behaviour contract names. */}
        <details className="group relative md:hidden">
          <summary
            className={`flex cursor-pointer list-none items-center gap-2 rounded-(--radius) border px-3 py-2 ${MONO} ${TEXT.label} ${FOCUS} ${
              onPlate ? "border-(--plate-ink-muted)/40 text-(--plate-ink)" : "border-border text-foreground"
            }`}
          >
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
          </summary>
          <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-(--radius) border border-border bg-card p-2 shadow-(--shadow-overlay)">
            <nav aria-label="Primary, mobile" className="flex flex-col">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={current === item.href ? "page" : undefined}
                  className={`rounded-(--radius-inner) px-3 py-2.5 ${MONO} ${TEXT.label} ${TRANSITION} ${FOCUS} ${
                    current === item.href
                      ? "text-(--primary-ink)"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-2 border-t border-border pt-3">
              <ModeToggle />
            </div>
          </div>
        </details>
      </Container>
    </header>
  );
}
