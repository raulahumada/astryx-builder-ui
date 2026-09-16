## Why

Linear [AST-2](https://linear.app/systhema/issue/AST-2/crear-mock-de-pantallas): after the landing mock (AST-1), the team needs a **visual mock** of the v0-style builder session — chat on the left (including “thinking” / tool-call activity) and an empty preview canvas in the center — so layout and Astryx Chat patterns can be validated before any real generation or live preview.

## What Changes

- Add a thin App Router route `app/chats/[chatId]/page.tsx` wired to a new `features/builder` capability.
- Mock builder shell: `AppShell` + `TopNav` (brand Astryx, project title, Preview tab, visual Log In / Sign Up).
- Left chat panel (~340–420px): static transcript (user prompt, assistant copy, `ChatToolCalls` activity including a running “Thinking” state) + follow-up `ChatComposer` (submit no-op).
- Center preview: fake browser chrome (`Toolbar`) + empty-state placeholder copy; no real preview HTML/iframe.
- Adapt Astryx template `ai-chat` (plus `ChatLayoutPanelChat` / `ChatToolCallsStatuses` patterns); strip live resize streaming, real artifacts, attachments, dictation, settings, mentions, slash commands.

## Non-goals

- No backend changes, no generate/chat API, no streaming LLM.
- No real preview, sandbox, or generated HTML.
- No real auth (Log In / Sign Up are visual only).
- No required navigation from landing; no Vitest/Playwright harness.
- Do not scaffold templates under `src/app/ai-chat` (or any `app/<template-name>`).
- No theme overrides of `--color-*` in `:root`.

## Capabilities

### New Capabilities

- `builder-session-mock`: Builder/tool session at `/chats/[chatId]` — top bar + left chat mock + empty preview canvas; local-only data.

### Modified Capabilities

- (none — `openspec/specs/` has no main specs yet; archived AST-1 does not change)

## Impact

- **Side:** frontend only. **Surface:** builder/tool (+ chat/agent patterns in the left panel) per `docs/design_guideline.md`.
- **Standards:** `frontend/docs/frontend-standards.md`, `frontend/AGENTS.md`, `docs/design_guideline.md`.
- **Files:** new `frontend/src/app/chats/[chatId]/page.tsx`; new `frontend/src/features/builder/{ui,model,index.ts}`. Leave `providers.tsx` / `globals.css` / `features/landing` unchanged unless a tiny shared icon import already exists.
- **Deps:** `@heroicons/react` as used by Astryx templates (likely already present via AST-1).
- **Backend / CORS / APIs:** none.
