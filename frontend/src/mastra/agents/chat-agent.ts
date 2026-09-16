import { Agent } from "@mastra/core/agent";

import { getChatModelFallbacks } from "../models/get-chat-model-fallbacks";
import { DEFAULT_CHAT_PROMPT_VARS } from "../prompts/constants";
import { render } from "../prompts/render";
import type { ChatSystemVars } from "../prompts/types";

export function createChatAgent(
  promptVars: ChatSystemVars = DEFAULT_CHAT_PROMPT_VARS,
) {
  return new Agent({
    id: "chat-agent",
    name: "Chat Agent",
    instructions: render("chat/system", promptVars),
    model: getChatModelFallbacks(),
  });
}

/** Default agent instance (static default prompt vars). */
export const chatAgent = createChatAgent();
