import { DEFAULT_CHAT_PROMPT_VARS } from "@/mastra/prompts/constants";
import type { ChatSystemVars } from "@/mastra/prompts/types";

import { isPlainRecord } from "./is-plain-record";
import type { PromptVarsResolution } from "./types";

export function resolvePromptVars(raw: unknown): PromptVarsResolution {
  if (raw === undefined) {
    return {
      ok: true,
      vars: {
        productName: DEFAULT_CHAT_PROMPT_VARS.productName,
        locale: DEFAULT_CHAT_PROMPT_VARS.locale,
      },
    };
  }
  if (!isPlainRecord(raw)) {
    return {
      ok: false,
      error: "promptVars must be an object of string | number | boolean values",
    };
  }
  const productName =
    typeof raw.productName === "string"
      ? raw.productName
      : DEFAULT_CHAT_PROMPT_VARS.productName;
  const locale =
    typeof raw.locale === "string"
      ? raw.locale
      : DEFAULT_CHAT_PROMPT_VARS.locale;
  const vars: ChatSystemVars = { productName, locale };
  return { ok: true, vars };
}
