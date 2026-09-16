export type PromptId = "chat/system";

export type ChatSystemVars = {
  productName: string;
  locale: string;
};

export type PromptVarsById = {
  "chat/system": ChatSystemVars;
};
