import { MOCK_PROJECT_TITLE } from "../model/mock-session";

/** Short title for the top bar from a user prompt (mock, no backend). */
export function projectTitleFromPrompt(prompt: string): string {
  const trimmed = prompt.trim().replace(/\s+/g, " ");
  if (!trimmed) {
    return MOCK_PROJECT_TITLE;
  }
  if (trimmed.length <= 48) {
    return trimmed;
  }
  return `${trimmed.slice(0, 45)}…`;
}
