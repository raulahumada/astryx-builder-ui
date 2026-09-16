/** Create an opaque chat session id for mock navigation. */
export function newChatId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `chat-${Date.now().toString(36)}`;
}
