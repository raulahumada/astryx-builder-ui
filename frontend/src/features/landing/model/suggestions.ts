import {
  ArrowPathIcon,
  ChartBarIcon,
  EnvelopeIcon,
  MicrophoneIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { ModelOption, SuggestionChip } from "./types";

export const MODEL_OPTIONS: ModelOption[] = [
  { id: "astryx", label: "Astryx" },
  { id: "astryx-fast", label: "Astryx Fast" },
];

export const DEFAULT_MODEL_ID = MODEL_OPTIONS[0].id;

export const SUGGESTION_SETS: SuggestionChip[][] = [
  [
    {
      id: "contact-form",
      label: "Contact Form",
      prompt: "Build a contact form with name, email, and message fields",
      icon: EnvelopeIcon,
    },
    {
      id: "image-editor",
      label: "Image Editor",
      prompt: "Build an image editor with crop, filters, and export",
      icon: PhotoIcon,
    },
    {
      id: "mini-game",
      label: "Mini Game",
      prompt: "Build a small browser mini game with score and restart",
      icon: PuzzlePieceIcon,
    },
    {
      id: "finance-calculator",
      label: "Finance Calculator",
      prompt: "Build a finance calculator for compound interest",
      icon: ChartBarIcon,
    },
  ],
  [
    {
      id: "dashboard",
      label: "Dashboard",
      prompt: "Build a metrics dashboard with charts and filters",
      icon: ChartBarIcon,
    },
    {
      id: "auth-form",
      label: "Sign In",
      prompt: "Build a sign-in form with email and password",
      icon: EnvelopeIcon,
    },
    {
      id: "gallery",
      label: "Photo Gallery",
      prompt: "Build a responsive photo gallery with lightbox",
      icon: PhotoIcon,
    },
    {
      id: "todo",
      label: "Todo App",
      prompt: "Build a todo app with add, complete, and filter",
      icon: PuzzlePieceIcon,
    },
  ],
];

export const LANDING_ICONS = {
  model: SparklesIcon,
  mic: MicrophoneIcon,
  refresh: ArrowPathIcon,
} as const;
