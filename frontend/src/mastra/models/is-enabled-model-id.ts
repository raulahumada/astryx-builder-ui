import { ENABLED_MODELS } from "./config";
import type { EnabledModelId, ModelProvider } from "./types";

export function isEnabledModelId(
  modelId: string,
  provider?: ModelProvider,
): modelId is EnabledModelId {
  return ENABLED_MODELS.some(
    (m) =>
      m.id === modelId &&
      (provider === undefined || m.provider === provider),
  );
}
