import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { env } from "./lib/env";

const jwtSecret = new TextEncoder().encode(env.jwtSecret);

async function createToken(userId: number): Promise<string> {
  return new SignJWT({ userId, type: "local" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwtSecret);
}

export async function verifyLocalToken(token: string): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret, { clockTolerance: 60 });
    if (typeof payload.userId === "number") {
      return { userId: payload.userId };
    }
    return null;
  } catch {
    return null;
  }
}

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        password: z.string().min(6).max(100),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if email already exists
      const existing = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existing) {
        throw new Error("An account with this email already exists");
      }

      const passwordHash = await bcrypt.hash(input.password, 12);

      const [result] = await db.insert(users).values({
        email: input.email,
        name: input.name,
        passwordHash,
        authType: "local",
        lastSignInAt: new Date(),
      }).$returningId();

      const token = await createToken(result.id);

      return {
        token,
        user: {
          id: result.id,
          name: input.name,
          email: input.email,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const user = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (!user || !user.passwordHash) {
        throw new Error("Invalid email or password");
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new Error("Invalid email or password");
      }

      // Update last sign in
      await db.update(users)
        .set({ lastSignInAt: new Date() })
        .where(eq(users.id, user.id));

      const token = await createToken(user.id);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    // Check for local auth token in x-local-auth-token header
    const localToken = ctx.req?.headers.get("x-local-auth-token");

    if (localToken) {
      const payload = await verifyLocalToken(localToken);
      if (payload) {
        const db = getDb();
        const user = await db.query.users.findFirst({
          where: eq(users.id, payload.userId),
        });
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          };
        }
      }
    }

    // Fall back to existing auth context
    if (ctx.user) {
      return {
        id: ctx.user.id,
        name: ctx.user.name,
        email: ctx.user.email,
        avatar: ctx.user.avatar,
        role: ctx.user.role,
      };
    }

    return null;
  }),

  logout: publicQuery.mutation(() => {
    return { success: true };
  }),
});
