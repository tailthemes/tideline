import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import nunjucks from "nunjucks";

type HtmlRoute = {
  template: string;
  output: string;
  title: string;
  [key: string]: unknown;
};
type HtmlConfig = {
  data: string;
  routes: HtmlRoute[];
  assets: Array<{ from: string; to: string }>;
};

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: bun run build-html <theme-slug>");
  process.exit(2);
}

const standalone = process.argv.includes("--standalone");
const repoRoot = process.cwd();
const themeRoot = standalone ? repoRoot : join(repoRoot, "themes", slug);
const htmlRoot = join(themeRoot, "html");
const sourceRoot = join(htmlRoot, "src");
const outputRoot = join(htmlRoot, "dist");
const configPath = join(htmlRoot, "html.json");

function contained(base: string, candidate: string): string {
  const target = resolve(base, candidate);
  if (target !== base && !target.startsWith(base + sep)) {
    throw new Error(`HTML edition path escapes its theme: ${candidate}`);
  }
  return target;
}

/*
 * The bundle's provenance hash, over every file under `html/src/js`, path
 * included and path-sorted so a rename counts as a change.
 *
 * `lib/pipeline/check-html.ts` carries this function verbatim and the two must
 * agree; it is duplicated rather than shared because a producer and its checker
 * importing one module is how a wrong hash agrees with itself. If they drift,
 * every theme goes red at once and names the rebuild — loud, which is the point.
 */
function scriptSourceHash(root: string): string {
  const files: string[] = [];
  const walk = (directory: string, prefix: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
      a.name < b.name ? -1 : 1,
    )) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(join(directory, entry.name), path);
      else files.push(path);
    }
  };
  walk(root, "");

  const hash = createHash("sha256");
  for (const path of files.sort()) {
    hash.update(path);
    hash.update("\0");
    hash.update(readFileSync(join(root, path)));
    hash.update("\0");
  }
  return hash.digest("hex");
}

if (!existsSync(configPath)) {
  throw new Error(`themes/${slug}/html/html.json does not exist`);
}

const config = JSON.parse(readFileSync(configPath, "utf8")) as HtmlConfig;
if (!Array.isArray(config.routes) || config.routes.length === 0) {
  throw new Error(`themes/${slug}/html/html.json has no routes`);
}

const dataPath = contained(htmlRoot, config.data);
const shared = JSON.parse(readFileSync(dataPath, "utf8")) as Record<string, unknown>;
const environment = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(sourceRoot, { noCache: true }),
  { autoescape: true, throwOnUndefined: true, trimBlocks: true, lstripBlocks: true },
);

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });

const built: string[] = [];
for (const route of config.routes) {
  const output = contained(outputRoot, route.output);
  const depth = relative(outputRoot, dirname(output))
    .split(sep)
    .filter(Boolean).length;
  const root = depth === 0 ? "./" : "../".repeat(depth);
  const html = environment.render(route.template, {
    ...shared,
    page: route,
    root,
  });

  if (/\{[{%#]/.test(html)) {
    throw new Error(`${route.output} contains an unresolved template delimiter`);
  }
  if ((html.match(/<h1\b/g) ?? []).length !== 1) {
    throw new Error(`${route.output} must contain exactly one h1`);
  }
  if (/\b(?:react|next\/static|_next\/static|__next)\b/i.test(html)) {
    throw new Error(`${route.output} contains a React or Next.js runtime marker`);
  }

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, html.trim() + "\n");
  built.push(route.output);
}

for (const asset of config.assets) {
  const from = contained(themeRoot, asset.from);
  const to = contained(outputRoot, asset.to);
  cpSync(from, to, { recursive: true });
}

const distributedFonts = join(outputRoot, "assets", "fonts");
if (existsSync(distributedFonts)) {
  for (const file of readdirSync(distributedFonts)) {
    if (!file.endsWith(".txt")) continue;
    const path = join(distributedFonts, file);
    const normalized = readFileSync(path, "utf8")
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+$/gm, "");
    writeFileSync(path, normalized.endsWith("\n") ? normalized : normalized + "\n");
  }
}

const cssInput = join(sourceRoot, "css", "theme.css");
const cssOutput = join(outputRoot, "assets", "theme.css");
mkdirSync(dirname(cssOutput), { recursive: true });
const css = spawnSync(
  "bun",
  ["x", "@tailwindcss/cli", "-i", cssInput, "-o", cssOutput, "--minify"],
  { cwd: repoRoot, encoding: "utf8" },
);
if (css.status !== 0) {
  throw new Error(`Tailwind HTML build failed:\n${css.stdout}\n${css.stderr}`);
}

const compiledCss = readFileSync(cssOutput, "utf8");
for (const match of compiledCss.matchAll(/url\((?:"|')?([^"')]+)(?:"|')?\)/g)) {
  const target = match[1];
  if (/^(?:data:|https?:)/.test(target)) continue;
  const assetPath = contained(outputRoot, relative(outputRoot, resolve(dirname(cssOutput), target)));
  if (!existsSync(assetPath)) {
    throw new Error(`Compiled HTML stylesheet references missing asset ${target}`);
  }
}

/*
 * The scripts ship twice, and the two copies answer different promises.
 *
 * `dist/assets/js/**` is the readable source, structure preserved: ADR-012
 * sells an edition a buyer can open and follow, and a vendored module under
 * `js/_tt/` is part of what they bought. Until today this copy was top-level
 * `.js` only, flattened into `assets/`, so a `js/_tt/` subdirectory was
 * silently dropped — the shape of failure CLAUDE.md §7.8 is about.
 *
 * `dist/assets/main.js` is the one classic script the pages load. Every
 * edition carries `<script defer src="…assets/main.js">` and `html/dist/`
 * has to open over `file://`, where an ESM `main.js` with `import` statements
 * is simply dead. Bundling to an IIFE lets the theme's own `main.js` compose
 * library modules while the tag and the runtime stay exactly what they were.
 * No minify: readable page source is half of what this edition sells.
 *
 * The banner is the tie between the two. `html/dist/` is committed and is what
 * the zip ships, so a re-vendor that rebuilds nothing would leave the bundle
 * behind its source with every other assertion green on the stale file;
 * `check-html.ts` recomputes this hash and fails that.
 */
const scriptsRoot = join(sourceRoot, "js");
if (existsSync(scriptsRoot)) {
  cpSync(scriptsRoot, join(outputRoot, "assets", "js"), { recursive: true });

  const entry = join(scriptsRoot, "main.js");
  if (existsSync(entry)) {
    const bundle = spawnSync(
      "bun",
      ["build", entry, "--format=iife", "--target=browser"],
      { cwd: repoRoot, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
    );
    if (bundle.status !== 0 || !bundle.stdout.trim()) {
      throw new Error(`HTML script bundle failed:\n${bundle.stdout}\n${bundle.stderr}`);
    }
    writeFileSync(
      join(outputRoot, "assets", "main.js"),
      `/* tt-html-bundle src-sha256=${scriptSourceHash(scriptsRoot)} */\n` +
        bundle.stdout.trimEnd() +
        "\n",
    );
  }
}

for (const route of config.routes) {
  const output = contained(outputRoot, route.output);
  const html = readFileSync(output, "utf8");
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    /* The schemes that are not a file in `dist/`. `geo:` (RFC 5870) joined the
       list for carafe's `/visit`, whose "open in a map app" link hands the
       café's coordinates to whatever the operating system routes them to; it
       is a real destination and the resolver below would have gone looking for
       `dist/visit/geo:45.5761,-73.5556…/index.html`. Anything absolute and
       non-local belongs here rather than in a theme's markup. */
    if (/^(?:https?:|mailto:|tel:|sms:|geo:|data:)/.test(target)) continue;
    const [pathname, fragment] = target.split("#", 2);
    let resolved = pathname ? resolve(dirname(output), pathname) : output;
    if (pathname?.endsWith("/") || existsSync(resolved) && !resolved.includes(".")) {
      resolved = join(resolved, "index.html");
    }
    if (!existsSync(resolved)) {
      throw new Error(`${route.output} references missing local target ${target}`);
    }
    if (fragment) {
      const destination = readFileSync(resolved, "utf8");
      if (!destination.includes(`id="${fragment}"`)) {
        throw new Error(`${route.output} references missing fragment ${target}`);
      }
    }
  }
}

writeFileSync(
  join(outputRoot, "html-manifest.json"),
  JSON.stringify(
    {
      slug,
      engine: "nunjucks",
      runtime: "vanilla",
      routes: built,
    },
    null,
    2,
  ) + "\n",
);

console.log(`Built ${slug} HTML edition: ${built.length} routes`);
