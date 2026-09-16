import { BuilderPage } from "@/features/builder";
import { firstSearchParam } from "@/shared/lib/first-search-param";

type ChatPageProps = {
  params: Promise<{ chatId: string }>;
  searchParams: Promise<{ prompt?: string | string[] }>;
};

export default async function ChatPage({
  params,
  searchParams,
}: ChatPageProps) {
  const { chatId } = await params;
  const query = await searchParams;
  const initialPrompt = firstSearchParam(query.prompt);

  return <BuilderPage chatId={chatId} initialPrompt={initialPrompt} />;
}
