import { newChatId } from "./new-chat-id";

/**
 * Build `/chats/[id]?prompt=…` for a non-empty prompt.
 * Returns null when the prompt is blank.
 */
export function buildChatSessionHref(prompt: string): string | null {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return null;
  }
  const params = new URLSearchParams({ prompt: trimmed });
  return `/chats/${newChatId()}?${params.toString()}`;
}
