/** Minimal part shape used by AI SDK UI messages. */
export type MessageTextPart = {
  type: string;
  text?: string;
};

/** Concatenate text parts for display in Astryx bubbles. */
export function textFromMessageParts(
  parts: ReadonlyArray<MessageTextPart> | undefined,
): string {
  if (!parts?.length) {
    return "";
  }

  return parts
    .filter(
      (part): part is { type: "text"; text: string } =>
        part.type === "text" && typeof part.text === "string",
    )
    .map((part) => part.text)
    .join("");
}
