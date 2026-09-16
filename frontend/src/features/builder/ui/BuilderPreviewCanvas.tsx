"use client";

import { Button } from "@astryxdesign/core/Button";
import { Center } from "@astryxdesign/core/Center";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Layout";
import { Text } from "@astryxdesign/core/Text";
import { Toolbar } from "@astryxdesign/core/Toolbar";
import {
  BUILDER_ICONS,
  MOCK_PREVIEW_EMPTY,
  MOCK_PREVIEW_PATH,
} from "../model/mock-session";

export function BuilderPreviewCanvas() {
  return (
    <VStack
      gap={0}
      height="100%"
      style={{
        backgroundColor: "var(--color-background-surface)",
        minHeight: 0,
      }}
    >
      <Toolbar
        label="Preview browser chrome"
        size="sm"
        dividers={["bottom"]}
        startContent={
          <HStack gap={1} vAlign="center">
            <Button
              label="Back"
              variant="ghost"
              size="sm"
              isIconOnly
              icon={<Icon icon={BUILDER_ICONS.back} size="sm" />}
              onClick={() => {}}
            />
            <Button
              label="Forward"
              variant="ghost"
              size="sm"
              isIconOnly
              icon={<Icon icon={BUILDER_ICONS.forward} size="sm" />}
              onClick={() => {}}
            />
            <Button
              label="Device preview"
              variant="ghost"
              size="sm"
              isIconOnly
              icon={<Icon icon={BUILDER_ICONS.device} size="sm" />}
              onClick={() => {}}
            />
          </HStack>
        }
        centerContent={
          <Text color="secondary">{MOCK_PREVIEW_PATH}</Text>
        }
        endContent={
          <Button
            label="Refresh preview"
            variant="ghost"
            size="sm"
            isIconOnly
            icon={<Icon icon={BUILDER_ICONS.refresh} size="sm" />}
            onClick={() => {}}
          />
        }
      />

      <Center axis="both" height="100%" padding={6}>
        <VStack gap={3} hAlign="center">
          <Icon icon={BUILDER_ICONS.brand} size="lg" />
          <Text color="secondary">{MOCK_PREVIEW_EMPTY}</Text>
        </VStack>
      </Center>
    </VStack>
  );
}
