## Why

The home prompt landing’s default suggestion chips do not include a general **Calculator** app idea. Users who want that starter prompt either type it manually or only see the specialized **Finance Calculator** chip. Linear [AST-7](https://linear.app/systhema/issue/AST-7/agregar-sugerencia) asks for a calculator suggestion in the app-ideas list.

## What Changes

- Add an English **Calculator** suggestion chip (`id: calculator`) to the default landing suggestion set (`SUGGESTION_SETS[0]`), visible on first paint at `/`.
- Keep four chips per set: move existing **Finance Calculator** into set 1 (swap with one set-1 chip) so both intents remain available via Refresh.
- Update `landing-home` requirements/scenarios and front tests (Vitest + Playwright) to match the new default labels.
- No UI chrome, composer behavior, navigation, backend, or agent changes.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `landing-home`: Default suggestion chip set on `/` must include **Calculator**; **Finance Calculator** remains in the rotating sets but is no longer required on first paint.

## Impact

- **Side:** frontend only (UI static model). Surface: **chat/agent** prompt landing.
- **Code:** `frontend/src/features/landing/model/suggestions.ts`; colocated Vitest under `features/landing/model/`; `frontend/e2e/landing.spec.ts`; OpenSpec delta for `landing-home`.
- **Non-goals:** no backend / FastAPI, no `features/landing/api/`, no Mastra / `app/api/agent/*`, no real calculator app generation, no Spanish copy, no change to chip click behavior (fill composer only).
- **Standards:** `frontend/docs/frontend-standards.md` (Project Structure, UI/UX, Testing); `docs/design_guideline.md` (English copy; suggestion chips = secondary `Button`).
