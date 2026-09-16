"use client";

import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Collapsible } from "@astryxdesign/core/Collapsible";
import { Icon } from "@astryxdesign/core/Icon";
import { Item } from "@astryxdesign/core/Item";
import { HStack, VStack } from "@astryxdesign/core/Layout";
import { Text } from "@astryxdesign/core/Text";
import {
  BUILDER_ICONS,
  MOCK_TIMELINE,
} from "../model/mock-session";
import type {
  MockResultEvent,
  MockThoughtEvent,
  MockTimelineEvent,
  MockToolEvent,
} from "../model/types";

function ThoughtEvent({ event }: { event: MockThoughtEvent }) {
  return (
    <Collapsible
      defaultIsOpen={event.defaultOpen ?? Boolean(event.body)}
      chevronPosition="end"
      trigger={
        <HStack gap={2} vAlign="center">
          <Icon icon={BUILDER_ICONS.thought} size="sm" />
          <Text color="secondary">{event.durationLabel}</Text>
        </HStack>
      }
    >
      {event.body ? (
        <Text style={{ paddingInlineStart: "var(--spacing-6)" }}>
          {event.body}
        </Text>
      ) : null}
    </Collapsible>
  );
}

function ToolEvent({ event }: { event: MockToolEvent }) {
  return (
    <Item
      density="compact"
      align="center"
      label={<Text color="secondary">{event.label}</Text>}
      startContent={<Icon icon={event.icon} size="sm" />}
    />
  );
}

function ResultEvent({ event }: { event: MockResultEvent }) {
  return (
    <Card padding={3} elevation="none" width="100%">
      <VStack gap={2} width="100%">
        <HStack gap={2} vAlign="center" hAlign="between" width="100%">
          <HStack gap={2} vAlign="center">
            <Text>{event.title}</Text>
            <Text color="secondary">{event.version}</Text>
          </HStack>
          <Button
            label="Undo changes"
            variant="ghost"
            size="sm"
            isIconOnly
            icon={<Icon icon={BUILDER_ICONS.undo} size="sm" />}
            onClick={() => {}}
          />
        </HStack>
        <VStack gap={1} width="100%">
          {event.files.map((file) => (
            <Item
              key={file.path}
              density="compact"
              label={file.name}
              description={file.path}
              startContent={<Icon icon={file.icon} size="sm" />}
            />
          ))}
        </VStack>
      </VStack>
    </Card>
  );
}

function TimelineEventRow({ event }: { event: MockTimelineEvent }) {
  switch (event.kind) {
    case "thought":
      return <ThoughtEvent event={event} />;
    case "tool":
      return <ToolEvent event={event} />;
    case "result":
      return <ResultEvent event={event} />;
  }
}

export function BuilderActivityFeed() {
  return (
    <VStack gap={2} width="100%" hAlign="stretch">
      {MOCK_TIMELINE.map((event) => (
        <TimelineEventRow key={event.id} event={event} />
      ))}
    </VStack>
  );
}
