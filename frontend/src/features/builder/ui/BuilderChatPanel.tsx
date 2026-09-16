"use client";

import { useState } from "react";
import { Button } from "@astryxdesign/core/Button";
import {
  ChatComposer,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
} from "@astryxdesign/core/Chat";
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu";
import { Icon } from "@astryxdesign/core/Icon";
import { useBuilderChat } from "../hooks/use-builder-chat";
import { textFromMessageParts } from "../lib/message-parts";
import {
  BUILDER_ICONS,
  BUILDER_MODEL_OPTIONS,
  DEFAULT_BUILDER_MODEL_ID,
  MOCK_COMPOSER_PLACEHOLDER,
} from "../model/mock-session";
import type { BuilderChatPanelProps } from "../model/types";

export function BuilderChatPanel({
  chatId,
  initialPrompt,
}: BuilderChatPanelProps) {
  const [value, setValue] = useState("");
  const [modelId, setModelId] = useState(DEFAULT_BUILDER_MODEL_ID);
  const { messages, sendMessage, status, error } = useBuilderChat({
    chatId,
    initialPrompt,
  });

  const activeModel =
    BUILDER_MODEL_OPTIONS.find((option) => option.id === modelId) ??
    BUILDER_MODEL_OPTIONS[0];

  const isBusy = status === "submitted" || status === "streaming";

  return (
    <ChatLayout
      density="compact"
      scrollButton={null}
      composer={
        <ChatComposer
          value={value}
          onChange={setValue}
          isDisabled={isBusy}
          status={
            error
              ? {
                  type: "error",
                  message:
                    error.message ||
                    "Chat failed. Check API keys and try again.",
                }
              : undefined
          }
          onSubmit={(submitted) => {
            if (isBusy) {
              return;
            }
            const text = submitted.trim();
            if (!text) {
              return;
            }
            void sendMessage({ text });
            setValue("");
          }}
          placeholder={MOCK_COMPOSER_PLACEHOLDER}
          footerActions={
            <DropdownMenu
              button={{
                label: activeModel.label,
                variant: "ghost",
                size: "md",
                icon: <Icon icon={BUILDER_ICONS.model} size="sm" />,
                children: activeModel.label,
              }}
              menuWidth={200}
              items={BUILDER_MODEL_OPTIONS.map((option) => ({
                label: option.label,
                onClick: () => setModelId(option.id),
              }))}
            />
          }
          sendActions={
            <Button
              label="Dictate"
              variant="ghost"
              size="md"
              icon={<Icon icon={BUILDER_ICONS.mic} />}
              isIconOnly
              onClick={() => {}}
            />
          }
        />
      }
    >
      <ChatMessageList>
        {messages.map((message) => {
          const text = textFromMessageParts(message.parts);
          if (!text && message.role !== "assistant") {
            return null;
          }
          return (
            <ChatMessage
              key={message.id}
              sender={message.role === "user" ? "user" : "assistant"}
            >
              <ChatMessageBubble
                variant={message.role === "assistant" ? "ghost" : undefined}
                width={message.role === "assistant" ? "100%" : undefined}
              >
                {text}
              </ChatMessageBubble>
            </ChatMessage>
          );
        })}
      </ChatMessageList>
    </ChatLayout>
  );
}
