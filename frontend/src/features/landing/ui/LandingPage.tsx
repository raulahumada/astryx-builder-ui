import { Layout, LayoutContent, VStack } from "@astryxdesign/core/Layout";
import { Heading } from "@astryxdesign/core/Text";
import { LandingComposer } from "./LandingComposer";

export function LandingPage() {
  return (
    <Layout
      height="fill"
      contentWidth={720}
      padding={6}
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-background-body)",
        color: "var(--color-text-primary)",
      }}
      content={
        <LayoutContent>
          <VStack gap={8} vAlign="center" style={{ minHeight: "100%" }}>
            <Heading level={1}>What do you want to create?</Heading>
            <LandingComposer />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
