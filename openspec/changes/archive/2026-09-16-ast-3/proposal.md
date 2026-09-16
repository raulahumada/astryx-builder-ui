## Why

Linear [AST-3](https://linear.app/systhema/issue/AST-3/harness-de-tests-vitest-playwright-por-feature): AST-1/AST-2 shipped UI mocks without automated tests because the repo had no harness. We need Vitest + Playwright now so each feature can prove functionality, and OpenSpec must require test tasks on future front changes.

## What Changes

- Install **Vitest** + **Testing Library** for unit/component tests colocated under `features/<capability>/`.
- Install **Playwright** (`@playwright/test`) for E2E smoke of feature flows (landing → chat, builder session).
- Add npm scripts (`test`, `test:watch`, `test:e2e`, `test:e2e:ui`) and configs under `frontend/`.
- Smoke coverage for existing features: `landing` (lib + E2E `/`) and `builder` (lib + E2E `/chats/[chatId]`).
- Update OpenSpec flow: `openspec/config.yaml` context/rules/operations, `frontend/docs/frontend-standards.md`, and enrich-us skill wording so harness-aware test tasks are required (no more “skip — no harness”).

## Non-goals

- No backend / pytest harness.
- No exhaustive scenario suites for AST-1/AST-2 (smoke only).
- No CI workflow YAML unless already present (scripts only).
- No product UI redesign; no new features/routes beyond test fixtures.
- No generate/chat API or real preview.

## Capabilities

### New Capabilities

- `frontend-test-harness`: Frontend testing toolchain (Vitest + Playwright), colocated feature tests, and OpenSpec/standards rules that require tests for front feature changes.

### Modified Capabilities

- (none — existing `landing-home` / `builder-session-mock` product requirements unchanged; smoke tests verify them, they do not alter requirements)

## Impact

- **Side:** frontend + OpenSpec docs/skills. **Surface:** tooling (cross-cutting), not a product surface.
- **Standards:** `frontend/docs/frontend-standards.md`, root `AGENTS.md` (test mention), `.cursor/skills/enrich-us/SKILL.md`, `openspec/config.yaml`.
- **Deps (dev):** `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@playwright/test`.
- **Files:** `frontend/package.json`, new `vitest.config.ts`, `playwright.config.ts`, `frontend/e2e/**`, feature `*.test.ts(x)`, OpenSpec config/standards.
- **Backend / CORS / APIs:** none.
