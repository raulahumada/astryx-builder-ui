import { describe, expect, it } from "vitest";

import { textFromMessageParts } from "./message-parts";

describe("textFromMessageParts", () => {
  it("joins text parts", () => {
    expect(
      textFromMessageParts([
        { type: "text", text: "Hello" },
        { type: "text", text: " world" },
      ]),
    ).toBe("Hello world");
  });

  it("ignores non-text parts", () => {
    expect(
      textFromMessageParts([
        { type: "step-start" },
        { type: "text", text: "Only this" },
        { type: "tool-invocation" },
      ]),
    ).toBe("Only this");
  });

  it("returns empty string for missing parts", () => {
    expect(textFromMessageParts(undefined)).toBe("");
    expect(textFromMessageParts([])).toBe("");
  });
});
