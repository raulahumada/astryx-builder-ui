"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@astryxdesign/core/Button";
import { ChatComposer } from "@astryxdesign/core/Chat";
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Layout";
import {
  DEFAULT_MODEL_ID,
  LANDING_ICONS,
  MODEL_OPTIONS,
  SUGGESTION_SETS,
  type SuggestionChip,
} from "../model/suggestions";

function newChatId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `chat-${Date.now().toString(36)}`;
}

export function LandingComposer() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [setIndex, setSetIndex] = useState(0);

  const activeModel =
    MODEL_OPTIONS.find((option) => option.id === modelId) ?? MODEL_OPTIONS[0];
  const chips = SUGGESTION_SETS[setIndex] ?? SUGGESTION_SETS[0];

  const applyChip = (chip: SuggestionChip) => {
    setValue(chip.prompt);
  };

  const refreshChips = () => {
    setSetIndex((current) => (current + 1) % SUGGESTION_SETS.length);
  };

  const startChat = (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      return;
    }
    const params = new URLSearchParams({ prompt: trimmed });
    router.push(`/chats/${newChatId()}?${params.toString()}`);
  };

  return (
    <VStack gap={4} width="100%">
      <ChatComposer
        value={value}
        onChange={setValue}
        onSubmit={startChat}
        placeholder="Ask Astryx to build..."
        footerActions={
          <DropdownMenu
            button={{
              label: activeModel.label,
              variant: "ghost",
              size: "md",
              icon: <Icon icon={LANDING_ICONS.model} size="sm" />,
              children: activeModel.label,
            }}
            menuWidth={200}
            items={MODEL_OPTIONS.map((option) => ({
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
            icon={<Icon icon={LANDING_ICONS.mic} />}
            isIconOnly
            onClick={() => {}}
          />
        }
      />

      <HStack gap={2} hAlign="center" wrap="wrap">
        {chips.map((chip) => (
          <Button
            key={chip.id}
            label={chip.label}
            variant="secondary"
            size="sm"
            icon={<Icon icon={chip.icon} size="sm" />}
            onClick={() => applyChip(chip)}
          />
        ))}
        <Button
          label="Refresh"
          variant="secondary"
          size="sm"
          icon={<Icon icon={LANDING_ICONS.refresh} size="sm" />}
          isIconOnly
          onClick={refreshChips}
        />
      </HStack>
    </VStack>
  );
}
