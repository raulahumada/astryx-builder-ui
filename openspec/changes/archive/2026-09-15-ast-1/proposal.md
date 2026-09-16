## Why

Linear [AST-1](https://linear.app/systhema/issue/AST-1/crear-mock-de-ui): the home route still shows a scaffold placeholder. We need a **visual mock** of the v0-style prompt landing (headline + composer + suggestion chips) so the team can validate Astryx Neutral look and frame before any real chat/generation work.

## What Changes

- Replace `frontend/src/app/page.tsx` placeholder with a thin App Router wire to a new `features/landing` capability.
- Add a centered marketing/chat zero-state landing: headline, `ChatComposer`, model dropdown (static), visual mic, four suggestion chips, refresh control.
- Introduce Screaming Architecture folder `features/landing/{ui,model}` (first real front capability in the repo).
- Adapt Astryx template `ai-chat-landing` (plus `ChatComposerFooterActions` patterns); strip greeting, categories, cards, mentions, slash commands, attachments, Settings, and live dictation.

## Non-goals

- No backend changes, no new HTTP routes, no generate/chat API.
- No transcript/`ChatLayout`, streaming, auth, AppShell, or builder canvas.
- No theme overrides or Vitest/Playwright harness in this change.
- Do not scaffold the template under `src/app/ai-chat-landing`.

## Capabilities

### New Capabilities

- `landing-home`: Zero-state home at `/` — prompt landing mock (headline, composer, chips) with local-only interactions.

### Modified Capabilities

- (none — `openspec/specs/` is empty)

## Impact

- **Side:** frontend only. **Surface:** marketing/landing + chat zero-state (`docs/design_guideline.md`).
- **Standards:** `frontend/docs/frontend-standards.md`, `frontend/AGENTS.md`, `docs/design_guideline.md`.
- **Files:** `frontend/src/app/page.tsx`; new `frontend/src/features/landing/**`. Leave `providers.tsx` / `globals.css` unchanged.
- **Deps:** may need `@heroicons/react` if not already transitive for icons (match Astryx templates).
- **Backend / CORS / APIs:** none.
