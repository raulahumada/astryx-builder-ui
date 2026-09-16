"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef } from "react";

export type UseBuilderChatOptions = {
  chatId?: string;
  initialPrompt?: string;
};

export function useBuilderChat({
  chatId,
  initialPrompt,
}: UseBuilderChatOptions = {}) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agent/chat",
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: chatId,
    transport,
  });

  // Per-instance guard only — a module-level Set breaks React Strict Mode
  // remounts (first mount sends, remount gets a fresh empty chat and skips).
  const sentInitialRef = useRef(false);

  useEffect(() => {
    sentInitialRef.current = false;
  }, [chatId, initialPrompt]);

  useEffect(() => {
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
  }, [initialPrompt, status, messages.length, sendMessage]);

  return { messages, sendMessage, status, error };
}
