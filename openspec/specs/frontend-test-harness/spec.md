## Purpose

Frontend testing harness (Vitest + Playwright) and OpenSpec/standards rules that require tests for front feature changes. Introduced by Linear AST-3.

## Requirements

### Requirement: Frontend unit test harness is available

The frontend SHALL provide a Vitest-based unit/component test harness runnable from `frontend/` via `npm test`, with tests colocated under `features/<capability>/` as `*.test.ts` or `*.test.tsx`.

#### Scenario: Run unit suite

- **WHEN** a developer runs `npm test` from `frontend/`
- **THEN** Vitest executes and exits successfully when all unit tests pass
- **AND** at least one test under `features/landing/lib/` and one under `features/builder/lib/` are included

#### Scenario: Colocated naming

- **WHEN** a new feature helper or UI unit test is added
- **THEN** the file lives next to the code under test (e.g. `features/chat/lib/formatTitle.test.ts`)
- **AND** it is not placed in a technical root drawer such as `src/tests/` for feature behavior

### Requirement: Frontend E2E harness is available

The frontend SHALL provide a Playwright E2E harness runnable via `npm run test:e2e`, with specs under `frontend/e2e/` covering feature routes without requiring the FastAPI backend.

#### Scenario: Run E2E suite

- **WHEN** a developer runs `npm run test:e2e` from `frontend/` (with Playwright browser installed)
- **THEN** Playwright starts or reuses the Next.js app on `http://localhost:3000`
- **AND** at least one landing and one builder smoke spec pass
- **AND** no backend service is required for those mock smokes

#### Scenario: Landing smoke

- **WHEN** Playwright opens `/`
- **THEN** the headline `What do you want to create?` is visible
- **AND** the message input (composer textbox) is present
- **AND** at least one suggestion chip (e.g. Contact Form) is visible

#### Scenario: Builder smoke

- **WHEN** Playwright opens `/chats/demo`
- **THEN** empty-preview copy indicating Astryx generation will appear is visible
- **AND** the builder shell (chat and preview regions) renders without network generate calls

### Requirement: OpenSpec front changes require tests when harness exists

OpenSpec project configuration and frontend standards SHALL require that front feature changes include test tasks (Vitest and/or Playwright) mapped to spec scenarios, instead of skipping tests for lack of a harness.

#### Scenario: Propose tasks for a front feature change

- **WHEN** an agent creates `tasks.md` for a frontend feature change after this harness lands
- **THEN** tasks MUST include running or adding Vitest and/or Playwright coverage for the changed capability
- **AND** tasks MUST NOT state that tests are skipped because no harness exists

#### Scenario: Standards document the commands

- **WHEN** a developer reads `frontend/docs/frontend-standards.md`
- **THEN** the doc names `npm test` and `npm run test:e2e`
- **AND** describes colocated `*.test.ts(x)` and `e2e/<feature>.spec.ts` conventions
