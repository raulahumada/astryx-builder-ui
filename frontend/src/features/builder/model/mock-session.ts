import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  CubeTransparentIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  PhotoIcon,
  SparklesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import type {
  BuilderModelOption,
  MockTimelineEvent,
} from "./types";

export const BUILDER_BRAND = "Astryx";

export const MOCK_PROJECT_TITLE = "Lawyer landing page";

export const MOCK_USER_PROMPT = "Landing page of lawyer";

export const MOCK_ASSISTANT_PLAN =
  "I'll shape this into a polished lawyer landing page with a credible, editorial feel, then fit it into the existing app structure.";

export const MOCK_COMPOSER_PLACEHOLDER = "Ask a follow-up...";

export const MOCK_PREVIEW_EMPTY =
  "Your Astryx generation will show here.";

export const MOCK_PREVIEW_PATH = "/";

export const BUILDER_MODEL_OPTIONS: BuilderModelOption[] = [
  { id: "astryx", label: "Astryx" },
  { id: "astryx-fast", label: "Astryx Fast" },
  { id: "astryx-pro", label: "Astryx Pro" },
];

export const DEFAULT_BUILDER_MODEL_ID = BUILDER_MODEL_OPTIONS[0].id;

/** Process feed for the builder chat sidebar (static mock). */
export const MOCK_TIMELINE: MockTimelineEvent[] = [
  {
    id: "thought-1",
    kind: "thought",
    durationLabel: "Thought for 1s",
  },
  {
    id: "tool-inspect",
    kind: "tool",
    label: "Inspected project",
    icon: MagnifyingGlassIcon,
  },
  {
    id: "tool-design",
    kind: "tool",
    label: "Explored legal design",
    icon: Squares2X2Icon,
  },
  {
    id: "tool-files",
    kind: "tool",
    label: "Explore · 4 Files",
    icon: MagnifyingGlassIcon,
  },
  {
    id: "thought-2",
    kind: "thought",
    durationLabel: "Thought for 1s",
    body: MOCK_ASSISTANT_PLAN,
    defaultOpen: true,
  },
  {
    id: "tool-portrait",
    kind: "tool",
    label: "Created firm portrait",
    icon: PhotoIcon,
  },
  {
    id: "tool-landing",
    kind: "tool",
    label: "Built lawyer landing",
    icon: DocumentTextIcon,
  },
  {
    id: "result-1",
    kind: "result",
    title: "Polished landing layout",
    version: "v1",
    files: [
      {
        name: "hero.png",
        path: "public/hero.png",
        icon: PhotoIcon,
      },
      {
        name: "page.tsx",
        path: "app/page.tsx",
        icon: CodeBracketIcon,
      },
      {
        name: "Hero.tsx",
        path: "components/Hero.tsx",
        icon: CodeBracketIcon,
      },
    ],
  },
  {
    id: "tool-tokens",
    kind: "tool",
    label: "Updated design tokens",
    icon: DocumentTextIcon,
  },
  {
    id: "tool-meta",
    kind: "tool",
    label: "Updated site metadata",
    icon: DocumentTextIcon,
  },
  {
    id: "thought-3",
    kind: "thought",
    durationLabel: "Thought for 1s",
  },
  {
    id: "tool-agent",
    kind: "tool",
    label: "Loaded agent",
    icon: SparklesIcon,
  },
  {
    id: "tool-browser",
    kind: "tool",
    label: "Checked browser",
    icon: GlobeAltIcon,
  },
];

export const BUILDER_ICONS = {
  brand: CubeTransparentIcon,
  back: ChevronLeftIcon,
  forward: ChevronRightIcon,
  device: DevicePhoneMobileIcon,
  refresh: ArrowPathIcon,
  thought: LightBulbIcon,
  undo: ArrowUturnLeftIcon,
  model: SparklesIcon,
  mic: MicrophoneIcon,
} as const;
