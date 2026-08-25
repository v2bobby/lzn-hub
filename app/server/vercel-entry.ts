import "dotenv/config";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { createOAuthCallbackHandler } from "./kimi/auth";

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

// Export for Vercel serverless.
// This file is bundled by esbuild into api/index.js at build time so that the
// Vercel Node runtime never has to compile TypeScript or resolve the
// @db/* and @contracts/* path aliases, which it cannot do.
export default handle(app);
