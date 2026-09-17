## Context

Linear [AST-8](https://linear.app/systhema/issue/AST-8/implementar-memoria-en-mastra). Builder chat already streams via `handleChatStream` → `chat-agent` (`POST /api/agent/chat`), but the agent has **no Memory**: context is only whatever the AI SDK client resends, and server-side state does not survive reload.

**Surface:** chat/agent (+ thin builder hook). **Side:** frontend/Node only. **Standards:** `frontend/docs/frontend-standards.md` (**AI agent (Mastra)**, Testing, Configuration); `docs/agent-roadmap.md` Paso 4. Design guideline: English copy for working-memory template text only (no landing/builder chrome redesign).

**As-is anchors:**
- `frontend/src/mastra/{index,agents/chat-agent,models,prompts}/` — no `memory/` yet; packages `@mastra/core` + `@mastra/ai-sdk` only.
- `frontend/src/app/api/agent/chat/route.ts` — `handleChatStream` with `messages` / optional `trigger`; GET → `405`.
- `frontend/src/features/builder/hooks/use-builder-chat.ts` — `useChat({ id: chatId, transport })` without memory body fields.
- Postgres: Railway service available via `DATABASE_URL` (public URL for local Next; private host only on Railway network).

## Goals / Non-Goals

**Goals**
- Postgres-backed Mastra Memory on `chat-agent`: storage + working memory + moderate `lastMessages`.
- Stable IDs: `memory.thread` = `chatId`, `memory.resource` = documented placeholder (`anon`) until auth.
- Route + builder transport pass those IDs on every chat POST.
- Reload hydrate: `GET` returns prior thread UI messages via Mastra `recall` + `@mastra/ai-sdk` conversion.
- Keep OpenAI→Anthropic fallbacks; document `DATABASE_URL` in `.env.example`.

**Non-Goals**
- Semantic recall (`PgVector` / embeddings) and Observational Memory (follow-ups).
- FastAPI memory/LLM; auth/multi-tenant resources; model-dropdown → Mastra; codegen/preview.
- Committing secrets or Railway private-only connection strings.

## Decisions

### 1. Memory factory under `src/mastra/memory/` (no UI)

| Concern | Path |
|---------|------|
| Factory | `frontend/src/mastra/memory/create-chat-memory.ts` — `new Memory({ storage: PostgresStore, options })` |
| Constants | `frontend/src/mastra/memory/constants.ts` — `DEFAULT_CHAT_RESOURCE_ID = "anon"`, `DEFAULT_LAST_MESSAGES` (20) |
| Working-memory template | `frontend/src/mastra/memory/working-memory-template.ts` (English project scratchpad string) |
| Types / ID helpers | `frontend/src/mastra/memory/types.ts`, `resolve-memory-ids.ts` (+ Vitest) |
| Agent wiring | `frontend/src/mastra/agents/chat-agent.ts` — `memory: createChatMemory()` |
| Composition | `frontend/src/mastra/index.ts` — unchanged agents map unless shared store registration is required by Mastra version |

**Rejected:** LibSQL file store (ticket requires Postgres). **Rejected:** putting Memory config inside the Route Handler.

### 2. Packages

From `frontend/`: add `@mastra/memory` and `@mastra/pg` compatible with `@mastra/core` `^1.67`. Keep `serverExternalPackages: ["@mastra/*"]`.

Use `PostgresStore` with `connectionString: process.env.DATABASE_URL`. Fail closed at request time with sanitized `500` if `DATABASE_URL` missing when memory runs (do not crash Next boot if possible — prefer lazy init in factory with clear error on first use).

### 3. ID mapping

| Mastra field | Source |
|--------------|--------|
| `memory.thread` | Builder route `chatId` (required non-empty string) |
| `memory.resource` | Constant `anon` until product auth/projects exist (export constant; do not invent user accounts) |

Pass via `handleChatStream` `params.memory = { thread, resource }` (Mastra v1 shape). Client sends `thread` (= `chatId`) on the JSON body; server may default `resource` to `DEFAULT_CHAT_RESOURCE_ID` if omitted.

**Rejected:** Using AI SDK `useChat` `id` alone without explicit `params.memory` — Mastra docs require thread/resource for memory to activate.

### 4. HTTP contract (Next-only)

**POST `/api/agent/chat`** (existing stream):
- Keep `messages` validation (`has-usable-chat-messages`).
- Require resolvable `thread` (body field `thread` or nested `memory.thread`); else `400`.
- Merge `memory: { thread, resource }` into `handleChatStream` params.
- Preserve model fallbacks on the agent; do not accept client model overrides in this change.
- Sanitize DB/connection errors like provider errors (no connection strings in client responses).

**GET `/api/agent/chat?thread=&resource=`** (new hydrate):
- `resource` defaults to `anon` if omitted.
- Missing/empty `thread` → `400`.
- `recall` thread messages → `toAISdkMessages(..., { version: "v7" })` → `200` JSON array (or `{ messages }`; pick one shape in implementation and lock in specs — prefer `{ messages: UIMessage[] }` for clarity).
- Empty thread → `200` with empty list (not 404).
- Other methods → `405`.

### 5. Builder transport (`features/builder`)

| Concern | Path |
|---------|------|
| Hook | `features/builder/hooks/use-builder-chat.ts` — `DefaultChatTransport({ api, body: { thread: chatId, resource: DEFAULT… } })` or `prepareSendMessagesRequest` so every POST includes IDs |
| Optional hydrate | Same hook: on mount with `chatId`, `GET /api/agent/chat?thread=…` and seed `useChat` initial messages when the API returns history (prefer AI SDK-supported initial messages / `setMessages` pattern already available — verify against installed `ai` / `@ai-sdk/react` at apply time) |
| Panel / page | No chrome redesign; `BuilderChatPanel` keeps passing `chatId` |

**Rejected:** FastAPI adapter under `features/builder/api/`.

### 6. Working memory + lastMessages

```ts
options: {
  lastMessages: 20,
  workingMemory: {
    enabled: true,
    template: PROJECT_WORKING_MEMORY_TEMPLATE, // English: project name, prefs, current goal, open questions, in-progress components
  },
}
```

No `vector` / `embedder` / `semanticRecall` / `observationalMemory` in this change.

### 7. Env / ops

- `frontend/.env.example`: `DATABASE_URL=` (placeholder comment: public URL for local; private Railway host only in-network). Keep existing OpenAI/Anthropic keys.
- Never commit real passwords; rotate any previously leaked Railway password outside this change.

### 8. Tests

- Vitest: `resolve-memory-ids`, working-memory template export shape, route helper that builds `params.memory` (mock Mastra/Postgres — no real DB/LLM in CI).
- Playwright: if transport body changes, assert mocked POST receives `thread` matching `chatId`; hydrate path mocked if implemented. No live LLM/DB in CI.
- Manual smoke (optional DoD note): two turns + reload with real `DATABASE_URL`.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Private Railway host unreachable from laptop | Document public `DATABASE_URL`; fail with clear sanitized error |
| Mastra schema init / DDL on first connect | Use official PostgresStore defaults; document first-run needs DB write rights |
| Dual source of truth (client messages vs server memory) | Hydrate on load; still send current turn messages per AI SDK; rely on Mastra to merge with stored thread |
| `anon` resource collides across users later | Accept until auth; constant is single migration point |
| Package API drift (`PostgresStore` vs `PgStore`) | Verify against installed `@mastra/pg` docs at apply time |

## Migration Plan

1. Install packages; add memory module; wire agent.
2. Extend POST + GET route; update builder hook.
3. Add `.env.example`; developers set local `DATABASE_URL`.
4. No data migration (greenfield memory tables).
5. Rollback: remove Memory from agent + revert route/hook; Postgres tables can remain unused.

## Open Questions

- Exact AI SDK hydrate API (`initialMessages` vs `setMessages`) — resolve against installed `@ai-sdk/react` during `/opsx:apply`.
- Whether Mastra requires registering storage on the `Mastra` root in addition to Agent `memory` — confirm at apply against `@mastra/core` 1.67.
