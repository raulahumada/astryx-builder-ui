import type { HeroIcon } from "@/shared/lib/hero-icon";

export type { HeroIcon };

export type SuggestionChip = {
  id: string;
  label: string;
  prompt: string;
  icon: HeroIcon;
};

export type ModelOption = {
  id: string;
  label: string;
};
