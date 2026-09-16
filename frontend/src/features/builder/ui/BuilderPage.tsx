import { AppShell } from "@astryxdesign/core/AppShell";
import {
  Layout,
  LayoutContent,
  LayoutPanel,
} from "@astryxdesign/core/Layout";
import { projectTitleFromPrompt } from "../lib/project-title";
import { MOCK_USER_PROMPT } from "../model/mock-session";
import type { BuilderPageProps } from "../model/types";
import { BuilderChatPanel } from "./BuilderChatPanel";
import { BuilderPreviewCanvas } from "./BuilderPreviewCanvas";
import { BuilderTopBar } from "./BuilderTopBar";

export function BuilderPage({
  chatId,
  initialPrompt,
}: BuilderPageProps) {
  const prompt = initialPrompt?.trim() || MOCK_USER_PROMPT;

  return (
    <AppShell
      height="fill"
      contentPadding={0}
      variant="section"
      topNav={
        <BuilderTopBar projectTitle={projectTitleFromPrompt(prompt)} />
      }
    >
      <Layout
        height="fill"
        padding={0}
        start={
          <LayoutPanel
            width={380}
            hasDivider
            padding={0}
            label="Chat"
            role="complementary"
          >
            <BuilderChatPanel chatId={chatId} initialPrompt={initialPrompt} />
          </LayoutPanel>
        }
        content={
          <LayoutContent padding={0}>
            <BuilderPreviewCanvas />
          </LayoutContent>
        }
      />
    </AppShell>
  );
}
