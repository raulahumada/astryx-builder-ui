import { describe, expect, it } from "vitest";

import { hasUsableChatMessages } from "./has-usable-chat-messages";

describe("hasUsableChatMessages", () => {
  it("accepts a user message with text parts", () => {
    expect(
      hasUsableChatMessages([
        {
          id: "1",
          role: "user",
          parts: [{ type: "text", text: "Hello" }],
        },
      ]),
    ).toBe(true);
  });

  it("rejects empty or missing messages", () => {
    expect(hasUsableChatMessages(undefined)).toBe(false);
    expect(hasUsableChatMessages([])).toBe(false);
    expect(hasUsableChatMessages("nope")).toBe(false);
  });

  it("rejects assistant-only payloads", () => {
    expect(
      hasUsableChatMessages([
        {
          id: "1",
          role: "assistant",
          parts: [{ type: "text", text: "Hi" }],
        },
      ]),
    ).toBe(false);
  });

  it("rejects blank user text", () => {
    expect(
      hasUsableChatMessages([
        {
          id: "1",
          role: "user",
          parts: [{ type: "text", text: "   " }],
        },
      ]),
    ).toBe(false);
  });
});
