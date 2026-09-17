## 1. Dependencies & env

- [x] 1.1 From `frontend/`, install `@mastra/memory` and `@mastra/pg` compatible with `@mastra/core` ^1.67; confirm `serverExternalPackages` still covers `@mastra/*`
- [x] 1.2 Create or update `frontend/.env.example` with `DATABASE_URL=` (no secrets) and a short comment that local Next needs a public Postgres URL

## 2. Mastra memory module

- [x] 2.1 Add `frontend/src/mastra/memory/constants.ts` (`DEFAULT_CHAT_RESOURCE_ID`, `DEFAULT_LAST_MESSAGES`) and English `working-memory-template.ts`
- [x] 2.2 Add `frontend/src/mastra/memory/create-chat-memory.ts` wiring `Memory` + `PostgresStore` (`DATABASE_URL`) with working memory + `lastMessages` only (no vector / semantic recall / OM)
- [x] 2.3 Add `resolve-memory-ids.ts` (+ colocated Vitest) to normalize `thread` / `resource` from request body or query
- [x] 2.4 Attach `memory: createChatMemory()` on `frontend/src/mastra/agents/chat-agent.ts`; keep `getChatModelFallbacks()` unchanged; confirm Mastra root registration needs (if any) in `index.ts`

## 3. Agent HTTP (Next Route Handler)

- [x] 3.1 Extend `frontend/src/app/api/agent/chat/types.ts` for `thread` / `memory` / GET query shape per design
- [x] 3.2 Update `POST` in `route.ts` to require thread, merge `params.memory`, sanitize DB errors; keep existing messages validation and UI Message Stream
- [x] 3.3 Implement `GET` hydrate: `recall` + `toAISdkMessages` → `200` `{ messages }` (empty list OK); `400` without thread; non-POST/GET → `405`
- [x] 3.4 Add Vitest for route helpers (resolve ids / error sanitization) under `app/api/agent/chat/` or `src/mastra/memory/` — mock Mastra/Postgres (no real DB/LLM)

## 4. Builder transport & hydrate

- [x] 4.1 Update `frontend/src/features/builder/hooks/use-builder-chat.ts` so every POST includes `thread: chatId` and resource (transport `body` or `prepareSendMessagesRequest`)
- [x] 4.2 On load with `chatId`, fetch GET history and seed `useChat` initial messages when present (resolve API against installed `@ai-sdk/react`); preserve `initialPrompt` auto-send only when history is empty
- [x] 4.3 Update Playwright `frontend/e2e/` builder (or chat) specs: mock POST/GET agent routes; assert POST body includes `thread` matching `chatId`; assert hydrate renders recalled messages when GET returns them

## 5. Verify

- [x] 5.1 Run `npm run lint` and `npm test` in `frontend/`
- [x] 5.2 Run relevant `npm run test:e2e` for builder/chat flows touched above
- [x] 5.3 Optional manual smoke with real `DATABASE_URL`: two turns on same `chatId`, reload, confirm history + working memory context (not required for CI) — skipped in CI; set `DATABASE_URL` locally to smoke
