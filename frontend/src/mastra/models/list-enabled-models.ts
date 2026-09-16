import { ENABLED_MODELS } from "./config";
import type { EnabledModel, ModelProvider } from "./types";

export function listEnabledModels(
  provider?: ModelProvider,
): readonly EnabledModel[] {
  if (!provider) {
    return ENABLED_MODELS;
  }
  return ENABLED_MODELS.filter((m) => m.provider === provider);
}
