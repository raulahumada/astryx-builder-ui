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

async function mockAgentChat(
  page: import("@playwright/test").Page,
  options?: {
    historyMessages?: Array<{
      id: string;
      role: "user" | "assistant";
      parts: Array<{ type: "text"; text: string }>;
    }>;
    onPost?: (body: Record<string, unknown>) => void;
  },
) {
  await page.route("**/api/agent/chat**", async (route) => {
    const request = route.request();
    const method = request.method();

    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ messages: options?.historyMessages ?? [] }),
      });
      return;
    }

    if (method === "POST") {
      const raw = request.postData() ?? "{}";
      let body: Record<string, unknown> = {};
      try {
        body = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        body = {};
      }
      options?.onPost?.(body);
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: MOCK_CHAT_SSE,
      });
      return;
    }

    await route.fulfill({
      status: 405,
      contentType: "application/json",
      body: JSON.stringify({ error: "Method not allowed" }),
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

  test("streams assistant text after composer submit and sends thread", async ({
    page,
  }) => {
    let postedBody: Record<string, unknown> | undefined;
    await mockAgentChat(page, {
      onPost: (body) => {
        postedBody = body;
      },
    });
    await page.goto("/chats/demo");

    const composer = page.getByRole("textbox", { name: "Message input" });
    await composer.fill("Build a landing page");
    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByText("Build a landing page")).toBeVisible();
    await expect(page.getByText("Hello from mock")).toBeVisible();
    await expect(
      page.getByText("Your Astryx generation will show here."),
    ).toBeVisible();

    await expect.poll(() => postedBody?.thread).toBe("demo");
  });

  test("hydrates recalled history on load", async ({ page }) => {
    await mockAgentChat(page, {
      historyMessages: [
        {
          id: "u1",
          role: "user",
          parts: [{ type: "text", text: "Prior user turn" }],
        },
        {
          id: "a1",
          role: "assistant",
          parts: [{ type: "text", text: "Prior assistant turn" }],
        },
      ],
    });

    await page.goto("/chats/demo");

    await expect(page.getByText("Prior user turn")).toBeVisible();
    await expect(page.getByText("Prior assistant turn")).toBeVisible();
  });
});
