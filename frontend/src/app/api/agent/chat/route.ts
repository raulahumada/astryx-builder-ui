import { NextResponse } from "next/server";

import { createChatAgent } from "@/mastra/agents/chat-agent";

import { resolvePromptVars } from "./resolve-prompt-vars";
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

  const message =
    typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json(
      { error: "message is required and must be a non-empty string" },
      { status: 400 },
    );
  }

  const resolved = resolvePromptVars(body.promptVars);
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  let agent;
  try {
    agent = createChatAgent(resolved.vars);
  } catch (err) {
    const messageText =
      err instanceof Error ? err.message : "Failed to render system prompt";
    return NextResponse.json({ error: messageText }, { status: 400 });
  }

  try {
    const stream = await agent.stream(message);
    const encoder = new TextEncoder();

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream.textStream) {
            if (chunk) {
              controller.enqueue(encoder.encode(chunk));
            }
          }
          controller.close();
        } catch {
          controller.error(
            new Error(
              "Agent generation failed. Check OPENAI_API_KEY / ANTHROPIC_API_KEY and try again.",
            ),
          );
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Agent generation failed. Check OPENAI_API_KEY / ANTHROPIC_API_KEY and try again.",
      },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
