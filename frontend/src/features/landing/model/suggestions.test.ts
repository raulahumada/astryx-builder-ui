import { describe, expect, it } from "vitest";
import { SUGGESTION_SETS } from "./suggestions";

describe("SUGGESTION_SETS", () => {
  it("keeps four chips per rotating set", () => {
    expect(SUGGESTION_SETS).toHaveLength(2);
    for (const set of SUGGESTION_SETS) {
      expect(set).toHaveLength(4);
    }
  });

  it("includes Calculator on the default (first-paint) set", () => {
    const calculator = SUGGESTION_SETS[0].find((chip) => chip.id === "calculator");
    expect(calculator).toMatchObject({
      id: "calculator",
      label: "Calculator",
      prompt: "Build a calculator with basic arithmetic operations",
    });
  });

  it("keeps Finance Calculator in a non-default set", () => {
    const finance = SUGGESTION_SETS.flat().find(
      (chip) => chip.id === "finance-calculator",
    );
    expect(finance).toMatchObject({
      id: "finance-calculator",
      label: "Finance Calculator",
    });
    expect(SUGGESTION_SETS[0].some((chip) => chip.id === "finance-calculator")).toBe(
      false,
    );
  });
});
