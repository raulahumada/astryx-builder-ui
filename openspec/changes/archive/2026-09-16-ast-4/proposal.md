## Why

Linear [AST-4](https://linear.app/systhema/issue/AST-4/agente-con-mastra): the builder mock (AST-2) is the future stream destination, but there is still no Node agent runtime. Per `docs/agent-roadmap.md`, we need a **simple Mastra scaffold first** — versionable Nunjucks system prompts and OpenAI→Anthropic fallback — **without** component codegen yet.

## What Changes

- Add Mastra (`@mastra/core`) + Nunjucks under `frontend/src/mastra/` (agents, prompts, models).
- One tool-less **chat agent** whose instructions come from versioned `.njk` templates (`throwOnUndefined`).
- Model chain: OpenAI primary, Anthropic fallback (Mastra native `model` array).
- Thin smoke API: `POST /api/agent/chat` (Next Route Handler) returning plain text via `agent.generate`.
- Env docs (`.env.example`): `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`; Next `serverExternalPackages` for `@mastra/*` if required.
- Vitest for prompt `render()` (and pure helpers).

## Non-goals

- No Astryx component/TSX generation, tools, typecheck/repair, or preview updates.
- No wiring stream into `features/builder` (roadmap Paso 3).
- No FastAPI / LangChain / Python agent; no auth, RAG, persistence, multi-agent, billing.
- No landing/builder UI redesign; LiquidJS not used (Nunjucks locked).

## Capabilities

### New Capabilities

- `mastra-chat-agent`: Node/Mastra chat agent with Nunjucks-versioned system prompts, OpenAI→Anthropic fallback, and `POST /api/agent/chat` smoke invoke.

### Modified Capabilities

- (none)

## Impact

- **Side:** frontend/Node only. **Surface:** agent runtime (server); not a visual UI surface.
- **Standards:** `frontend/docs/frontend-standards.md` (thin `app/api/…`; runtime in `src/mastra/`, not a UI feature). `docs/agent-roadmap.md`. Backend CA N/A — no `backend/` changes. Design guideline N/A for look.
- **Files:** new `frontend/src/mastra/**`; new `frontend/src/app/api/agent/chat/route.ts`; possibly `frontend/next.config.ts`, `frontend/.env.example`, `frontend/package.json`.
- **Deps:** `@mastra/core`, `nunjucks`, `@types/nunjucks` (dev). Optional `@mastra/next` only if design chooses adapter (default: raw Route Handler).
- **HTTP:** Next-only `POST /api/agent/chat` — not FastAPI. CORS unchanged.
- **Tests:** Vitest colocated under `src/mastra/`; no Playwright against live LLMs in CI.
