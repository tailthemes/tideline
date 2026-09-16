/* @tt-ui ui/core/react/recipe.ts library=1.5.1 sha256=0e449da09296680e007247ac7dd886fee3e84454be61a20d141ce68c54b8e46b
 * Vendored verbatim; do not edit. `bun run ui sync <slug>` re-vendors it;
 * `bun run ui eject <part> --theme <slug>` makes it yours. */
/**
 * The type that makes a forgotten skin a compile error.
 *
 * A recipe is a plain object of semantic utility strings, one per slot and one
 * per axis value, written by the theme and passed into the skeleton as a
 * **required** prop (library.md §1.6). There is no `cva`, no `clsx`, no
 * `tailwind-merge`: the zip's dependency list is the manifest's and nothing
 * else (`lib/pipeline/package.ts:63`), and a buyer opening a theme should find
 * a `Record<string, string>` they can read, not a class-variance DSL they have
 * to learn.
 *
 * **The type is the anti-convergence guarantee, and everything else is a
 * backstop to it** (§1.9). `Recipe<A>` has no optional keys but the declared
 * `optionalSlots` (Amendment K; see `OptionalSlot`), so a theme that
 * forgets `size.lg` fails `bunx tsc --noEmit`, which is `verify-theme` stage 1
 * — a gate that already exists rather than one we would have to write. A theme
 * that fills the keys with empty strings renders unstyled DOM, which is loud;
 * a library that shipped a default skin would render *generic* DOM, which is
 * invisible, and invisible is how P-6 and P-7 happened.
 *
 * *Rejected*: `Partial<Recipe<A>>` with the skeleton falling back to a
 * structural default. It is one line in the skeleton and it re-introduces the
 * shared appearance the whole document exists to make impossible.
 *
 * *Rejected*: generating the axes type from the skeleton's props. The axes
 * module is read by `ui/cli`'s `add` (to write every slot and axis value into
 * the theme's stub with a `TODO(design-pass)` beside it) and by
 * `gate:recipe-distance` (to tokenize per slot). Both want data, and a props
 * type is not data at runtime.
 *
 * No React import. `parts/<part>/axes.ts`, the CLI and the gate all read this
 * file, and only one of the three has React in scope.
 */

/**
 * The shape a part's `axes.ts` declares: a `slots` tuple plus zero or more
 * closed value sets. `as const` (or the `axes()` helper below) is what makes
 * the members literal types rather than `string[]`, and literal types are the
 * whole mechanism.
 */
export interface AxesShape {
  readonly slots: readonly string[];
  readonly [axis: string]: readonly string[];
}

/** A slot name of `A` — the keys whose value in a recipe is one class string. */
export type Slot<A extends AxesShape> = A["slots"][number];

/**
 * An **optional** slot name of `A` — the members of `optionalSlots`, when the
 * part declares one (CONTRACT Amendment K §K.1.1).
 *
 * The one sanctioned optional key, and it is narrower than it looks: an optional
 * slot's node renders **only when the call site supplies its content**, so a
 * recipe that does not name the key renders exactly what it rendered before the
 * slot existed — nothing. That is the only shape in which "add a slot" leaves
 * every adopter's pixels alone, and so the only shape in which adding one is a
 * minor rather than a major.
 *
 * *Rejected*: `Partial<>` over a declared subset of `slots`. Then the question
 * "does this node render when its key is absent" has two answers in one list,
 * and the skeleton — not the type — decides which, which is the fallback-string
 * problem wearing a type annotation. A separate tuple makes the rule structural:
 * nothing in `slots` may be skipped, and nothing in `optionalSlots` may render
 * without content.
 */
export type OptionalSlot<A extends AxesShape> = A extends {
  readonly optionalSlots: readonly (infer S extends string)[];
}
  ? S
  : never;

/** An axis name of `A` — every declared key except `slots` and `optionalSlots`. */
export type Axis<A extends AxesShape> = Exclude<keyof A, "slots" | "optionalSlots">;

/** A legal value of one axis. `AxisValue<typeof dialogAxes, "size">` is `"sm" | "md" | "lg"`. */
export type AxisValue<A extends AxesShape, K extends Axis<A>> = A[K][number];

/**
 * `Record<slot, string>`, the optional slots as the one optional key family
 * (see `OptionalSlot`), and, per axis, `Record<value, string>`.
 *
 * The two halves are separate mapped types rather than one, because `slots` has
 * to be excluded from the axis half and a single mapped type cannot both drop a
 * key and change the value shape of the rest.
 */
export type Recipe<A extends AxesShape> = { [S in Slot<A>]: string } & {
  [S in OptionalSlot<A>]?: string;
} & {
  [K in Axis<A>]: { [V in AxisValue<A, K>]: string };
};

/**
 * The exit duration of a layer part, in milliseconds, intersected into that
 * part's recipe: `type DialogRecipe = Recipe<typeof dialogAxes> & LayerMotion`.
 *
 * It sits beside the class strings and not inside `ui.config.ts` because it is
 * a property of *this part's* exit keyframe — foundry's dialog is `closeMs: 0`
 * ("print does not move, it is placed") while its disclosure is not — and
 * because `useLayerPresence` cannot type-check a number the theme forgot if the
 * number is optional. Themes that keep one value for the whole theme write
 * `closeMs: ui.motion.close` and the config is still the single source.
 *
 * *Rejected*: putting `closeMs` in `Recipe<A>` unconditionally. Then `badge`,
 * `field` and every other part with no exit would carry a meaningless required
 * number, and the first theme to write `closeMs: 0` on a badge teaches the next
 * reader that it means something. library.md §1.6 writes the expansion with
 * `closeMs` inside `Recipe<typeof dialogAxes>`; this splits it out so only
 * layer parts owe it — reported as a deviation.
 */
export interface LayerMotion {
  /** How long the closing node stays mounted for its exit. 0 = no exit. */
  closeMs: number;
}

/**
 * Identity, with `const` inference. `axes({ slots: ["root"], size: ["sm"] })`
 * gives the same literal types `as const` would and one fewer thing to forget;
 * `as const` remains exactly equivalent and is what library.md §1.6 writes.
 */
export function axes<const A extends AxesShape>(definition: A): A {
  return definition;
}

/**
 * Joins recipe values into one `className`, dropping anything absent.
 *
 * Every slot and axis value is required, so most compositions are a template
 * literal and do not need this. What does need it: a value the *theme* left
 * empty on purpose (`tone: { neutral: "" }` is the common case — foundry's
 * neutral dialog adds nothing) and an optional axis the caller may omit, where
 * a template literal would emit a doubled space or the string `"undefined"`.
 *
 * It joins. It does not merge, dedupe, or resolve conflicting utilities — that
 * is `tailwind-merge`, and a recipe whose own slots fight each other is a
 * design bug the theme should see rather than a runtime the library should ship
 * to fourteen zips.
 */
export function cx(...values: readonly (string | false | null | undefined)[]): string {
  return values.filter((value): value is string => Boolean(value)).join(" ");
}
