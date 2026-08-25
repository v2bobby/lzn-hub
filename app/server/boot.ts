import "dotenv/config";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { sql } from "drizzle-orm";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { getDb } from "./queries/connection";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// Kimi OAuth callback
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

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
    // Create a caller to invoke the tRPC procedure
    const caller = appRouter.createCaller({
      req: c.req.raw,
      resHeaders: new Headers(),
      user: null as any,
    });
    const result = await caller.googleAuth.callback({ code, state: state || undefined });

    // Redirect to frontend auth callback with token
    return c.redirect(`/auth-callback?token=${result.token}&name=${encodeURIComponent(result.user.name || "User")}`);
  } catch (err: any) {
    console.error("Google auth error:", err);
    return c.redirect(`/?error=google_auth_failed&message=${encodeURIComponent(err.message || "")}`);
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

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.nodeEnv === "production") {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(env.port);
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
