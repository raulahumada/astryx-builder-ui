## MODIFIED Requirements

### Requirement: Home route shows prompt landing mock

The system SHALL render a centered prompt landing at `/` using Astryx layout primitives (`Layout`, `LayoutContent`, stacks) — not the previous scaffold placeholder copy (“Frontend listo con Astryx”).

#### Scenario: Visitor opens home

- **WHEN** a user navigates to `/`
- **THEN** the page shows the headline `What do you want to create?`
- **AND** a `ChatComposer` with placeholder `Ask Astryx to build...`
- **AND** four suggestion chips labeled Contact Form, Image Editor, Mini Game, and Calculator
- **AND** a refresh control with an accessible name (e.g. Refresh)

#### Scenario: Calculator chip fills the composer

- **WHEN** a user activates the suggestion chip labeled `Calculator` on `/`
- **THEN** the composer value becomes `Build a calculator with basic arithmetic operations`
- **AND** the app does not navigate away from `/` solely due to the chip click

#### Scenario: Finance Calculator remains in rotating suggestions

- **WHEN** suggestion sets are defined for the landing composer
- **THEN** a chip with id `finance-calculator` and label `Finance Calculator` exists in a non-default set (reachable via Refresh)
- **AND** the default (first-paint) set does not require Finance Calculator
