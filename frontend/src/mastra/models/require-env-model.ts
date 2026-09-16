import { isEnabledModelId } from "./is-enabled-model-id";
import type { ModelProvider } from "./types";

export function requireEnvModel(
  envKey: string,
  provider: ModelProvider,
): string {
  const value = process.env[envKey]?.trim();
  if (!value) {
    throw new Error(
      `${envKey} is required in the environment (must be an enabled ${provider} model from mastra/models/config).`,
    );
  }
  if (!isEnabledModelId(value, provider)) {
    throw new Error(
      `${envKey}=${value} is not an enabled ${provider} model. Update frontend/src/mastra/models/config.ts or pick an enabled id.`,
    );
  }
  return value;
}
