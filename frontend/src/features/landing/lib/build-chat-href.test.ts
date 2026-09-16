import { describe, expect, it, vi } from "vitest";
import { buildChatSessionHref } from "./build-chat-href";

describe("buildChatSessionHref", () => {
  it("returns null for blank prompts", () => {
    expect(buildChatSessionHref("")).toBeNull();
    expect(buildChatSessionHref("   ")).toBeNull();
  });

  it("builds /chats/[id]?prompt=… for a non-empty prompt", () => {
    vi.stubGlobal("crypto", {
      randomUUID: () => "test-chat-id",
    });

    const href = buildChatSessionHref("  Contact form  ");
    expect(href).toBe(
      `/chats/test-chat-id?${new URLSearchParams({ prompt: "Contact form" }).toString()}`,
    );

    vi.unstubAllGlobals();
  });
});
