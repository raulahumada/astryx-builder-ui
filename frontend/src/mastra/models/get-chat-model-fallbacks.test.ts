import { afterEach, describe, expect, it } from "vitest";

import { getChatModelFallbacks } from "./get-chat-model-fallbacks";

const ORIGINAL_OPENAI = process.env.MASTRA_OPENAI_MODEL;
const ORIGINAL_ANTHROPIC = process.env.MASTRA_ANTHROPIC_MODEL;

afterEach(() => {
  if (ORIGINAL_OPENAI === undefined) {
    delete process.env.MASTRA_OPENAI_MODEL;
  } else {
    process.env.MASTRA_OPENAI_MODEL = ORIGINAL_OPENAI;
  }
  if (ORIGINAL_ANTHROPIC === undefined) {
    delete process.env.MASTRA_ANTHROPIC_MODEL;
  } else {
    process.env.MASTRA_ANTHROPIC_MODEL = ORIGINAL_ANTHROPIC;
  }
});

describe("getChatModelFallbacks", () => {
  it("reads primary and fallback from env when enabled", () => {
    process.env.MASTRA_OPENAI_MODEL = "openai/gpt-4o-mini";
    process.env.MASTRA_ANTHROPIC_MODEL = "anthropic/claude-haiku-4-5-20251001";

    expect(getChatModelFallbacks()).toEqual([
      { model: "openai/gpt-4o-mini", maxRetries: 2 },
      { model: "anthropic/claude-haiku-4-5-20251001", maxRetries: 2 },
    ]);
  });

  it("throws when env model is missing", () => {
    delete process.env.MASTRA_OPENAI_MODEL;
    process.env.MASTRA_ANTHROPIC_MODEL = "anthropic/claude-haiku-4-5-20251001";

    expect(() => getChatModelFallbacks()).toThrow(
      /MASTRA_OPENAI_MODEL is required/,
    );
  });

  it("throws when env model is not in enabled config", () => {
    process.env.MASTRA_OPENAI_MODEL = "openai/not-a-real-model";
    process.env.MASTRA_ANTHROPIC_MODEL = "anthropic/claude-haiku-4-5-20251001";

    expect(() => getChatModelFallbacks()).toThrow(
      /not an enabled openai model/,
    );
  });
});
