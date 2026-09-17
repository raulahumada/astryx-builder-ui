## Context

Linear [AST-7](https://linear.app/systhema/issue/AST-7/agregar-sugerencia) asks for a **calculator** entry in the home landing’s app-suggestion chips. The prompt landing already lives under Screaming Architecture:

| Role | Path | Notes |
|------|------|--------|
| Thin route | `frontend/src/app/page.tsx` | Imports feature only |
| Page (Server) | `features/landing/ui/LandingPage.tsx` | Frame + headline |
| Composer (Client) | `features/landing/ui/LandingComposer.tsx` | Maps `SUGGESTION_SETS` → secondary `Button` chips |
| Model data | `features/landing/model/suggestions.ts` | `SUGGESTION_SETS` (2×4), icons from `@heroicons/react/24/outline` |
| Types | `features/landing/model/types.ts` | `SuggestionChip` shape unchanged |

Surface: **chat/agent** zero-state (`ai-chat-landing` pattern already adapted). Default set today ends with **Finance Calculator** (compound interest) — distinct from a general calculator.

Standards: `frontend/docs/frontend-standards.md` (Project Structure, UI/UX, Testing); `docs/design_guideline.md` (English copy; chips = `Button` secondary/sm, not Token/Card).

## Goals / Non-Goals

**Goals:**

- First paint at `/` shows a chip labeled **Calculator** that fills the composer with a basic-arithmetic build prompt.
- Keep four chips per rotating set; retain **Finance Calculator** somewhere in `SUGGESTION_SETS`.
- Cover the change with colocated Vitest + Playwright; update `landing-home` delta.

**Non-Goals:**

- Backend / FastAPI / CORS / new endpoints / `features/landing/api/`.
- Mastra, `app/api/agent/*`, or builder session behavior.
- Generating a real calculator UI; auto-submit on chip click; Spanish labels.
- Redesigning landing layout, model selector, or Refresh mechanics.

## Decisions

1. **Data-only change in `suggestions.ts`**
   - Rationale: `LandingComposer` already renders whatever `SUGGESTION_SETS[setIndex]` provides; no UI logic change needed.
   - Rejected: hardcoding a fifth chip in JSX; inventing a new feature folder.

2. **Chip contract**

   | Field | Value |
   |-------|--------|
   | `id` | `calculator` |
   | `label` | `Calculator` |
   | `prompt` | `Build a calculator with basic arithmetic operations` |
   | `icon` | `CalculatorIcon` from `@heroicons/react/24/outline` |

3. **Set layout (keep 4×2)**
   - Set 0 (first paint): Contact Form, Image Editor, Mini Game, **Calculator**.
   - Set 1: Dashboard, Sign In, Photo Gallery, **Finance Calculator** (replaces Todo App).
   - Rejected: renaming Finance Calculator → Calculator (loses finance intent); five chips on first paint (breaks established density); putting Calculator only in set 1 (fails AST-7 “appears in the list” without Refresh).

4. **Components / imports (existing, not invented)**
   - `@astryxdesign/core/Button` (already used for chips).
   - `@astryxdesign/core/Icon` + `CalculatorIcon` (Heroicons outline; available in installed package).
   - No new Astryx template discovery required beyond confirming chip pattern already matches `ai-chat-landing` / project rules.

5. **Tests**
   - Vitest: `features/landing/model/suggestions.test.ts` — set 0 includes `calculator`; `finance-calculator` still present in some set; each set length === 4.
   - Playwright: `e2e/landing.spec.ts` — assert `getByRole("button", { name: "Calculator" })` on `/`.

6. **Backend / API**
   - None. Explicit Non-goal: no HTTP contract.

## Risks / Trade-offs

- [Todo App removed from rotating sets] → Mitigation: acceptable for this ticket; can restore in a later copy tweak if product wants it back.
- [Users expecting Finance Calculator on first paint] → Mitigation: still available after one Refresh; spec updated accordingly.
- [Main `landing-home` still documents outdated “submit does nothing remote” from AST-1] → Mitigation: out of scope for AST-7; do not “fix” unrelated scenarios in this delta.

## Migration Plan

- Ship as a pure frontend data + test + spec update; no feature flags or rollback beyond git revert.
- After apply: sync delta into `openspec/specs/landing-home` on archive/sync.

## Open Questions

- None blocking. If product prefers keeping Todo and dropping another set-1 chip instead of Finance↔Todo swap, adjust in apply without changing the Calculator-on-first-paint requirement.
