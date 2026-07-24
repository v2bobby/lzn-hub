import { z } from "zod";

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

function camelCaseEnv(env: NodeJS.ProcessEnv): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(env)) {
    result[toCamelCase(key)] = value;
  }
  return result;
}

const envSchema = z.object({
  nodeEnv: z.string().default("development"),
  port: z.string().default("3000"),
  host: z.string().default("0.0.0.0"),

  databaseUrl: z.string(),

  appId: z.string(),
  appSecret: z.string(),
  kimiAuthUrl: z.string().url().default("https://agents-auth.5i.work"),
  kimiOpenUrl: z.string().url().default("https://open.kimi.com"),
  oauthRedirectUri: z.string().url().default("http://localhost:3000/api/google/callback"),
  ownerUnionId: z.string().default(""),

  jwtSecret: z.string().min(8).default("change-me-in-production-32-chars!!"),

  googleClientId: z.string().default(""),
  googleClientSecret: z.string().default(""),
});

function loadEnv() {
  const camelEnv = camelCaseEnv(process.env);
  const parsed = envSchema.safeParse(camelEnv);

  if (!parsed.success) {
    const errors = Object.entries(parsed.error.flatten().fieldErrors)
      .map(([k, v]) => `  ${k}: ${v?.join(", ")}`)
      .join("\n");

    throw new Error(`Missing or invalid environment variables:\n${errors}`);
  }

  return parsed.data;
}

export const env = loadEnv();
