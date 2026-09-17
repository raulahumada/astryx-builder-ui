import { expect, test } from "@playwright/test";

test.describe("landing", () => {
  test("shows headline and composer", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "What do you want to create?" }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Message input" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Contact Form" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Calculator" })).toBeVisible();
  });

  test("submitting a prompt navigates to a chat session", async ({ page }) => {
    await page.goto("/");
    const composer = page.getByRole("textbox", { name: "Message input" });
    await composer.fill("Contact form for a clinic");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page).toHaveURL(/\/chats\/.+\?prompt=/);
  });
});
