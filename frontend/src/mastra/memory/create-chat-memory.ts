import { Memory } from "@mastra/memory";

import { DEFAULT_LAST_MESSAGES } from "./constants";
import { getChatPostgresStore } from "./get-chat-postgres-store";
import { PROJECT_WORKING_MEMORY_TEMPLATE } from "./working-memory-template";

let cachedMemory: Memory | undefined;

export {
  MissingDatabaseUrlError,
} from "./get-chat-postgres-store";

/** Lazily create (and cache) Postgres-backed Memory for chat-agent. */
export function createChatMemory(): Memory {
  if (cachedMemory) {
    return cachedMemory;
  }

  cachedMemory = new Memory({
    storage: getChatPostgresStore(),
    options: {
      lastMessages: DEFAULT_LAST_MESSAGES,
      workingMemory: {
        enabled: true,
        scope: "thread",
        template: PROJECT_WORKING_MEMORY_TEMPLATE,
      },
    },
  });

  return cachedMemory;
}

/** Test helper — clears the singleton between unit tests. */
export function resetChatMemoryCacheForTests() {
  cachedMemory = undefined;
}
