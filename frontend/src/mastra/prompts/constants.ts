import type { PromptId } from "./types";

/** Pinned template version for chat system instructions. */
export const CHAT_SYSTEM_PROMPT_VERSION = "v1" as const;

export const DEFAULT_CHAT_PROMPT_VARS = {
  productName: "Astryx",
  locale: "en",
} as const;

export const PROMPTS_ROOT_SEGMENTS = ["src", "mastra", "prompts"] as const;

export const TEMPLATE_RELATIVE_PATH: Record<PromptId, string> = {
  "chat/system": `chat/${CHAT_SYSTEM_PROMPT_VERSION}.system.njk`,
};
