import { describe, expect, it } from "vitest";

import { PROJECT_WORKING_MEMORY_TEMPLATE } from "./working-memory-template";

describe("PROJECT_WORKING_MEMORY_TEMPLATE", () => {
  it("includes project scratchpad sections", () => {
    expect(PROJECT_WORKING_MEMORY_TEMPLATE).toContain("# Project");
    expect(PROJECT_WORKING_MEMORY_TEMPLATE).toContain("Current focus:");
    expect(PROJECT_WORKING_MEMORY_TEMPLATE).toContain("In-progress components:");
  });
});
