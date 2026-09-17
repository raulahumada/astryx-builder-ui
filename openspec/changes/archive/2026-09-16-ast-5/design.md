## Context

Linear [AST-5](https://linear.app/systhema/issue/AST-5/implementar-ai-sdk). AST-4 left `POST /api/agent/chat` as a plain-text Mastra smoke stream and the builder chat as a static mock (`BuilderChatPanel` `onSubmit` no-op + `MOCK_TIMELINE`). Product need: stream real assistant text into the builder using Mastra’s AI SDK bridge ([Mastra AI SDK UI](https://mastra.ai/integrations/agentic-ui/ai-sdk-ui)).

**Surfaces:** `builder/tool` + `chat/agent`. **Side:** frontend only. **Standards:** `frontend/docs/frontend-standards.md`, `docs/design_guideline.md` (English copy for now), `docs/agent-roadmap.md` Paso 3 (text stream only).

**As-is anchors:**
- `frontend/src/mastra/` — `Mastra` + `chatAgent` (`id: "chat-agent"`), Nunjucks prompts, OpenAI→Anthropic fallback.
- `frontend/src/app/api/agent/chat/route.ts` — `{ message, promptVars? }` → `text/plain`.
- `frontend/src/features/builder/ui/BuilderChatPanel.tsx` — Astryx `ChatLayout` / `ChatComposer` / `ChatMessage*` already in place.

## Goals / Non-Goals

**Goals**
- AI SDK–compatible UI Message Stream from `POST /api/agent/chat`.
- Builder composer sends messages and renders streamed assistant `text` parts in Astryx bubbles.
- Keep Mastra agent tool-less; keep layout/chrome from AST-2.

**Non-Goals**
- Workflows, networks, tool generative UI, Memory/threads, codegen, preview updates, FastAPI, locale migration.

## Decisions

### 1. Framework-agnostic handlers in Next (not Mastra server)

Use `@mastra/ai-sdk` `handleChatStream` + `ai` `createUIMessageStreamResponse` inside the existing App Router route. Do **not** run Mastra’s standalone server / `chatRoute()` (wrong deployment shape for this Next app).

**Rejected:** Keep custom `textStream` encoder and parse on the client — fights AI SDK and blocks future tool parts.

### 2. Packages and AI SDK `version`

Install from `frontend/`: `@mastra/ai-sdk@latest`, `@ai-sdk/react`, `ai`. Pass `version` to `handleChatStream` matching the installed `ai` major (Mastra docs: default `'v5'`; use `'v7'` if that is what npm resolves — verify at install time, do not hardcode in specs).

### 3. Agent id and composition root

Call `handleChatStream({ mastra, agentId: 'chat-agent', version, params })` using the exported `mastra` from `@/mastra`. Prefer reusing the registered agent (prompt vars via RequestContext / optional body extension only if trivial). MVP may use the default `chatAgent` instance instructions (static default prompt vars) and defer dynamic `promptVars` if it conflicts with the AI SDK body — document in Open Questions if deferred.

**Rejected:** Dual endpoints (`/api/agent/chat` plain + `/api/agent/chat-ui`) — one breaking cut is cleaner.

### 4. Screaming Architecture mapping

| Concern | Path | Server/Client |
|---------|------|---------------|
| Route Handler | `app/api/agent/chat/route.ts` (+ `types.ts`) | Server (Node runtime) |
| Chat hook | `features/builder/hooks/use-builder-chat.ts` | Client |
| Panel UI | `features/builder/ui/BuilderChatPanel.tsx` | Client |
| Text-part helpers | `features/builder/lib/message-parts.ts` (+ Vitest) | Shared pure |
| Types | `features/builder/model/types.ts` as needed | — |
| Thin page | `app/chats/[chatId]/page.tsx` | unchanged wiring |

No `features/builder/api/` FastAPI adapter (Next relative `/api/agent/chat` via `DefaultChatTransport`). No new layout template; keep existing Chat components (AST-2 kit). Re-run `npx astryx component Chat` / docs only to confirm props — no scaffold under `app/`.

### 5. Client transport and UX

- `useChat({ transport: new DefaultChatTransport({ api: '/api/agent/chat' }) })`.
- `ChatComposer.onSubmit` → `sendMessage({ text })`; clear input; disable while `status !== 'ready'`.
- Render `messages`: user/assistant `text` parts → `ChatMessage` + `ChatMessageBubble`.
- **Hide** `BuilderActivityFeed` / `MOCK_TIMELINE` when live messages exist (or always after this change for the assistant slot); static activity is not the source of truth.
- `initialPrompt` from landing: show as first user message and **auto-send once** on mount (guard with ref) so the session starts streaming without an extra click.
- Model dropdown + mic: UI-only / no-op (unchanged).
- Preview canvas: unchanged empty placeholder.
- Copy: English (existing placeholders OK).

### 6. Errors and runtime

- Keep `export const runtime = "nodejs"` and `maxDuration` (≥30–60s).
- Invalid / empty `messages` → `400` `{ error }`.
- Provider/stream failure → `500` generic error (no API keys). Prefer surfacing stream errors via AI SDK status on the client when possible.

### 7. Tests

- Vitest: `message-parts` (extract text from UIMessage-like parts).
- Playwright: mock `POST /api/agent/chat` with a minimal UI stream (or route fulfill) so CI does not need live LLM keys; assert composer submit → assistant text appears. Keep existing empty-preview assertion.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| AI SDK major / `version` mismatch breaks stream | Pin packages together; set `version` explicitly after install; smoke in browser |
| Breaking AST-4 plain-text clients | Update main spec on archive; no known external clients beyond smoke |
| Agent registration key vs `id` | Use `chat-agent` per AST-4; verify `mastra.getAgent('chat-agent')` before ship |
| Auto-send `initialPrompt` double-fire (Strict Mode) | Ref guard / “already sent” flag |
| E2E flake without keys | Always mock the chat route in Playwright for this flow |

## Migration Plan

1. Land deps + route refactor (breaking).
2. Wire builder hook/UI.
3. Update specs on archive; note roadmap Paso 3 partially done (text only).
4. Rollback: revert route to AST-4 encoder if needed (no data migration).

## Open Questions

- Whether to keep optional `promptVars` / `RequestContext` in MVP vs follow-up (prefer follow-up if it blocks the happy path).
- Exact Playwright mock format for UI Message Stream (depend on installed `ai` stream framing — implement against real response headers once packages are in).
