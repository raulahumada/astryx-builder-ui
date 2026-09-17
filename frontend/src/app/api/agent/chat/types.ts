import type { ChatSystemVars } from "@/mastra/prompts/types";

export type ChatRequestBody = {
  messages?: unknown;
  /** Optional AI SDK trigger passthrough */
  trigger?: unknown;
  /** Mastra memory thread (= builder chatId) */
  thread?: unknown;
  resource?: unknown;
  memory?: {
    thread?: unknown;
    resource?: unknown;
  };
};

export type PromptVarsResolution =
  | { ok: true; vars: ChatSystemVars }
  | { ok: false; error: string };

export type ChatHistoryResponse = {
  messages: unknown[];
};
