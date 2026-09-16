---
name: /enrich-us
id: enrich-us
category: Workflow
description: Enrich a user story / Linear ticket (AST-*) with implementation-ready technical detail
---

Enrich a user story with complete, implementation-ready technical detail.

**Skill source of truth:** follow `.cursor/skills/enrich-us/SKILL.md` end-to-end.

**Input**: `$ARGUMENTS` — ticket text, `AST-123`, a Linear URL (`https://linear.app/systhema/issue/AST-…`), or a short reference.

---

## Quick steps

1. **Resolve input**
   - Full ticket text in chat → direct mode (default).
   - Issue key / Linear URL / “use Linear” → Linear mode via Linear MCP (`plugin-linear-linear` or current Linear namespace). Discover + read schemas before calling. Auth if `needsAuth`.
   - Ambiguous → ask: Linear or paste full ticket?

2. **Load progressive context** (only what the story needs)
   - `AGENTS.md`, `openspec/config.yaml`
   - UI: `frontend/AGENTS.md` + `docs/design_guideline.md` + `frontend/docs/frontend-standards.md` (Project Structure, Technology Stack, Coding / UI/UX / Testing / Configuration / Performance) + Astryx CLI (`npx astryx …` from `frontend/`)
   - AI agent / Mastra: frontend-standards **AI agent (Mastra)** + `docs/agent-roadmap.md` + `frontend/src/mastra/` + `app/api/agent/…`
   - API: `backend/docs/backend-standards.md` (Clean Architecture) + `backend/app/` (+ OpenAPI / future `backend/docs/api/api-*.md` if present)
   - Prefer Codegraph when indexed; else Grep/Glob/Read

3. **Judge completeness** against the skill checklist (functionality, fields, endpoints, **architecture paths**, files, DoD, docs/**Testing Standards**, Mastra split if agent, OpenSpec follow-up, NFRs). Enhanced stories must name `features/<capability>/…` and/or CA layers when touching front/back; agent stories must name `src/mastra/` vs feature UI.

4. **Output always**
   - `## Original`
   - `## Enhanced`

5. **Linear write-back** — only in Linear mode or if the user asks
   - `get_issue` → merge `## [original]` + `## [enhanced]` → `save_issue`
   - Optionally move from refine/triage → pending validation after `list_issue_statuses`

6. **Next step** — suggest `/opsx:propose AST-N` (OpenSpec folder = lowercase id, e.g. `ast-1`) or `/opsx:explore`; do not auto-create OpenSpec changes unless asked.

## Guardrails

- Do not invent API request/response shapes that are not in FastAPI code or API docs.
- Do not invent Astryx components — discover with `npx astryx`.
- Front enrichments must include test expectations (frontend-standards **Testing Standards**). Agent enrichments must follow **AI agent (Mastra)** — no UI under `src/mastra/`, no FastAPI LLM loop by default.
- Write-back to Linear is off unless Linear mode / explicit ask.
- Keep enrichment concise and implementation-ready for this monorepo (`frontend/` + `backend/`).
