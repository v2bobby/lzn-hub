import { eq, or } from "drizzle-orm";
import { getDb } from "./connection";
import { users } from "@db/schema";
import type { User, InsertUser } from "@db/schema";
import { env } from "../lib/env";

export async function findUserByUnionId(unionId: string) {
  const rows = await getDb()
    .select()
    .from(users)
    .where(eq(users.unionId, unionId))
    .limit(1);
  return rows.at(0);
}

export async function upsertUser(data: InsertUser) {
  const values = { ...data };
  const updateSet: Partial<InsertUser> = {
    lastSignInAt: new Date(),
    ...data,
  };

  if (
    values.role === undefined &&
    values.unionId &&
    values.unionId === env.ownerUnionId
  ) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  await getDb()
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

type ProviderInfo = {
  unionId?: string;
  email?: string;
  name?: string;
  avatar?: string;
};

export async function findOrCreateUser(info: ProviderInfo, authType: "local" | "google" | "kimi"): Promise<User> {
  const db = getDb();
  const conditions = [];

  if (info.unionId) {
    conditions.push(eq(users.unionId, info.unionId));
  }
  if (info.email) {
    conditions.push(eq(users.email, info.email));
  }

  if (conditions.length === 0) {
    throw new Error("No identifying info provided for user lookup");
  }

  let user = await db.query.users.findFirst({
    where: conditions.length === 1 ? conditions[0] : or(...conditions),
  });

  if (!user) {
    const [result] = await db.insert(users).values({
      unionId: info.unionId || null,
      email: info.email || null,
      name: info.name || (info.email ? info.email.split("@")[0] : "User"),
      avatar: info.avatar || null,
      authType,
      lastSignInAt: new Date(),
    }).$returningId();

    const newUser = await db.query.users.findFirst({
      where: eq(users.id, result.id),
    });
    if (!newUser) throw new Error("Failed to create user");
    user = newUser;
  } else {
    await db.update(users)
      .set({ lastSignInAt: new Date() })
      .where(eq(users.id, user.id));
  }

  return user;
}

export async function getUserById(userId: number): Promise<User | null> {
  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user || null;
}
