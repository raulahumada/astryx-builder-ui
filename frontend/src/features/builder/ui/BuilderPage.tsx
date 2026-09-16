import { AppShell } from "@astryxdesign/core/AppShell";
import {
  Layout,
  LayoutContent,
  LayoutPanel,
} from "@astryxdesign/core/Layout";
import { BuilderChatPanel } from "./BuilderChatPanel";
import { BuilderPreviewCanvas } from "./BuilderPreviewCanvas";
import { BuilderTopBar } from "./BuilderTopBar";
import {
  MOCK_USER_PROMPT,
  projectTitleFromPrompt,
} from "../model/mock-session";

type BuilderPageProps = {
  chatId: string;
  initialPrompt?: string;
};

export function BuilderPage({
  chatId,
  initialPrompt,
}: BuilderPageProps) {
  void chatId;
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
            <BuilderChatPanel initialPrompt={prompt} />
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
