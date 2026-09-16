import nunjucks from "nunjucks";

import { loadTemplateSource } from "./load-template-source";
import type { PromptId, PromptVarsById } from "./types";

const env = new nunjucks.Environment(null, {
  autoescape: false,
  throwOnUndefined: true,
});

export function render<T extends PromptId>(
  promptId: T,
  vars: PromptVarsById[T],
): string {
  const source = loadTemplateSource(promptId);
  return env.renderString(source, vars);
}
