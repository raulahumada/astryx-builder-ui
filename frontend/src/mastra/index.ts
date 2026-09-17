import { Mastra } from "@mastra/core";

import { chatAgent } from "./agents/chat-agent";
import { getChatPostgresStore } from "./memory/get-chat-postgres-store";

/**
 * Storage on the Mastra root is required for Memory (esp. working memory /
 * message history processors) to load thread history into the LLM.
 * Without it, Mastra falls back to an ephemeral in-memory store.
 */
export const mastra = new Mastra({
  agents: { chatAgent },
  ...(process.env.DATABASE_URL?.trim()
    ? { storage: getChatPostgresStore() }
    : {}),
});
