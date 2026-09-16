import type { ChatSystemVars } from "@/mastra/prompts/types";

export type ChatRequestBody = {
  messages?: unknown;
  /** Optional AI SDK trigger passthrough */
  trigger?: unknown;
};

export type PromptVarsResolution =
  | { ok: true; vars: ChatSystemVars }
  | { ok: false; error: string };
