import { describe, expect, it } from "vitest";

import { DEFAULT_CHAT_RESOURCE_ID } from "./constants";
import { resolveMemoryIds } from "./resolve-memory-ids";

describe("resolveMemoryIds", () => {
  it("reads top-level thread and defaults resource", () => {
    const result = resolveMemoryIds({ thread: "chat-1" });
    expect(result).toEqual({
      ok: true,
      ids: { thread: "chat-1", resource: DEFAULT_CHAT_RESOURCE_ID },
    });
  });

  it("reads nested memory.thread / memory.resource", () => {
    const result = resolveMemoryIds({
      memory: { thread: "t2", resource: "user-1" },
    });
    expect(result).toEqual({
      ok: true,
      ids: { thread: "t2", resource: "user-1" },
    });
  });

  it("rejects missing thread", () => {
    expect(resolveMemoryIds({})).toEqual({
      ok: false,
      error: "thread is required",
    });
    expect(resolveMemoryIds({ thread: "  " }).ok).toBe(false);
  });
});
