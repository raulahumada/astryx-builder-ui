## 1. Confirm chip pattern

- [x] 1.1 From `frontend/`, confirm suggestion chips stay Astryx `Button` secondary/sm + Heroicons (no new layout): skim `LandingComposer` and, if unsure of `Button`/`Icon` props, run `npx astryx component Button` (and `Icon` as needed) — do not invent components or CSS.

## 2. Landing model update

- [x] 2.1 In `frontend/src/features/landing/model/suggestions.ts`, import `CalculatorIcon` from `@heroicons/react/24/outline` and add chip `{ id: "calculator", label: "Calculator", prompt: "Build a calculator with basic arithmetic operations", icon: CalculatorIcon }` to `SUGGESTION_SETS[0]`, replacing `finance-calculator` in that set.
- [x] 2.2 Move `finance-calculator` into `SUGGESTION_SETS[1]` (replace `todo`); keep each set at exactly four chips. Leave `LandingComposer.tsx`, `types.ts`, and `app/page.tsx` unchanged unless a type import breaks.

## 3. Tests

- [x] 3.1 Add `frontend/src/features/landing/model/suggestions.test.ts`: assert set 0 includes `id: "calculator"` with label `Calculator` and the designed prompt; assert `finance-calculator` exists in some set; assert both sets have length 4.
- [x] 3.2 Update `frontend/e2e/landing.spec.ts` so first-paint assertions include `getByRole("button", { name: "Calculator" })` (and keep Contact Form / composer checks as needed).

## 4. Verify

- [x] 4.1 From `frontend/`, run `npm run lint`, `npm test`, and `npm run test:e2e` (landing) — all pass before marking done.
