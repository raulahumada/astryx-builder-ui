import { BuilderPage } from "@/features/builder";

type ChatPageProps = {
  params: Promise<{ chatId: string }>;
  searchParams: Promise<{ prompt?: string | string[] }>;
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function ChatPage({
  params,
  searchParams,
}: ChatPageProps) {
  const { chatId } = await params;
  const query = await searchParams;
  const initialPrompt = firstParam(query.prompt);

  return <BuilderPage chatId={chatId} initialPrompt={initialPrompt} />;
}
