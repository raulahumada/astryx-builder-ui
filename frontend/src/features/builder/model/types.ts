import type { HeroIcon } from "@/shared/lib/hero-icon";

export type { HeroIcon };

export type BuilderModelOption = {
  id: string;
  label: string;
};

export type MockResultFile = {
  name: string;
  path: string;
  icon: HeroIcon;
};

export type MockThoughtEvent = {
  id: string;
  kind: "thought";
  durationLabel: string;
  body?: string;
  defaultOpen?: boolean;
};

export type MockToolEvent = {
  id: string;
  kind: "tool";
  label: string;
  icon: HeroIcon;
};

export type MockResultEvent = {
  id: string;
  kind: "result";
  title: string;
  version: string;
  files: MockResultFile[];
};

export type MockTimelineEvent =
  | MockThoughtEvent
  | MockToolEvent
  | MockResultEvent;

export type BuilderPageProps = {
  chatId: string;
  initialPrompt?: string;
};

export type BuilderChatPanelProps = {
  initialPrompt?: string;
};

export type BuilderTopBarProps = {
  projectTitle?: string;
};
