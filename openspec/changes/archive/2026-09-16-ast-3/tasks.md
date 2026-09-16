## 1. Install harness (frontend)

- [x] 1.1 From `frontend/`, install Vitest + Testing Library deps: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` (devDependencies)
- [x] 1.2 From `frontend/`, install `@playwright/test` (devDependency) and run `npx playwright install chromium`
- [x] 1.3 Add `frontend/vitest.config.ts`, `frontend/src/test/setup.ts`, and npm scripts `test` / `test:watch`
- [x] 1.4 Add `frontend/playwright.config.ts` (`webServer` → `npm run dev`, baseURL `http://localhost:3000`, reuseExistingServer) and scripts `test:e2e` / `test:e2e:ui`

## 2. Feature smoke tests

- [x] 2.1 Add Vitest tests: `features/landing/lib/build-chat-href.test.ts` and `features/landing/lib/new-chat-id.test.ts`
- [x] 2.2 Add Vitest tests: `features/builder/lib/project-title.test.ts`
- [x] 2.3 Add Playwright `frontend/e2e/landing.spec.ts` (headline + placeholder; optional submit → `/chats/`)
- [x] 2.4 Add Playwright `frontend/e2e/builder.spec.ts` (`/chats/demo` empty-preview copy visible)

## 3. OpenSpec + standards wiring

- [x] 3.1 Update `openspec/config.yaml` context/rules/operations: harness exists; front feature tasks MUST include Vitest/Playwright; remove “skip — no harness”
- [x] 3.2 Update `frontend/docs/frontend-standards.md` (§9 + checklist) with commands and colocated/`e2e/` conventions
- [x] 3.3 Update `.cursor/skills/enrich-us/SKILL.md` (and brief note in root `AGENTS.md`) so enrich expects tests when front changes

## 4. Verify

- [x] 4.1 Run `npm test` in `frontend/` — all unit tests pass
- [x] 4.2 Run `npm run test:e2e` in `frontend/` — landing + builder smokes pass
- [x] 4.3 Run `npm run lint` in `frontend/` and fix issues
- [x] 4.4 Confirm no backend files changed
