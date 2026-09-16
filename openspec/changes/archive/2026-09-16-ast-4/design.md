## Context

[AST-4](https://linear.app/systhema/issue/AST-4/agente-con-mastra) introduces the first **Node/Mastra agent runtime** in `frontend/`, aligned with `docs/agent-roadmap.md` (agent lives where Astryx/TS validation will live later). Today: builder mock in `features/builder` (static), FastAPI scaffold-only, no Mastra, no LLM keys wired.

**Stakeholders:** eng implementing the agent loop. **Surface:** server agent runtime (not a visual UI). **Standards:** thin `app/api/` + domain in `src/mastra/` per `frontend/docs/frontend-standards.md`; no backend CA slice.

## Goals / Non-Goals

**Goals**

- Mastra composition root + one tool-less `chat-agent`.
- Versionable system prompts via **Nunjucks** (`.njk`), typed vars, fail on undefined.
- OpenAI primary → Anthropic fallback via Mastra `model` array.
- Smoke invoke: `POST /api/agent/chat` → plain text (`agent.generate`).
- Vitest for prompt render; `.env.example` for keys.

**Non-Goals**

- Codegen, tools, streaming into builder, FastAPI agent, auth/RAG/persistence, `@mastra/next` adapter, Playwright against live LLMs.

## Decisions

### 1. Runtime location: `frontend/src/mastra/`

- **Choice:** Mastra’s recommended `src/mastra/` tree inside Next, not FastAPI and not `features/<x>/`.
- **Why:** Framework root for agents/prompts/models; Screaming Architecture reserves `features/` for product UI capabilities. Route Handler stays thin.
- **Rejected:** Growing `backend/app/main.py`; inventing `features/agent` UI folders for non-UI code.

### 2. Prompt engine: Nunjucks (locked)

- **Choice:** `nunjucks` + `@types/nunjucks`; templates at `frontend/src/mastra/prompts/chat/v1.system.njk`.
- **API:** `render(promptId, vars)` in `prompts/render.ts`; env with `throwOnUndefined: true`; pin default version id in code (`v1`).
- **Load:** Node `fs` + path under `src/mastra/prompts` (server-only). Vitest covers happy path + missing var.
- **Rejected:** LiquidJS; ad-hoc `{{replace}}`; external prompt SaaS.

### 3. Invoke path: App Router Route Handler (not `@mastra/next`)

- **Choice:** `frontend/src/app/api/agent/chat/route.ts` calls `mastra.getAgent('chat-agent').generate(...)`.
- **Why:** Minimal deps for smoke; easy to curl/Postman; no Hono adapter yet.
- **Rejected:** `@mastra/next` + Hono for this spike (revisit if Studio/dev server needs it).

### 4. Model IDs (pinned defaults)

| Role | Model string | Env |
|------|----------------|-----|
| Primary | `openai/gpt-4o-mini` | `OPENAI_API_KEY` |
| Fallback | `anthropic/claude-3-5-haiku-latest` | `ANTHROPIC_API_KEY` |

- Optional overrides: `MASTRA_OPENAI_MODEL`, `MASTRA_ANTHROPIC_MODEL`.
- Fallback entry `maxRetries`: primary `2`, Anthropic `2` (tunable).
- Defined in `frontend/src/mastra/models/defaults.ts`.

### 5. HTTP contract (Next-only — designed here)

`POST /api/agent/chat`

**Request JSON**

```ts
{
  message: string; // required, non-empty
  promptVars?: Record<string, string | number | boolean>;
}
```

**Success `200`** — streamed plain text (`text/plain; charset=utf-8`) via Mastra `agent.stream` → `textStream` (tokens as they arrive). Not a single JSON `{ text }` body.

**Errors (before the stream starts)**

- `400` `{ error: string }` — missing/invalid `message` or prompt render failure (undefined vars).
- `500` `{ error: string }` — fail to start stream / missing keys; do not leak raw provider payloads/secrets.
- `405` for non-POST.

No FastAPI routes. No CORS change (browser → Next).

### 6. Next / packaging

- Add `serverExternalPackages: ['@mastra/*']` to `frontend/next.config.ts`.
- Deps in `frontend/`: `@mastra/core`, `nunjucks`; dev `@types/nunjucks`.
- Secrets only in `.env.local` (gitignored); document in `frontend/.env.example`.

### Module map

```text
frontend/src/mastra/
  index.ts                 # export const mastra = new Mastra({ agents: { chatAgent } })
  agents/chat-agent.ts     # Agent id chat-agent; instructions from render(); no tools
  prompts/
    chat/v1.system.njk
    render.ts
    types.ts               # PromptId, ChatSystemVars, …
    render.test.ts
  models/defaults.ts       # model fallback array
frontend/src/app/api/agent/chat/route.ts
```

Agent instructions MUST tell the model it is a helpful Astryx assistant and MUST NOT emit component/TSX/codegen.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Mastra package churn / peer deps | Pin versions at install; follow Mastra Next `serverExternalPackages` note |
| Live LLM cost / flaky CI | Unit-test render only; manual smoke for generate; no Playwright LLM in CI |
| `.njk` path wrong under Next cwd | Resolve from known base (`path.join(process.cwd(), 'src/mastra/prompts')` or `import.meta`/fileURL); assert in tests |
| Keys missing in local env | Clear `500` message; `.env.example` documents both keys |
| Fallback never exercised | Document how to force (invalid OpenAI key) in apply notes; no automated multi-provider test required |

## Migration Plan

1. Install deps → scaffold `src/mastra` → Route Handler → `.env.example` + next config.
2. Rollback: remove `src/mastra`, route, deps, config lines; no DB/data migration.
3. Does not break landing/builder mocks.

## Open Questions

- None blocking. Model slugs may be bumped later via env overrides without changing architecture.
