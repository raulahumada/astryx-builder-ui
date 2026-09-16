import { describe, expect, it } from "vitest";

import { render } from "./render";

describe("render", () => {
  it("interpolates chat system vars", () => {
    const text = render("chat/system", {
      productName: "Astryx",
      locale: "en",
    });

    expect(text).toContain("Astryx");
    expect(text).toContain("locale: en");
    expect(text).not.toContain("{{ productName }}");
    expect(text).toMatch(/Do NOT generate UI components/i);
  });

  it("throws when a required variable is missing", () => {
    expect(() =>
      render("chat/system", {
        productName: "Astryx",
      } as { productName: string; locale: string }),
    ).toThrow();
  });
});
