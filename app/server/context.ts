import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalToken } from "./local-auth";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try Kimi OAuth first (for backward compat)
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // Kimi auth not available, try local auth
    try {
      const token = opts.req.headers.get("x-local-auth-token");
      if (token) {
        const payload = await verifyLocalToken(token);
        if (payload) {
          const db = getDb();
          const found = await db.query.users.findFirst({
            where: eq(users.id, payload.userId),
          });
          if (found) ctx.user = found;
        }
      }
    } catch {
      // Local auth failed too — user stays null
    }
  }

  return ctx;
}
