import { expect, test } from "@playwright/test";

test.describe("builder", () => {
  test("shows empty preview copy on /chats/demo", async ({ page }) => {
    await page.goto("/chats/demo");
    await expect(
      page.getByText("Your Astryx generation will show here."),
    ).toBeVisible();
  });
});
