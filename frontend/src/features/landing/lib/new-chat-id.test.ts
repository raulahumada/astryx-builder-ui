import { describe, expect, it, vi } from "vitest";
import { newChatId } from "./new-chat-id";

describe("newChatId", () => {
  it("uses crypto.randomUUID when available", () => {
    vi.stubGlobal("crypto", {
      randomUUID: () => "uuid-123",
    });

    expect(newChatId()).toBe("uuid-123");
    vi.unstubAllGlobals();
  });

  it("falls back to a chat- prefix when randomUUID is missing", () => {
    vi.stubGlobal("crypto", {});
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);

    expect(newChatId()).toMatch(/^chat-/);

    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
});
