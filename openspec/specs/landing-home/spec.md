## Purpose

Zero-state home at `/`: Astryx-branded prompt landing (headline, composer, suggestion chips) with local-only mock interactions. Introduced by Linear AST-1.

## Requirements

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

### Requirement: Composer mock controls are local-only

The landing composer SHALL expose a model selector and a microphone control that do not call a backend or SpeechRecognition APIs.

#### Scenario: Model selector

- **WHEN** the user opens the model `DropdownMenu` in the composer footer
- **THEN** static options are shown (including an Astryx-branded option)
- **AND** selecting an option updates only local UI state (trigger label)
- **AND** no network request is made

#### Scenario: Microphone is visual only

- **WHEN** the user activates the microphone control
- **THEN** the control is reachable and labeled for accessibility (e.g. Dictate)
- **AND** the app does not start speech recognition or call a remote API

#### Scenario: Submit does nothing remote

- **WHEN** the user submits the composer
- **THEN** the app does not navigate to a chat transcript
- **AND** the app does not call any HTTP endpoint

### Requirement: Landing code lives under features/landing

The home implementation SHALL follow Screaming Architecture: UI and static model data under `frontend/src/features/landing/`, with `frontend/src/app/page.tsx` only wiring the feature.

#### Scenario: Thin app route

- **WHEN** the change is implemented
- **THEN** `app/page.tsx` imports from `features/landing` and contains no composer business logic
- **AND** there is no scaffold path `src/app/ai-chat-landing`
- **AND** there is no `features/landing/api/` module for this mock
