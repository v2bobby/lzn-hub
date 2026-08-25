import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

export function getDb() {
  if (!instance) {
    instance = drizzle({
      // TiDB Serverless requires TLS and silently drops plaintext connection
      // attempts rather than refusing them, so an untrusted connection hangs
      // until the platform timeout instead of returning an error.
      //
      // drizzle.config.ts appends `sslaccept=strict` for drizzle-kit, but that
      // file is only read by the CLI. The runtime connection needs its own TLS
      // configuration, which is what this block is.
      connection: {
        uri: env.databaseUrl,
        ssl: {
          minVersion: "TLSv1.2",
          rejectUnauthorized: true,
        },
        // Without an explicit timeout a blocked connection occupies the whole
        // serverless invocation budget and surfaces as an opaque
        // FUNCTION_INVOCATION_TIMEOUT. Ten seconds fails fast enough to return
        // a readable error to the client.
        connectTimeout: 10_000,
      },
      mode: "planetscale",
      schema: fullSchema,
    });
  }
  return instance;
}