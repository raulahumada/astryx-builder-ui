import { handleChatStream } from "@mastra/ai-sdk";
import type { ChatStreamHandlerParams } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse } from "ai";
import { NextResponse } from "next/server";

import { mastra } from "@/mastra";

import { hasUsableChatMessages } from "./has-usable-chat-messages";
import type { ChatRequestBody } from "./types";

export const runtime = "nodejs";
export const maxDuration = 60;

const PROVIDER_ERROR =
  "Agent generation failed. Check OPENAI_API_KEY / ANTHROPIC_API_KEY and try again.";

function publicAgentError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  // Never echo secrets if a provider includes them in the message.
  if (/api[_-]?key|sk-|sk-ant-|bearer/i.test(raw)) {
    return PROVIDER_ERROR;
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return PROVIDER_ERROR;
  }
  // Keep UI concise; full detail stays in the server log.
  return trimmed.length > 240 ? `${trimmed.slice(0, 240)}…` : trimmed;
}

function logAgentError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error("[api/agent/chat]", message);
  if (err instanceof Error && err.stack) {
    console.error(err.stack);
  }
}

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

  try {
    // Mastra pins internal AI SDK v7 types that are structurally close but not
    // identical to the app's `ai` package UIMessage — cast at the boundary.
    const params = {
      messages: body.messages,
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

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
