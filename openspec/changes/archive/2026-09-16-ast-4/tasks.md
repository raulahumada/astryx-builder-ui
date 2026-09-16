## 1. Dependencies & Next config

- [x] 1.1 In `frontend/`, install `@mastra/core`, `nunjucks`, and `@types/nunjucks` (dev); pin versions from npm at install time
- [x] 1.2 Update `frontend/next.config.ts` with `serverExternalPackages: ['@mastra/*']`
- [x] 1.3 Add `frontend/.env.example` documenting `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and optional `MASTRA_OPENAI_MODEL` / `MASTRA_ANTHROPIC_MODEL` (no real secrets)

## 2. Nunjucks prompts

- [x] 2.1 Create `frontend/src/mastra/prompts/types.ts` (`PromptId`, chat system vars types)
- [x] 2.2 Add `frontend/src/mastra/prompts/chat/v1.system.njk` (Astryx assistant; forbid TSX/codegen)
- [x] 2.3 Implement `frontend/src/mastra/prompts/render.ts` (Nunjucks, `throwOnUndefined: true`, resolve templates under `src/mastra/prompts`)
- [x] 2.4 Add Vitest `frontend/src/mastra/prompts/render.test.ts` (happy path + missing-var failure)

## 3. Mastra agent & models

- [x] 3.1 Add `frontend/src/mastra/models/defaults.ts` (OpenAI `openai/gpt-4o-mini` primary → Anthropic `anthropic/claude-3-5-haiku-latest` fallback; env overrides; per-entry retries)
- [x] 3.2 Add `frontend/src/mastra/agents/chat-agent.ts` (id `chat-agent`, instructions from `render`, zero tools)
- [x] 3.3 Add `frontend/src/mastra/index.ts` registering the chat agent on a `Mastra` instance

## 4. Smoke HTTP route

- [x] 4.1 Implement thin `frontend/src/app/api/agent/chat/route.ts`: `POST` validates `message` / optional `promptVars`, renders prompt vars, calls `agent.generate`, returns `{ text }` or `400`/`405`/`500` per `design.md` (no secret leakage)
- [ ] 4.2 Manual smoke with real keys: `POST /api/agent/chat` returns `200` + text (document one-liner in PR/notes; not CI)

## 5. Verification

- [x] 5.1 Run `npm test` in `frontend/` (render tests pass)
- [x] 5.2 Run `npm run lint` in `frontend/`
- [x] 5.3 Confirm no `backend/` changes and `features/builder` untouched

## 6. Docs / OpenSpec (optional note)

- [x] 6.1 Optionally add a one-line pointer in `docs/agent-roadmap.md` that AST-4 lands the Mastra scaffold without codegen (only if editing the roadmap in this change is desired)
