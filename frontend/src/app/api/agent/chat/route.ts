import { handleChatStream } from "@mastra/ai-sdk";
import type { ChatStreamHandlerParams } from "@mastra/ai-sdk";
import { toAISdkMessages } from "@mastra/ai-sdk/ui";
import { createUIMessageStreamResponse } from "ai";
import { NextResponse } from "next/server";

import { mastra } from "@/mastra";
import { resolveMemoryIds } from "@/mastra/memory/resolve-memory-ids";

import { hasUsableChatMessages } from "./has-usable-chat-messages";
import { logAgentError, publicAgentError } from "./public-agent-error";
import type { ChatRequestBody } from "./types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!hasUsableChatMessages(body.messages)) {
    return NextResponse.json(
      {
        error: "messages is required and must include usable user text",
      },
      { status: 400 },
    );
  }

  const memoryIds = resolveMemoryIds(body);
  if (!memoryIds.ok) {
    return NextResponse.json({ error: memoryIds.error }, { status: 400 });
  }

  try {
    // Mastra pins internal AI SDK v7 types that are structurally close but not
    // identical to the app's `ai` package UIMessage — cast at the boundary.
    const params = {
      messages: body.messages,
      memory: {
        thread: memoryIds.ids.thread,
        resource: memoryIds.ids.resource,
      },
      ...(body.trigger === "submit-message" ||
      body.trigger === "regenerate-message"
        ? { trigger: body.trigger }
        : {}),
    } as ChatStreamHandlerParams;

    const stream = await handleChatStream({
      mastra,
      agentId: "chat-agent",
      version: "v7",
      params,
      onError: (err) => {
        logAgentError(err);
        return publicAgentError(err);
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (err) {
    logAgentError(err);
    return NextResponse.json(
      { error: publicAgentError(err) },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const memoryIds = resolveMemoryIds({
    thread: url.searchParams.get("thread"),
    resource: url.searchParams.get("resource"),
  });
  if (!memoryIds.ok) {
    return NextResponse.json({ error: memoryIds.error }, { status: 400 });
  }

  try {
    const agent = mastra.getAgentById("chat-agent");
    const memory = await agent.getMemory();
    if (!memory) {
      return NextResponse.json({ messages: [] });
    }

    const recalled = await memory.recall({
      threadId: memoryIds.ids.thread,
      resourceId: memoryIds.ids.resource,
    });

    const messages = toAISdkMessages(recalled.messages ?? [], {
      version: "v7",
    });

    return NextResponse.json({ messages });
  } catch (err) {
    logAgentError(err);
    return NextResponse.json(
      { error: publicAgentError(err) },
      { status: 500 },
    );
  }
}
