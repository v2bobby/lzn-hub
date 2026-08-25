import "dotenv/config";
import type { IncomingMessage, ServerResponse } from "http";
import { Hono } from "hono";
import { getRequestListener } from "@hono/node-server";
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

const honoListener = getRequestListener(app.fetch);

function readRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Export for Vercel serverless.
//
// Three things matter here:
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
//
// 3. @hono/node-server's Vercel body handling only takes its fast path
//    (synchronously wrapping the body into a Request) when Vercel attaches
//    `rawBody` (a Buffer) to the incoming request. On this runtime it
//    doesn't, so it falls back to `Readable.toWeb(incoming).getReader()`,
//    a pull-based read against Vercel's request object that never
//    resolves - every POST with a body (register, login, contract
//    mutations, etc.) hangs for the full function timeout with no error.
//    Buffering the body ourselves with plain 'data'/'end' events (which
//    Vercel's request object does support) and attaching it as `rawBody`
//    before handing off routes @hono/node-server onto its working
//    synchronous path instead.
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET" && req.method !== "HEAD" && !("rawBody" in req)) {
    (req as IncomingMessage & { rawBody?: Buffer }).rawBody = await readRawBody(req);
  }
  return honoListener(req, res);
}
