"use client";

import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack } from "@astryxdesign/core/Layout";
import { NavIcon } from "@astryxdesign/core/NavIcon";
import { Text } from "@astryxdesign/core/Text";
import {
  TopNav,
  TopNavHeading,
  TopNavItem,
} from "@astryxdesign/core/TopNav";
import {
  BUILDER_BRAND,
  BUILDER_ICONS,
  MOCK_PROJECT_TITLE,
} from "../model/mock-session";

type BuilderTopBarProps = {
  projectTitle?: string;
};

export function BuilderTopBar({
  projectTitle = MOCK_PROJECT_TITLE,
}: BuilderTopBarProps) {
  return (
    <TopNav
      label="Builder navigation"
      heading={
        <HStack gap={3} vAlign="center">
          <TopNavHeading
            heading={BUILDER_BRAND}
            headingHref="/"
            logo={
              <NavIcon
                icon={<Icon icon={BUILDER_ICONS.brand} size="sm" />}
              />
            }
            logoLabel={BUILDER_BRAND}
          />
          <TopNavHeading
            heading={projectTitle}
            menu={
              <Text color="secondary">
                Switch project (mock)
              </Text>
            }
          />
        </HStack>
      }
      startContent={
        <TopNavItem label="Preview" href="#" isSelected />
      }
      endContent={
        <HStack gap={2} vAlign="center">
          <Button
            label="Log In"
            variant="secondary"
            size="sm"
            onClick={() => {}}
          />
          <Button
            label="Sign Up"
            variant="primary"
            size="sm"
            onClick={() => {}}
          />
        </HStack>
      }
    />
  );
}
