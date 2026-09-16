# Frontend code standards

Code standards for `frontend/`. **Architecture: Screaming Architecture** (folders scream product domain, not technology).

**Complements:** `frontend/AGENTS.md` (Next + Astryx), `docs/design_guideline.md` (look), root `AGENTS.md`, `docs/agent-roadmap.md` (agent).  
**Used by:** `/enrich-us`, `/opsx:propose`, `/opsx:apply` — cite concrete sections in stories and changes.

## Index

1. [Principles](#principles)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
   - [Core Technologies](#core-technologies)
   - [UI Framework](#ui-framework)
   - [State Management & Data Flow](#state-management--data-flow)
   - [Testing Framework](#testing-framework)
   - [Development Tools](#development-tools)
4. [Coding Standards](#coding-standards)
   - [Language and Naming Conventions](#language-and-naming-conventions)
   - [File Naming](#file-naming)
   - [Component Conventions](#component-conventions)
   - [State Management](#state-management)
   - [Service Layer Architecture](#service-layer-architecture)
5. [UI/UX Standards](#uiux-standards)
6. [Testing Standards](#testing-standards)
7. [Configuration Standards](#configuration-standards)
8. [Performance Best Practices](#performance-best-practices)
9. [AI agent (Mastra)](#ai-agent-mastra)
10. [Pre-merge checklist (front)](#pre-merge-checklist-front)

---

## Principles

1. **Scream the domain** — opening `src/` should reveal *what the product does* (`landing`, `builder`, …), not only `components/` / `hooks/`.
2. **Thin App Router** — `src/app/` is routes, layouts, and wiring only.
3. **Features own their UI** — screens, hooks, and adapters live together.
4. **Decouple types and logic** — types in `model/`; helpers in `lib/` / `api/`, not embedded in JSX.
5. **Shared is last resort** — only genuinely cross-cutting code.
6. **Astryx first** — UI via Design System + design guideline.
7. **Server by default** — `"use client"` only at the lowest necessary edge.

---

## Project Structure

```text
frontend/
  e2e/                      # Playwright specs
  src/
    app/                    # Next.js App Router (thin)
      api/agent/            # Agent Route Handlers (Node)
      chats/[chatId]/      # Builder routes
      layout.tsx
      providers.tsx
      globals.css
    features/               # Screaming Architecture
      <capability>/
        ui/
        hooks/
        api/                # FastAPI adapters (when applicable)
        model/              # types, constants, mappers, mocks
        lib/                # pure helpers
        index.ts
    mastra/                 # AI agent runtime (NOT UI)
      agents/
      prompts/              # versioned *.njk
      models/
      index.ts
    shared/                 # minimal cross-cutting
    entities/               # shared domain types (≥2 features)
    test/setup.ts           # Vitest setup
  vitest.config.ts
  playwright.config.ts
  .env / .env.example
```

### What goes where

| What | Where |
|------|--------|
| Route `/chats/[id]` | `app/…/page.tsx` imports `features/builder` |
| Screen / composer | `features/<x>/ui/` |
| Chat / UI-state hook | `features/<x>/hooks/` |
| FastAPI adapter | `features/<x>/api/` |
| Types / mocks | `features/<x>/model/` |
| Pure helpers | `features/<x>/lib/` |
| Agent / prompts / models | `src/mastra/` |
| HTTP to the LLM | `app/api/agent/…` |
| E2E | `e2e/<feature>.spec.ts` |

### Anti-structure (avoid)

```text
src/components/   src/hooks/   src/services/   src/utils/   src/types/
```

That is *technical layering*. Prefer `features/<capability>/…`.

### Dependency rules

```text
app/  →  features/*  →  entities/*  →  shared/*
                 ↘_______________↗
mastra/  ←  app/api/agent/*   (runtime)
features/*  →  consume streams via hooks; do not import UI from mastra/
```

- `features/A` must not import internals of `features/B` (only `index.ts` if unavoidable).
- `shared/` never imports `features/`.
- `ui/` may import `model/` / `lib/` / `hooks/` / `api/`; **not** the reverse.

---

## Technology Stack

### Core Technologies

| Piece | Technology | Notes |
|-------|------------|--------|
| Framework | Next.js `16.3.5` (App Router) | Local docs: `node_modules/next/dist/docs/` |
| UI lib | React `19.2.8` | Server Components by default |
| Language | TypeScript strict | paths `@/*` → `src/*` |
| Agent | Mastra (`@mastra/core`) + Nunjucks | Node-only; see [AI agent (Mastra)](#ai-agent-mastra) |
| AI SDK bridge | `ai`, `@ai-sdk/react`, `@mastra/ai-sdk` | UI Message Stream ↔ builder |
| Backend (monorepo) | FastAPI | Business domain only; **not** the LLM loop |

### UI Framework

| Piece | Technology |
|-------|------------|
| Design System | `@astryxdesign/core` + `@astryxdesign/theme-neutral` `^0.6.2` |
| CLI | `npx astryx <cmd>` from `frontend/` |
| Icons | `@heroicons/react/24/outline` |
| Theme / Link | `Theme` + `LinkProvider` in `app/providers.tsx` |
| Base CSS | `reset.css` + `astryx.css` + `theme-neutral/theme.css` in `globals.css` |

**No** invented Tailwind utilities, and no raw hex/px (except structural layout widths). See [UI/UX Standards](#uiux-standards) and `docs/design_guideline.md`.

### State Management & Data Flow

| Case | Approach |
|------|----------|
| Server data | Server Components / `searchParams` / props from `page.tsx` |
| Local UI (composer, dropdown) | `useState` in Client Components |
| Chat stream | `useChat` + `DefaultChatTransport` in `features/<x>/hooks/` |
| URL / chat session | `chatId` in the route; `prompt` in the query |
| Global client store | **Not** by default (no Redux/Zustand unless an explicit change) |

Typical agent flow:

```text
UI (features/builder) → POST /api/agent/chat → handleChatStream(mastra) → LLM
```

### Testing Framework

| Layer | Tool | Config |
|-------|------|--------|
| Unit / component | Vitest + Testing Library + jsdom | `vitest.config.ts`, `src/test/setup.ts` |
| E2E | Playwright | `playwright.config.ts`, `e2e/` |

Commands: `npm test`, `npm run test:watch`, `npm run test:e2e`, `npm run test:e2e:ui`. Details in [Testing Standards](#testing-standards).

### Development Tools

| Tool | Use |
|------|-----|
| ESLint (`eslint-config-next`) | `npm run lint` |
| TypeScript | `tsc` / IDE check; strict |
| Astryx CLI | discover components / templates / docs |
| OpenSpec | `openspec/` + `/opsx:*` |
| Env | `frontend/.env` (local) + `.env.example` (docs) |

---

## Coding Standards

### Language and Naming Conventions

- TypeScript `strict`; avoid `any`.
- Domain names: `BuilderChatPanel`, `projectTitleFromPrompt` — not `DataView2` / catch-all `utils.ts`.
- Types in `model/types.ts` (or `model/types/<name>.ts`); no domain types inside `.tsx` except local `Props`.
- Typed constants / mocks in `model/`; mappers in `model/mappers.ts`.
- Feature public API via `index.ts` (controlled re-exports).

### File Naming

| Kind | Convention | Examples |
|------|------------|----------|
| React components / pages | `PascalCase.tsx` | `BuilderPage.tsx`, `ChatComposer.tsx` |
| Hooks | `use-<name>.ts(x)` (kebab) | `use-builder-chat.ts` |
| Pure helpers / lib | `kebab-case.ts` | `message-parts.ts`, `project-title.ts` |
| Types / mappers / mocks | `kebab-case.ts` under `model/` | `types.ts`, `mappers.ts` |
| Route Handlers | `route.ts` (Next convention) | `app/api/agent/chat/route.ts` |
| Tests | mirror source + `.test.ts(x)` | `project-title.test.ts`, `ChatComposer.test.tsx` |
| E2E | `kebab-case.spec.ts` | `e2e/builder.spec.ts` |
| Prompts | `vN.<role>.njk` | `prompts/chat/v1.system.njk` |
| Feature barrel | `index.ts` | `features/builder/index.ts` |

Rules:

1. One primary export per file when practical; filename matches the main symbol (`ChatComposer.tsx` → `ChatComposer`).
2. Prefer kebab for non-component modules; PascalCase only for React component files.
3. Do not invent catch-alls (`helpers.ts`, `misc.ts`, `utils.ts`) — name by domain responsibility.
4. Colocate tests next to the unit under test (or under `e2e/` for flows).

### Component Conventions

- Prefer Server Components; `"use client"` only where state, effects, or browser APIs are required.
- UI = presentation. Reusable logic in `lib/` / hooks; business fetch in `api/` or Route Handlers.
- Import Astryx from `@astryxdesign/core/<Name>` — no pointless wrappers.
- Discover with `npx astryx build|component|docs` before inventing markup.
- No layout `<div>`s; use DS stacks / grids / layout.
- Component props first; otherwise `style` / `className` with tokens `var(--color-*|--spacing-*|--radius-*)`.

### State Management

- UI state: local to the Client Component or feature hook (`features/<x>/hooks/`).
- Do not lift state into `app/` or global providers without need.
- Streams / async UI: prefer AI SDK patterns (`status`, `messages`) or feature hooks; clean Strict Mode guards (per-instance refs, not fragile module-level Sets).
- Network / agent errors: surface in UI (e.g. `ChatComposer` `status`) without leaking secrets.

### Service Layer Architecture

| Layer | Responsibility |
|-------|----------------|
| `features/<x>/api/` | Typed adapters to real **FastAPI** (OpenAPI). Map DTO → model. |
| `app/api/**/route.ts` | Next Route Handlers (agent, BFF). Thin; no JSX. |
| `src/mastra/` | Agents, prompts, model config — LLM runtime. |
| `features/<x>/lib/` | Pure: validation, formatters, message-part extractors. |

Rules:

1. Do not invent HTTP shapes: use existing FastAPI or a contract defined in the change’s OpenSpec/design.
2. UI should not know raw wire JSON when avoidable (mappers).
3. Agent chat is **Next**, not FastAPI (unless an explicit ticket says otherwise).
4. Secrets are server-side only; client gets `NEXT_PUBLIC_*` only.

---

## UI/UX Standards

Look source of truth: **`docs/design_guideline.md`** (product). Operational summary:

- Name the **surface** before designing (landing / builder / chat / …).
- Frame first: `Layout` / `AppShell` / `ChatLayout` per surface (`npx astryx docs layout`).
- Theme Neutral, mode `system`, accent `--color-accent`. Do not override `--color-*` in `:root`.
- Cards only for standalone interactive widgets; dense lists = Table/List/Item.
- **Copy:** English for now (Rioplatense = follow-up; do not migrate in enrichments unless an explicit ticket).
- a11y: labels on icon-only controls (`Dictate`, `Send`, etc.).
- Mic / model selector: visual-only until a change asks for real wiring.

---

## Testing Standards

1. Every front behavior change **must** add/update Vitest and/or Playwright aligned to OpenSpec scenarios.
2. Placement:
   - Unit: `features/<x>/**/*.test.ts(x)`, `src/mastra/**/*.test.ts`, helpers next to the Route Handler.
   - Component: `features/<x>/ui/*.test.tsx` — feature logic, **do not** re-test Astryx.
   - E2E: `e2e/<feature>.spec.ts`.
3. Prefer Vitest for pure logic; Playwright for routes/flows.
4. Mock `POST /api/agent/chat` (and other APIs) in E2E; **do not** require LLM API keys in CI.
5. Manual smoke with keys only if the ticket DoD asks for it (local, not CI).
6. Commands from `frontend/`: `npm test`, `npm run test:watch`, `npm run test:e2e`, `npm run test:e2e:ui`.

---

## Configuration Standards

| Concern | Where / rule |
|---------|----------------|
| Local env | `frontend/.env` — **do not** commit |
| Env docs | `frontend/.env.example` without secrets |
| Agent keys / models | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `MASTRA_OPENAI_MODEL`, `MASTRA_ANTHROPIC_MODEL` (ids from `mastra/models/config.ts`) |
| Next config | `next.config.ts` — e.g. `serverExternalPackages: ["@mastra/*"]` |
| Paths | `tsconfig` `@/*` → `src/*` |
| After editing `.env` | Restart `npm run dev` (Next loads env at startup) |
| OpenSpec | Change folder = Linear id lowercased (`ast-5`) |

---

## Performance Best Practices

- Server Components by default; minimize Client islands.
- Avoid unnecessary client waterfalls; prefer server props / RSC.
- Streams: `runtime = "nodejs"` on agent routes; set `maxDuration` accordingly; do not block the event loop with heavy sync work in the handler.
- Lists / chat: stable keys (`message.id`); avoid recreating transports / useless `useMemo` every render (stable transport per hook).
- Images / media: Astryx components and patterns; do not invent heavy CSS.
- E2E tests: mock the network so CI does not depend on LLM latency.
- Do not log huge payloads or secrets in prod.

---

## AI agent (Mastra)

Agent runtime runs in **Node inside Next**, not FastAPI. Roadmap: `docs/agent-roadmap.md`. Spec: `openspec/specs/mastra-chat-agent/`.

```text
frontend/src/mastra/
  index.ts     # new Mastra({ agents })
  agents/      # stable id e.g. chat-agent
  prompts/     # *.njk + typed render (throwOnUndefined)
  models/      # catalog + OpenAI→Anthropic fallbacks
```

| Concern | Where |
|---------|--------|
| HTTP | `app/api/agent/…` (today `POST /api/agent/chat` + AI SDK UI stream) |
| Consuming UI | `features/<capability>/` (`useChat`, Astryx bubbles) — **never** under `mastra/` |
| Agent id (AI SDK) | `agentId: 'chat-agent'` (`getAgentById`) |

Rules:

1. `mastra/` ≠ feature UI.
2. Bridges `handleChatStream` / `useChat` live in route + feature; breaking HTTP → OpenSpec.
3. Do not leak API keys; sanitize errors to the client; keep detail in server logs.
4. Vitest under `src/mastra/**`; no real LLM in unit tests.

---

## Pre-merge checklist (front)

- [ ] Is `app/` only composing features / thin Route Handlers?
- [ ] Is new code under `features/<capability>/` (or justified `shared/` / `entities/` / `mastra/`)?
- [ ] Are types in `model/types*` (or `entities/`), not embedded in UI?
- [ ] Are helpers in `lib/` / `model/` / `api/`, decoupled from JSX?
- [ ] Does it follow Astryx + design guideline + English copy?
- [ ] Are HTTP contracts real (FastAPI or OpenSpec), with no invented shapes?
- [ ] Is Server vs Client justified?
- [ ] Is there Vitest and/or Playwright for the changed behavior?
- [ ] If agent-touched: `src/mastra/` + `app/api/agent/…`, no UI in `mastra/`, `.env.example` up to date?
- [ ] Does `npm run lint` (+ `npm test` / e2e if applicable) pass?
