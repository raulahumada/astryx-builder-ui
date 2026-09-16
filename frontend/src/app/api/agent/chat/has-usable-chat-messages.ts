/** True when `messages` has at least one user message with non-empty text. */
export function hasUsableChatMessages(messages: unknown): boolean {
  if (!Array.isArray(messages) || messages.length === 0) {
    return false;
  }

  return messages.some((entry) => {
    if (!entry || typeof entry !== "object") {
      return false;
    }
    const message = entry as {
      role?: unknown;
      parts?: unknown;
      content?: unknown;
    };
    if (message.role !== "user") {
      return false;
    }
    if (Array.isArray(message.parts)) {
      return message.parts.some((part) => {
        if (!part || typeof part !== "object") {
          return false;
        }
        const p = part as { type?: unknown; text?: unknown };
        return (
          p.type === "text" &&
          typeof p.text === "string" &&
          p.text.trim().length > 0
        );
      });
    }
    return (
      typeof message.content === "string" && message.content.trim().length > 0
    );
  });
}
