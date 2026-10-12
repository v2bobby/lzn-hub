import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";

type App = Hono<{ Bindings: HttpBindings }>;

/**
 * Serves the built site the same way vercel.json does:
 *   1. a real file in dist/public wins,
 *   2. /page resolves to dist/public/page/index.html (pre-rendered pages),
 *   3. anything else gets spa.html, the client-only app shell.
 */
export function serveStaticFiles(app: App) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");

  app.use("*", serveStatic({ root: "./dist/public" }));

  app.notFound((c) => {
    const accept = c.req.header("accept") ?? "";
    if (!accept.includes("text/html")) {
      return c.json({ error: "Not Found" }, 404);
    }

    const pathname = decodeURIComponent(new URL(c.req.url).pathname);
    const pageIndex = path.resolve(distPath, `.${pathname}`, "index.html");
    if (pageIndex.startsWith(distPath) && fs.existsSync(pageIndex)) {
      return c.html(fs.readFileSync(pageIndex, "utf-8"));
    }

    const shell = path.resolve(distPath, "spa.html");
    const fallback = fs.existsSync(shell) ? shell : path.resolve(distPath, "index.html");
    return c.html(fs.readFileSync(fallback, "utf-8"));
  });
}
