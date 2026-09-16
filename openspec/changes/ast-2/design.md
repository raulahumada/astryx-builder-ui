## Context

Linear **AST-2**. Landing mock already lives at `/` via `features/landing` (AST-1). There is no builder/session route yet. Theme + LinkProvider remain in `providers.tsx`; globals CSS unchanged. Backend stays scaffold-only (`GET /`, `GET /health`) and is **out of scope**.

AST-2 references v0-style screenshots: top chrome (brand + project title + Preview + auth buttons), left chat (user prompt → assistant → activity/tool rows ending in “Thinking”), center empty preview with fake browser chrome.

## Goals / Non-Goals

**Goals:**

- Ship a visual builder-session mock at `/chats/[chatId]` (e.g. `/chats/demo`) using Astryx Neutral.
- Introduce `features/builder` (Screaming Architecture) with a thin App Router page.
- Show static “thinking” / tool-call activity via `ChatToolCalls` (no dedicated ChatReasoning in Astryx 0.6.2).
- Empty preview canvas as the dominant visual anchor; no live generation.

**Non-Goals:**

- Backend, fetch, generate/chat APIs, streaming.
- Real preview HTML/iframe/sandbox.
- Real auth; required nav from landing.
- Vitest/Playwright harness.
- Scaffolding Astryx templates under `app/<template-name>`.

## Decisions

### 1. Surface + frame: `AppShell` + `TopNav`, chat as content panel

- **Choice:** Surface **builder/tool** (`docs/design_guideline.md` §1.1 / §6). Outer frame = `AppShell` (`height="fill"`, `contentPadding={0}`) with `topNav` = `TopNav`. Main children = `HStack`: left chat panel (~340–420px structural width) + fill preview.
- **Why:** Matches multi-pane builder; preview is the dominant anchor; v0 refs put chrome in a top bar, not SideNav.
- **Rejected:** Putting chat in `SideNav` (wrong semantics; SideNav is app navigation). Full-page `ChatLayout` alone (no preview region). Dumping `npx astryx template ai-chat ./src/app/ai-chat`.

### 2. Feature layout (Screaming Architecture)

```text
frontend/src/
  app/chats/[chatId]/page.tsx          # Server: params → BuilderPage
  features/builder/
    ui/BuilderPage.tsx                 # Server: AppShell + compose panels
    ui/BuilderTopBar.tsx               # TopNav mock (may be Server)
    ui/BuilderChatPanel.tsx            # Client: transcript + composer state
    ui/BuilderPreviewCanvas.tsx        # Server or Client: empty preview + Toolbar
    model/mock-session.ts              # static titles, messages, tool calls
    index.ts
```

- **No** `features/builder/api/` or cross-feature imports from `features/landing` internals.
- `"use client"` only on `BuilderChatPanel` (and preview only if it needs local UI state).

### 3. Astryx kit (keep vs strip)

**Discover (from `frontend/`):**

```bash
npx astryx build "builder tool chat left preview center top bar"
npx astryx docs layout
npx astryx template ai-chat --skeleton
npx astryx template ChatLayoutPanelChat
npx astryx template ChatToolCallsStatuses
npx astryx component AppShell
npx astryx component TopNav
npx astryx component ChatToolCalls
npx astryx component Toolbar
```

**Keep / use (real imports):**

| Import | Role |
|--------|------|
| `@astryxdesign/core/AppShell` — `AppShell` | Page shell |
| `@astryxdesign/core/TopNav` — `TopNav`, `TopNavHeading` / items as needed | Top chrome |
| `@astryxdesign/core/Layout` — `HStack`, `VStack`, `Layout` / `LayoutPanel` if needed | Regions |
| `@astryxdesign/core/Chat` — `ChatLayout`, `ChatMessageList`, `ChatMessage`, `ChatMessageBubble`, `ChatComposer`, `ChatToolCalls`, optional `ChatSystemMessage`, `Markdown` | Left panel |
| `@astryxdesign/core/Toolbar` | Fake browser chrome over preview |
| `@astryxdesign/core/Button`, `Icon`, `Text`, `Heading` | Actions, empty state, labels |
| `@heroicons/react/24/outline` | Icons |

**Strip from `ai-chat`:** live `ResizeHandle`/streaming hooks, real artifact body content, Dialog/settings, attachments, dictation, ClickableCards, @mentions, slash commands — unless needed for static look.

**Thinking:** No `ChatReasoning` component. Represent activity with `ChatToolCalls` (`pending` / `running` / `complete`) and optional `ChatSystemMessage` / secondary `Text` for “Sending…”.

### 4. Mock data + copy (Astryx-branded)

Static in `model/mock-session.ts` (illustrative; align to AST-2 refs):

- Project title: e.g. `Lawyer landing page`
- User bubble: `Landing page of lawyer`
- Assistant intro (short editorial sentence)
- Tool rows: Inspected project, Explored legal design, Explore • 4 Files (`complete`), Thinking (`running`)
- Preview empty: `Your Astryx generation will show here.`
- URL chrome: `/`
- Top actions: Preview tab, Log In, Sign Up (no-op)

Composer: controlled local value; `onSubmit` no-op; placeholder e.g. `Ask a follow-up...`.

Accent: Neutral `--color-accent`; do not copy v0 black Sign Up / purple glow.

### 5. Routing

- Dynamic segment `/chats/[chatId]` so a later real session id can reuse the path; mock works with any id (ignore or display only).
- Landing does **not** need to link here in this change.

### 6. Backend / API

None. No CA layers. No `features/builder/api/`.

### 7. Responsive

Desktop-first mock matching refs. On narrow viewports: prefer stacking (chat above or below preview) or keep horizontal scroll of the HStack — pick the least-custom option AppShell/`Layout` already support; document choice in implementation comments if non-obvious. Do not invent a custom hamburger.

## Risks / Trade-offs

- **[Risk] `ai-chat` template is heavier than the mock** → Study skeleton; compose only needed pieces into `features/builder/ui`.
- **[Risk] No ChatReasoning → “Thinking” looks wrong** → Use `ChatToolCalls` running status + copy; re-check AST-2 screenshots.
- **[Risk] Fake browser chrome fights DS** → Prefer `Toolbar` + icon buttons with a11y labels over raw DOM.
- **[Trade-off] No automated UI tests** → Manual lint + visual check at `/chats/demo`.
- **[Trade-off] Config “as-is” still mentions empty features/** → Treat AST-1 landing as current truth; do not rewrite landing.

## Migration Plan

1. Astryx discovery → implement `features/builder` → add `app/chats/[chatId]/page.tsx`.
2. Verify `/chats/demo` visually; `npm run lint`.
3. Rollback: delete the route + feature folder; landing unchanged.

## Open Questions

- Exact project-switcher / star icon fidelity — approximate with TopNav + Icon; polish later if product asks.
- Whether Preview gear opens anything — **no** in this mock (visual only).
