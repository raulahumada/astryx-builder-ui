"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";

import { DEFAULT_CHAT_RESOURCE_ID } from "@/mastra/memory/constants";

export type UseBuilderChatOptions = {
  chatId?: string;
  initialPrompt?: string;
};

async function fetchChatHistory(
  chatId: string,
): Promise<UIMessage[] | undefined> {
  const params = new URLSearchParams({
    thread: chatId,
    resource: DEFAULT_CHAT_RESOURCE_ID,
  });
  const response = await fetch(`/api/agent/chat?${params.toString()}`);
  if (!response.ok) {
    return undefined;
  }
  const data = (await response.json()) as { messages?: unknown };
  if (!Array.isArray(data.messages)) {
    return undefined;
  }
  return data.messages as UIMessage[];
}

export function useBuilderChat({
  chatId,
  initialPrompt,
}: UseBuilderChatOptions = {}) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agent/chat",
        // Mastra Memory loads history server-side. Sending the full client
        // transcript causes timestamp/order bugs and the model "forgets" turns.
        prepareSendMessagesRequest({ messages }) {
          const lastMessage = messages[messages.length - 1];
          return {
            body: {
              messages: lastMessage ? [lastMessage] : [],
              thread: chatId,
              resource: DEFAULT_CHAT_RESOURCE_ID,
            },
          };
        },
      }),
    [chatId],
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    id: chatId,
    transport,
  });

  const [hydratedChatId, setHydratedChatId] = useState<string | null>(null);
  const historyReady = !chatId || hydratedChatId === chatId;
  const sentInitialRef = useRef(false);

  useEffect(() => {
    sentInitialRef.current = false;
    if (!chatId) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const history = await fetchChatHistory(chatId);
        if (cancelled) {
          return;
        }
        if (history && history.length > 0) {
          setMessages(history);
        }
      } catch {
        // Hydrate is best-effort; composer still works without history.
      } finally {
        if (!cancelled) {
          setHydratedChatId(chatId);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chatId, setMessages]);

  useEffect(() => {
    if (!historyReady) {
      return;
    }
    const prompt = initialPrompt?.trim();
    if (!prompt) {
      return;
    }
    if (status !== "ready") {
      return;
    }
    if (sentInitialRef.current) {
      return;
    }
    if (messages.length > 0) {
      return;
    }

    sentInitialRef.current = true;
    void sendMessage({ text: prompt });
  }, [historyReady, initialPrompt, status, messages.length, sendMessage]);

  return { messages, sendMessage, status, error, historyReady };
}
