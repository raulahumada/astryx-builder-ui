import fs from "node:fs";
import path from "node:path";

import { PROMPTS_ROOT_SEGMENTS, TEMPLATE_RELATIVE_PATH } from "./constants";
import type { PromptId } from "./types";

const PROMPTS_ROOT = path.join(process.cwd(), ...PROMPTS_ROOT_SEGMENTS);

export function loadTemplateSource(promptId: PromptId): string {
  const relative = TEMPLATE_RELATIVE_PATH[promptId];
  const absolute = path.join(PROMPTS_ROOT, relative);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Prompt template not found: ${absolute}`);
  }
  return fs.readFileSync(absolute, "utf8");
}
