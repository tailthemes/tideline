import type { ReactNode } from "react";
import { DISPLAY, FOCUS, INK, MONO, TEXT, TRANSITION } from "./type";

/**
 * The small shared parts. Everything here is theme-owned appearance over
 * behaviour that is either native or, where it is not, vendored from the
 * library into `_tt/` (Amendment F). Nothing in this file implements a focus
 * trap, an Escape handler or a scroll lock — if a part needs one, it comes from
 * `_tt/`.
 */

/* ── measure ─────────────────────────────────────────────────────────────── */

const WIDTHS = {
  /** The page. Wide, because the photography is the argument. */
  page: "max-w-[84rem]",
  /** Prose measure — 45–75ch. */
  prose: "max-w-[38rem]",
  /** A column beside a plate. */
  column: "max-w-[34rem]",
} as const;

export function Container({
  size = "page",
  className = "",
  children,
}: {
  size?: keyof typeof WIDTHS;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full ${WIDTHS[size]} px-6 sm:px-10 ${className}`}>
      {children}
    </div>
  );
}

/* ── eyebrow ─────────────────────────────────────────────────────────────── */

/**
 * The reference sets its eyebrow centred between two ornamental diamonds. This
 * one runs a single hairline out to the right instead: the composition is
 * left-weighted throughout, and a centred ornament on a left-weighted page is
 * decoration that has to be defended twice.
 *
 * The rule uses `--primary-ink`, not `--primary` — brass on the light ground is
 * 1.88:1 and would be an invisible hairline in light mode.
 */
export function Eyebrow({
  children,
  className = "",
  rule = true,
  onPlate = false,
}: {
  children: ReactNode;
  className?: string;
  rule?: boolean;
  /** Sitting on a photograph, which is dark in BOTH modes — so the brass here
   *  must be the non-inverting `--plate-ink-brass`, not `--primary-ink`. */
  onPlate?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-3.5 ${
        onPlate ? "text-(--plate-ink-brass)" : INK
      } ${TEXT.eyebrow} ${className}`}
    >
      <span className={MONO}>{children}</span>
      {rule ? (
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-current opacity-60"
        />
      ) : null}
    </p>
  );
}

/* ── button ──────────────────────────────────────────────────────────────── */

type ButtonTone = "primary" | "quiet";

const TONE: Record<ButtonTone, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-(--primary-hover) active:bg-(--primary-active)",
  quiet:
    "border border-(--control-border) text-foreground hover:bg-secondary active:bg-(--secondary-active)",
};

const BUTTON_BASE = `inline-flex items-center justify-center gap-2 rounded-(--radius) px-6 ${MONO} ${TEXT.label} font-medium motion-safe:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS} ${TRANSITION}`;

/**
 * `control` is the size a button takes when it sits on a row with a field:
 * both read `--control-height` so neither has to be measured against the
 * other's type size. `default` keeps its own padding for buttons that stand
 * alone.
 */
const SIZE = {
  default: "py-3.5",
  control: "h-(--control-height) py-0",
} as const;

export function Button({
  tone = "primary",
  size = "default",
  type = "button",
  className = "",
  children,
  ...rest
}: {
  tone?: ButtonTone;
  size?: keyof typeof SIZE;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`${BUTTON_BASE} ${SIZE[size]} ${TONE[tone]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  tone = "primary",
  size = "default",
  href,
  className = "",
  children,
}: {
  tone?: ButtonTone;
  size?: keyof typeof SIZE;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={`${BUTTON_BASE} ${SIZE[size]} ${TONE[tone]} ${className}`}>
      {children}
    </a>
  );
}

/* ── plate ───────────────────────────────────────────────────────────────── */

/**
 * A photograph, with the scrim that makes type over it legible.
 *
 * The scrim is a token and a declared gradient, not an opacity guess: the
 * numbers behind it are in the colour receipt, measured against the plate's
 * actual darkest, mean and brightest pixels (17.11 / 15.12 / 8.98:1 for
 * `--plate-ink`). `overlay` is off for plates that carry no type, because a
 * scrim on a picture nobody is reading over is just a darker picture.
 */
export function Plate({
  src,
  alt,
  className = "",
  imgClassName = "",
  overlay = false,
  children,
}: {
  src: string;
  /** Required. `alt=""` is only correct for a plate that says nothing. */
  alt: string;
  className?: string;
  imgClassName?: string;
  overlay?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden rounded-(--radius) ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- themes ship as
          plain source a buyer drops into any React app; next/image would bind
          the zip to a Next runtime it may not have. */}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      {overlay ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(100deg,var(--scrim)_0%,var(--scrim)_34%,transparent_86%)] opacity-[0.82]"
        />
      ) : null}
      {children}
    </div>
  );
}

/* ── figures ─────────────────────────────────────────────────────────────── */

/** A label over a figure. Used in the build strip and the room table. */
export function Stat({
  label,
  children,
  sub,
}: {
  label: string;
  children: ReactNode;
  sub?: string;
}) {
  return (
    <div>
      <dt className={`${MONO} ${TEXT.label} text-muted-foreground`}>{label}</dt>
      <dd className={`mt-2.5 ${DISPLAY} ${TEXT.d1} text-foreground`}>
        {children}
        {sub ? (
          <span className={`ml-1.5 ${TEXT.body} text-muted-foreground`}>{sub}</span>
        ) : null}
      </dd>
    </div>
  );
}

/** The brand wordmark. `data-brand-name` is the one rebrand injection point. */
export function Brand({
  className = "",
  onPlate = false,
}: {
  className?: string;
  /** Over a photograph, which is dark in both modes. */
  onPlate?: boolean;
}) {
  return (
    <span
      className={`${MONO} ${TEXT.caption} tracking-(--tracking-wordmark) uppercase ${
        onPlate ? "text-(--plate-ink)" : "text-foreground"
      } ${className}`}
    >
      <span data-brand-name>Marram</span>
    </span>
  );
}
