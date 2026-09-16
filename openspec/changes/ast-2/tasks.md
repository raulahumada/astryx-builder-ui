## 1. Discovery (Astryx)

- [x] 1.1 From `frontend/`, run `npx astryx build "builder tool chat left preview center top bar"`, `npx astryx docs layout`, `npx astryx template ai-chat --skeleton`, `npx astryx template ChatLayoutPanelChat`, and `npx astryx template ChatToolCallsStatuses`
- [x] 1.2 Confirm components via `npx astryx component AppShell`, `TopNav`, `ChatToolCalls`, `Toolbar`, plus Chat pieces used in the transcript (`ChatLayout`, `ChatMessageList`, `ChatMessage`, `ChatMessageBubble`, `ChatComposer`)

## 2. Feature scaffold

- [x] 2.1 Create `frontend/src/features/builder/model/mock-session.ts` with static project title, messages, and `ChatToolCallItem[]` (including a running Thinking row)
- [x] 2.2 Create `frontend/src/features/builder/ui/BuilderTopBar.tsx` with `TopNav` — Astryx brand, project title, Preview control, visual Log In / Sign Up (no-op)
- [x] 2.3 Create `frontend/src/features/builder/ui/BuilderChatPanel.tsx` (`"use client"`) with compact `ChatLayout` / message list, static bubbles, `ChatToolCalls`, follow-up `ChatComposer` (`onSubmit` no-op)
- [x] 2.4 Create `frontend/src/features/builder/ui/BuilderPreviewCanvas.tsx` with `Toolbar` fake browser chrome (accessible icon labels) + empty-state `Text`/`Icon` (Astryx copy; no iframe)
- [x] 2.5 Create `frontend/src/features/builder/ui/BuilderPage.tsx` (Server) with `AppShell` `height="fill"` `contentPadding={0}`, `topNav`, and `HStack` (chat panel ~340–420 + fill preview)
- [x] 2.6 Add `frontend/src/features/builder/index.ts` public re-exports; do not add `features/builder/api/`

## 3. App wiring

- [x] 3.1 Add `frontend/src/app/chats/[chatId]/page.tsx` that only renders `BuilderPage` from `features/builder` (pass `chatId` if needed for display only)
- [x] 3.2 Leave `providers.tsx`, `globals.css`, and `features/landing` unchanged; do not create `src/app/ai-chat`

## 4. Verify

- [x] 4.1 Run `npm run lint` in `frontend/` and fix issues
- [x] 4.2 Visually check `/chats/demo` (desktop and a narrow viewport): top bar, left chat with tool/thinking rows, empty preview
- [x] 4.3 Confirm no harness — skip automated tests (no Vitest/Playwright in frontend today)
- [x] 4.4 Confirm no backend files changed
