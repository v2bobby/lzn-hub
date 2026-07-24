import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

// Parse the connection URL for drizzle-kit
// TiDB requires SSL - use the raw URL which mysql2 will parse
// Add sslaccept=strict if not present
const connectionUrl = url.includes("sslaccept=") ? url : url + (url.includes("?") ? "&" : "?") + "sslaccept=strict";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    uri: connectionUrl,
  },
});