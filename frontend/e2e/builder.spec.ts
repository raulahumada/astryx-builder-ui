import { expect, test } from "@playwright/test";

const MOCK_CHAT_SSE = [
  'data: {"type":"start","messageId":"m1"}',
  "",
  'data: {"type":"text-start","id":"t1"}',
  "",
  'data: {"type":"text-delta","id":"t1","delta":"Hello from mock"}',
  "",
  'data: {"type":"text-end","id":"t1"}',
  "",
  'data: {"type":"finish"}',
  "",
  "data: [DONE]",
  "",
  "",
].join("\n");

async function mockAgentChat(page: import("@playwright/test").Page) {
  await page.route("**/api/agent/chat", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: MOCK_CHAT_SSE,
    });
  });
}

test.describe("builder", () => {
  test("shows empty preview copy on /chats/demo", async ({ page }) => {
    await mockAgentChat(page);
    await page.goto("/chats/demo");
    await expect(
      page.getByText("Your Astryx generation will show here."),
    ).toBeVisible();
  });

  test("streams assistant text after composer submit", async ({ page }) => {
    await mockAgentChat(page);
    await page.goto("/chats/demo");

    const composer = page.getByRole("textbox", { name: "Message input" });
    await composer.fill("Build a landing page");
    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByText("Build a landing page")).toBeVisible();
    await expect(page.getByText("Hello from mock")).toBeVisible();
    await expect(
      page.getByText("Your Astryx generation will show here."),
    ).toBeVisible();
  });
});
