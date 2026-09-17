import { DEFAULT_CHAT_RESOURCE_ID } from "./constants";
import type { MemoryIdsResolution } from "./types";

function nonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Resolve Mastra memory thread/resource from a POST body or GET query bag.
 * Accepts top-level `thread`/`resource` or nested `memory.thread`/`memory.resource`.
 */
export function resolveMemoryIds(
  source: unknown,
  defaults: { resource?: string } = {},
): MemoryIdsResolution {
  const defaultResource = defaults.resource ?? DEFAULT_CHAT_RESOURCE_ID;

  if (source === null || typeof source !== "object" || Array.isArray(source)) {
    return { ok: false, error: "thread is required" };
  }

  const record = source as Record<string, unknown>;
  const nested =
    record.memory !== null &&
    typeof record.memory === "object" &&
    !Array.isArray(record.memory)
      ? (record.memory as Record<string, unknown>)
      : undefined;

  const thread =
    nonEmptyString(record.thread) ?? nonEmptyString(nested?.thread);
  if (!thread) {
    return { ok: false, error: "thread is required" };
  }

  const resource =
    nonEmptyString(record.resource) ??
    nonEmptyString(nested?.resource) ??
    defaultResource;

  return { ok: true, ids: { thread, resource } };
}
