import {
  CHAT_MODEL_MAX_RETRIES,
  MASTRA_ANTHROPIC_MODEL_ENV,
  MASTRA_OPENAI_MODEL_ENV,
} from "./constants";
import { requireEnvModel } from "./require-env-model";
import type { ChatModelFallbackEntry } from "./types";

/** Primary OpenAI + Anthropic fallback from env, validated against enabled config. */
export function getChatModelFallbacks(): ChatModelFallbackEntry[] {
  return [
    {
      model: requireEnvModel(MASTRA_OPENAI_MODEL_ENV, "openai"),
      maxRetries: CHAT_MODEL_MAX_RETRIES,
    },
    {
      model: requireEnvModel(MASTRA_ANTHROPIC_MODEL_ENV, "anthropic"),
      maxRetries: CHAT_MODEL_MAX_RETRIES,
    },
  ];
}
