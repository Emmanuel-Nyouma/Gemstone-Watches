import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cachedDatabase: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!cachedDatabase) {
    const client = neon(process.env.DATABASE_URL);
    cachedDatabase = drizzle({ client, schema });
  }

  return cachedDatabase;
}
