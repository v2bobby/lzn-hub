import { createRouter, publicQuery } from "./middleware";
import { contractRouter } from "./contract-router";
import { localAuthRouter } from "./local-auth";
import { googleAuthRouter } from "./google-auth";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  contract: contractRouter,
  localAuth: localAuthRouter,
  googleAuth: googleAuthRouter,
});

export type AppRouter = typeof appRouter;
