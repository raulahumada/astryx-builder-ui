---
name: enrich-us
description: >-
  Analyze and enhance user stories with complete, implementation-ready technical
  detail from direct ticket input or Linear (team Systhema, keys AST-*). Use when
  enriching issues, refining user stories, or when the user runs /enrich-us.
metadata:
  author: systhema
  version: "1.0.0"
---

# enrich-us Skill

Use it when this workflow is required in the project.

## Instructions

Please analyze and enrich the ticket: $ARGUMENTS.

Follow these steps:

1. Determine the ticket input source:
   - **Direct input mode (default when ticket text is provided):** Use the ticket content shared by the user in the prompt/chat.
   - **Linear mode (optional):** If the user provides a Linear issue id/key (e.g. `AST-1`), a Linear URL (`https://linear.app/systhema/issue/AST-…`), or asks to use Linear (including references like "the one in progress"), use the **Linear MCP** to fetch the issue details.
2. Act as a product expert with technical knowledge of this monorepo (Next.js + Astryx frontend, FastAPI backend, OpenSpec).
3. Understand the problem described in the ticket.
4. Decide whether or not the User Story is completely detailed according to product best practices. Validate that it includes:
   - Full functionality description (user value + behavior)
   - Comprehensive list of fields / UI surfaces / data to create or update
   - Required endpoints structure and URLs (from the backend contract — see Project context)
   - Files/modules to modify according to architecture and best practices:
     - Frontend → Screaming Architecture paths under `features/<capability>/…` (see `frontend/docs/frontend-standards.md`)
     - Backend → Clean Architecture layers `domain` / `application` / `presentation` / `infrastructure` (see `backend/docs/backend-standards.md`)
   - Definition of done (implementation and delivery steps)
   - Documentation and test updates (OpenSpec artifacts, API docs if applicable)
   - OpenSpec follow-up: whether `/opsx:propose` should create a change and which artifacts (proposal / design / tasks / specs)
   - Non-functional requirements (security, performance, observability, CORS, etc.)
5. If the story lacks enough technical detail for autonomous implementation, provide an improved version that is clearer, more specific, and concise, aligned with step 4. Load only the project context relevant to the ticket as described below. Return the result in markdown.
6. Output format must always include:
   - `## Original`
   - `## Enhanced`
7. Linear write-back is optional and only applies in Linear mode (or when the user explicitly asks to update Linear):
   - Discover Linear tools first (`GetDynamicTools` / MCP descriptors). Prefer namespace matching Linear (often `plugin-linear-linear`). If Linear is unavailable or needs auth, say so and continue with chat-only enrichment.
   - Read the tool schema before calling (`get_issue`, `save_issue`, `list_issue_statuses`, `list_issues`, or equivalents).
   - Fetch the issue with `get_issue` using the identifier (e.g. `AST-1`).
   - Update the issue description by appending the enhanced content after the original content, with clear `## [original]` and `## [enhanced]` sections and readable formatting (lists/code snippets when useful). Use `save_issue` with `id` and the full merged `description` (literal newlines, not escape sequences).
   - If the issue state matches a refinement backlog state (e.g. `To refine`, `Triage`, or team equivalent), move it to the team's pending-validation state (e.g. `Pending refinement validation`). Use `list_issue_statuses` with the issue's team to resolve exact state names before calling `save_issue` with `state`.

## Linear MCP quick reference

| Action | Tool | Key params |
|--------|------|------------|
| Fetch issue | `get_issue` | `id`: issue identifier (e.g. `AST-1`) |
| Search issues | `list_issues` | `query`, `assignee: "me"`, `state`, `team` |
| List team states | `list_issue_statuses` | `team` |
| Update issue | `save_issue` | `id`, `description`, optional `state` |

Workspace / team: **Systhema** (`linear.app/systhema`). Issue keys: **`AST-*`**.

Server name (typical): `plugin-linear-linear`. Always read each tool's JSON schema under the MCP descriptors before calling. Authenticate if the namespace reports `needsAuth`.

## Project context (progressive)

Load only what the ticket needs. Do not dump the whole repo into context.

1. Read root `AGENTS.md` once per session (monorepo map, run commands, agent principles).
2. Read `openspec/config.yaml` once per session.
3. Prefer **Codegraph** (`user-codegraph` → `codegraph_explore` with `projectPath` = this repo) for story intent before broad file searches. If no `.codegraph/` index exists, fall back to Grep/Glob/Read.
4. **Frontend / UI stories:**
   - Read `frontend/AGENTS.md` (Next.js + Astryx rules).
   - Read `docs/design_guideline.md` (v0-like product look on Astryx Neutral) — cite relevant sections in `## Enhanced`.
   - Read `frontend/docs/frontend-standards.md` (Screaming Architecture + code practices) — name concrete `features/<capability>/…` paths in `## Enhanced`.
   - Discover UI via Astryx CLI from `frontend/`: `npx astryx build "<idea>"`, `npx astryx docs layout`, `npx astryx component <Name>`, `npx astryx search "<query>"`.
   - Reference concrete paths under `frontend/src/` (thin `app/` + `features/`). Do not propose dumping logic into `app/page.tsx` or technical-only folders (`components/`, `hooks/` at root).
   - Enforce Astryx constraints in the enhanced story: no layout `<div>`, tokens only, Theme/LinkProvider already in `providers.tsx`; frame-first; cards only for standalone widgets.
5. **Backend / API stories:**
   - Read `backend/docs/backend-standards.md` (Clean Architecture + FastAPI practices) — name layers and files (`presentation/…`, `application/…`, `domain/…`, `infrastructure/…`) in `## Enhanced`.
   - Read `backend/app/` as it exists today; if still scaffold-only (`main.py`), the enhanced story must describe the first Clean Architecture slice to introduce — do not grow a god-`main.py`.
   - Contract source of truth: existing FastAPI routes + OpenAPI (`/docs` when running). Do **not** invent request/response shapes.
   - If API markdown contracts appear later (e.g. `backend/docs/api/api-*.md`), list that directory and read matching files in full.
6. **Cross-cutting frontend ↔ API:**
   - Name concrete endpoints, methods, payloads, status codes, and which Next.js layer calls them (Server Component, Route Handler, `features/<x>/api`).
   - Note CORS (`backend` allows `http://localhost:3000` today) and any env vars needed.
   - Keep front feature adapters and back use cases aligned; mention both standards docs when the story spans both sides.
7. Reuse Linear issue and team-status results already present in the active conversation. Do not repeat catalog calls without a concrete missing field.

## Architecture anchors (this repo)

| Area | Path / note |
|------|-------------|
| Frontend standards | `frontend/docs/frontend-standards.md` (Screaming Architecture) |
| Backend standards | `backend/docs/backend-standards.md` (Clean Architecture) |
| Design guideline | `docs/design_guideline.md` |
| Frontend app (thin) | `frontend/src/app/` |
| Frontend features | `frontend/src/features/<capability>/` (target) |
| Astryx providers | `frontend/src/app/providers.tsx` |
| Backend API | `backend/app/` → CA layers as code grows |
| OpenSpec | `openspec/changes/`, `openspec/specs/` |
| Agent rules | `AGENTS.md`, `frontend/AGENTS.md` |

Enhanced stories must reference concrete paths (`frontend/src/…`, `backend/app/…`), Server vs Client Components, Astryx imports (`@astryxdesign/core/*`), and test expectations when relevant (add Vitest/Playwright only if the repo already uses them; otherwise say “add tests when the harness exists”).

When the story implies a non-trivial change, note that `/opsx:propose` should include tasks for:

- Implementation in frontend and/or backend
- Spec/design updates under `openspec/`
- API documentation if new routes are added (prefer documenting in FastAPI + any `backend/docs/` that exists)

## Notes

- Do not require Linear when the user already provided full ticket content directly.
- If input is ambiguous (for example, user gives a short reference without content), ask whether to resolve via Linear or request the full ticket text.
- Linear write-back is **off by default**; only update Linear when in Linear mode or when the user asks to persist the enrichment.
- Use enrich-us only to refine an **existing** issue that is thin or outdated — not to invent greenfield epics without a ticket.
- When merging descriptions, preserve existing Linear content; append enrichment sections rather than replacing unrelated content. If a stale `[enhanced]` exists, regenerate it from the checklist and replace it (keep useful `[original]` substance).
- After enrichment, suggest next step: `/opsx:propose AST-N` (change folder = lowercase id, e.g. `ast-1`) or `/opsx:explore` if still fuzzy — do not auto-create OpenSpec changes unless the user asks.
