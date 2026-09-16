import { describe, expect, it } from "vitest";
import { MOCK_PROJECT_TITLE } from "../model/mock-session";
import { projectTitleFromPrompt } from "./project-title";

describe("projectTitleFromPrompt", () => {
  it("returns the mock title for blank prompts", () => {
    expect(projectTitleFromPrompt("")).toBe(MOCK_PROJECT_TITLE);
    expect(projectTitleFromPrompt("   ")).toBe(MOCK_PROJECT_TITLE);
  });

  it("returns the trimmed prompt when short enough", () => {
    expect(projectTitleFromPrompt("  Lawyer landing  ")).toBe("Lawyer landing");
  });

  it("truncates long prompts with an ellipsis", () => {
    const long = "a".repeat(60);
    expect(projectTitleFromPrompt(long)).toBe(`${"a".repeat(45)}…`);
  });
});
