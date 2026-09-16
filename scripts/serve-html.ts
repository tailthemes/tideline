import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: bun run preview-html <theme-slug> [--port 4173]");
  process.exit(2);
}

const standalone = process.argv.includes("--standalone");
const portIndex = process.argv.indexOf("--port");
const port = portIndex === -1 ? 4173 : Number(process.argv[portIndex + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("--port must be an integer from 1 to 65535");
}

const outputRoot = standalone
  ? join(process.cwd(), "html", "dist")
  : join(process.cwd(), "themes", slug, "html", "dist");

if (!existsSync(join(outputRoot, "index.html"))) {
  throw new Error(`HTML output is missing. Run bun run build-html ${slug} first.`);
}

function contained(pathname: string): string {
  const target = resolve(outputRoot, `.${pathname}`);
  if (target !== outputRoot && !target.startsWith(outputRoot + sep)) {
    throw new Error("Path escapes the HTML output directory");
  }
  return target;
}

const mimeTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

const hostname = "127.0.0.1";
const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", `http://${hostname}:${port}`);
    let pathname: string;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      response.writeHead(400).end("Bad request");
      return;
    }

    let filePath: string;
    try {
      filePath = contained(pathname);
    } catch {
      response.writeHead(400).end("Bad request");
      return;
    }

    if (pathname.endsWith("/") || existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, "index.html");
    } else if (!extname(pathname) && !existsSync(filePath)) {
      filePath = join(filePath, "index.html");
    }

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream",
    });
    response.end(readFileSync(filePath));
});

server.listen(port, hostname, () => {
  console.log(`${slug} HTML preview: http://${hostname}:${port}`);
});
