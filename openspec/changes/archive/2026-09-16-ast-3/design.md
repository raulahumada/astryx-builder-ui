## Context

Linear [AST-3](https://linear.app/systhema/issue/AST-3/harness-de-tests-vitest-playwright-por-feature). Frontend has `features/landing` and `features/builder` but no test runner. OpenSpec `config.yaml` still tells agents to skip tests when no harness exists. This change introduces the harness and flips that rule.

**Side:** frontend + OpenSpec/docs. **No product UI redesign.** Standards: `frontend/docs/frontend-standards.md` §9 (colocated tests).

## Goals / Non-Goals

**Goals:**

- Vitest for pure `lib/` / `model/` and optional component tests per feature.
- Playwright for E2E smoke of feature routes (`/`, `/chats/[chatId]`).
- OpenSpec + standards require test tasks once harness exists.
- Minimal smoke tests proving the toolchain works against current features.

**Non-Goals:**

- pytest / backend harness.
- Full regression matrix for every AST-1/AST-2 scenario.
- GitHub Actions / CI YAML (scripts only).
- Snapshot / visual regression tooling.

## Decisions

### 1. Vitest + Testing Library (not Jest)

- **Choice:** Vitest + `@vitejs/plugin-react` + `jsdom` + `@testing-library/react` + `@testing-library/jest-dom` + `@testing-library/user-event`.
- **Why:** Already named in `frontend-standards` / OpenSpec config; fast ESM; aligns with Next/React 19.
- **Rejected:** Jest (heavier), Cypress component (overlaps Playwright).

### 2. Playwright for E2E (not Cypress)

- **Choice:** `@playwright/test` with `webServer` pointing at `npm run dev` (or `next start` after build if preferred for stability — default: `next dev` on `http://localhost:3000` with reuseExistingServer).
- **Why:** First-class Next/App Router; config already partially present as optional peer via Next tooling; named in project docs.
- **Rejected:** Cypress (extra runner), pure `fetch` HTTP checks (not UI).

### 3. Colocation layout (Screaming Architecture)

```text
frontend/
  vitest.config.ts
  playwright.config.ts
  src/test/setup.ts                 # jest-dom matchers only
  src/features/<capability>/
    lib/*.test.ts                   # unit (preferred for pure helpers)
    ui/*.test.tsx                   # optional RTL when UI logic warrants
  e2e/
    landing.spec.ts
    builder.spec.ts
```

- No root `src/tests/` drawer for feature behavior.
- E2E lives in `frontend/e2e/` (cross-route; not owned by a single feature folder).

### 4. What to test first (smoke, not exhaustive)

| Layer | Target | Assertion |
|-------|--------|-----------|
| Vitest | `landing/lib/build-chat-href.ts`, `new-chat-id.ts` | href shape / blank → null |
| Vitest | `builder/lib/project-title.ts` | truncate / empty fallback |
| Playwright | `/` | headline + composer placeholder visible |
| Playwright | submit non-empty prompt | navigates to `/chats/…` |
| Playwright | `/chats/demo` | top bar / empty preview copy visible |

Component RTL of full Astryx trees is optional; prefer lib unit + E2E for DS-heavy UI.

### 5. OpenSpec / agent flow updates

Update so future `/opsx:propose` + `/opsx:apply` + `/enrich-us` **require** tests:

| File | Change |
|------|--------|
| `openspec/config.yaml` | Context: harness **exists** (Vitest + Playwright). Rules for `tasks` / `specs` / `apply`: front feature changes MUST include Vitest and/or Playwright tasks mapping to scenarios; drop “skip — no harness”. |
| `frontend/docs/frontend-standards.md` | §9 + checklist: how to run `npm test` / `npm run test:e2e`; colocated naming `*.test.ts(x)`; E2E under `e2e/<feature>.spec.ts`. |
| `.cursor/skills/enrich-us/SKILL.md` | Expect Vitest/Playwright when front changes. |
| Root `AGENTS.md` (brief) | Note harness + scripts. |

### 6. npm scripts

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

Browsers: install Chromium via `npx playwright install chromium` (document in tasks; commit `playwright.config.ts` only).

## Risks / Trade-offs

- **[Risk] Astryx components hard to unit-test in jsdom** → Prefer pure `lib/` tests + Playwright for UI; avoid brittle RTL of DS internals.
- **[Risk] E2E flaky on cold `next dev`** → `webServer.timeout` generous; `reuseExistingServer: !process.env.CI`.
- **[Trade-off] No CI yet** → Local scripts ready; CI is a follow-up ticket.
- **[Trade-off] Spec landing-home still says submit does not navigate** → Product already navigates via `buildChatSessionHref`; E2E asserts current behavior. Do not MODIFY `landing-home` in this change (out of scope); note drift for a later sync if needed.

## Migration Plan

1. Install deps + browser binary.
2. Add configs/scripts/setup.
3. Add smoke tests; run `npm test` and `npm run test:e2e`.
4. Update OpenSpec config + standards + enrich-us.
5. Archive sync of `frontend-test-harness` spec on `/opsx:archive`.

Rollback: remove configs/deps/scripts; revert OpenSpec wording to “no harness”.

## Open Questions

- None blocking. Optional later: GitHub Action, pytest for FastAPI.
