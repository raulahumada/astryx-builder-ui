export type ModelProvider = "openai" | "anthropic";

export type EnabledModel = {
  /** Mastra model router id, e.g. `openai/gpt-4o-mini` */
  id: EnabledModelId;
  provider: ModelProvider;
  label: string;
};

export type EnabledModelId =
  | "openai/gpt-4o-mini"
  | "openai/gpt-4o"
  | "anthropic/claude-3-5-haiku-latest"
  | "anthropic/claude-sonnet-4-5";

export type ChatModelFallbackEntry = {
  model: string;
  maxRetries: number;
};
