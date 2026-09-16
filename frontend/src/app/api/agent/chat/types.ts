import type { ChatSystemVars } from "@/mastra/prompts/types";

export type ChatRequestBody = {
  message?: unknown;
  promptVars?: unknown;
};

export type PromptVarsResolution =
  | { ok: true; vars: ChatSystemVars }
  | { ok: false; error: string };
