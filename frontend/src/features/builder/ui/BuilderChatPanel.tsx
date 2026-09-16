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
import { BuilderActivityFeed } from "./BuilderActivityFeed";
import {
  BUILDER_ICONS,
  BUILDER_MODEL_OPTIONS,
  DEFAULT_BUILDER_MODEL_ID,
  MOCK_COMPOSER_PLACEHOLDER,
  MOCK_USER_PROMPT,
} from "../model/mock-session";

type BuilderChatPanelProps = {
  initialPrompt?: string;
};

export function BuilderChatPanel({
  initialPrompt,
}: BuilderChatPanelProps) {
  const [value, setValue] = useState("");
  const [modelId, setModelId] = useState(DEFAULT_BUILDER_MODEL_ID);
  const userPrompt = initialPrompt?.trim() || MOCK_USER_PROMPT;

  const activeModel =
    BUILDER_MODEL_OPTIONS.find((option) => option.id === modelId) ??
    BUILDER_MODEL_OPTIONS[0];

  return (
    <ChatLayout
      density="compact"
      scrollButton={null}
      composer={
        <ChatComposer
          value={value}
          onChange={setValue}
          onSubmit={() => {}}
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
        <ChatMessage sender="user">
          <ChatMessageBubble>{userPrompt}</ChatMessageBubble>
        </ChatMessage>

        <ChatMessage sender="assistant">
          <ChatMessageBubble variant="ghost" width="100%">
            <BuilderActivityFeed />
          </ChatMessageBubble>
        </ChatMessage>
      </ChatMessageList>
    </ChatLayout>
  );
}
