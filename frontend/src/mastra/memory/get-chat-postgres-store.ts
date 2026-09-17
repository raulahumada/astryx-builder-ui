import { PostgresStore } from "@mastra/pg";

import { CHAT_MEMORY_STORAGE_ID } from "./constants";

let cachedStore: PostgresStore | undefined;

export class MissingDatabaseUrlError extends Error {
  constructor() {
    super("DATABASE_URL is not configured");
    this.name = "MissingDatabaseUrlError";
  }
}

/** Shared Postgres store for Mastra root + chat Memory. */
export function getChatPostgresStore(): PostgresStore {
  if (cachedStore) {
    return cachedStore;
  }

  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new MissingDatabaseUrlError();
  }

  cachedStore = new PostgresStore({
    id: CHAT_MEMORY_STORAGE_ID,
    connectionString,
  });

  return cachedStore;
}

export function resetChatPostgresStoreForTests() {
  cachedStore = undefined;
}
