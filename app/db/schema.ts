import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  authType: mysqlEnum("authType", ["local", "google", "kimi"]).default("local").notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const contracts = mysqlTable("contracts", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  vendor: varchar("vendor", { length: 255 }),
  contractType: mysqlEnum("contractType", ["saas", "vendor", "sow", "freelancer", "lease", "other"]).default("other"),
  fileName: varchar("fileName", { length: 255 }),
  status: mysqlEnum("status", ["uploaded", "analyzing", "completed", "failed"]).default("uploaded"),
  riskScore: int("riskScore"),
  summary: text("summary"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const clauseFindings = mysqlTable("clause_findings", {
  id: serial("id").primaryKey(),
  contractId: bigint("contractId", { mode: "number", unsigned: true }).notNull(),
  clauseName: varchar("clauseName", { length: 255 }).notNull(),
  severity: mysqlEnum("severity", ["critical", "high", "medium", "low"]).notNull(),
  originalText: text("originalText"),
  suggestedText: text("suggestedText"),
  explanation: text("explanation"),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;
export type ClauseFinding = typeof clauseFindings.$inferSelect;
export type InsertClauseFinding = typeof clauseFindings.$inferInsert;
