## 1. Discovery (Astryx)

- [x] 1.1 From `frontend/`, run `npx astryx build "AI chat landing with prompt composer and suggestion chips"`, `npx astryx docs layout`, `npx astryx template ai-chat-landing`, and `npx astryx template ChatComposerFooterActions`
- [x] 1.2 Confirm components via `npx astryx component ChatComposer`, `Button`, `DropdownMenu` (and `Icon` / `IconButton` if used)

## 2. Feature scaffold

- [x] 2.1 Create `frontend/src/features/landing/model/suggestions.ts` with static chips + model options (Astryx-branded copy)
- [x] 2.2 Create `frontend/src/features/landing/ui/LandingComposer.tsx` (`"use client"`) with `ChatComposer` + `ChatComposerInput`, model `DropdownMenu` in `footerActions`, visual mic in `sendActions`, chips + refresh as `Button`s; `onSubmit` no-op; no `useChatDictation`
- [x] 2.3 Create `frontend/src/features/landing/ui/LandingPage.tsx` (Server) with `Layout` `height="fill"` `contentWidth={720}`, headline `What do you want to create?`, and `LandingComposer`
- [x] 2.4 Add `frontend/src/features/landing/index.ts` public re-exports
- [x] 2.5 If `@heroicons/react` is not resolvable, add it as a direct dependency in `frontend/package.json`

## 3. App wiring

- [x] 3.1 Replace `frontend/src/app/page.tsx` to only render `LandingPage` from `features/landing` (no raw `<main>` / px layout)
- [x] 3.2 Leave `providers.tsx` and `globals.css` unchanged; do not create `src/app/ai-chat-landing`

## 4. Verify

- [x] 4.1 Run `npm run lint` in `frontend/` and fix issues
- [x] 4.2 Visually check `/` (desktop ~1140px and a narrow viewport): headline, composer, four chips, refresh; no scaffold placeholder
- [x] 4.3 Confirm no harness — skip automated tests (no Vitest/Playwright in frontend today)
- [x] 4.4 Confirm no backend files changed
