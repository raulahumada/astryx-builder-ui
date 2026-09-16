import type { EnabledModel } from "./types";

/**
 * Catalog of models allowed for the Mastra chat agent.
 * Defaults (primary / fallback) come from env and MUST match an entry here.
 */
export const ENABLED_MODELS = [
  {
    id: "openai/gpt-4o-mini",
    provider: "openai",
    label: "GPT-4o mini",
  },
  {
    id: "openai/gpt-4o",
    provider: "openai",
    label: "GPT-4o",
  },
  {
    id: "anthropic/claude-3-5-haiku-latest",
    provider: "anthropic",
    label: "Claude 3.5 Haiku",
  },
  {
    id: "anthropic/claude-sonnet-4-5",
    provider: "anthropic",
    label: "Claude Sonnet 4.5",
  },
] as const satisfies readonly EnabledModel[];
