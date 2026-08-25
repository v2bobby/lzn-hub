import "dotenv/config";
import { Hono } from "hono";
import { getRequestListener } from "@hono/node-server";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { sql, eq } from "drizzle-orm";
import { appRouter } from "./router";
import { createContext } from "./context";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";

const app = new Hono();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// Kimi OAuth callback
app.get("/api/oauth/callback", createOAuthCallbackHandler());

// Google OAuth callback
app.get("/api/google/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  if (error) {
    return c.redirect(`/?error=google_${error}`);
  }

  if (!code) {
    return c.redirect("/?error=google_no_code");
  }

  try {
    const caller = appRouter.createCaller({
      req: c.req.raw,
      resHeaders: new Headers(),
      user: undefined,
    });
    const result = await caller.googleAuth.callback({ code, state: state || undefined });

    return c.redirect(`/auth-callback?token=${result.token}&name=${encodeURIComponent(result.user.name || "User")}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    console.error("Google auth error:", err);
    return c.redirect(
      `/?error=google_auth_failed&message=${encodeURIComponent(message)}`,
    );
  }
});

// tRPC API endpoint
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// Health check
app.get("/api/health", (c) => c.json({ ok: true, ts: Date.now() }));

// Temporary diagnostic: isolates DB connectivity from the rest of the
// signup flow so a hang can be timed and attributed to the DB layer
// specifically. Remove once the TiDB connectivity issue is resolved.
app.get("/api/db-health", async (c) => {
  const start = Date.now();
  try {
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    return c.json({ ok: true, ms: Date.now() - start });
  } catch (err) {
    return c.json(
      {
        ok: false,
        ms: Date.now() - start,
        message: err instanceof Error ? err.message : String(err),
        code: (err as { code?: string })?.code,
      },
      500,
    );
  }
});

// Temporary diagnostic: same query the register/login mutations run
// (db.query.users.findFirst via the relational query builder), isolated
// from raw sql`` to see whether RQB itself is what hangs.
app.get("/api/db-health-rqb", async (c) => {
  const start = Date.now();
  try {
    const db = getDb();
    const found = await db.query.users.findFirst({
      where: eq(users.email, "diagnostic-probe@example.com"),
    });
    return c.json({ ok: true, ms: Date.now() - start, found: !!found });
  } catch (err) {
    return c.json(
      {
        ok: false,
        ms: Date.now() - start,
        message: err instanceof Error ? err.message : String(err),
        code: (err as { code?: string })?.code,
      },
      500,
    );
  }
});

// Export for Vercel serverless.
//
// Two things matter here:
//
// 1. This file is bundled by esbuild into api/index.js at build time, so the
//    Vercel Node runtime never has to compile TypeScript or resolve the
//    @db/* and @contracts/* path aliases, which it cannot do.
//
// 2. The export is a Node-style (req, res) listener, not hono/vercel's
//    handle(). Vercel's Node runtime invokes handlers with Node's
//    IncomingMessage/ServerResponse. A fetch-style handler receives those,
//    fails to read them as a Request, returns a Response that nothing
//    consumes, and never calls res.end() - which surfaces as
//    FUNCTION_INVOCATION_TIMEOUT rather than an error.
export default getRequestListener(app.fetch);
