## Context

Linear **AST-1**. Frontend is still a scaffold: `frontend/src/app/page.tsx` uses a raw `<main>` placeholder. Theme + LinkProvider already live in `providers.tsx`; CSS stack is already in `globals.css`. No `features/` yet. Backend stays untouched (scaffold `GET /` and `GET /health` only).

The mock in AST-1 is a v0-like prompt home: headline, large composer, model trigger, mic, four prompt chips, refresh.

## Goals / Non-Goals

**Goals:**

- Ship a visual mock at `/` that matches the AST-1 composition using Astryx Neutral.
- Introduce `features/landing` (Screaming Architecture) with a thin `app/page.tsx`.
- Local-only interactions (type, open model menu, chip/refresh optional local state).

**Non-Goals:**

- Backend, network fetch, generate/chat APIs.
- Transcript, streaming, dictation, attachments, mentions, slash commands.
- AppShell / builder / auth.
- Test harness (Vitest/Playwright not in repo).

## Decisions

### 1. Frame: `Layout` column, not `AppShell` or `ChatLayout`

- **Choice:** `Layout` with `height="fill"`, `contentWidth={720}`, centered `VStack` (from `ai-chat-landing`).
- **Why:** Surface is marketing/landing + chat zero-state; design guideline forbids AppShell chrome on a hero landing and `ChatLayout` implies a transcript stream.
- **Rejected:** Dumping `npx astryx template ai-chat-landing ./src/app/ai-chat-landing` into App Router.

### 2. Feature layout (Screaming Architecture)

```text
frontend/src/
  app/page.tsx                         # Server: import LandingPage only
  features/landing/
    ui/LandingPage.tsx                 # Server: Layout frame + compose children
    ui/LandingComposer.tsx             # Client: ChatComposer + chips + local state
    model/suggestions.ts               # static chip + model lists
    index.ts                           # public re-exports
```

- No `features/landing/api/` or `hooks/` in this change.
- Client boundary only on `LandingComposer`.

### 3. Astryx kit (keep vs strip)

**Discover (from `frontend/`):**

```bash
npx astryx build "AI chat landing with prompt composer and suggestion chips"
npx astryx docs layout
npx astryx template ai-chat-landing
npx astryx template ChatComposerFooterActions
npx astryx component ChatComposer
npx astryx component Button
npx astryx component DropdownMenu
```

**Keep / use:**

| Import | Role |
|--------|------|
| `@astryxdesign/core/Layout` — `Layout`, `LayoutContent`, `VStack`, `HStack` | Page frame |
| `@astryxdesign/core/Text` — `Heading`, `Text` | Headline |
| `@astryxdesign/core/Chat` — `ChatComposer`, `ChatComposerInput` | Prompt box |
| `@astryxdesign/core/DropdownMenu` | Model selector in `footerActions` |
| `@astryxdesign/core/Button` / `Icon` | Chips, mic, refresh |
| `@heroicons/react/24/outline` | Icons (same as templates) |

**Strip from `ai-chat-landing`:** greeting “Hi, Andrew”, category `ToggleButtonGroup`, `ClickableCard` grid, `@`/`/` triggers, attachment drawer, Settings menu, mode tokens, `useChatDictation`.

**Copy (branded Astryx, not v0):**

- Headline: `What do you want to create?`
- Placeholder: `Ask Astryx to build...`
- Model trigger label: `Astryx` (static menu items e.g. Astryx / Astryx Fast)
- Chips: Contact Form, Image Editor, Mini Game, Finance Calculator (+ refresh)

### 4. Mock behavior

- `onSubmit`: no-op.
- Mic: visual `Button`/`IconButton` only — **no** `useChatDictation`.
- Model dropdown: local state updates trigger label only.
- Chip click / refresh: optional local state (fill composer or cycle static chip set); never network.
- Accent: Neutral `--color-accent`; do not paint Vercel-black CTAs.

### 5. Backend / API

None. No CA layers. Do not call `GET /` or invent chat endpoints.

## Risks / Trade-offs

- **[Risk] Template drift vs mock screenshot** → Re-check AST-1 image; prioritize composition over template extras.
- **[Risk] `@heroicons/react` not a direct dep** → Add explicit dependency if imports fail; do not invent another icon set.
- **[Risk] Composer default send button appears when typing** → Accept DS behavior; do not custom-paint a black send.
- **[Trade-off] No automated UI tests** → Manual lint + visual check until a harness exists.

## Migration Plan

1. Implement under `features/landing`; swap `app/page.tsx`.
2. Verify `/` visually; `npm run lint`.
3. Rollback: restore previous `page.tsx` and delete `features/landing`.

## Open Questions

- None blocking. Chip click may be no-op or fill composer — either is acceptable for the mock.
