## 1. Discovery & deps

- [x] 1.1 From `frontend/`, confirm existing Chat components (`npx astryx component Chat` / search) — no new layout template; keep AST-2 `ChatLayout` / `ChatComposer` / `ChatMessage*`
- [x] 1.2 Install `@mastra/ai-sdk@latest`, `@ai-sdk/react`, and `ai` in `frontend/`; note installed `ai` major and the matching `handleChatStream` `version` value
- [x] 1.3 Verify `mastra.getAgent('chat-agent')` works with the composition root in `frontend/src/mastra/index.ts`

## 2. Route Handler (AI SDK stream)

- [x] 2.1 Refactor `frontend/src/app/api/agent/chat/route.ts` to `handleChatStream` + `createUIMessageStreamResponse`; keep `runtime = "nodejs"` and `maxDuration`
- [x] 2.2 Update `frontend/src/app/api/agent/chat/types.ts` (and helpers) for AI SDK `{ messages }` body; return `400` when messages are missing/unusable
- [x] 2.3 Preserve generic `500` / stream failure behavior without leaking API keys; keep non-`POST` → `405`

## 3. Builder chat wiring

- [x] 3.1 Add `frontend/src/features/builder/lib/message-parts.ts` (+ `message-parts.test.ts`) to extract display text from UI message parts
- [x] 3.2 Add `frontend/src/features/builder/hooks/use-builder-chat.ts` with `useChat` + `DefaultChatTransport({ api: '/api/agent/chat' })` and one-shot `initialPrompt` auto-send guard
- [x] 3.3 Update `frontend/src/features/builder/ui/BuilderChatPanel.tsx` to render live messages, wire composer submit, disable while not ready, and stop using `MOCK_TIMELINE` as transcript source of truth
- [x] 3.4 Leave model dropdown, mic, and `BuilderPreviewCanvas` behavior unchanged (visual / empty placeholder)

## 4. Tests & verification

- [x] 4.1 Extend or add Playwright coverage in `frontend/e2e/builder.spec.ts` (mock `POST /api/agent/chat`) for submit → assistant text appears; keep empty-preview assertion
- [x] 4.2 Run `npm run lint` and `npm test` in `frontend/`
- [x] 4.3 Run relevant `npm run test:e2e` in `frontend/`
- [x] 4.4 Manual smoke: `npm run dev` with keys → composer streams assistant text in `/chats/[id]`

## 5. Docs / OpenSpec notes

- [x] 5.1 No FastAPI / `backend/docs/api` update (Next-only route; no backend harness / pytest)
- [x] 5.2 Optionally note in `docs/agent-roadmap.md` that Paso 3 text-stream wiring is covered by AST-5 (tools/preview still pending) — only if editing that doc in this change
