export function isPlainRecord(
  value: unknown,
): value is Record<string, string | number | boolean> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every(
    (v) =>
      typeof v === "string" || typeof v === "number" || typeof v === "boolean",
  );
}
