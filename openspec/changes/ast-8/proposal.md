## Why

Linear [AST-8](https://linear.app/systhema/issue/AST-8/implementar-memoria-en-mastra): the builder chat streams via Mastra (`chat-agent` + `POST /api/agent/chat`) but has no durable memory — each turn relies only on client-sent messages, and reloads lose server-side context. Per `docs/agent-roadmap.md` Paso 4 and the enriched ticket, we need Postgres-backed Mastra Memory with stable `thread`/`resource`, working memory, and moderate `lastMessages` before semantic recall or Observational Memory.

## What Changes

- Add `@mastra/memory` + `@mastra/pg`; configure `Memory` on `chat-agent` with `PostgresStore` (`DATABASE_URL`).
- Enable **working memory** (project-oriented English template) and moderate **`lastMessages`**.
- Wire stable IDs on every chat invoke: `memory.thread` = builder `chatId`, `memory.resource` = documented stable placeholder until auth (e.g. `anon`).
- Extend `POST /api/agent/chat` (`handleChatStream` params) so the route supplies `memory`; builder `useBuilderChat` sends `chatId` as thread.
- Optional thin **GET** history hydrate via Mastra `recall` + AI SDK UI messages (same Next agent surface).
- Document `DATABASE_URL` in `frontend/.env.example` (no secrets). Preserve OpenAI→Anthropic model fallbacks.
- Vitest for memory factory / ID helpers (mocked store); Playwright only if builder transport changes (mocked agent route).

## Non-goals

- **Semantic recall** (`PgVector` / embeddings) — follow-up when threads exceed `lastMessages`.
- **Observational Memory** — follow-up after measuring token/cost on long chats.
- FastAPI ownership of memory or the LLM loop; auth / multi-tenant resource isolation.
- Wiring builder model dropdown to the Mastra model chain; codegen tools / preview.
- Committing Railway private URLs or credentials.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `mastra-chat-agent`: Postgres-backed Memory on `chat-agent` (storage + working memory + `lastMessages`); chat HTTP must pass `thread`/`resource`; env docs for `DATABASE_URL`.
- `builder-chat-stream`: builder transport supplies `chatId` as memory thread (and resource convention); optional history hydrate on reload.

## Impact

- **Side:** frontend/Node only. **Surface:** chat/agent (runtime + thin builder hook changes).
- **Standards:** `frontend/docs/frontend-standards.md` (**AI agent (Mastra)**, Testing, Configuration); `docs/agent-roadmap.md` Paso 4. Backend CA N/A.
- **Files:** `frontend/src/mastra/agents/chat-agent.ts`, new `frontend/src/mastra/memory/**`, `frontend/src/app/api/agent/chat/{route,types}.ts`, `frontend/src/features/builder/hooks/use-builder-chat.ts`, `frontend/.env.example`, `frontend/package.json`.
- **Deps:** `@mastra/memory`, `@mastra/pg` (aligned with `@mastra/core` ^1.67).
- **HTTP:** Next-only agent routes — not FastAPI. CORS unchanged.
- **Tests:** Vitest under `src/mastra/memory/**` (+ route helpers); E2E mock agent if transport body changes — no live LLM/DB required in CI.
