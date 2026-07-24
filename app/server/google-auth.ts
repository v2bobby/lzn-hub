import { z } from "zod";
import { SignJWT, jwtVerify } from "jose";
import { createRouter, publicQuery } from "./middleware";
import { env } from "./lib/env";
import { findOrCreateUser } from "./queries/users";

const jwtSecret = new TextEncoder().encode(env.jwtSecret);

async function createToken(userId: number): Promise<string> {
  return new SignJWT({ userId, type: "google" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwtSecret);
}

export async function verifyGoogleToken(token: string): Promise<{ userId: number } | null> {
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

export const googleAuthRouter = createRouter({
  url: publicQuery.query(() => {
    if (!env.googleClientId) {
      return { url: "" };
    }

    const redirectUri = `${env.oauthRedirectUri}`;
    const state = btoa(redirectUri);

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", env.googleClientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("state", state);
    url.searchParams.set("prompt", "select_account");

    return { url: url.toString() };
  }),

  callback: publicQuery
    .input(
      z.object({
        code: z.string(),
        state: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!env.googleClientId || !env.googleClientSecret) {
        throw new Error("Google OAuth is not configured");
      }

      // Exchange code for tokens
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: env.googleClientId,
          client_secret: env.googleClientSecret,
          code: input.code,
          redirect_uri: env.oauthRedirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenRes.ok) {
        throw new Error("Failed to exchange Google code for tokens");
      }

      const tokenData = (await tokenRes.json()) as { id_token?: string; access_token?: string };
      const idToken = tokenData.id_token;

      if (!idToken) {
        throw new Error("No id_token in Google response");
      }

      // Get user info from Google
      const userInfoRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
      );

      if (!userInfoRes.ok) {
        throw new Error("Failed to verify Google id_token");
      }

      const userInfo = (await userInfoRes.json()) as { email?: string; name?: string; picture?: string };

      const user = await findOrCreateUser(
        {
          email: userInfo.email || "",
          name: userInfo.name || userInfo.email?.split("@")[0] || "User",
          avatar: userInfo.picture || undefined,
        },
        "google"
      );

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
});
