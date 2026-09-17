import { describe, expect, it } from "vitest";

import { MissingDatabaseUrlError } from "@/mastra/memory/create-chat-memory";

import {
  MEMORY_ERROR,
  PROVIDER_ERROR,
  publicAgentError,
} from "./public-agent-error";

describe("publicAgentError", () => {
  it("maps MissingDatabaseUrlError to memory message", () => {
    expect(publicAgentError(new MissingDatabaseUrlError())).toBe(MEMORY_ERROR);
  });

  it("redacts connection strings", () => {
    expect(
      publicAgentError(
        new Error('connect ECONNREFUSED postgresql://user:secret@host/db'),
      ),
    ).toBe(MEMORY_ERROR);
  });

  it("redacts API key material", () => {
    expect(publicAgentError(new Error("Invalid API key sk-abc"))).toBe(
      PROVIDER_ERROR,
    );
  });

  it("passes through short safe messages", () => {
    expect(publicAgentError(new Error("Model overloaded"))).toBe(
      "Model overloaded",
    );
  });
});
