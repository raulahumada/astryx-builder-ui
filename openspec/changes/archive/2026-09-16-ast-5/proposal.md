## Why

Linear [AST-5](https://linear.app/systhema/issue/AST-5/implementar-ai-sdk): AST-4 landed a Mastra `chat-agent` and `POST /api/agent/chat` as a **plain-text** smoke stream, but the builder chat (`features/builder`) is still mock-only and cannot consume AI SDK UI. We need the Mastra ↔ Vercel AI SDK bridge so the builder composer streams real assistant text via `useChat`.

## What Changes

- Install `@mastra/ai-sdk`, `@ai-sdk/react`, and `ai` in `frontend/`.
- **BREAKING:** Refactor `POST /api/agent/chat` to `handleChatStream` + `createUIMessageStreamResponse` (UI Message Stream) instead of `text/plain` token chunks; accept AI SDK `{ messages }` body (agent id `chat-agent`).
- Wire builder chat: `useChat` + `DefaultChatTransport` in `features/builder`, map text parts to existing Astryx `ChatMessage` / `ChatMessageBubble`.
- Update OpenSpec `mastra-chat-agent` HTTP contract; add Vitest/Playwright coverage for the new stream path (mock route in e2e where keys are unavailable).

## Non-goals

- No workflows / agent networks / suspend-resume.
- No Custom UI for tools, Mastra Memory/threads, or codegen/preview updates.
- No FastAPI / backend changes; no auth, billing, persistence.
- No model-dropdown → real provider mapping; mic stays visual no-op.
- No español rioplatense copy migration (UI stays English for now).

## Capabilities

### New Capabilities

- `builder-chat-stream`: Builder chat panel streams live assistant text via AI SDK `useChat` against `/api/agent/chat`, replacing static user/assistant mock as the source of truth for messages.

### Modified Capabilities

- `mastra-chat-agent`: Smoke endpoint contract changes from plain-text `{ message }` stream to AI SDK UI Message Stream via `@mastra/ai-sdk` `handleChatStream`.

## Impact

- **Side:** frontend only. **Surfaces:** `builder/tool` + `chat/agent` (`docs/design_guideline.md`).
- **Standards:** `frontend/docs/frontend-standards.md` (Screaming Architecture under `features/builder/`); thin `app/api/agent/chat`; design guideline for Chat layout (keep existing Astryx Chat components — no new template dump). Backend CA N/A.
- **Files:** `frontend/src/app/api/agent/chat/route.ts` (+ types); `features/builder/hooks/`, `ui/BuilderChatPanel.tsx`, optional `lib/`; `package.json` / lockfile; OpenSpec delta specs.
- **Deps:** `@mastra/ai-sdk`, `@ai-sdk/react`, `ai` (pin `handleChatStream` `version` to installed AI SDK major).
- **HTTP:** Next-only `POST /api/agent/chat` — **BREAKING** vs AST-4. Not FastAPI. CORS unchanged.
- **Tests:** Vitest for helpers; Playwright builder flow with mocked stream where needed; `npm run lint` / `npm test`.
