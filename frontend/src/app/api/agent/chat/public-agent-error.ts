const PROVIDER_ERROR =
  "Agent generation failed. Check OPENAI_API_KEY / ANTHROPIC_API_KEY and try again.";

const MEMORY_ERROR =
  "Agent memory failed. Check DATABASE_URL and try again.";

/** Sanitize agent/memory errors for the client (no secrets). */
export function publicAgentError(err: unknown): string {
  if (
    err instanceof Error &&
    (err.name === "MissingDatabaseUrlError" ||
      /DATABASE_URL is not configured/i.test(err.message))
  ) {
    return MEMORY_ERROR;
  }

  const raw = err instanceof Error ? err.message : String(err);
  if (
    /api[_-]?key|sk-|sk-ant-|bearer|postgres(ql)?:\/\/|DATABASE_URL|password|connectionstring/i.test(
      raw,
    )
  ) {
    if (/postgres|database|connection|DATABASE_URL/i.test(raw)) {
      return MEMORY_ERROR;
    }
    return PROVIDER_ERROR;
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return PROVIDER_ERROR;
  }
  return trimmed.length > 240 ? `${trimmed.slice(0, 240)}…` : trimmed;
}

export function logAgentError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error("[api/agent/chat]", message);
  if (err instanceof Error && err.stack) {
    console.error(err.stack);
  }
}

export { PROVIDER_ERROR, MEMORY_ERROR };
